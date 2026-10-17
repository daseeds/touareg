Type: grilling
Status: claimed
Blocked by: 01

## Question

Charting settled that maintenance is both observations raised by Members and recurring service
tracking. The Maintenance Items ticket settles the *shape* of both. This ticket settles the *rules* a
Service actually runs on, so the spec can specify them rather than leaving them to whoever builds it:

- Which Services does the boat actually have? Get the real list from whoever looks after the boat rather
  than inventing one — an app tracking six guessed Services is worse than one tracking the four that get
  forgotten. Nothing is imported or discovered, so a Service nobody entered is a Service nobody is ever
  reminded about.
- For each: the cycle (seasonal, annual, or by elapsed time — antifouling is typically every 12–18
  months), and how the next due date is computed from the last completion.
- Which Services are seasonal and therefore bound to a window rather than a date — "lay up before
  December", not "every 365 days".
- **Load-bearing, because nothing will surface it:** when a Service comes due, who is told? The app does
  not raise an Observation on its behalf, so the only thing standing between a Service and two years of
  neglect is whoever happens to look. Is there a lead, or is it everybody's to notice?
- Can a Service be marked not-applicable or skipped, and does that stop the cycle forever or just for
  one period?
- Is there a Service that has come due and been deferred more than once — and if so, what does the app
  show, given that is precisely the boat rotting unnoticed?

Keep this to the real boat. The value here is a short accurate list, not a general maintenance system.

## Answer

_Answering, not yet settled — the real list is still missing._

**Services are entered manually in the app, each with a recurring time.** Nobody imports them, nothing
discovers them, and the app has no opinion about what a boat should need. Whoever looks after Touareg
enters them once.

**The app reminds Members when a Service falls due.** This is the counterweight to the Maintenance Items
decision that a Service never raises an Observation. Nothing invents work, so the reminder is the only
thing standing between a Service and two years of neglect — which makes it load-bearing rather than
decorative. Its mechanism is in the Notifications ticket.

**Consequence worth sitting with:** a Service that was never entered can never be reminded about. The
app's memory is exactly what someone typed in. That makes the list below the whole safety net, and it is
why it is still open.

**Already settled by the Maintenance Items ticket, not re-opened here:** next due is derived from the
last completion rather than stored; anyone may complete a Service directly; deferring does not move the
date while skipping does; and a Service is completed in its own right, never as a side effect of closing
an Observation.

**Still open:**
- The real list. Get it from whoever looks after the boat — the prototype's four are a guess.
- Whether a recurring time is an interval only ("every 18 months") or can also be a window ("lay up
  before December"). The model supports both; "a recurring time" reads like the first.
- How soon before due a reminder fires, and how it repeats while the Service stays undone.