## Destination

A build-ready spec for Touareg: one document an agent or developer can implement end-to-end —
covering Maintenance Items, the cost and Payment ledger, Bookings, and Days Used stats — without
stopping to make further decisions. The spec is the deliverable; this effort does not build the app.

## Notes

**Planning only.** Produce decisions, not deliverables. The pull to start building is the signal the
map is done: hand off to `/to-spec` or `/implement-spec` at that point.

**Domain language.** Read `GLOSSARY.md` before naming anything. The canonical terms are Boat, Member,
Owner, Fare year, Dues, Share, Expense, Payment, Balance, Slot, Booking, Days Used, Maintenance Item.
Drift from these and the spec inherits the drift.

**Settled during charting — do not re-litigate:**

- Single boat, Touareg. Not a fleet, not a club.
- One Owner, who is also a Member and carries a Share like everyone else.
- The app records Payments. It never moves money: no card capture, no direct debit.
- Full transparency: every Member sees every Balance, Payment and Expense.
- The Fare year is the calendar year; a Member joining mid-year is prorated.
- Bookings are per-Slot: morning, afternoon, night.
- Bookings are first-come-first-served, free to cancel, with a per-Member cap.
- Every Expense is divided by Share, and out-of-pocket payment credits whoever fronted it.
- Share is 1 for every Member unless overridden.
- Maintenance has **two faces**, both in scope: **observations** any Member raises on seeing something
  wrong ("an electric wire will need fixing"), and **service tracking** for recurring work that comes due
  whether or not anyone notices. The shape of each is unsettled — see the Maintenance Items and
  Recurring services tickets.
- Stack: undecided. Firebase is a suggestion, not a given.

**How sessions run here.** `/wayfinder <path/to/map.md>` resumes. Read the frontier from the
`Blocked by:` and `Status:` lines in `issues/`, claim by setting `Status: claimed`, resolve by
writing an `## Answer`, setting `Status: resolved`, and appending a one-line gist here.

## Decisions so far

<!-- one line per resolved ticket: - [Title](path): gist. The detail lives in the ticket. -->

_Nothing resolved yet._

- [Stack research: hosting, auth and database options against this app's needs](issues/05-stack-research.md): 8 invite emails fit every free tier's volume, but Firebase Spark cannot send one at all (no server to hold the key, magic links capped 5/day) while Supabase's default SMTP does 2/hour to project-team addresses only.

## Not yet specified

- **Notifications and reminders**: what the app proactively surfaces — unpaid Dues, a Booking starting
  tomorrow, an overdue Maintenance Item. Depends on the ledger, the Bookings and the Maintenance Items
  all being settled.
- **Guests and crew on a Booking**: whether a Booking can carry people who are not Members, and
  whether that affects the fairness cap.
- **Export and backup**: getting the financial history out — CSV, a printable statement, something to
  hand the bank or an accountant. Nobody has said what they need, which is why it is fog.
- **Late payment**: whether an unpaid Balance should affect a Member's booking rights, and whether
  anything accrues beyond the Balance itself.
- **Member leaving**: what happens to a departed Member's history and to any outstanding Balance.
  Overlaps the Members ticket; graduate only if that ticket leaves it open.
- **Boat profile**: whether name, registration, dimensions and home port are recorded in the app, and
  whether any of it is worth a field.

## Out of scope

- **Processing payments** — card capture, direct debit, the app as payer of record. Chosen: record only.
- **Multiple boats or fleet management.** Chosen: a single boat.
- **Native mobile apps.** The destination is a web app, usable on desktop and mobile.
- **An approval step on Bookings.** Chosen: first-come-first-served. Being a bottleneck on every trip
  was explicitly rejected.