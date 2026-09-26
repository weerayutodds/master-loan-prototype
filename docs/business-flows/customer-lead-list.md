# Business Flow: Customer Lead List (ข้อมูลลูกค้า)

Source: `image_figma/CustomerLeadList.png`

Entry point: `/customer-form` → "ดำเนินการต่อ" (once enabled) → `/customer-lead-list?leadId=<id>` (see [customer-form.md](customer-form.md)). The `leadId` identifies the `customer_lead` row just created; the page also always lists every saved lead below it.

## Flow

| # | Trigger | Result | Notes |
|---|---------|--------|-------|
| 1 | `/customer-lead-list?leadId=<id>` page loads | Page title "ข้อมูลลูกค้า" renders a summary card for that lead, a tab row, and a "รายการ Lead" list below | `getCustomerLeadById` for the summary card, `listCustomerLeads` for the list (both `src/lib/customer-lead.ts`) |
| 2 | Summary card renders | Shows ชื่อ + นามสกุล, "บุคคลธรรมดา", a green "Dip Chip" badge (only when the lead has a เลขบัตรประชาชน — i.e. came from the card-read path, not manual key-in), masked เลขบัตรประชาชน, and formatted เบอร์มือถือ | Masking/formatting via `maskIdCardNumber` / `formatThaiPhone` (`src/lib/format.ts`) |
| 3 | `/customer-lead-list` page loads with no `leadId` | Summary card renders with "-" placeholders instead of erroring | Direct navigation without a lead in context |
| 4 | "รายการ Lead" tab (default active) | Lists every `customer_lead` row, newest first | Each row shows name, phone, masked เลขบัตรประชาชน, NCB เกรด badge, and a "ทำรายการสินเชื่อ" link |
| 5 | No leads exist yet | Empty state: document icon + "ไม่มีรายการ" | Matches the empty state in the Figma reference |
| 6 | Click "ทำรายการสินเชื่อ" on a lead row | Navigates to `/ratebook?leadId=<id>` | Reuses the ratebook sidebar's existing lead pre-fill (see [ratebook.md](ratebook.md)) |

## Out of scope for this phase (flagged, not silently built)
- "รายการใบคำขอ" and "รายการสัญญาสินเชื่อ" tabs — visual only; no application/contract data model exists yet, so only "รายการ Lead" has real content.
- "ตรวจ eNCB" button on the summary card — visual only; the NCB เกรด is already assigned automatically when the lead is created (see [customer-form.md](customer-form.md)), not triggered from here.
- "จัดสินเชื่อ" button — visual only, no defined destination.
- The เมนู (☰) icon in the header — visual only, no menu wired.
