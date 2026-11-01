import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Panel } from "@/components/panel";
import { Tag } from "@/components/tag";
import { buttonVariants } from "@/components/ui/button";
import {
  getMessages,
  getProjectBySlug,
  getProjectSlugs,
  getProjects,
  requireLocale,
} from "@/lib/content";
import { sectionHref } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/content";
import {
  getLanguageAlternates,
  getPageUrl,
  openGraphLocales,
  socialImageSize,
} from "@/lib/seo";

type ProjectPageParams = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: ProjectPageParams;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = requireLocale(rawLocale);
  const project = getProjectBySlug(locale, slug);
  const profile = getProfile(locale);

  if (!project) return {};

  const pageUrl = getPageUrl(locale, `projects/${slug}`);
  const imageUrl = getPageUrl(locale, `projects/${slug}/opengraph-image`);

  return {
    title: project.name,
    description: project.summary,
    alternates: {
      canonical: pageUrl,
      languages: getLanguageAlternates(`projects/${slug}`),
    },
    openGraph: {
      title: project.name,
      description: project.summary,
      type: "article",
      url: pageUrl,
      siteName: profile.name,
      locale: openGraphLocales[locale],
      images: [
        {
          url: imageUrl,
          width: socialImageSize.width,
          height: socialImageSize.height,
          alt: project.cover.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.summary,
      images: [imageUrl],
    },
  };
}

const caseStudyParts = [
  { id: "problem", message: "project.part.problem" },
  { id: "approach", message: "project.part.approach" },
  { id: "built", message: "project.part.built" },
  { id: "outcome", message: "project.part.outcome" },
] as const;

export default async function ProjectPage({
  params,
}: {
  params: ProjectPageParams;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = requireLocale(rawLocale);
  const messages = getMessages(locale);
  const project = getProjectBySlug(locale, slug);

  if (!project) notFound();

  const projectOrder = getProjects(locale).findIndex(
    (entry) => entry.slug === slug,
  );
  const orderLabel = String(projectOrder + 1).padStart(2, "0");
  const study = [
    project.caseStudy.problem,
    project.caseStudy.approach,
    project.caseStudy.built,
    project.outcome,
  ];

  return (
    <Section bordered={false} className="pb-2xl pt-xl md:pt-2xl">
      <Container>
        <Link
          href={sectionHref(locale, "work")}
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            "-ml-3 min-h-11",
          )}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {messages["project.back"]}
        </Link>

        <header className="mt-xl border-b border-border pb-xl">
          <div className="flex flex-wrap items-center gap-sm type-mono-badge text-muted-foreground">
            <span>{orderLabel}</span>
            <span aria-hidden="true" className="text-faint">
              /
            </span>
            <span>{project.role}</span>
          </div>
          <h1 className="mt-md type-display-hero text-foreground">
            {project.name}
          </h1>
          <p className="mt-md max-w-3xl type-body-lg text-muted-foreground">
            {project.summary}
          </p>

          <ul
            aria-label={messages["project.stackLabel"]}
            className="mt-lg flex flex-wrap gap-sm"
          >
            {project.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>

          <div className="mt-lg flex flex-wrap items-center gap-sm">
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                className={buttonVariants({
                  size: "md",
                  className: "min-h-11",
                })}
              >
                {messages["project.liveSite"]}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            {!project.private && project.repoUrl ? (
              <Link
                href={project.repoUrl}
                className={buttonVariants({
                  variant: "secondary",
                  size: "md",
                  className: "min-h-11",
                })}
              >
                {messages["project.source"]}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            {project.private ? <Tag>{messages["project.private"]}</Tag> : null}
          </div>
        </header>

        <Panel className="mt-xl overflow-hidden p-xs md:p-sm">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) calc(100vw - 4rem), 1160px"
            className="h-auto w-full rounded-md"
          />
        </Panel>

        <ol className="mt-2xl divide-y divide-border border-y border-border">
          {caseStudyParts.map((part, index) => (
            <li
              key={part.id}
              className="grid gap-md py-lg md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)] md:gap-xl md:py-xl"
            >
              <h2 className="type-headline-md text-foreground">
                <span className="mr-md type-mono-badge text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {messages[part.message]}
              </h2>
              <p className="max-w-3xl type-body-lg text-muted-foreground">
                {study[index]}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-xl">
          <Link
            href={sectionHref(locale, "work")}
            className={cn(
              buttonVariants({ variant: "ghost", size: "md" }),
              "-ml-3 min-h-11",
            )}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {messages["project.back"]}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
