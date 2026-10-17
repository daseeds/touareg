Type: prototype
Status: open

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