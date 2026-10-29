import type { SiteContent } from "@/lib/content/types"

// Seeded from docs/profile.md. This file is the runtime source of truth.
export const siteContent: SiteContent = {
  profile: {
    name: "Danny Ng",
    displayName: "Danny",
    pronouns: "He/Him",
    role: "Software Engineering Student & Intern",
    location: "Indonesia, Kepulauan Riau, Batam Island",
    timezone: "GMT +7 (Jakarta)",
    headline:
      "Building robust full-stack web applications and software systems with modern web technologies.",
    intro:
      "I'm Danny, an 12th-grade vocational software engineering student and intern based in Batam, Indonesia. I focus on developing practical, real-world web applications and enterprise solutions.",
    currentlyLooking:
      "Challenging software engineering projects, collaborations, and opportunities to scale my technical expertise.",
    availabilityLine: "Open for select projects and technical collaborations.",
    available: false,
    experienceSummary:
      "3 years of learning software engineering as a vocational student and interning as a software engineer at a local bank.",
    rememberLine:
      "Clean code, reliable architecture, and a step-by-step commitment to mastering engineering are at the core of everything I build.",
    email: "dannycode992@gmail.com",
    emailVisibility: "copy",
    githubUsername: "DannyLurker",
  },
  experience: [
    {
      company: "BPR Agra Dhana",
      title: "Software Engineering Intern",
      start: "2026-10",
      end: null,
      summary:
        "Developing internal software systems and banking tech solutions as part of my vocational internship.",
    },
  ],
  projects: [
    {
      slug: "internal-management-system",
      name: "Internal Management System",
      summary:
        "An internal management system application focused on hotel-oriented workflows and operational efficiency.",
      stack: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      role: "Full Stack Developer",
      outcome:
        "Streamlined internal workflows and data organization.",
      liveUrl: null,
      repoUrl: "https://github.com/DannyLurker/internal-management-system",
      private: false,
      caseStudy: {
        problem:
          "Organizations need unified internal systems to handle complex operational workflows and data tracking reliably.",
        approach:
          "Designed a modern full-stack architecture using Next.js and PostgreSQL to ensure type safety, fast data retrieval, and smooth user interactions.",
        built:
          "A scalable internal management system with robust database schemas, secure backend services, and clean responsive interfaces.",
        result:
          "Delivered a performant tool capable of managing internal processes efficiently.",
      },
    },
  ],
  skills: {
    top: ["TypeScript", "Next.js", "PostgreSQL"],
    all: [
      "TypeScript",
      "JavaScript",
      "Next.js",
      "React",
      "Node.js",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
      "Laravel",
      "Docker",
      "Git",
    ],
  },
  metrics: [
    {
      value: "2",
      label: "Projects",
    },
  ],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/DannyLurker",
      icon: "github",
    },
    {
      label: "X",
      href: "https://x.com/DannyLurker",
      icon: "x",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/danny-ng-33a16b3b4/",
      icon: "linkedin",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/danny_env",
      icon: "instagram",
    },
  ],
}
