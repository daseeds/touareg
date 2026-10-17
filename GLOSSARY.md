# Touareg

A shared sailing boat. Several Members share its costs and take turns booking it; this app keeps the
books straight, tracks what the boat needs, and records who used it when.

## People

**Member**:
A person who shares the boat's costs and may book it. Members are the only people in the system.
_Avoid_: user, crew, passenger, friend

**Owner**:
The Member who holds title to the boat and administers on behalf of everyone else. The Owner is also
a Member and carries a Share like anyone else — owning confers no exemption from costs.
_Avoid_: admin, manager, treasurer

## Money

**Fare year**:
The calendar year (1 January – 31 December) that Dues are charged for. The only billing period.
_Avoid_: season, billing period, membership year

**Dues**:
The amount a Member owes for a Fare year, independent of any Expense. Prorated for a Member who
joins mid-year.
_Avoid_: fare share, subscription, membership fee

**Share**:
The weight used to divide Costs between Members. Every Share is 1 unless a Member is given a
different one, so costs are equal by default and weighted by exception.
_Avoid_: ratio, weight, percentage (implying shares always sum to 100)

**Expense**:
A cost incurred by the boat, divided among Members by their Shares.
_Avoid_: bill, invoice, cost (Cost is the amount, the Expense is the recorded thing)

**Payment**:
A record of money received from a Member. The app records Payments; it never moves money.
_Avoid_: transaction, invoice, charge

**Balance**:
What a Member currently owes: their Dues, plus their Share of each Expense, minus their Payments.
_Avoid_: debt, amount due

## Booking

**Slot**:
A half-day period the boat can be booked in: morning, afternoon, or night. A single day has three.
_Avoid_: half-day, period, timeslot

**Booking**:
One Member's claim on one or more consecutive Slots on one or more dates. A Booking is a claim that
the boat will be used, not proof it was.
_Avoid_: reservation, hire, rental

**Cancelled Booking**:
A Booking given up before use. It no longer counts toward anything.
_Avoid_: deleted booking

**Completed Booking**:
A Booking marked as actually used. The basis for Days Used.
_Avoid_: confirmed booking, sailed

**Days Used**:
The Slots of Completed Bookings, counted as fractions of a day, per Member. Distinct from Days
Booked, which counts every Booking that was not Cancelled.
_Avoid_: bookings, reservations, days sailed

## Maintenance

**Observation**:
Work the boat needs, noted by a Member on seeing it — an electrical fault, a loose fitting, something to
inspect. Carries a lifecycle: raised, worked, then done or declined.
_Avoid_: Maintenance Item, note, task, todo, issue, repair request, fault

**Service**:
Recurring work the boat needs, anchored to a time of the year rather than an elapsed interval —
"before April", every year — whether or not anyone notices it is due. Its next due date always counts
from its last completion, so a job run late does not have its cycle squeezed. Completed directly by
whoever did the work, never as a side effect of closing an Observation.
_Avoid_: Maintenance Item, recurring task, reminder, schedule