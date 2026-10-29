import { messages } from "@/content/messages"
import { siteContent } from "@/content/site"
import type { Locale } from "@/lib/i18n/locales"
import type {
  ExperienceRole,
  Localized,
  Messages,
  Metric,
  Profile,
  Project,
  Skills,
  SocialLink,
} from "./types"

function resolveString(field: Localized<string>, locale: Locale): string {
  const value = field[locale]
  if (
    process.env.NODE_ENV !== "production" &&
    (!value || value.trim().length === 0)
  ) {
    return field.en
  }
  return value
}

export function getProfile(locale: Locale): Profile {
  const { profile } = siteContent
  return {
    name: profile.name,
    displayName: profile.displayName,
    pronouns: resolveString(profile.pronouns, locale),
    role: resolveString(profile.role, locale),
    location: resolveString(profile.location, locale),
    timezone: profile.timezone,
    headline: resolveString(profile.headline, locale),
    intro: resolveString(profile.intro, locale),
    currentlyLooking: resolveString(profile.currentlyLooking, locale),
    availabilityLine: resolveString(profile.availabilityLine, locale),
    available: profile.available,
    experienceSummary: resolveString(profile.experienceSummary, locale),
    rememberLine: resolveString(profile.rememberLine, locale),
    email: profile.email,
    emailVisibility: profile.emailVisibility,
    githubUsername: profile.githubUsername,
  }
}

export function getExperience(locale: Locale): ExperienceRole[] {
  return [...siteContent.experience]
    .sort((left, right) => right.start.localeCompare(left.start))
    .map((role) => ({
      company: role.company,
      title: resolveString(role.title, locale),
      start: role.start,
      end: role.end,
      summary: resolveString(role.summary, locale),
    }))
}

export function getProjects(locale: Locale): Project[] {
  return siteContent.projects.map((project) => ({
    slug: project.slug,
    name: resolveString(project.name, locale),
    summary: resolveString(project.summary, locale),
    stack: [...project.stack],
    role: resolveString(project.role, locale),
    outcome: resolveString(project.outcome, locale),
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    private: project.private,
    caseStudy: {
      problem: resolveString(project.caseStudy.problem, locale),
      approach: resolveString(project.caseStudy.approach, locale),
      built: resolveString(project.caseStudy.built, locale),
      result: resolveString(project.caseStudy.result, locale),
    },
  }))
}

export function getProjectBySlug(
  locale: Locale,
  slug: string
): Project | undefined {
  const project = siteContent.projects.find((p) => p.slug === slug)
  if (!project) return undefined
  return {
    slug: project.slug,
    name: resolveString(project.name, locale),
    summary: resolveString(project.summary, locale),
    stack: [...project.stack],
    role: resolveString(project.role, locale),
    outcome: resolveString(project.outcome, locale),
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    private: project.private,
    caseStudy: {
      problem: resolveString(project.caseStudy.problem, locale),
      approach: resolveString(project.caseStudy.approach, locale),
      built: resolveString(project.caseStudy.built, locale),
      result: resolveString(project.caseStudy.result, locale),
    },
  }
}

export function getSkills(): Skills {
  return siteContent.skills
}

export function getMetrics(locale: Locale): Metric[] {
  return siteContent.metrics.map((metric) => ({
    value: metric.value,
    label: resolveString(metric.label, locale),
  }))
}

export function getLinks(): SocialLink[] {
  return [...siteContent.links]
}

export function getMessages(locale: Locale): Messages {
  const dict = messages[locale]
  if (process.env.NODE_ENV !== "production" && !dict) {
    return messages.en
  }
  if (process.env.NODE_ENV !== "production") {
    const fallback: Messages = { ...messages.en }
    for (const key of Object.keys(messages.en) as Array<keyof Messages>) {
      if (dict[key] && dict[key].trim().length > 0) {
        fallback[key] = dict[key]
      }
    }
    return fallback
  }
  return dict
}

export { isLocale, requireLocale, defaultLocale, locales, localeNames } from "@/lib/i18n/locales"
export { swapLocalePath } from "@/lib/i18n/path"
export { formatMonth } from "@/lib/i18n/format"
export { assertContentValid } from "./validate"
export type {
  EmailVisibility,
  ExperienceRole,
  ExperienceRoleContent,
  Localized,
  LocalizedString,
  Messages,
  Metric,
  MetricContent,
  Profile,
  ProfileContent,
  Project,
  ProjectCaseStudy,
  ProjectCaseStudyContent,
  ProjectContent,
  SiteContent,
  Skills,
  SocialLink,
  SocialIcon,
} from "./types"
