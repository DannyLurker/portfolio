import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SocialLinks } from "@/components/layout/social-links";
import { Panel } from "@/components/panel";
import type { Messages, Profile, SocialLink } from "@/lib/content/types";
import { ContactForm } from "./contact-form";

function ContactSection({
  profile,
  links,
  messages,
}: {
  profile: Profile;
  links: SocialLink[];
  messages: Messages;
}) {
  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <Container>
        <h2 id="contact-heading" className="type-headline-lg text-foreground">
          {messages["contact.heading"]}
        </h2>

        <div className="mt-lg grid gap-xl md:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)] md:gap-2xl">
          <Panel>
            <ContactForm
              email={profile.email}
              messages={messages}
            />
          </Panel>

          <div className="flex flex-col items-start gap-lg border-t border-border pt-lg md:border-l md:border-t-0 md:pl-xl md:pt-0">
            <div>
              <h3 className="type-mono-badge text-muted-foreground">
                {messages["contact.socialLabel"]}
              </h3>
              <SocialLinks
                links={links}
                label={messages["contact.socialLabel"]}
                className="mt-sm"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export { ContactSection };
