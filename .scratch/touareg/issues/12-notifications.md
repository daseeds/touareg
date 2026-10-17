Type: grilling
Status: open
Blocked by: 02, 06, 11

## Question

The app is now required to remind Members — a Service reminder is confirmed, and nothing else in the
app will surface a due Service on its own. Settle the whole notification surface at once, rather than
letting it grow one trigger at a time:

- **Triggers.** A Service has come due is settled. What else? Candidates: a Dues balance unpaid, a
  Booking starting tomorrow, someone booking or cancelling a Slot you had in mind, an Observation
  raised, an Expense recorded that moves your Balance. Which of these are worth someone's attention,
  and which are just noise?
- **Channel.** Email is the only thing that reaches a Member who has not opened the app. Is email
  enough, or is in-app acceptable because everyone checks the calendar anyway? If email: who sends it,
  and what does it cost against the free tier the Stack research found? Note that Firebase's free tier
  cannot send mail at all, so this interacts with that decision.
- **Timing and repetition.** A Service reminder one month before its window is settled. What happens
  while the Service stays undone — does it stay quiet, or say again next month? The deferred-forever
  case is the one that matters: a Service nobody acts on should keep saying so. Same question for an
  unpaid Dues balance: remind once, or every month until it clears?
- **Who is told.** All Members about a Service, or only the Owner? And for a Balance, only the Member it
  belongs to, or everyone?
- **Quiet hours.** Anyone reminded at 2am about antifouling will turn notifications off for good.
- **Opt-out.** Can a Member mute a category? And if so, can they mute something about the boat's safety
  or about money owed?

Keep it proportionate. This is a boat with about eight people on it. The failure mode is a stream of
reminders that gets muted, not too few of them.