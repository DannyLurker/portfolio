import { siteContent } from "@/content/site"
import type {
  EmailVisibility,
  Project,
  SiteContent,
  SocialIcon,
} from "./types"

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
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
const SOCIAL_ICONS: SocialIcon[] = ["github", "x", "linkedin", "instagram"]
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

function checkProject(
  errors: string[],
  project: Project,
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

  checkString(errors, `${path}.name`, project.name)
  checkString(errors, `${path}.summary`, project.summary)
  checkString(errors, `${path}.role`, project.role)
  checkString(errors, `${path}.outcome`, project.outcome)
  checkStringArray(errors, `${path}.stack`, project.stack, 1)
  checkString(errors, `${path}.caseStudy.problem`, project.caseStudy.problem)
  checkString(errors, `${path}.caseStudy.approach`, project.caseStudy.approach)
  checkString(errors, `${path}.caseStudy.built`, project.caseStudy.built)
  checkString(errors, `${path}.caseStudy.result`, project.caseStudy.result)
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

function checkContent(content: SiteContent): string[] {
  const errors: string[] = []

  const profileStrings: Array<[string, string]> = [
    ["name", content.profile.name],
    ["displayName", content.profile.displayName],
    ["pronouns", content.profile.pronouns],
    ["role", content.profile.role],
    ["location", content.profile.location],
    ["timezone", content.profile.timezone],
    ["headline", content.profile.headline],
    ["intro", content.profile.intro],
    ["currentlyLooking", content.profile.currentlyLooking],
    ["availabilityLine", content.profile.availabilityLine],
    ["experienceSummary", content.profile.experienceSummary],
    ["rememberLine", content.profile.rememberLine],
    ["githubUsername", content.profile.githubUsername],
  ]

  profileStrings.forEach(([field, value]) => {
    checkString(errors, `profile.${field}`, value)
  })

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
    checkString(errors, `${path}.title`, role.title)
    checkString(errors, `${path}.summary`, role.summary)
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
    checkString(errors, `metrics[${index}].label`, metric.label)
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
