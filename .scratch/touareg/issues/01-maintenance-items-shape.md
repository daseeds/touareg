Type: prototype
Status: resolved

## Question

Maintenance has two faces, and both are in scope:

- **Observations** — any Member notes something that needs doing. "Someone sees that an electric wire
  will need to be fixed."
- **Service tracking** — recurring work that comes due whether or not anyone notices it. Antifouling
  each spring, rig inspection, sail inspection, engine service, winter lay-up.

Build a cheap, rough, concrete artifact showing both (an outline is enough, or a stub UI if that helps)
and react to it, settling:

**Observations**
- What does an item carry beyond its description? Who raised it, on what date, which part of the boat,
  how urgent.
- What lifecycle — open, in progress, done? Is anything ever declined or abandoned rather than done?
- Who may raise an item, and who may close one? All Members, or the Owner only?
- Is a photo or attachment possible, or is text enough?
- Does anything distinguish "urgent, the boat is unsafe" from "next time we are out there"?

**Services**
- Is a Service a recurring rule (every 18 months, every spring), a dated item the Owner keeps up to
  date, or both?
- Does a Service come due and sit overdue until someone deals with it, or does it raise an Observation
  automatically so the two lists share one workflow?
- Can a Service be deferred or skipped without the schedule silently resetting — antifouling done late
  should push the next date, not spawn a second overdue item?
- Is there ever a Service with no cycle, such as a one-off commissioning job?

**Where the two meet**
- Does closing an Observation satisfy a Service that came due, or are they strictly separate?
- Are they one list with two labels, or two lists?

Deliberately left to a later ticket: how the cost of work reaches the ledger. Do not settle that here —
but do record whether the shape you build can carry a cost at all, since the From a Maintenance Item to
an Expense ticket depends on that answer.

## Answer

_Settling — one question still open. See the last section._

A prototype put the model through its awkward cases: the happy path, a job done late, a service
deferred until it disappears, and an attempt at something that should be illegal. It is kept as a
primary source on the throwaway branch `prototype/maintenance-model` (file
`prototype/maintenance-model.html`, never merged); the pure reducer in its `model` script block is the
part worth lifting into the real code. What survived:

**Two kinds of Maintenance, and they behave differently enough to be distinct concepts.** An
**Observation** is raised by a Member on seeing something wrong. A **Service** is recurring work on a
cycle. An Observation is raised and closed by people; a Service comes due on its own and can be
deferred, skipped, or done late.

**An Observation carries** a description, the part of the boat, who raised it and when, an urgency
(routine / soon / unsafe), an optional photo, an optional cost, and a status: open → in progress → done,
or declined. Declined is terminal, and the item stays findable in the record.

**A Service carries** a cycle — an interval of months, or seasonal, "before April" — the date it was
last completed, a derived next-due date, and counters for deferrals and skips.

**Next due is always derived from the last completion, never stored alongside it**, so a Service can
never disagree with its own cycle. That invariant is what makes the rest hold.

**Done late counts from completion.** Antifouling finished three months overdue gets a full cycle from
the day it was finished, not from the date it was due. Counting from the old due date squeezes the cycle
and the job creeps earlier every year.

**Deferring does not move the date.** The Service stays overdue, and the deferral is counted and shown.
Silently resetting the schedule would hide precisely the case that matters — the boat quietly rotting.
**Skip** is the deliberate escape hatch: it pushes a full cycle forward from today and counts the skip.

**Permissions.**
- Any Member may raise an Observation, attach a photo, start and finish work, attach a cost, and
  complete a Service. A Member who buys a part knows what it cost.
- Only the Owner may decline an Observation — deciding the boat will *not* do something is the Owner's
  call — and only the Owner may defer or skip a Service, because that moves the schedule.

**An Observation and a Service can both carry a cost.** That settles the handoff: the From a
Maintenance Item to an Expense ticket is not blocked by the shape, and a Member-recorded cost has
somewhere to live. It also raised a question now carried in that ticket — if any Member can put a
figure on the record, what stops a bad figure or a duplicate from inflating everyone's Balance?

**One list or two: neither — Observations and Services are strictly separate.** A Service comes due and
stays visible on its own; the app never raises an Observation on its behalf, and closing an Observation
never completes or resets a Service. A Service is completed directly, in its own right, by whoever did
the work.

That is the prototype's default position, so the model as built is already the settled one. The two
switches remain in only because they cost nothing to keep and demonstrate the alternative if the boat's
reality turns out otherwise — with a handful of Members who are all perfectly capable of noticing, the
app inventing work is worse than trusting them to see it.

The consequence to carry forward: "when a Service comes due, who is told?" stops being a nicety and
becomes load-bearing, since nothing in the app will surface it on its own. That is in the Recurring
services ticket.