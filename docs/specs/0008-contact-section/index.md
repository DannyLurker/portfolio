# 0008. Build the contact section

**Date**: 2026-10-31
**Status**: In Progress

## Summary

The contact section gives visitors a short form that opens a ready to send email in their mail app. It asks only for a name, reply email and message, and puts those values into a clear, localized draft. The section also keeps the copy email action and social links available.

## Requirements

**User stories**:

* As a visitor, I want to send a concise inquiry, so I can start a conversation without composing the email from scratch.
* As a visitor, I want to copy the published address or reach the social profiles, so I have another way to make contact.
* As the site owner, I want the form to open a draft without a backend, so the site does not collect or store messages.

**Acceptance criteria**:

* **AC-1**: The contact section is the final home page section before the footer on `/en` and `/id`. It uses the `contact` section id, a localized heading, the existing section and container patterns, and the design tokens in `DESIGN.md`.
* **AC-2**: The form has exactly three fields: required name, required reply email and required message. Name is limited to 100 characters, email to 254 characters and message to 2,000 characters. The email field uses native email validation. Invalid fields keep the browser from opening the draft, using native browser validation.
* **AC-3**: Submitting a valid form opens a `mailto:` draft addressed to `profile.email`. Its localized subject is `Contact from {name}` in English and `Kontak dari {name}` in Indonesian.
* **AC-4**: The draft body is `Name: {name}\nReply email: {email}\n\nMessage:\n{message}` in English and `Nama: {name}\nEmail balasan: {email}\n\nPesan:\n{message}` in Indonesian. The three values come from the submitted fields. The email value is included in the body, not set as a draft header. Subject and body are encoded for the `mailto:` URI.
* **AC-5**: The form does not send the message or claim it was sent. It creates a draft for the visitor to review and send. No message is stored or sent to a server.
* **AC-6**: The published email can be copied with visible, localized success feedback announced through a live status region. If clipboard access fails, the section announces localized failure feedback and reveals the address as selectable text.
* **AC-7**: Social links use `getLinks()` and have an accessible group label plus the accessible name supplied for each link. Form controls, copy action and social links are keyboard reachable with a visible focus ring.
* **AC-8**: All contact section interface copy is provided for English and Indonesian through `content/messages.ts`. At 360px width the section has no horizontal scrolling and its interactive controls are at least 44px tall.
* **AC-9**: `npm run lint` reports no errors and `npm run build` renders the home page in both locales.

## Decision

**Chosen option**: Option 1: collect name, reply email and message, then generate a localized subject and a labeled email body.

Require all three fields. Use native browser validation and limits of 100 characters for name, 254 for email and 2,000 for message. The subject is `Contact from {name}` in English and `Kontak dari {name}` in Indonesian. The body contains the localized name and reply email lines, followed by a blank line and the localized message block. Use the active page locale for all labels and subject text.

The exact body templates are `Name: {name}\nReply email: {email}\n\nMessage:\n{message}` in English and `Nama: {name}\nEmail balasan: {email}\n\nPesan:\n{message}` in Indonesian. The reply email is body text so the visitor can use it to reply. The form does not set a separate draft header from that field.

The component can use a small client side boundary to build the encoded `mailto:` URI and report clipboard results. The native validation remains browser provided. No backend endpoint or storage is added.

## Feature design

**Data model sketch**:

There is no persisted data model. The three values exist only in the form until the browser opens the visitor's mail handler. The visitor decides whether to send the draft.

| Form field | Type | Required | Maximum length | Draft destination |
|---|---|---:|---:|---|
| `name` | text | yes | 100 characters | Localized subject and first body line |
| `email` | email | yes | 254 characters | Second body line |
| `message` | textarea | yes | 2,000 characters | Message block after the blank line |

**Localized interface copy**:

| Purpose | English | Indonesian |
|---|---|---|
| Section heading | `Contact` | `Kontak` |
| Name field | `Name` | `Nama` |
| Reply email field | `Reply email` | `Email balasan` |
| Message field | `Message` | `Pesan` |
| Submit action | `Open email draft` | `Buka draf email` |
| Copy action | `Copy email` | `Salin email` |
| Copy success | `Email copied` | `Email disalin` |
| Copy failure | `Copy failed. You can select and copy the address.` | `Gagal menyalin. Anda dapat memilih dan menyalin alamat email.` |
| Social link group | `Social links` | `Tautan sosial` |

**State transitions**: none. The form does not create or track a submission. Copy feedback has `idle`, `copied` and `failed` display states, reset when the visitor tries again.

**API surface**:

