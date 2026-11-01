import type { Locale } from "@/lib/i18n/locales"

export type EmailVisibility = "copy" | "text"

export type SocialIcon = "github" | "twitter" | "linkedin" | "instagram"

export type Localized<T> = Record<Locale, T>
export type LocalizedString = Localized<string>

export type Profile = {
  name: string
  displayName: string
  pronouns: string
  role: string
  location: string
  timezone: string
  timezoneId: string
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
  cover: ProjectCover
  caseStudy: ProjectCaseStudy
}

export type ProjectCover = {
  src: string
  alt: string
  width: number
  height: number
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
  timezoneId: string
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
  cover: ProjectCoverContent
  caseStudy: ProjectCaseStudyContent
}

export type ProjectCoverContent = {
  src: string
  alt: LocalizedString
  width: number
  height: number
}

export type MetricContent = {
  value: string
  label: LocalizedString
}

export type SiteContent = {
  profile: ProfileContent
  experience: ExperienceRoleContent[]
  projects: ProjectContent[]
  activityRepositories: string[]
  skills: Skills
  metrics: MetricContent[]
  links: SocialLink[]
}

export type Messages = {
  "language.label": string
  "language.current": string
  "nav.label": string
  "nav.work": string
  "nav.experience": string
  "nav.contact": string
  "nav.openMenu": string
  "nav.closeMenu": string
  "hero.action": string
  "skip.label": string
  "intro.skip": string
  "footer.navLabel": string
  "footer.socialLabel": string
  "notFound.title": string
  "notFound.description": string
  "notFound.home": string
  "project.back": string
  "project.liveSite": string
  "project.source": string
  "project.private": string
  "project.stackLabel": string
  "project.part.problem": string
  "project.part.approach": string
  "project.part.built": string
  "project.part.outcome": string
  "projects.heading": string
  "projects.empty": string
  "metrics.heading": string
  "experience.heading": string
  "experience.current": string
  "experience.present": string
  "experience.rangeTo": string
  "heatmap.heading": string
  "heatmap.total": string
  "heatmap.dayCount": string
  "heatmap.empty": string
  "heatmap.profileLink": string
  "heatmap.summary": string
  "heatmap.graphLabel": string
  "activity.heading": string
  "activity.repositoryLink": string
  "activity.commitLink": string
  "contact.heading": string
  "contact.name": string
  "contact.email": string
  "contact.message": string
  "contact.subject": string
  "contact.submit": string
  "contact.copyEmail": string
  "contact.copySuccess": string
  "contact.copyFailure": string
  "contact.socialLabel": string
}
