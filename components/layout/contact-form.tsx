"use client"

import * as React from "react"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Messages } from "@/lib/content/types"

function ContactForm({
  email,
  messages,
}: {
  email: string
  messages: Messages
}) {
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">(
    "idle"
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    if (!form.reportValidity()) return

    const formData = new FormData(form)
    const senderName = String(formData.get("name") ?? "")
    const senderEmail = String(formData.get("email") ?? "")
    const message = String(formData.get("message") ?? "")
    const subject = messages["contact.subject"].replace(
      "{name}",
      () => senderName
    )
    const body = [
      `${messages["contact.name"]}: ${senderName}`,
      `${messages["contact.email"]}: ${senderEmail}`,
      "",
      `${messages["contact.message"]}:`,
      message,
    ].join("\n")

    const draft = `mailto:${encodeURI(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.assign(draft)
  }

  async function handleCopyEmail() {
    setCopyState("idle")

    try {
      await navigator.clipboard.writeText(email)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  return (
    <div className="space-y-lg">
      <form
        aria-labelledby="contact-heading"
        className="space-y-lg"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-lg md:grid-cols-2">
          <div className="grid content-start gap-sm">
            <Label htmlFor="contact-name">{messages["contact.name"]}</Label>
            <Input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              required
              className="min-h-11"
            />
          </div>

          <div className="grid content-start gap-sm">
            <Label htmlFor="contact-email">{messages["contact.email"]}</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              className="min-h-11"
            />
          </div>
        </div>

        <div className="grid gap-sm">
          <Label htmlFor="contact-message">
            {messages["contact.message"]}
          </Label>
          <Textarea
            id="contact-message"
            name="message"
            maxLength={2000}
            required
            rows={6}
          />
        </div>

        <Button type="submit" className="min-h-11 w-full sm:w-auto">
          {messages["contact.submit"]}
        </Button>
      </form>

      <div className="flex flex-col items-start gap-sm border-t border-border pt-lg">
        <Button
          type="button"
          variant="secondary"
          className="min-h-11"
          onClick={handleCopyEmail}
        >
          <Copy aria-hidden="true" />
          {messages["contact.copyEmail"]}
        </Button>

        <p role="status" aria-live="polite" aria-atomic="true" className="type-body-sm text-muted-foreground">
          {copyState === "copied" ? messages["contact.copySuccess"] : null}
          {copyState === "failed" ? messages["contact.copyFailure"] : null}
        </p>
        {copyState === "failed" ? (
          <p className="break-all type-mono-code text-electric">{email}</p>
        ) : null}
      </div>
    </div>
  )
}

export { ContactForm }