| Surface | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| Contact form submit handler | browser form submit | `name`, `email`, `message` | Navigates to a `mailto:` URI with recipient, subject and body | Public | Native validation blocks missing, malformed or over limit values; no mail handler is a browser or operating system condition that the page cannot reliably detect |
| Copy email handler | button activation | `profile.email` | Clipboard write and localized feedback state | Public | Clipboard rejection reveals the address and shows failure feedback |

There is no HTTP endpoint. The browser's default email handler opens the draft, and the visitor sends it manually.

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Render the section | section id | `contact`, shared section id from `lib/navigation.ts` |
| Render the heading and form labels | localized interface copy | `getMessages(locale)` from `content/messages.ts`, with new `contact.*` keys |
| Render the recipient address | email address | `profile.email` from `getProfile(locale)` |
| Build the subject | subject text | localized `contact from {name}` template plus submitted `name` |
| Build the first body line | name label and value | localized `contact.name` label plus submitted `name` |
| Build the second body line | reply email label and value | localized `contact.email` label plus submitted `email` |
| Build the message block | message label and value | localized `contact.message` label plus submitted `message` |
| Render social links | destinations and accessible names | `getLinks()` from `lib/content`, the group label from `contact.socialLabel` |
| Copy the address | clipboard value | `profile.email` from `getProfile(locale)` |
| Show copy feedback | success or failure status | copy handler result and localized `contact.copySuccess` or `contact.copyFailure` messages |
| Show the address after copy failure | selectable address text | `profile.email` from `getProfile(locale)` |

**Key invariants**:

* All three fields are required and use the confirmed maximum lengths.
* The subject and body use the active page locale, and the body order is name, reply email, message.
* The recipient is always `profile.email`; the form cannot override it.
* The application never claims the email was sent. It only opens a draft.
* Form values are not persisted, logged or submitted to a site endpoint.
* Clipboard success is announced only after the write succeeds. Failure feedback does not hide the only visible way to retrieve the address.

**Security model**:

The section is public and has no authentication or authorization. The form values remain in the visitor's browser until the visitor opens and sends the draft through their own mail handler. The application does not store or transmit the values to a server. The email recipient is a published profile value.

**Configuration required**: none.

**Critical test scenarios**:

* Happy path: on both locales, enter all three fields and submit. The mail draft has the profile email recipient, localized subject and body in the agreed order, verifies **AC-2**, **AC-3**, **AC-4**, **AC-5**.
* Validation: leave each field blank in turn, enter a malformed email, and exceed each limit. The browser blocks submission and exposes its native validation, verifies **AC-2**.
* Clipboard success and failure: success shows confirmation only after writing; a rejected write reveals the address and failure message, verifies **AC-6**.
* Keyboard and narrow screen: use every control on `/en` and `/id` by keyboard, then view at 360px. Focus is visible, controls remain usable and no horizontal scroll appears, verifies **AC-7**, **AC-8**.
* Public access: open either locale without an account. The form and social links are available with no auth check, verifies **AC-1**, **AC-7**.

## Build plan

Tracer Bullet: connect the form from localized content through the browser draft first, then finish the copy and social paths and check both locales.

* [x] Add the localized heading, form labels, subject templates, copy feedback and social group label to both message dictionaries and the `Messages` type, satisfies **AC-1**, **AC-3**, **AC-4**, **AC-6**, **AC-7**, **AC-8**.
* [x] Build the contact section with the three constrained fields and the client side submit handler. Source profile and locale values from the existing accessors, encode the recipient, subject and body, and open the draft without claiming delivery, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**.
* [x] Add copy email feedback and its clipboard failure fallback, then render the social links from `getLinks()` with an accessible group label, satisfies **AC-6**, **AC-7**.
* [x] Replace the contact placeholder in the home page section list with the real section and apply the existing design tokens, responsive sizes and focus treatment, satisfies **AC-1**, **AC-7**, **AC-8**.
* [x] Check draft mapping, validation, clipboard outcomes, keyboard access, both locales and 360px layout, then run lint and build, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**, **AC-8**, **AC-9**.

## Consequences

**Positive**:

* Visitors get a ready to send email with the important details in a predictable order.
* The site remains static and does not hold submitted personal messages.
* Existing profile, locale, message and social link sources remain the single source for contact details.

**Negative / tradeoffs**:

* Visitors need a mail handler to create the draft, and the site cannot confirm that they sent it.
* The subject is fixed apart from the sender's name, so visitors cannot categorize an inquiry from the form.
* Clipboard access can be denied, so the failure path must reveal the address.

**Neutral**:

* The form fields and email draft exist only in browser memory.
* The design follows `DESIGN.md` and existing section patterns. The Figma file can inform a later visual adjustment if a contact frame is supplied.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
