import { existsSync } from "node:fs"
import { join } from "node:path"
import { messages } from "@/content/messages"
import { siteContent } from "@/content/site"
import { locales } from "@/lib/i18n/locales"
import type {
  EmailVisibility,
  Messages,
  ProjectContent,
  SiteContent,
  SocialIcon,
} from "./types"

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/
const MONTH_PATTERN = /^\d{4}-(?:0[1-9]|1[0-2])$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PLACEHOLDER_TOKENS = [
  "lorem",
  "todo",
  "tbd",
  "your name",
  "example.com",
  "placeholder",
]
const SOCIAL_ICONS: SocialIcon[] = ["github", "twitter", "linkedin", "instagram"]
const EMAIL_VISIBILITIES: EmailVisibility[] = ["copy", "text"]

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function checkString(errors: string[], path: string, value: unknown) {
  if (!isNonEmptyString(value)) {
    errors.push(`${path} must be a non empty string`)
    return
  }

  const normalized = value.trim()

  if (normalized.toLowerCase() === "none") {
    errors.push(`${path} is set to "None"; delete the optional value instead`)
    return
  }

  const token = PLACEHOLDER_TOKENS.find((entry) =>
    normalized.toLowerCase().includes(entry)
  )

  if (token) {
    errors.push(`${path} contains the placeholder "${token}"`)
  }
}

function checkLocalizedString(
  errors: string[],
  path: string,
  field: unknown
) {
  if (!field || typeof field !== "object") {
    errors.push(
      `${path} must be a localized object with keys: ${locales.join(", ")}`
    )
    return
  }

  const record = field as Record<string, unknown>

  locales.forEach((locale) => {
    const localePath = `${path}.${locale}`
    checkString(errors, localePath, record[locale])
  })
}

function checkUrl(errors: string[], path: string, value: unknown) {
  if (value === null) return

  if (!isNonEmptyString(value)) {
    errors.push(`${path} must be null or a URL`)
    return
  }

  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    errors.push(`${path} is not a valid URL`)
    return
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    errors.push(`${path} must use http or https`)
  }
}

function checkSiteUrl(errors: string[], value: unknown) {
  const path = "siteUrl"

  if (!isNonEmptyString(value)) {
    errors.push(`${path} must be an absolute HTTPS origin`)
    return
  }

  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    errors.push(`${path} must be an absolute HTTPS origin`)
    return
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.origin !== value ||
    parsed.username.length > 0 ||
    parsed.password.length > 0
  ) {
    errors.push(`${path} must be an HTTPS origin with no path, query, or fragment`)
  }
}

function checkMonth(errors: string[], path: string, value: unknown) {
  if (!isNonEmptyString(value) || !MONTH_PATTERN.test(value)) {
    errors.push(`${path} must use the YYYY-MM shape`)
  }
}

function checkStringArray(
  errors: string[],
  path: string,
  values: unknown,
  minimum: number
) {
  if (!Array.isArray(values)) {
    errors.push(`${path} must be an array`)
    return
  }

  if (values.length < minimum) {
    errors.push(`${path} must contain at least ${minimum} entries`)
  }

  values.forEach((value, index) => {
    checkString(errors, `${path}[${index}]`, value)
  })
}

function checkActivityRepositories(errors: string[], repositories: unknown) {
  checkStringArray(errors, "activityRepositories", repositories, 1)

  if (!Array.isArray(repositories)) return

  const seen = new Set<string>()

  repositories.forEach((repository, index) => {
    if (!isNonEmptyString(repository)) return

    const value = repository.trim()
    if (!REPOSITORY_PATTERN.test(value)) {
      errors.push(
        `activityRepositories[${index}] must use the owner/repository shape`
      )
      return
    }

    const key = value.toLowerCase()
    if (seen.has(key)) {
      errors.push(`activityRepositories contains duplicate "${value}"`)
      return
    }

    seen.add(key)
  })
}

