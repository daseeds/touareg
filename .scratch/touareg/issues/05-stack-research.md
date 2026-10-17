Type: research
Status: resolved

## Question

Gather the facts needed to choose the stack. Nothing here is a decision — the decision is the
Choosing the stack ticket, which is blocked by this one.

The shape the stack must serve: one boat, roughly 8 Members now, a handful of writes a week, read-heavy
dashboards, web used on both desktop and mobile, one Owner with administrative rights, no money
moving through the app. Firebase is the incumbent suggestion; the previous abandoned app in this repo
was React 19 + Vite + Firebase 12 in plain JavaScript.

Compare at minimum:

- **Firebase** — Firestore's current pricing and free quota (it changed more than once), Firebase Auth,
  Firebase Hosting. Is it still the obvious fit for a tiny, low-write, multi-user app?
- **Supabase** — Postgres, auth, and whether its free tier holds for this scale.
- **A conventional backend** — hosted Postgres behind a thin API. What does it actually cost to run,
  and is it simpler to reason about than a serverless store?
- **Email delivery for Owner invites.** This is the sharpest constraint. Which provider, what the
  free-tier sending limits are, what it costs, and whether any of these options can send reliably from
  a free tier at all. If the free tiers cannot cover 8 invite emails, that fact outranks everything else.
- **Where the cost lands as the roster grows** — from ~8 Members to ~50, and whether anything breaks
  (query limits, auth limits, connection limits).
- **Whether a serverless shape is genuinely appropriate** or whether it buys nothing here.

Cite sources. Where pricing or quotas are involved, cite the current figure and date it, because these
move. Return a comparison a human can argue with, not a recommendation.

## Answer

Researched **17 October 2026**. Every figure below is dated as of that date and tied to a primary
source — the provider's own pricing page or documentation. This is a comparison, not a decision. The
decision belongs to the Choosing the stack ticket.

---

### The sharpest constraint: the Owner's invite email

The roster is gated on the Owner being able to email an invite to roughly 8 people. Taking that first,
because it disqualifies options rather than pricing them.

**Short version: no free email tier is short of 8 emails. But Firebase's free tier cannot send the
email at all** — not because of a quota, but because there is nowhere on Spark to run the code that
sends it. Supabase and the conventional-backend option can both do it, with a caveat each.

| Candidate | Can it send an invite email on its own free tier? |
|---|---|
| Firebase (Spark) | **No.** No server on Spark can hold the privileged key, and Auth's own magic-link is capped at 5/day |
| Supabase (Free) | Yes — but only after adding a third-party SMTP provider, and only at 30/hour by default |
| Conventional backend | Yes, over an HTTPS email API — but two common hosts block SMTP on free tiers |

#### Firebase: a structural blocker, not a quota one

Firebase Auth sends exactly four kinds of email, and none of them is an invite. Their free-tier daily
caps:

| Operation | Spark plan limit | Blaze plan limit |
|---|---|---|
| Address verification emails | 1,000 emails/day | 100,000 emails/day |
| Address change emails | 1,000 emails/day | 10,000 emails/day |
| Password reset emails | 150 emails/day | 10,000 emails/day |
| **Email link sign-in emails** | **5 emails/day** | 25,000 emails/day |

