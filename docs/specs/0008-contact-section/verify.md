# Verify: contact section · spec 0008 · updated 2026-10-31

_Steps derived from spec 0008 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open `/en` and `/id`. Confirm the Contact section is the final home page section before the footer, has the `contact` anchor, and shows the correct localized heading and field labels. **AC-1**, **AC-8**
- [x] In English, enter a name such as `Morgan`, a reply address such as `morgan@example.com`, and a message. Submit and confirm the draft recipient is `dannycode992@gmail.com`, the subject is `Contact from Morgan`, and the body is `Name: Morgan`, then `Reply email: morgan@example.com`, a blank line, then `Message:` and the entered message. **AC-3**, **AC-4**
- [x] Repeat in Indonesian. Confirm the subject is `Kontak dari Morgan` and the body labels are `Nama`, `Email balasan`, and `Pesan`, with the same value order. **AC-3**, **AC-4**
- [x] Leave each field empty in turn, enter a malformed reply email, and try to exceed the name, email, and message limits. Confirm native validation prevents opening the draft and the limits hold. **AC-2**
- [x] Confirm submit opens a draft only. Do not send it. Verify the site does not show a sent confirmation or send the form values to a site endpoint. **AC-5**
- [x] Activate Copy email. Confirm success appears only after the address is copied. Deny clipboard access and activate it again. Confirm failure feedback appears and `dannycode992@gmail.com` is revealed as selectable text. **AC-6**
- [x] Use the keyboard to reach the submit button, copy button, and each social link. Confirm visible focus, the social group name, and the supplied accessible name for each link. **AC-7**
- [x] At 360px width, confirm there is no horizontal scroll and every interactive control is at least 44px tall. **AC-8**

## Commands

- [ ] `npm run lint` reports no errors. **AC-9**
- [ ] `npm run build` completes and prerenders the home page in English and Indonesian. **AC-9**

## Acceptance criteria coverage

- AC-1 and AC-8 are covered by the locale, section anchor, labels, and narrow viewport steps.
- AC-2 is covered by the required field, malformed email, and length limit step.
- AC-3 and AC-4 are covered by the English and Indonesian draft steps, including recipient, subject, labels, values, and order.
- AC-5 is covered by the draft only step.
- AC-6 is covered by the clipboard success and denial step.
- AC-7 is covered by the keyboard and social link step.
- AC-9 is covered by both command steps.
