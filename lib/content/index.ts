import { siteContent } from "@/content/site"
import type {
  ExperienceRole,
  Metric,
  Profile,
  Project,
  Skills,
  SocialLink,
} from "./types"

export function getProfile(): Profile {
  return siteContent.profile
}

export function getExperience(): ExperienceRole[] {
  return [...siteContent.experience].sort((left, right) =>
    right.start.localeCompare(left.start)
  )
}

export function getProjects(): Project[] {
  return [...siteContent.projects]
}

export function getProjectBySlug(slug: string): Project | undefined {
  return siteContent.projects.find((project) => project.slug === slug)
}

export function getSkills(): Skills {
  return siteContent.skills
}

export function getMetrics(): Metric[] {
  return [...siteContent.metrics]
}

export function getLinks(): SocialLink[] {
  return [...siteContent.links]
}

export { assertContentValid } from "./validate"
export type {
  EmailVisibility,
  ExperienceRole,
  Metric,
  Profile,
  Project,
  ProjectCaseStudy,
  SiteContent,
  Skills,
  SocialLink,
  SocialIcon,
} from "./types"
