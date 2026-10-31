import { Link } from "@/components/link";
import type { SocialIcon, SocialLink } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../icons";
import { XIcon } from "lucide-react";

const icons: Record<
  SocialIcon,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  github: GithubIcon,
  twitter: XIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
};

function SocialLinks({
  links,
  label,
  className,
}: {
  links: SocialLink[];
  label: string;
  className?: string;
}) {
  return (
    <ul
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-sm", className)}
    >
      {links.map((link) => {
        const Icon = icons[link.icon];

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              variant="nav"
              aria-label={link.label}
              className="group/social inline-flex min-h-11 min-w-11 items-center justify-center gap-sm rounded-md border border-border bg-transparent px-md py-sm type-body-sm text-muted-foreground transition-colors hover:border-border-accent hover:bg-card-hover hover:text-electric active:border-border-accent active:bg-accent active:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Icon
                aria-hidden="true"
                className="size-4 shrink-0 transition-colors group-hover/social:text-electric"
              />
              <span>{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { SocialLinks };
