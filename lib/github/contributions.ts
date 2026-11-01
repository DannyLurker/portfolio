import { graphql } from "@octokit/graphql"
import { cacheLife } from "next/cache"
import { siteContent } from "@/content/site"
import {
  buildYear,
  isIsoDate,
  todayInZone,
  windowFor,
  type ContributionDay,
  type ContributionYear,
} from "./heatmap"

/**
 * The build time read of Danny's GitHub contribution calendar.
 *
 * The whole window is computed and cached as one entry, refreshed daily. The
 * cached function never throws, so a broken GitHub cannot fail a build, and
 * the page renders no section at all instead of a grid that lies.
 */

const ATTEMPTS = 2
const RETRY_DELAY_MS = 400

const CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

type ContributionDayPayload = {
  date: string
  contributionCount: number
}

type ContributionsResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: Array<{ contributionDays: ContributionDayPayload[] }>
      }
    }
  } | null
}

type ContributionRead =
  | { ok: true; year: ContributionYear }
  | { ok: false; reason: string }

async function fetchContributionDays(
  login: string,
  from: string,
  to: string
): Promise<ContributionDay[]> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error("GITHUB_TOKEN is not set")
  }

  const response = await graphql<ContributionsResponse>(CONTRIBUTIONS_QUERY, {
    login,
    from: `${from}T00:00:00Z`,
    to: `${to}T23:59:59Z`,
    headers: {
      authorization: `bearer ${token}`,
      "user-agent": "danny-portfolio",
    },
  })

  if (!response.user) {
    throw new Error(`GitHub user "${login}" was not found`)
  }

  const days =
    response.user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays
    )

  return days.map((day) => {
    if (!isIsoDate(day.date)) {
      throw new Error(`GitHub returned an invalid date: ${String(day.date)}`)
    }

    if (!Number.isInteger(day.contributionCount) || day.contributionCount < 0) {
      throw new Error(`GitHub returned an invalid count for ${day.date}`)
    }

    return { date: day.date, count: day.contributionCount }
  })
}

async function readContributionDays(
  login: string,
  from: string,
  to: string
): Promise<ContributionDay[]> {
  let lastError: unknown

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      return await fetchContributionDays(login, from, to)
    } catch (error) {
      lastError = error

      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

/**
 * The cached year. The clock is read inside the cache scope on purpose: under
 * Cache Components an unstable value such as `new Date()` cannot be read
 * during prerender outside a cached scope.
 *
 * The failure is caught inside the cached scope and returned as data. Next
 * ends the build when a cached function rejects during prerender, even when
 * the caller catches it, so this is the only shape that keeps a broken GitHub
 * read from failing the build.
 */
async function readContributionYear(): Promise<ContributionRead> {
  "use cache"
  cacheLife("days")

  try {
    const profile = siteContent.profile
    const today = todayInZone(profile.timezoneId)
    const window = windowFor(today)
    const days = await readContributionDays(
      profile.githubUsername,
      window.from,
      window.to
    )

    return { ok: true, year: buildYear(days, window) }
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * The 52 week grid ending today in the profile timezone, or `null` when the
 * read fails. A `null` result leaves the section out of the page.
 */
export async function getContributionYear(): Promise<ContributionYear | null> {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "[contribution heatmap] left out of the page, GITHUB_TOKEN is not set"
    )

    return null
  }

  const result = await readContributionYear()

  if (!result.ok) {
    console.warn(
      `[contribution heatmap] left out of the page, GitHub read failed: ${result.reason}`
    )

    return null
  }

  return result.year
}
