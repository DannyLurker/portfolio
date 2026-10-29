export type EmailVisibility = "copy" | "text"

export type SocialIcon = "github" | "x" | "linkedin" | "instagram"

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

export type SiteContent = {
  profile: Profile
  experience: ExperienceRole[]
  projects: Project[]
  skills: Skills
  metrics: Metric[]
  links: SocialLink[]
}
