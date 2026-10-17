Type: grilling
Status: open

## Question

The app keeps a record of everything Members do, consultable by any Member, so the group can see who
did what. That is doing real work in the design: with the fairness cap dropped and no Owner override,
the log is what makes the day counts believable. A number nobody can trace is a number nobody trusts.

Settle:

- **What counts as an action.** Only changes — a Use logged, a Booking cancelled, a Service completed,
  an Expense recorded, a period blocked? Or also *readings*, so a Member can see that someone read the
  ledger? Logging every read would bury the changes and buy almost nothing.
- **Append-only, or editable?** If entries can be edited, this is a changelog rather than an audit log,
  and the one thing it exists to rule out — someone quietly rewriting a past entry — is what it permits.
  Append-only, with corrections recorded as new entries?
- **Are money records editable at all?** If an Expense or a Payment was entered wrong, is it corrected in
  place, or by adding a reversing entry? The stricter answer is that amounts are never edited, because
  the point of the log is that nobody can rewrite what they once owed.
- **What is shown, and how.** A flat list of everything, or filterable by Member and by kind of action?
  It has to be usable by someone who is not technical: a Member should be able to ask "who touched that
  Expense?" and get an answer without having to trust the database.
- **Retention.** Keep everything forever, or is a settled Fare year a reasonable place to stop? That
  bounds the size, which is otherwise not a real problem at this scale.
- **What a Member may do about it.** Read only? Or may a Member annotate an entry — flagging it as
  wrong, which would then need a way to be answered?

Keep it proportionate: eight people, a few hundred actions a year. The failure mode is a log so heavy
nobody consults, which is the same as having none.