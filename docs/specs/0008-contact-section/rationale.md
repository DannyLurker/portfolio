# Rationale: 0008. Build the contact section

## Context

The contact section closes the portfolio page. Visitors need a direct way to start a conversation, while the site remains static and does not store or deliver messages. The published address is already part of the profile content and is currently hidden behind a copy action.

The portfolio supports English and Indonesian. A visitor should be able to understand the form and the draft without guessing how their details will be used. The form therefore needs a small, explicit set of fields and a predictable mapping into the email subject and body.

The visual source is the existing `DESIGN.md` and the current section patterns. The repository also links a Figma file, but no design tool connection or contact frame was supplied for this decision.

## Options considered

### Option 1: Three required fields with a fixed subject and labeled body

Ask for a name, reply email and message. Build the subject from the name and put the name and reply email above the message in the draft body.

**Pros**:

* Collects only what is needed to reply.
* Makes the resulting email easy to scan and identify.
* Keeps the form small and the email mapping explicit.

**Cons**:

* The visitor cannot choose a custom subject.
* The form cannot categorize or route inquiries automatically.

### Option 2: Add a visitor entered subject

Add a fourth field and use its value as the email subject.

**Pros**:

* The visitor can describe the inquiry in their own words.
* It may help distinguish unrelated inquiries in an inbox.

**Cons**:

* Adds another required choice before a visitor can contact the site owner.
* Subject quality and language become the visitor's responsibility.

### Option 3: Add project type and budget fields

Ask the visitor to classify the inquiry and provide a budget before opening the email draft.

**Pros**:

* Could help qualify project inquiries.
* Could provide more context before the conversation begins.

**Cons**:

* Adds friction for collaborators and other visitors who are not requesting paid work.
* The static site has no routing or workflow that would use these answers.

## Rationale

The site owner chose the three field set, made all fields required, and chose a subject that includes the sender's name and follows the page locale. The chosen body order puts reply details before the message, making the draft easy to scan. The 2,000 character message limit keeps the encoded draft bounded without changing the requested form into a full message service.

The static site needs only enough information to start a human conversation. A custom subject or qualification fields would ask visitors for more work without a server side feature that uses those answers. Native validation and the existing profile and message sources also fit the project's minimal stack.
