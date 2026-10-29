import type { SiteContent } from "@/lib/content/types"

// Seeded from docs/profile.md. This file is the runtime source of truth.
export const siteContent: SiteContent = {
  profile: {
    name: "Danny Ng",
    displayName: "Danny",
    pronouns: {
      en: "He/Him",
      id: "Dia",
    },
    role: {
      en: "Software Engineering Student & Intern",
      id: "Siswa & Pemagang Rekayasa Perangkat Lunak",
    },
    location: {
      en: "Indonesia, Kepulauan Riau, Batam Island",
      id: "Indonesia, Kepulauan Riau, Pulau Batam",
    },
    timezone: "GMT +7 (Jakarta)",
    headline: {
      en: "Building robust full-stack web applications and software systems with modern web technologies.",
      id: "Membangun aplikasi web full-stack dan sistem perangkat lunak yang tangguh dengan teknologi web modern.",
    },
    intro: {
      en: "I'm Danny, an 12th-grade vocational software engineering student and intern based in Batam, Indonesia. I focus on developing practical, real-world web applications and enterprise solutions.",
      id: "Saya Danny, siswa SMK kelas 12 jurusan rekayasa perangkat lunak dan pemagang yang berbasis di Batam, Indonesia. Saya berfokus pada pengembangan aplikasi web praktis untuk dunia nyata dan solusi enterprise.",
    },
    currentlyLooking: {
      en: "Challenging software engineering projects, collaborations, and opportunities to scale my technical expertise.",
      id: "Proyek rekayasa perangkat lunak yang menantang, kolaborasi, dan kesempatan untuk mengembangkan keahlian teknis saya.",
    },
    availabilityLine: {
      en: "Open for select projects and technical collaborations.",
      id: "Terbuka untuk proyek terpilih dan kolaborasi teknis.",
    },
    available: false,
    experienceSummary: {
      en: "3 years of learning software engineering as a vocational student and interning as a software engineer at a local bank.",
      id: "3 tahun mempelajari rekayasa perangkat lunak sebagai siswa SMK dan magang sebagai rekayasawan perangkat lunak di bank lokal.",
    },
    rememberLine: {
      en: "Clean code, reliable architecture, and a step-by-step commitment to mastering engineering are at the core of everything I build.",
      id: "Kode yang bersih, arsitektur yang andal, dan komitmen bertahap untuk menguasai rekayasa perangkat lunak menjadi inti dari setiap hal yang saya bangun.",
    },
    email: "dannycode992@gmail.com",
    emailVisibility: "copy",
    githubUsername: "DannyLurker",
  },
  experience: [
    {
      company: "BPR Agra Dhana",
      title: {
        en: "Software Engineering Intern",
        id: "Pemagang Rekayasa Perangkat Lunak",
      },
      start: "2026-10",
      end: null,
      summary: {
        en: "Developing internal software systems and banking tech solutions as part of my vocational internship.",
        id: "Mengembangkan sistem perangkat lunak internal dan solusi teknologi perbankan sebagai bagian dari magang kejuruan saya.",
      },
    },
  ],
  projects: [
    {
      slug: "internal-management-system",
      name: {
        en: "Internal Management System",
        id: "Internal Management System",
      },
      summary: {
        en: "An internal management system application focused on hotel-oriented workflows and operational efficiency.",
        id: "Aplikasi sistem manajemen internal yang berfokus pada alur kerja perhotelan dan efisiensi operasional.",
      },
      stack: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      role: {
        en: "Full Stack Developer",
        id: "Full Stack Developer",
      },
      outcome: {
        en: "Streamlined internal workflows and data organization.",
        id: "Menyederhanakan alur kerja internal dan pengelolaan data.",
      },
      liveUrl: null,
      repoUrl: "https://github.com/DannyLurker/internal-management-system",
      private: false,
      caseStudy: {
        problem: {
          en: "Organizations need unified internal systems to handle complex operational workflows and data tracking reliably.",
          id: "Organisasi membutuhkan sistem internal terpadu untuk menangani alur kerja operasional yang kompleks dan pelacakan data secara andal.",
        },
        approach: {
          en: "Designed a modern full-stack architecture using Next.js and PostgreSQL to ensure type safety, fast data retrieval, and smooth user interactions.",
          id: "Merancang arsitektur full-stack modern menggunakan Next.js dan PostgreSQL untuk memastikan keamanan tipe data, temu kembali data yang cepat, dan interaksi pengguna yang lancar.",
        },
        built: {
          en: "A scalable internal management system with robust database schemas, secure backend services, and clean responsive interfaces.",
          id: "Sistem manajemen internal yang skalabel dengan skema basis data yang tangguh, layanan backend yang aman, dan antarmuka responsif yang bersih.",
        },
        result: {
          en: "Delivered a performant tool capable of managing internal processes efficiently.",
          id: "Menghasilkan alat berkinerja tinggi yang mampu mengelola proses internal secara efisien.",
        },
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
      label: {
        en: "Projects",
        id: "Proyek",
      },
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
