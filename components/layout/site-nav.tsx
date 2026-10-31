"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import type { Messages } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import {
  sectionHref,
  siteSections,
  type SiteSectionId,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./active-section";

const HEADER_OFFSET = 80;
const MENU_ID = "site-menu";

function SiteNav({ locale, messages }: { locale: Locale; messages: Messages }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  // The path the panel was opened on. A navigation changes the pathname, which
  // closes the panel without an effect or a cascading render.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath !== null && openPath === pathname;
  const { activeId, setActiveId } = useActiveSection();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = siteSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    let frame = 0;

    const update = () => {
      frame = 0;

      if (elements.length === 0) {
        setActiveId(null);
        return;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveId(elements[elements.length - 1].id as SiteSectionId);
        return;
      }

      let current: SiteSectionId | null = null;

      for (const element of elements) {
        if (element.getBoundingClientRect().top <= HEADER_OFFSET) {
          current = element.id as SiteSectionId;
        }
      }

      setActiveId(current);
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenPath(null);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenPath(null);
      }
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const onMediaChange = () => {
      if (desktop.matches) setOpenPath(null);
    };

    onMediaChange();
    desktop.addEventListener("change", onMediaChange);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      desktop.removeEventListener("change", onMediaChange);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="flex items-center">
      <nav
        aria-label={messages["nav.label"]}
        className="hidden items-center gap-lg md:flex"
      >
        {siteSections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <Link
              key={section.id}
              href={sectionHref(locale, section.id)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative inline-flex h-16 items-center type-body-md transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {messages[section.labelKey]}
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-electric"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <Button
        ref={triggerRef}
        type="button"
        variant="icon"
        size="icon"
        className="size-11 md:hidden"
        aria-label={open ? messages["nav.closeMenu"] : messages["nav.openMenu"]}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={MENU_ID}
            key={MENU_ID}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.16,
              ease: [0.2, 0, 0, 1],
            }}
            className="fixed inset-x-0 top-16 z-30 overflow-hidden border-b border-border bg-background md:hidden"
          >
            <Container className="py-md">
              <nav aria-label={messages["nav.label"]} className="flex flex-col">
                {siteSections.map((section) => {
                  const isActive = activeId === section.id;

                  return (
                    <Link
                      key={section.id}
                      href={sectionHref(locale, section.id)}
                      aria-current={isActive ? "location" : undefined}
                      onClick={() => setOpenPath(null)}
                      className={cn(
                        "inline-flex min-h-11 items-center border-b border-border py-sm type-body-lg transition-colors last:border-b-0",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "relative",
                          isActive &&
                            "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-electric",
                        )}
                      >
                        {messages[section.labelKey]}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export { SiteNav };
