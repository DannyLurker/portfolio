import "server-only"
import { Octokit } from "@octokit/rest"
import { cacheLife } from "next/cache"
import { siteContent } from "@/content/site"

const EVENTS_PER_PAGE = 100
const MAX_EVENT_PAGES = 3
const MAX_COMMITS = 8
const COMPARE_CONCURRENCY = 5
const RETRY_DELAY_MS = 400

type PublicPush = {
  repository: string
  branch: string
  before: string
  head: string
}

export type ActivityCommit = {
  repository: string
  repositoryUrl: string
  branch: string
  sha: string
  commitUrl: string
  message: string
  committerDate: string
}

export type ActivityFeedSnapshot = {
  asOf: string
  commits: ActivityCommit[]
}

type ActivityRead =
  | { ok: true; snapshot: ActivityFeedSnapshot }
  | { ok: false; reason: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isSha(value: unknown): value is string {
  return typeof value === "string" && /^(?:[a-f\d]{40}|[a-f\d]{64})$/i.test(value)
}

function isTransient(error: unknown): boolean {
  if (!isRecord(error)) return true

  const status = error.status
  return typeof status !== "number" || status === 0 || status >= 500
}

async function withRetry<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request()
  } catch (error) {
    if (!isTransient(error)) throw error

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    return request()
  }
}

function parsePublicPush(
  value: unknown,
  allowedRepositories: Set<string>
): PublicPush | null {
  if (!isRecord(value)) {
    throw new Error("GitHub returned an invalid event")
  }

  if (value.type !== "PushEvent") return null
  if (value.public === false) return null
  if (value.public !== true) {
    throw new Error("GitHub returned a push without a public flag")
  }

  if (!isRecord(value.repo) || typeof value.repo.name !== "string") {
    throw new Error("GitHub returned a push without a repository name")
  }

  const repository = value.repo.name
  if (!allowedRepositories.has(repository.toLowerCase())) return null

  if (!isRecord(value.payload)) {
    throw new Error(`GitHub returned an invalid push for ${repository}`)
  }

  const ref = value.payload.ref
  const before = value.payload.before
  const head = value.payload.head

  if (typeof ref !== "string") {
    throw new Error(`GitHub returned an invalid branch for ${repository}`)
  }

  if (!ref.startsWith("refs/heads/")) return null

  if (!isSha(before) || !isSha(head)) {
    throw new Error(`GitHub returned invalid commit references for ${repository}`)
  }

  const branch = ref.slice("refs/heads/".length)
  if (!branch) {
    throw new Error(`GitHub returned an empty branch for ${repository}`)
  }

  return { repository, branch, before, head }
}

function repositoryParts(repository: string) {
  const [owner, name] = repository.split("/")
  if (!owner || !name) {
    throw new Error(`Invalid allowlisted repository: ${repository}`)
  }
  return { owner, repo: name }
}

async function readEvents(octokit: Octokit): Promise<unknown[]> {
  const events: unknown[] = []

  for (let page = 1; page <= MAX_EVENT_PAGES; page += 1) {
    const response = await withRetry(() =>
      octokit.rest.activity.listPublicEventsForUser({
        username: siteContent.profile.githubUsername,
        per_page: EVENTS_PER_PAGE,
        page,
      })
    )

    if (!Array.isArray(response.data)) {
      throw new Error("GitHub returned an invalid public events response")
    }

    events.push(...response.data)
    if (response.data.length < EVENTS_PER_PAGE) break
  }

  return events
}

async function readRepositoryVisibility(
  octokit: Octokit,
  repositories: string[]
): Promise<Map<string, { isPublic: boolean; url: string }>> {
  const visibility = new Map<string, { isPublic: boolean; url: string }>()

  for (const repository of repositories) {
    const { owner, repo } = repositoryParts(repository)
    const response = await withRetry(() =>
      octokit.rest.repos.get({ owner, repo })
    )

    if (typeof response.data.private !== "boolean") {
      throw new Error(`GitHub returned invalid visibility for ${repository}`)
    }

    if (typeof response.data.html_url !== "string") {
      throw new Error(`GitHub returned no public URL for ${repository}`)
    }

    visibility.set(repository.toLowerCase(), {
      isPublic: !response.data.private,
      url: response.data.html_url,
    })
  }

  return visibility
}