function checkProject(
  errors: string[],
  project: ProjectContent,
  index: number,
  slugs: Map<string, number>
) {
  const path = `projects[${index}]`

  checkString(errors, `${path}.slug`, project.slug)

  if (isNonEmptyString(project.slug) && !SLUG_PATTERN.test(project.slug)) {
    errors.push(`${path}.slug must be kebab case`)
  }

  if (isNonEmptyString(project.slug)) {
    const existing = slugs.get(project.slug)

    if (existing === undefined) {
      slugs.set(project.slug, index)
    } else {
      errors.push(
        `${path}.slug duplicates "projects[${existing}].slug" (${project.slug})`
      )
    }
  }

  checkLocalizedString(errors, `${path}.name`, project.name)
  checkLocalizedString(errors, `${path}.summary`, project.summary)
  checkLocalizedString(errors, `${path}.role`, project.role)
  checkLocalizedString(errors, `${path}.outcome`, project.outcome)
  checkStringArray(errors, `${path}.stack`, project.stack, 1)

  const cover = project.cover
  if (!cover || typeof cover !== "object") {
    errors.push(`${path}.cover must be an object`)
  } else {
    checkString(errors, `${path}.cover.src`, cover.src)
    checkLocalizedString(errors, `${path}.cover.alt`, cover.alt)
    for (const dimension of ["width", "height"] as const) {
      if (!Number.isInteger(cover[dimension]) || cover[dimension] <= 0) {
        errors.push(`${path}.cover.${dimension} must be a positive integer`)
      }
    }

    if (isNonEmptyString(cover.src) && isNonEmptyString(project.slug)) {
      const prefix = `/projects/${project.slug}/`
      if (!cover.src.startsWith(prefix)) {
        errors.push(`${path}.cover.src must start with ${prefix}`)
      } else {
        const imageParts = cover.src.slice(1).split(/[\\/]/)
        if (imageParts.some((part) => part === "." || part === "..")) {
          errors.push(`${path}.cover.src must not traverse directories`)
        } else {
          const imagePath = join(process.cwd(), "public", ...imageParts)
          if (!existsSync(imagePath)) {
            errors.push(`${path}.cover.src does not exist under public`)
          }
        }
      }
    }
  }

  checkLocalizedString(
    errors,
    `${path}.caseStudy.problem`,
    project.caseStudy.problem
  )
  checkLocalizedString(
    errors,
    `${path}.caseStudy.approach`,
    project.caseStudy.approach
  )
  checkLocalizedString(
    errors,
    `${path}.caseStudy.built`,
    project.caseStudy.built
  )
  checkLocalizedString(
    errors,
    `${path}.caseStudy.result`,
    project.caseStudy.result
  )

  checkUrl(errors, `${path}.liveUrl`, project.liveUrl)
  checkUrl(errors, `${path}.repoUrl`, project.repoUrl)

  if (
    project.liveUrl === null &&
    project.repoUrl === null &&
    !project.private
  ) {
    errors.push(`${path} needs liveUrl or repoUrl while it is public`)
  }

  if (typeof project.private !== "boolean") {
    errors.push(`${path}.private must be true or false`)
  }
}

function checkMessages(errors: string[]) {
  locales.forEach((locale) => {
    const dict = messages[locale]
    if (!dict || typeof dict !== "object") {
      errors.push(`messages.${locale} must be a dictionary`)
      return
    }

    const messageKeys = Object.keys(messages.en) as Array<keyof Messages>

    messageKeys.forEach((key) => {
      const path = `messages.${locale}.${key}`
      checkString(errors, path, dict[key])
    })
  })
}

