# 0005. Hero section: decision record

## Context

The scope asks for a first screen with the name, role, headline, intro, availability dot and a primary action, all from the owner's content. `DESIGN.md` covers the display type, the atmospheric glow and the status pill, but it never names a call to action, and the content model has no field for one. The hero was built during `/develop` on an assumed decision: one `Get in touch` action to the contact section. That assumption was never deliberated, so the spec stayed `Assumed` after the feature shipped.

The build also made two choices the scope's element list does not spell out. It added a location and timezone line next to the status pill, and it made the dot ping while `profile.available` is `false`. A later feature would otherwise have to guess at both, so all three choices are settled here together.

The forces are simple. The site is static and public, so every value must come from one content source and nothing can be computed per visitor. The contact section is the only outcome the owner controls today, because the project index and the detail pages are still ahead. And the hero is the one screen every visitor sees, so each extra element and each extra focus stop costs attention.

## Options considered

### Option 1: The built composition, with one `Get in touch` action (chosen)

Status pill with the availability line and an always pinging dot, location and timezone line, role eyebrow, name as the `h1`, headline, intro, and one primary button to the contact section.

**Pros**:
- Contact is the outcome the site exists for, and it is one click away from the first screen.
- Every value is real profile data, so the screen needs no invented copy beyond the action label.
- The location and timezone answer the remote work question before the visitor reads the intro.

**Cons**:
- The name as the `h1` puts the least descriptive line in the strongest search position.
- The extra location line is not in the scope's element list.
- The action points at a section that is still a placeholder today.

### Option 2: The scope's six elements, without the location line

Status pill, role eyebrow, name as the `h1`, headline, intro and one `Get in touch` button. The location and timezone are dropped.

**Pros**:
- Matches the scope list exactly and keeps the first screen shorter.
- Fewer values to bind and one less thing to maintain.

**Cons**:
- Loses real profile data that a visitor evaluating remote work cares about.
- The status row then holds only the pill, which reads as thinner and less deliberate.

### Option 3: The built composition with `View work` as the single action

The same layout, but the one button sends the visitor to the project index instead of contact.

**Pros**:
- Pushes visitors into the work, which is the strongest evidence the site can show.
- The label reads as a natural next step after the intro.

**Cons**:
- The project index does not exist yet, so the button would point at a placeholder or a future anchor.
- Contact becomes harder to reach, and the contact section is the owner's real goal.
- The destination would change meaning once the index ships, which makes the label unstable.

### Option 4: `Get in touch` primary plus a quieter `View work` link

Two actions on the first screen, a filled button for contact and a text link for the work.

**Pros**:
- Serves both visitor intents without hiding either.
- Keeps the primary action where it belongs.

**Cons**:
- Adds a second message key, a second focus stop and a second decision about hierarchy.
- Two actions on a first screen compete, and the quieter one tends to read as decoration.

**Availability dot**: driving the ping from `profile.available` was also considered and rejected. The availability line is the message and the dot is motion. Making the boolean the source of truth would let a field the hero never reads override the sentence the owner already wrote, and the two currently disagree. The mismatch belongs to the content, not to the component.

## Rationale

The action choice follows the site's job. This is a portfolio meant to start conversations, and contact is the one outcome the owner controls today. `View work` fails on timing: the index and the detail pages are not built, so the label would promise a destination that does not exist yet, and its meaning would shift when those pages land. Two actions fail on focus: the first screen is a single message, and a second link splits it.

The composition keeps the location and timezone because they are real profile values and they answer a practical question early. Dropping them would match the scope list, but it would also remove information the visitor would otherwise have to find on the contact section. The name stays the `h1` because that is how the page is titled and shared. Promoting the headline would make the page title a sentence that changes with every content edit, and the headline already sits directly under the name in the display order.

The dot always pings because decoration should not arbitrate content. The pill already carries the availability sentence, so the dot only needs to look alive. Tying it to `available` would make a boolean the real message and turn a content disagreement into a rendering rule. The follow up records the mismatch and leaves the fix to the content owner.