async function readPushCommits(
  octokit: Octokit,
  push: PublicPush,
  repositoryUrl: string
): Promise<ActivityCommit[]> {
  const { owner, repo } = repositoryParts(push.repository)
  const response = await withRetry(() =>
    octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${push.before}...${push.head}`,
    })
  )

  if (!Array.isArray(response.data.commits)) {
    throw new Error(`GitHub returned invalid commits for ${push.repository}`)
  }

  const commits: ActivityCommit[] = []

  for (const entry of response.data.commits) {
    const login = entry.author?.login
    if (
      typeof login !== "string" ||
      login.toLowerCase() !== siteContent.profile.githubUsername.toLowerCase()
    ) {
      continue
    }

    const message = entry.commit.message.split(/\r?\n/, 1)[0]?.trim()
    const committerDate = entry.commit.committer?.date

    if (
      !isSha(entry.sha) ||
      typeof entry.html_url !== "string" ||
      !message ||
      typeof committerDate !== "string" ||
      Number.isNaN(Date.parse(committerDate))
    ) {
      throw new Error(`GitHub returned an invalid commit for ${push.repository}`)
    }

    commits.push({
      repository: push.repository,
      repositoryUrl,
      branch: push.branch,
      sha: entry.sha,
      commitUrl: entry.html_url,
      message,
      committerDate,
    })
  }

  return commits
}

async function mapInBatches<T, R>(
  values: T[],
  batchSize: number,
  map: (value: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []

  for (let index = 0; index < values.length; index += batchSize) {
    const batch = values.slice(index, index + batchSize)
    results.push(...(await Promise.all(batch.map(map))))
  }

  return results
}

async function fetchActivityFeed(): Promise<ActivityFeedSnapshot> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error("GITHUB_TOKEN is not set")

  const asOf = new Date().toISOString()
  const octokit = new Octokit({
    auth: token,
    userAgent: "danny-portfolio",
  })
  const allowedRepositories = new Set(
    siteContent.activityRepositories.map((repository) => repository.toLowerCase())
  )
  const events = await readEvents(octokit)
  const pushes = events
    .map((event) => parsePublicPush(event, allowedRepositories))
    .filter((push): push is PublicPush => push !== null)

  const repositories = [...new Set(pushes.map((push) => push.repository))]
  const visibility = await readRepositoryVisibility(octokit, repositories)
  const publicPushes = pushes.filter(
    (push) => visibility.get(push.repository.toLowerCase())?.isPublic === true
  )

  const commitGroups = await mapInBatches(
    publicPushes,
    COMPARE_CONCURRENCY,
    (push) =>
      readPushCommits(
        octokit,
        push,
        visibility.get(push.repository.toLowerCase())!.url
      )
  )

  const unique = new Map<string, ActivityCommit>()
  for (const commit of commitGroups.flat()) {
    const key = `${commit.repository.toLowerCase()}:${commit.sha.toLowerCase()}`
    const existing = unique.get(key)
    if (
      !existing ||
      Date.parse(commit.committerDate) > Date.parse(existing.committerDate)
    ) {
      unique.set(key, commit)
    }
  }

  const commits = [...unique.values()]
    .sort(
      (left, right) =>
        Date.parse(right.committerDate) - Date.parse(left.committerDate)
    )
    .slice(0, MAX_COMMITS)

  return { asOf, commits }
}

async function readCachedActivityFeed(): Promise<ActivityRead> {
  "use cache"
  cacheLife("days")

  try {
    return { ok: true, snapshot: await fetchActivityFeed() }
  } catch (error) {
    const token = process.env.GITHUB_TOKEN
    const reason = error instanceof Error ? error.message : String(error)

    return {
      ok: false,
      reason: token ? reason.replaceAll(token, "[redacted]") : reason,
    }
  }
}

export async function getActivityFeed(): Promise<ActivityFeedSnapshot | null> {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "[activity feed] left out of the page, GITHUB_TOKEN is not set"
    )
    return null
  }

  const result = await readCachedActivityFeed()
  if (!result.ok) {
    console.warn(`[activity feed] left out of the page, ${result.reason}`)
    return null
  }

  return result.snapshot
}
