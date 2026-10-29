import type { Locale } from "@/lib/i18n/locales"

export type EmailVisibility = "copy" | "text"

export type SocialIcon = "github" | "x" | "linkedin" | "instagram"

export type Localized<T> = Record<Locale, T>
export type LocalizedString = Localized<string>

export type Profile = {
  name: string
  displayName: string
  pronouns: string
  role: string
  location: string
  timezone: string
  headline: string
  intro: string
  currentlyLooking: string
  availabilityLine: string
  available: boolean
  experienceSummary: string
  rememberLine: string
  email: string
  emailVisibility: EmailVisibility
  githubUsername: string
}

export type ExperienceRole = {
  company: string
  title: string
  start: string
  end: string | null
  summary: string
}

export type ProjectCaseStudy = {
  problem: string
  approach: string
  built: string
  result: string
}

export type Project = {
  slug: string
  name: string
  summary: string
  stack: string[]
  role: string
  outcome: string
  liveUrl: string | null
  repoUrl: string | null
  private: boolean
  caseStudy: ProjectCaseStudy
}

export type Metric = {
  value: string
  label: string
}

export type Skills = {
  top: string[]
  all: string[]
}

export type SocialLink = {
  label: string
  href: string
  icon: SocialIcon
}

export type ProfileContent = {
  name: string
  displayName: string
  pronouns: LocalizedString
  role: LocalizedString
  location: LocalizedString
  timezone: string
  headline: LocalizedString
  intro: LocalizedString
  currentlyLooking: LocalizedString
  availabilityLine: LocalizedString
  available: boolean
  experienceSummary: LocalizedString
  rememberLine: LocalizedString
  email: string
  emailVisibility: EmailVisibility
  githubUsername: string
}

export type ExperienceRoleContent = {
  company: string
  title: LocalizedString
  start: string
  end: string | null
  summary: LocalizedString
}

export type ProjectCaseStudyContent = {
  problem: LocalizedString
  approach: LocalizedString
  built: LocalizedString
  result: LocalizedString
}

export type ProjectContent = {
  slug: string
  name: LocalizedString
  summary: LocalizedString
  stack: string[]
  role: LocalizedString
  outcome: LocalizedString
  liveUrl: string | null
  repoUrl: string | null
  private: boolean
  caseStudy: ProjectCaseStudyContent
}

export type MetricContent = {
  value: string
  label: LocalizedString
}

export type SiteContent = {
  profile: ProfileContent
  experience: ExperienceRoleContent[]
  projects: ProjectContent[]
  skills: Skills
  metrics: MetricContent[]
  links: SocialLink[]
}

export type Messages = {
  "language.label": string
  "language.current": string
}
