import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import type { SiteSectionId } from "@/lib/navigation"

// Temporary until the real section lands. See spec 0004 Follow-up.
function SectionPlaceholder({
  id,
  label,
}: {
  id: SiteSectionId
  label: string
}) {
  return (
    <Section id={id} className="flex min-h-[70vh] items-center">
      <Container>
        <h2 className="type-headline-lg text-foreground">{label}</h2>
      </Container>
    </Section>
  )
}

export { SectionPlaceholder }
