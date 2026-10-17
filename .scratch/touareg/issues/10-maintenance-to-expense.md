Type: grilling
Status: open
Blocked by: 01, 03

## Question

When work on the boat is paid for, it has to reach the ledger. Settle the seam between the two
subsystems:

- Who pays for a repair — the Owner out of pocket, the boat's bank account, or a Member fronting it? If
  the answer differs by case, does the app model those differently, or does the Expense record who paid
  and treat that as bookkeeping detail?
- When an Expense is raised against an Observation, is the link one-way (the Expense points at the
  Observation) or must the Observation carry the cost itself?
- Can one Expense cover several Observations — a haul-out that fixes three things at once? Can one
  Observation take several Expenses across months, as a long-running repair does?
- Once the Expense for an Observation is paid, does the Observation become done automatically, or does
  someone still have to mark it done? Work that is paid for but not recorded as finished is how
  maintenance lists rot.
- Is there work that is paid for but was never an Observation — routine fuel, insurance, mooring,
  berth fees — and how is that kept distinguishable from a repair?
- Should the maintenance list be able to show cost, so a Member can see what keeping the boat afloat
  actually costs, or is the finance side deliberately separate from the to-do side?
- **Carried in from the Maintenance Items ticket:** any Member may attach a cost to an Observation or a
  Service, not just the Owner. So a Member can put a figure on the record that the ledger will divide
  among everyone. Does that make every Member able to create an Expense, and if so what stops a bad
  figure or a duplicate from inflating everyone's Balance? Does a Member-recorded cost need the Owner's
  confirmation before it counts?