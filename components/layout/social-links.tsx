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
  x: XIcon,
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
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {links.map((link) => {
        const Icon = icons[link.icon];

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              variant="icon"
              aria-label={link.label}
              className="size-11 [&_svg]:size-5"
            >
              <Icon aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { SocialLinks };
