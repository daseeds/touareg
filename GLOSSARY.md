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
One Member's claim on one or more consecutive Slots on one or more dates. A run of several days is one
Booking, not several. A Booking is a claim that the boat will be used, not proof it was. Only ever made
by the Member it belongs to.
_Avoid_: reservation, hire, rental

**Interest**:
A Member's registration that they would have taken a Slot another Member holds. They are told if that
Booking is Cancelled. An Interest is not a Booking, confers no priority, and builds no queue.
_Avoid_: waitlist entry, claim, request

**Cancelled Booking**:
A Booking given up before it starts. It releases its Slots at once and no longer counts toward anything.
A Booking that has already started cannot be Cancelled.
_Avoid_: deleted booking

**Blocked Period**:
A date range the Owner has marked the boat unavailable — laid up, in the yard, out of action. Shown with
its reason, and nothing may be booked inside it.
_Avoid_: blackout, closure, unavailability, maintenance window

**Use**:
A Member actually having the boat. Counted as Days Used whether or not it was reserved, so a trip logged
after the fact counts the same as a Completed Booking. Logged for any past date in the current Fare year,
never for a future date, and never inside a Blocked Period.
_Avoid_: sail, trip (a Booking is the claim; a Use is the fact)

**Completed Booking**:
A Booking marked as actually used. One of the two ways a Use is recorded; the other is logging it
directly.
_Avoid_: confirmed booking, sailed

**Days Used**:
The Slots a Member has had the boat, counted as fractions of a day — whether from a Completed Booking or
from a Use logged after the fact. Distinct from Days Booked, which counts every Booking that was not
Cancelled.
_Avoid_: bookings, reservations, days sailed

## Record

**Audit Log**:
The record of what each Member has done, readable by every Member, so the day counts above can be
trusted. Its shape is still being decided.
_Avoid_: history, activity log, changelog

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