# Business Flow: Customer Lead List (ข้อมูลลูกค้า)

Source: `image_figma/CustomerLeadList.png`

Entry point: `/customer-form` → "ดำเนินการต่อ" (once enabled) → `/customer-lead-list?leadId=<id>` (see [customer-form.md](customer-form.md)). The `leadId` identifies the `customer_lead` row just created; the page also always lists every saved `customer_lead_opportunity` (loan-application attempt) below it, across all leads.

## Flow

| # | Trigger | Result | Notes |
|---|---------|--------|-------|
| 1 | `/customer-lead-list?leadId=<id>` page loads | Page title "ข้อมูลลูกค้า" renders a summary card for that lead, a tab row, and a "รายการ Lead" list below | `getCustomerLeadById` for the summary card (`src/lib/customer-lead.ts`), `listCustomerLeadOpportunities` for the list (`src/lib/customer-lead-opportunity.ts`) — the summary card stays scoped to the just-verified `customer_lead`, the list below shows `customer_lead_opportunity` rows across all leads |
| 2 | Summary card renders | Shows ชื่อ + นามสกุล, "บุคคลธรรมดา", a green "Dip Chip" badge (only when the lead has a เลขบัตรประชาชน — i.e. came from the card-read path, not manual key-in), masked เลขบัตรประชาชน, and formatted เบอร์มือถือ | Masking/formatting via `maskIdCardNumber` / `formatThaiPhone` (`src/lib/format.ts`) |
| 3 | `/customer-lead-list` page loads with no `leadId` | Summary card renders with "-" placeholders instead of erroring; tab row shows only "รายการ Lead" | Direct navigation without a lead in context — with no lead there is no card read, so it follows the same rule as a manual-entry lead |
| 4 | Tab row renders | Shows all three tabs ("รายการ Lead", "รายการใบคำขอ", "รายการสัญญาสินเชื่อ") only when the focused lead came from the card-read path; otherwise just "รายการ Lead" | Gated on `customer_lead.verification_method === "card"` — the same signal that drives the "Dip Chip" badge. ใบคำขอ/สัญญา only ever follow a dipchip-verified customer, so hiding them keeps a manual-entry lead from advertising steps it can't reach |
| 5 | "รายการ Lead" tab (default active) | Lists every `customer_lead_opportunity` row (one per loan-application attempt, across all leads), newest first | Each row shows the opportunity's snapshot name/phone, its loan-purpose + collateral-type labels (or "-" · "-" if the loan questions haven't been answered yet), the created date, NCB เกรด badge from the snapshot, and a "ทำรายการสินเชื่อ" button. The tab's copy still reads "รายการ Lead" even though it now lists opportunities, not leads — a deliberate non-change pending a separate copy decision |
| 6 | No opportunities exist yet | Empty state: document icon + "ไม่มีรายการ" | Matches the empty state in the Figma reference |
| 7 | Click "ทำรายการสินเชื่อ" on a row | Submits a form bound to `createOpportunityAndRedirect` (`src/lib/actions/customer-lead-opportunity.ts`) for that row's `leadId` — inserts a **new** `customer_lead_opportunity` row snapshotting the lead's current fields, then redirects to `/ratebook?opportunityId=<new id>` | See [ratebook.md](ratebook.md). Every click creates a brand-new draft row, even repeated clicks for the same lead — there is no "resume last draft" logic, by design |
| 8 | Click "จัดสินเชื่อ" (only when a `leadId` is in context) | Same as step 7, scoped to the summary card's focused lead | Rendered as a disabled button when there's no `leadId` (nothing to send). Also creates a brand-new opportunity every click |

## Out of scope for this phase (flagged, not silently built)
- "รายการใบคำขอ" and "รายการสัญญาสินเชื่อ" tabs — visual only even on the dipchip path; no application/contract data model exists yet, so only "รายการ Lead" has real content. They are also not clickable: the tab row is static markup, so "รายการ Lead" is always the active tab and there is no tab-switching behavior to hide.
- "ตรวจ eNCB" button on the summary card — visual only. The NCB เกรด is no longer assigned on lead creation, even via Dipchip (see [customer-form.md](customer-form.md)), so new rows show the neutral "-" NCB badge until a real eNCB check exists.
- The เมนู (☰) icon in the header — visual only, no menu wired.
- Repeated "จัดสินเชื่อ"/"ทำรายการสินเชื่อ" clicks pile up multiple `customer_lead_opportunity` rows per lead by design — an accepted tradeoff, no dedupe/resume-draft logic.
- The "รายการ Lead" tab label is unchanged even though its data source moved from `customer_lead` to `customer_lead_opportunity` — renaming it (e.g. to something like "รายการทำรายการสินเชื่อ") is a separate copy decision, not made here.
