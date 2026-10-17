Type: grilling
Status: open
Blocked by: 05

## Question

Given the findings from the Stack research ticket, settle the stack and say why: hosting, database,
auth, email delivery, and the client framework.

Constraints already fixed: single boat; about 8 Members; low write volume; read-heavy dashboards; web
usable on desktop and mobile; the Owner invites by email; the app records money but never moves it.

Settle alongside it:

- **Client form factor.** A responsive web app, or a responsive app plus an installable PWA? The
  Members are on boats and on phones, and being one tap from the booking calendar has real value — but
  an offline-capable installable app is a different amount of work and a different kind of thing to
  maintain. Say which, and say why.
- **Language and typing.** The previous app here was plain JavaScript with oxlint. Is this one
  TypeScript? The ledger is arithmetic with money and dates, which is exactly where types earn their
  keep.
- Record this as an ADR if it is hard to reverse — which a datastore and an auth provider are. A future
  reader will want to know why this and not the obvious alternative.

One thing to keep an eye on while deciding: the email constraint the research surfaced. If invite email
cannot be sent reliably and cheaply, the invite flow the roster depends on is the weakest link in the
design, and that is a fact to weigh rather than to discover later.