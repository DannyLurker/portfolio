"use client"

import { useSyncExternalStore } from "react"
import { formatContrast } from "@/lib/contrast"

const TOKEN_NAMES = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--card-hover",
  "--popover",
  "--popover-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--primary",
  "--primary-foreground",
  "--primary-hover",
  "--secondary",
  "--secondary-foreground",
  "--destructive",
  "--border",
  "--border-strong",
  "--border-accent",
  "--input",
  "--ring",
  "--electric",
  "--faint",
  "--heat-0",
  "--heat-1",
  "--heat-2",
  "--heat-3",
  "--heat-4",
]

const EMPTY_SNAPSHOT = ""

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style"],
  })
  return () => observer.disconnect()
}

function getSnapshot() {
  const styles = getComputedStyle(document.documentElement)
  return TOKEN_NAMES.map(
    (name) => `${name}:${styles.getPropertyValue(name).trim()}`
  ).join(";")
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT
}

function parseSnapshot(snapshot: string) {
  const values: Record<string, string> = {}

  if (!snapshot) return values

  for (const entry of snapshot.split(";")) {
    const separator = entry.indexOf(":")
    if (separator === -1) continue
    values[entry.slice(0, separator)] = entry.slice(separator + 1)
  }

  return values
}

export function TokenSwatches() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const values = parseSnapshot(snapshot)
  const canvas = values["--background"]
  const card = values["--card"]

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
      {TOKEN_NAMES.map((name) => {
        const value = values[name]

        return (
          <div
            key={name}
            className="flex flex-col gap-sm rounded-lg border border-border bg-card p-md"
          >
            <div
              className="h-16 rounded border border-border-strong"
              style={value ? { backgroundColor: value } : undefined}
            />
            <p className="type-mono-code text-foreground">{name}</p>
            <p className="type-mono-code text-muted-foreground">
              {value || "reading token"}
            </p>
            <p className="type-body-sm text-muted-foreground">
              Canvas{" "}
              {value && canvas ? formatContrast(canvas, value) : "waiting"} ·
              Card {value && card ? formatContrast(card, value) : "waiting"}
            </p>
          </div>
        )
      })}
    </div>
  )
}
