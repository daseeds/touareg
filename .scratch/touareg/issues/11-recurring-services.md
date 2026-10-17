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
- For each: the time of the year it recurs at, and how the next due date is computed from the last
  completion. _Answered: annually, anchored to a time of year; next due derived from last completion._
- Which Services are seasonal and therefore bound to a window rather than a date — "lay up before
  December", not "every 365 days".
- **Load-bearing, because nothing will surface it:** when a Service comes due, who is told? The app does
  not raise an Observation on its behalf, so the only thing standing between a Service and two years of
  neglect is whoever happens to look. Is there a lead, or is it everybody's to notice?
- Can a Service be marked not-applicable or skipped, and does that stop the cycle forever or just for
  one period?
- Whether a Service that has come due and been deferred more than once — and if so, what does the app
  show, given that is precisely the boat rotting unnoticed?

Keep this to the real boat. The value here is a short accurate list, not a general maintenance system.

## Answer

_Answering, not yet settled — the real list is still missing._

**Services are entered manually in the app, each with a recurring time.** Nobody imports them, nothing
discovers them, and the app has no opinion about what a boat should need. Whoever looks after Touareg
enters them once.

**The recurring time is a point in the year, not an elapsed interval.** Every Service recurs annually,
anchored to a time — "before April", never "every 18 months". This is the right shape for a boat, where
work hangs off a season rather than a counter, and done on time a Service comes round every 11–12
months, which is how the boat actually lives.

**A Service's next due is derived from its last completion.** Unchanged from the Maintenance Items
ticket, and it still holds once the interval is gone: a job finished after its window slips to the next
window rather than squeezing its own cycle.

**The app reminds Members one month before a Service falls due.** "Before April" reminds in March.

**Consequence worth sitting with:** a Service that was never entered can never be reminded about. The
app's memory is exactly what someone typed in. That makes the list below the whole safety net, and it is
why it is still open.

**Already settled by the Maintenance Items ticket, not re-opened here:** anyone may complete a Service
directly; deferring does not move the date while skipping does; and a Service is completed in its own
right, never as a side effect of closing an Observation.

**Still open:**
- The real list. Get it from whoever looks after the boat — the prototype's four are a guess.
- Whether the reminder repeats while a Service stays undone. One month before is settled; whether it
  then goes quiet is not, and the deferred-forever case is precisely that. It sits in the Notifications
  ticket.