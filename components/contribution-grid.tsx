"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatDay } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import type { HeatmapWeek, MonthLabel } from "@/lib/github/heatmap";

const LEVEL_CLASS = [
  "bg-heat-0",
  "bg-heat-1",
  "bg-heat-2",
  "bg-heat-3",
  "bg-heat-4",
] as const;

type Position = { week: number; day: number };

/**
 * The 52 week grid. One Tab stop with arrow key movement, a tooltip for the
 * active day, sideways scrolling on small screens. The cells are presentational
 * on purpose: the figure label and the summary sentence carry the meaning for
 * screen readers, so nothing is announced 364 times.
 */
function ContributionGrid({
  weeks,
  monthLabels,
  weekdayMarkers,
  locale,
  label,
  dayCountTemplate,
  summaryId,
}: {
  weeks: HeatmapWeek[];
  monthLabels: MonthLabel[];
  weekdayMarkers: Array<string | null>;
  locale: Locale;
  label: string;
  dayCountTemplate: string;
  summaryId: string;
}) {
  const [cursor, setCursor] = React.useState<Position | null>(null);
  const [hovered, setHovered] = React.useState<Position | null>(null);
  const active = hovered ?? cursor;
  const cellRefs = React.useRef(new Map<string, HTMLDivElement>());

  const isDay = (week: number, day: number) => Boolean(weeks[week]?.days[day]);

  const firstDay = React.useCallback(
    (): Position | null => (weeks.length > 0 ? { week: 0, day: 0 } : null),
    [weeks],
  );

  const lastDay = React.useCallback((): Position | null => {
    const weekIndex = weeks.length - 1;
    const days = weeks[weekIndex]?.days ?? [];

    for (let day = days.length - 1; day >= 0; day -= 1) {
      if (days[day]) return { week: weekIndex, day };
    }

    return null;
  }, [weeks]);

  const revealCell = React.useCallback(
    (position: Position) => {
      const cell = weeks[position.week]?.days[position.day];
      if (!cell) return;

      cellRefs.current
        .get(cell.date)
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    },
    [weeks],
  );

  const move = (
    position: Position,
    weekStep: number,
    dayStep: number,
  ): Position => {
    if (weekStep !== 0) {
      for (
        let week = position.week + weekStep;
        week >= 0 && week < weeks.length;
        week += weekStep
      ) {
        if (isDay(week, position.day)) return { week, day: position.day };
      }

      return position;
    }

    const day = position.day + dayStep;

    if (day >= 0 && day < 7 && isDay(position.week, day)) {
      return { week: position.week, day };
    }

    return position;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = cursor ?? lastDay() ?? firstDay();
    if (!current) return;

    let next: Position | null;

    switch (event.key) {
      case "ArrowLeft":
        next = move(current, -1, 0);
        break;
      case "ArrowRight":
        next = move(current, 1, 0);
        break;
      case "ArrowUp":
        next = move(current, 0, -1);
        break;
      case "ArrowDown":
        next = move(current, 0, 1);
        break;
      case "Home":
        next = firstDay();
        break;
      case "End":
        next = lastDay();
        break;
      case "Escape":
        setHovered(null);
        setCursor(null);
        return;
      default:
        return;
    }

    if (!next) return;

    event.preventDefault();
    setHovered(null);
    setCursor(next);
    revealCell(next);
  };

  return (
    <div className="overflow-x-auto pb-2 pt-10">
      <div
        role="group"
        aria-label={label}
        aria-describedby={summaryId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerLeave={() => setHovered(null)}
        onFocus={() =>
          setCursor((current) => current ?? lastDay() ?? firstDay())
        }
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setCursor(null);
          }
        }}
        className="inline-flex w-max rounded-md"
      >
        <div className="flex flex-col gap-0.75 pr-sm">
          <span className="h-4" aria-hidden="true" />
          {weekdayMarkers.map((marker, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="flex h-2.75 items-center justify-end font-mono text-[9px] leading-none text-faint"
            >
              {marker}
            </span>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="flex h-4 gap-0.75" aria-hidden="true">
            {weeks.map((week, column) => {
              const month = monthLabels.find(
                (entry) => entry.column === column,
              );

              return (
                <span key={week.startDate} className="relative w-2.75">
                  {month ? (
                    <span className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] leading-4 text-faint">
                      {month.label}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>

          <div className="flex gap-0.75">
            {weeks.map((week, weekIndex) => (
              <div key={week.startDate} className="flex flex-col gap-0.75">
                {week.days.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <span
                        key={`${week.startDate}-${dayIndex}`}
                        aria-hidden="true"
                        className="size-2.75"
                      />
                    );
                  }

                  const isActive =
                    active?.week === weekIndex && active?.day === dayIndex;

                  return (
                    <div
                      key={day.date}
                      ref={(node) => {
                        if (node) {
                          cellRefs.current.set(day.date, node);
                        } else {
                          cellRefs.current.delete(day.date);
                        }
                      }}
                      aria-hidden="true"
                      onPointerEnter={() =>
                        setHovered({ week: weekIndex, day: dayIndex })
                      }
                      className={cn(
                        "relative size-2.75 rounded-sm",
                        LEVEL_CLASS[day.level] ?? "bg-heat-0",
                      )}
                    >
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute z-10 whitespace-nowrap rounded-md border border-border-strong bg-popover px-sm py-xs shadow-lg",
                            dayIndex <= 1
                              ? "top-full mt-2"
                              : "bottom-full mb-2",
                            weekIndex <= 2
                              ? "left-0"
                              : weekIndex >= weeks.length - 3
                                ? "right-0"
                                : "left-1/2 -translate-x-1/2",
                          )}
                        >
                          <span className="block font-mono text-[10px] leading-4 text-muted-foreground">
                            {formatDay(day.date, locale)}
                          </span>
                          <span className="block font-mono text-[11px] leading-4 text-electric">
                            {dayCountTemplate.replace(
                              "{count}",
                              String(day.count),
                            )}
                          </span>
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ContributionGrid };