Source: [Firebase Authentication Limits](https://firebase.google.com/docs/auth/limits), retrieved
17 Oct 2026.

Two separate consequences, and the second is the one that matters:

1. **The only email kind that could plausibly stand in for an invite is capped at 5 per day on the
   free plan** — eight invites in a sitting exceeds it. The docs flag this figure as having moved
   recently: *"The limits for email link sign-in emails were recently changed. Please add a billing
   instrument to go beyond 5 email link sign-in emails."* Any higher figure previously in circulation
   no longer applies.

2. **None of those four is an invite email in the first place.** They carry Google's own templates and
   wording. An invite that says "you have been added to Touareg, here is your link" has to be sent by
   something the app controls, using a key the browser must never hold. On Firebase that means Cloud
   Functions or an extension, and both are off the table on Spark:
   - The Firebase pricing page lists Cloud Functions as **"Not applicable"** on the Spark plan.
     Invocations (no-cost 2M/month), GB-seconds (400K/month) and CPU-seconds (200K/month) appear only
     in the Blaze column. ([Firebase pricing](https://firebase.google.com/pricing), 17 Oct 2026.)
   - The Trigger Email extension's own README: *"To install an extension, your project must be on the
     Blaze (pay as you go) plan."* (via
     [extensions.dev](https://extensions.dev/extensions/firebase/firestore-send-email), 17 Oct 2026)

**So on Firebase, the free tier cannot send an invite, and no larger free quota would fix it.** This
does not disqualify Firebase — Blaze carries Spark's no-cost usage in full, so at this app's volume
the bill is nil — but "Firebase, free" stops being free the moment an invite is in the design. It also
means the Owner cannot bootstrap the roster without a card on file.

**Separate and worth flagging now:** the **Firebase Extensions service is deprecated and shuts down on
31 March 2027.** Already-deployed extensions keep executing, but after that date you lose the ability
to update, reconfigure or uninstall them through the Firebase console or CLI, and lose the ability to
export their configuration. ([Firebase Extensions Deprecation FAQ](https://firebase.google.com/docs/extensions/faq-and-troubleshooting),
retrieved 17 Oct 2026.) Google is steering extension users toward self-managed "function kits" on npm.

#### Supabase: the quota is the blocker until you add an SMTP provider

Supabase's built-in email server is explicitly for exploration. Three documented restrictions
([Send emails with custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), retrieved 17 Oct 2026):

- **2 messages per hour.** *"Currently this value is set to 2 messages per hour."*
- **Pre-authorised addresses only.** *"Supabase Auth will refuse to deliver messages to addresses that
  are not part of the project's team ... All other addresses will fail with the error message Email
  address not authorized."*
- **No SLA** — *"provided as best-effort only."*

The [Auth rate-limit table](https://supabase.com/docs/guides/auth/rate-limits) (17 Oct 2026) gives the
same 2/hour and notes the limit becomes configurable with custom SMTP or the Send Email hook. With
custom SMTP configured, Supabase *"impose[s] a low rate-limit of 30 messages per hour"*, adjustable at
the project's rate-limits page.

Eight invites in a sitting fits inside 30/hour. The Supabase pricing page lists **Custom SMTP server as
Included on Free**, so the third-party email account is the only external dependency — not a paid plan
([pricing](https://supabase.com/pricing), 17 Oct 2026). Two Free-tier caveats that bear on the invite
flow specifically: Supabase branding **cannot** be removed from emails on Free, and the Free project is
paused after 1 week of inactivity.

#### Conventional backend: it depends on the host's SMTP policy, not the language

Two hosts, both with free tiers relevant here:

- **Render free web services cannot send email over SMTP at all.** *"Free web services can't send
  outbound network traffic on ports `25`, `465`, or `587`, commonly used for SMTP."* An HTTPS email API
  is the only route. ([Deploy for Free](https://render.com/docs/free), 17 Oct 2026.)
- **Hetzner blocks ports 25 and 465** on all cloud servers by default; port 587 is open and needs no
  request. ([Hetzner Cloud FAQ](https://docs.hetzner.com/cloud/servers/faq/), 17 Oct 2026.)

#### The email providers' free tiers

| Provider | Free tier (retrieved 17 Oct 2026) | Card required? |
|---|---|---|
| [Resend](https://resend.com/pricing) | 3,000 emails/mo, capped at **100 emails/day**, 3 sending domains | No |
| [Mailgun](https://www.mailgun.com/pricing/) | **100 emails/day**, 1 custom domain, 1-day log retention | No |
| [MailerSend](https://mailersend.com/pricing) | 500 emails/mo, 100 API requests/day — but **the Free plan requires a credit card** | **Yes** |
| [AWS SES](https://aws.amazon.com/ses/pricing/) | No per-product free allowance on the pricing page any more; see below | Yes |

Resend's 100/day is the most generous free cap here and needs no card. Eight invites is ~8% of it.

**AWS SES is the one to be careful with.** New accounts are sandboxed: *"You can only send mail to
verified email addresses and domains, or to the Amazon SES mailbox simulator. You can send a maximum of
200 messages per 24-hour period."* Escaping the sandbox needs a production-access request, and *"The
AWS Support team provides an initial response to your request within 96 hours."* A brand-new SES
account therefore cannot send 8 invites to real Members on day one — the 200-message ceiling is
generous, but the verified-recipients-only rule makes it useless until production access lands.
([Request production access](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html),
retrieved 17 Oct 2026.)

**Net on email: free email volume is not the constraint. Firebase's is, and it is structural.**

---

### What changed since the commonly-cited figures

Flagging these because the numbers previously quoted for this project are no longer what the
providers publish.

| Figure | Was commonly cited as | Now | Source |
|---|---|---|---|
| Firestore document reads | $0.06 / 100K | **$0.03 / 100K** | [cloud.google.com/firestore/pricing](https://cloud.google.com/firestore/pricing), 17 Oct 2026 |
| Firestore document writes | $0.18 / 100K | **$0.09 / 100K** | same |
| Firebase email link sign-in, Spark | higher than 5/day | **5 emails/day**, docs note it "was recently changed" | [docs/auth/limits](https://firebase.google.com/docs/auth/limits), 17 Oct 2026 |
| AWS SES outbound | $0.10 / 1,000 | **Essentials $0.16 / 1,000**; à-la-carte $0.08 / 1,000; Pro $0.22 (min $105/mo), Enterprise $0.23 (min $500/mo) | [aws.amazon.com/ses/pricing](https://aws.amazon.com/ses/pricing/), 17 Oct 2026 |
| Hetzner cloud server | CX23 €3.99/mo | **€5.49/mo**; CAX11 €4.49 → **€5.99/mo** (excl. IPv4, Germany/Finland) | [Hetzner Price Adjustment 15 June 2026](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/), 17 Oct 2026 |

SES restructured substantially: three plan tiers (Essentials / Pro / Enterprise) apply to accounts with
no metered SES activity since 1 June 2025 from **21 July 2026**, and the Pro and Enterprise tiers carry
monthly minimums ($105 and $500 per account per region per month) that a small send volume will never
amortise.

Unchanged and worth stating because they are the numbers most often quoted: **Firestore's free quota
is still 1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 10 GiB/month egress**
([Firestore pricing](https://firebase.google.com/docs/firestore/pricing) and
[quotas](https://firebase.google.com/docs/firestore/quotas), 17 Oct 2026). Resend's free tier is still
3,000/month with the 100/day cap.

---

### Firebase in detail

All figures retrieved 17 Oct 2026 from [firebase.google.com/pricing](https://firebase.google.com/pricing).

| | Spark (free) | Blaze |
|---|---|---|
| Firestore stored data | 1 GiB | 1 GiB, then $0.000205479/GiB-month |
| Firestore document reads | 50,000/day | 50,000/day, then $0.03/100K |
| Firestore document writes | 20,000/day | 20,000/day, then $0.09/100K |
| Firestore deletes | 20,000/day | 20,000/day, then $0.01/100K |
| Firestore egress | 10 GiB/month | 10 GiB/month, then $0.01/GiB (first 10 GiB free) |
| Hosting storage | 10 GB | 10 GB, then $0.026/GB |
| **Hosting data transfer** | **360 MB/day** | 360 MB/day, then $0.15/GB |
| Authentication — other services (incl. email/password) | No-cost | No-cost |
| Authentication with Identity Platform | — | 50,000 MAU no-cost, then Google Cloud pricing |
| Cloud Functions | **Not applicable** | 2M invocations/mo no-cost, then $0.40/million |

Three things here deserve attention beyond the invite-email blocker:

- **Hosting's 360 MB/day is the tightest Firebase number for this app, not Firestore's 50K reads.**
  360 MB/day is the no-cost cap for the *whole project*. A React bundle plus fonts and a manifest is
  on the order of a megabyte per cold page view, so this is roughly a few hundred page views per day
  across all Members. Fine at 8 Members; at 50, or with photos attached to Maintenance Items, it is the
  first number to trip.
- **Auth's registered-user account limit is documented as "Unlimited"**, and other authentication
  services are no-cost on both plans. Auth is not a scaling risk at 50 Members on either axis.
- **TTL deletes, PITR, backups, restores and clones have no free usage at all** — *"You must enable
  billing to use these features."* This lands directly on the Members ticket's question about what an
  invite looks like when it expires: on Firestore, TTL-based invite expiry is a billable feature, not
  a free one.

On the Firestore read model, one structural observation rather than a recommendation: Firestore bills
per document read, and a query is also charged for index entries read. A read-heavy dashboard built
by fetching many documents per render therefore has a cost that grows with *dashboard design*, not
with the number of Members — and Balance and Days Used are aggregates over Expenses and Bookings, so
they pull in exactly the read-heavy queries. Whether that matters is the ledger and stats tickets'
call (03, 07), not this one's; it is flagged because it couples those decisions to the datastore
choice. ([Understand Cloud Firestore billing](https://firebase.google.com/docs/firestore/pricing),
17 Oct 2026.)

---

### Supabase in detail

All figures retrieved 17 Oct 2026 from [supabase.com/pricing](https://supabase.com/pricing).

| | Free | Pro |
|---|---|---|
| Price | $0 | from $25/month |
| Database size | 500 MB/project | 8 GB/project, then $0.125/GB |
| Egress | 5 GB | 250 GB, then $0.09/GB |
| MAUs | 50,000 | 100,000, then $0.00325/MAU |
| API requests | Unlimited | Unlimited |
| Backups | **None** | 7 days |
| Log retention | 1 day | 7 days |
| Paused for inactivity | **After 1 week** | Never |
| Realtime peak connections | 200 | 500, then $10 per 1000 |
| Custom SMTP server | Included | Included |
| Remove Supabase branding from emails | **Not included** | Included |
| Projects | 2 | Unlimited |

Compute is billed separately per project: Micro is $10/month (1 GB RAM, 60 direct / 200 pooler
connections), and Pro includes $10/month of compute credit covering one Micro instance. So the Pro
floor for a single project is $25/month, and there is no paid tier below it.

Two operational facts that a boat app feels more than a SaaS does: **the Free project pauses after a
week of inactivity** (a boat laid up over winter meets this), and **Free has no automatic backups** at
all — for an app that holds the ledger of shared money, that is a category difference, not a
price difference.

Supabase's Postgres also answers "is it simpler to reason about than a serverless store" in the
direction that matters here: Balances and Days Used are arithmetic over relational data, and Postgres
constraints and transactions are the right tool for money and dates. That is an observation about fit,
not a verdict.

---

### Conventional backend: what it actually costs to run

| Component | Cheapest realistic option | Figure (17 Oct 2026) | Catch |
|---|---|---|---|
| Database | [Neon Free](https://neon.com/pricing) | $0; 100 CU-hours/project/mo; scale-to-zero after 5 min (cannot be disabled on Free); 1 GB storage/project; 5 GB egress; 6-hour history; 1 manual snapshot | 6 hours of point-in-time recovery is not a backup strategy; no scheduled snapshots on Free |
| Database (bills from day one) | Render Postgres | $6/month (256 MB) | — |
| App server | Render free web service | $0; 750 instance hours/month/workspace | Spins down after 15 min idle (~1 min to wake); **no persistent disk**; **no outbound SMTP on 25/465/587**; free Postgres **expires 30 days after creation**, then 14 days' grace, then deleted |
| App server (bills from day one) | Render web service | $7/month (<1 CPU, 512 MB) | — |
| App server (own box) | [Hetzner CX23](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/) | €5.49/month excl. IPv4 — 2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB traffic included | You run the OS, TLS, backups and updates yourself |
| Static front-end hosting | [Cloudflare Pages Free](https://developers.cloudflare.com/pages/platform/limits/) | $0; 500 builds/month; 100 custom domains/project; 20,000 files; 25 MiB max asset | No bandwidth cap is listed on the Free plan |
| A place to run a free invite-email sender | [Cloudflare Workers Free](https://developers.cloudflare.com/workers/platform/pricing/) | $0; 100,000 requests/day | 10 ms CPU per invocation |

So the conventional shape has a genuine **$0 floor** — Neon Free + Render free web service + Cloudflare
Pages — and a genuine **~$6–12/month floor** once anything must survive. The free floor's real costs are
operational, not financial: Render's free database is deleted after 30 days, which makes it a
development tool and nothing else, and a thin API in front of Postgres has to be written, deployed,
secured and kept alive by somebody. Neon's 6-hour history and single manual snapshot on Free do not
protect a ledger of shared money on their own.

Against the serverless candidates on the specific dimensions this app cares about: 50 Members is far
below every quota here (Neon 60k MAU, Supabase 50k MAU, Firestore 50k reads/day), and a read-heavy
dashboard is cheap against Postgres egress allowances (5 GB free / 250 GB on Supabase Pro, 5 GB free on
Neon) in a way that Firestore's 50,000-document-read budget is not obviously cheap against.

---

### Where the cost lands as the roster goes from ~8 to ~50

| | At ~8 Members | At ~50 Members | What actually breaks first |
|---|---|---|---|
| Firebase Spark | $0 for Firestore, Auth, Hosting | $0 for Firestore, Auth; **$0 but capped** on Hosting (360 MB/day, project-wide) | Hosting transfer, not the database. Auth accounts are documented unlimited |
| Firebase Blaze | $0 actual, card required | $0 actual at this volume | Same, plus a real budget-alert discipline |
| Supabase Free | $0 | Still $0; 500 MB DB is not binding for text records | Nothing technical. The week-of-inactivity pause and absent backups are the live risks |
| Supabase Pro | $25/month | $25/month | The $25 floor, immediately and permanently |
| Neon + free web service | $0 | $0 | Render's 30-day database expiry becomes urgent |
| Neon + paid Postgres + paid web service | ~$13/month | ~$13/month | Nothing; egress is the only variable |

Nothing on this list breaks at 50 Members on capacity. The changes that bite are all *operational*:
Hosting's 360 MB/day cap on Firebase, Supabase Free's inactivity pause and missing backups, Render's
30-day free-database expiry, and Neon's 6-hour history. Two are about members and load (Firestore reads,
Hosting transfer); the rest are about the plan you are on, not the size of the crew.

---

### Is a serverless shape genuinely appropriate here?

Facts on both sides, no verdict.

Arguments the facts support: the quotas are generous by two orders of magnitude at 8 Members and still
comfortable at 50; scale-to-zero means no idle cost; the app is low-write and read-heavy, which is the
shape serverless pricing likes; and both Firebase Spark and Cloudflare Pages/Workers have genuine $0
floors.

Arguments the facts support against, and one is sharper than the rest: **the one capability that is
genuinely hard here — sending the invite — is precisely the one serverless does not give away for
free.** Every path needs a component holding a privileged key, and on Firebase that component is not
available on the free plan at all. Beyond that: money arithmetic (Balance, Days Used) has no constraint
language in either a document store or a function, and in a document store it is also read-billed
per document; Supabase Free and Render Free both trade away operational properties (weekly pause, 30-day
database death) that a ledger app should probably not accept; and Firebase Extensions — the tidy
package for exactly this kind of glue — has five months left before it can no longer be updated.

Whether that balances is the Choosing the stack ticket's call, and it is entitled to make it. What was
not available to it before is now: the email constraint resolves to "8 emails is not a budget problem
anywhere; Firebase Spark is a structural problem, and Supabase's default SMTP is 2 emails/hour to
project-team addresses only."

---

### Not established

Stated plainly rather than guessed:

- **Whether base Firebase Auth (email/password, without Identity Platform) is or will become billable.**
  The pricing page marks "Other Authentication services" as no-cost on both plans, while Identity
  Platform carries separate per-MAU tiered pricing. I found no published per-MAU price for base
  Firebase Auth email/password and did not find a primary source stating whether one exists or is
  planned.
- **Whether AWS SES still grants a standalone 3,000-free-messages-for-12-months allowance.** The SES
  pricing page no longer lists one and now points at AWS Free Tier credits ($200 for new customers, a
  6-month free plan). The SES FAQ still contains the older 3,000-message language, so the two official
  pages currently disagree. Not resolved here; worth confirming against the live AWS account before
  pricing SES.
- **Brevo's free tier** — not fetched, so no figure is offered rather than a remembered one.
- **Firestore Enterprise edition pricing** — the pricing page has a separate page for it; only Standard
  edition figures are recorded above.
- **Whether Supabase Free truly permits custom SMTP in practice.** The pricing page (fetched 17 Oct 2026)
  lists Custom SMTP server as Included on the Free plan and the SMTP guide states no plan restriction,
  but I did not create a project to confirm it end-to-end.
- **Actual Firestore read counts for a Touareg dashboard** — unknowable before the dashboard and ledger
  are designed (tickets 03, 07, 08). The 50,000/day budget cannot be sanity-checked against a real
  query shape from here.
- **Whether an 8-invite batch is the right unit at all.** The resend/expiry policy that determines it is
  the Members ticket's (04), not this one's.