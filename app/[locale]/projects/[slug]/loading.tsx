import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Panel } from "@/components/panel";

export default function Loading() {
  return (
    <Section bordered={false} className="pb-2xl pt-xl md:pt-2xl">
      <Container className="animate-pulse">
        {/* Top Back Link Placeholder */}
        <div className="h-11 w-28 rounded-md bg-muted/60" />

        {/* Header Skeleton */}
        <header className="mt-xl border-b border-border pb-xl">
          {/* Metadata Row (Order / Role) */}
          <div className="flex items-center gap-sm">
            <div className="h-4 w-6 rounded bg-muted/60" />
            <div className="h-4 w-2 rounded bg-muted/40" />
            <div className="h-4 w-32 rounded bg-muted/60" />
          </div>

          {/* Title */}
          <div className="mt-md h-12 w-3/4 max-w-2xl rounded-lg bg-muted/80 md:h-16" />

          {/* Summary Paragraph */}
          <div className="mt-md max-w-3xl space-y-2">
            <div className="h-5 w-full rounded bg-muted/60" />
            <div className="h-5 w-4/5 rounded bg-muted/60" />
          </div>

          {/* Stack Tags */}
          <div className="mt-lg flex flex-wrap gap-sm">
            <div className="h-7 w-20 rounded-md bg-muted/50" />
            <div className="h-7 w-24 rounded-md bg-muted/50" />
            <div className="h-7 w-16 rounded-md bg-muted/50" />
            <div className="h-7 w-28 rounded-md bg-muted/50" />
          </div>

          {/* Action Buttons */}
          <div className="mt-lg flex flex-wrap items-center gap-sm">
            <div className="h-11 w-32 rounded-md bg-muted/70" />
            <div className="h-11 w-36 rounded-md bg-muted/50" />
          </div>
        </header>

        {/* Cover Image Container */}
        <Panel className="mt-xl overflow-hidden p-xs md:p-sm">
          <div className="aspect-video w-full rounded-md bg-muted/60" />
        </Panel>

        {/* Case Study Parts List (4 items matching caseStudyParts) */}
        <div className="mt-2xl divide-y divide-border border-y border-border">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="grid gap-md py-lg md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)] md:gap-xl md:py-xl"
            >
              {/* Left Column: Part Index & Heading */}
              <div className="flex items-center gap-md">
                <div className="h-6 w-6 rounded bg-muted/50" />
                <div className="h-6 w-32 rounded bg-muted/70" />
              </div>

              {/* Right Column: Case Study Text */}
              <div className="max-w-3xl space-y-2">
                <div className="h-5 w-full rounded bg-muted/50" />
                <div className="h-5 w-11/12 rounded bg-muted/50" />
                <div className="h-5 w-3/4 rounded bg-muted/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Back Link Placeholder */}
        <div className="mt-xl">
          <div className="h-11 w-28 rounded-md bg-muted/60" />
        </div>
      </Container>
    </Section>
  );
}