function checkContent(content: SiteContent): string[] {
  const errors: string[] = []

  checkSiteUrl(errors, content.siteUrl)
  checkString(errors, "profile.name", content.profile.name)
  checkString(errors, "profile.displayName", content.profile.displayName)
  checkLocalizedString(errors, "profile.pronouns", content.profile.pronouns)
  checkLocalizedString(errors, "profile.role", content.profile.role)
  checkLocalizedString(errors, "profile.location", content.profile.location)
  checkString(errors, "profile.timezone", content.profile.timezone)
  checkString(errors, "profile.timezoneId", content.profile.timezoneId)

  if (isNonEmptyString(content.profile.timezoneId)) {
    try {
      new Intl.DateTimeFormat("en-US", {
        timeZone: content.profile.timezoneId,
      })
    } catch {
      errors.push(
        "profile.timezoneId must be a valid IANA timezone, such as Asia/Jakarta"
      )
    }
  }
  checkLocalizedString(errors, "profile.headline", content.profile.headline)
  checkLocalizedString(errors, "profile.intro", content.profile.intro)
  checkLocalizedString(
    errors,
    "profile.currentlyLooking",
    content.profile.currentlyLooking
  )
  checkLocalizedString(
    errors,
    "profile.availabilityLine",
    content.profile.availabilityLine
  )
  checkLocalizedString(
    errors,
    "profile.experienceSummary",
    content.profile.experienceSummary
  )
  checkLocalizedString(
    errors,
    "profile.rememberLine",
    content.profile.rememberLine
  )
  checkString(errors, "profile.githubUsername", content.profile.githubUsername)
  checkString(errors, "profile.email", content.profile.email)

  if (
    isNonEmptyString(content.profile.email) &&
    !EMAIL_PATTERN.test(content.profile.email)
  ) {
    errors.push("profile.email must be a valid email address")
  }

  if (!EMAIL_VISIBILITIES.includes(content.profile.emailVisibility)) {
    errors.push("profile.emailVisibility must be copy or text")
  }

  if (typeof content.profile.available !== "boolean") {
    errors.push("profile.available must be true or false")
  }

  if (content.experience.length === 0) {
    errors.push("experience must have at least one role")
  }

  let currentRoles = 0

  content.experience.forEach((role, index) => {
    const path = `experience[${index}]`

    checkString(errors, `${path}.company`, role.company)
    checkLocalizedString(errors, `${path}.title`, role.title)
    checkLocalizedString(errors, `${path}.summary`, role.summary)
    checkMonth(errors, `${path}.start`, role.start)

    if (role.end === null) {
      currentRoles += 1
    } else {
      checkMonth(errors, `${path}.end`, role.end)

      if (
        isNonEmptyString(role.start) &&
        isNonEmptyString(role.end) &&
        MONTH_PATTERN.test(role.start) &&
        MONTH_PATTERN.test(role.end) &&
        role.end < role.start
      ) {
        errors.push(`${path}.end is earlier than its start`)
      }
    }
  })

  if (currentRoles > 1) {
    errors.push("only one experience role may have a null end")
  }

  if (content.projects.length === 0) {
    errors.push("projects must have at least one entry")
  }

  const slugs = new Map<string, number>()

  content.projects.forEach((project, index) => {
    checkProject(errors, project, index, slugs)
  })

  checkActivityRepositories(errors, content.activityRepositories)

  if (content.skills.top.length !== 3) {
    errors.push("skills.top must have exactly three entries")
  }

  checkStringArray(errors, "skills.top", content.skills.top, 3)
  checkStringArray(errors, "skills.all", content.skills.all, 3)

  content.skills.top.forEach((skill, index) => {
    if (!content.skills.all.includes(skill)) {
      errors.push(`skills.top[${index}] (${skill}) is missing from skills.all`)
    }
  })

  if (content.metrics.length === 0) {
    errors.push("metrics must have at least one entry")
  }

  content.metrics.forEach((metric, index) => {
    checkString(errors, `metrics[${index}].value`, metric.value)
    checkLocalizedString(errors, `metrics[${index}].label`, metric.label)
  })

  if (content.links.length === 0) {
    errors.push("links must have at least one entry")
  }

  content.links.forEach((link, index) => {
    const path = `links[${index}]`

    checkString(errors, `${path}.label`, link.label)
    checkUrl(errors, `${path}.href`, link.href)

    if (!SOCIAL_ICONS.includes(link.icon)) {
      errors.push(`${path}.icon must be one of ${SOCIAL_ICONS.join(", ")}`)
    }
  })

  checkMessages(errors)

  return errors
}

export function assertContentValid() {
  const errors = checkContent(siteContent)

  if (errors.length === 0) return

  const message = [
    "Invalid site content:",
    ...errors.map((error) => `- ${error}`),
  ].join("\n")

  if (process.env.NODE_ENV === "production") {
    throw new Error(message)
  }

  console.error(message)
}
