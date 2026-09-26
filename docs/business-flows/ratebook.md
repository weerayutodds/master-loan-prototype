# Business Flow: RateBook (ทำรายการสินเชื่อ)

Source: `image_figma/MainPage.png`, `image_figma/RateBookPage.png`

Entry point: Home (`/`) → "Ratebook" quick-action card → `/ratebook`.

## Flow

| # | Trigger | Result | Notes |
|---|---------|--------|-------|
| 1 | Start | User lands on Home (`/`) | Sidebar + dashboard with Quick Actions & Shortcuts |
| 2 | Click "Ratebook" quick-action card | Navigates to `/ratebook` | `href="/ratebook"`, defined in `src/lib/mock.ts` (`quickActions`) |
| 3 | `/ratebook` page loads (no `leadId`) | Page title "ทำรายการสินเชื่อ" renders with two panels | Loan purpose defaults to "ต้องการเงิน" (pre-selected); customer info, เลขบัตรประชาชน, NCB เกรด, collateral fields all empty (เลขบัตรประชาชน and NCB เกรด show as a neutral "-" badge, not an input); "บันทึก Lead" disabled |
| 3b | `/ratebook?leadId=<id>` page loads | Sidebar is pre-filled from the `customer_lead` row | `getCustomerLeadById` (`src/lib/customer-lead.ts`, Server Component read) — populates ข้อมูลลูกค้า (name + phone), a masked read-only เลขบัตรประชาชน badge, and the NCB เกรด badge; "บันทึก Lead" becomes enabled |
| 4 | Click "เพิ่ม/แก้ไข" on ข้อมูลลูกค้า (customer info) | Customer Info modal opens | `CustomerInfoModal` — ชื่อ / นามสกุล / เบอร์โทรศัพท์ fields; lets the user override the name/phone that came from a lead, if any |
| 5a | Fill name/phone → click "บันทึก" | Modal closes; left panel shows saved name + phone plus a progress badge (`filled sections / 4`); "บันทึก Lead" becomes enabled | Progress counts: customer info, เลขบัตรประชาชน, เลขทะเบียน/เลขตัวถัง, ยี่ห้อ/รุ่น |
| 5b | Click "ยกเลิก", the backdrop, or `Esc` | Modal closes; no changes saved | |
| 6 | Click any option card (loan purpose / collateral type / refinance status) | That card becomes selected within its group (single-select per group, independent groups) | `LoanQuestionsPanel` — no cross-panel dependency |
| 7 | Click "Dipchip" next to เลขบัตรประชาชน | Navigates to `/customer-form` (ตรวจสอบข้อมูลลูกค้า) | Plain navigation; completing that flow and clicking "ดำเนินการต่อ" there creates a `customer_lead` row and redirects to `/customer-lead-list?leadId=<id>` (see [customer-form.md](customer-form.md)); from there, clicking "ทำรายการสินเชื่อ" on that lead's row returns here as `/ratebook?leadId=<id>`, which re-renders this sidebar filled in (see [customer-lead-list.md](customer-lead-list.md)) |
| 8 | Click "บันทึก Lead" (once enabled) | **Not yet wired to a destination** | The `customer_lead` row backing the sidebar already exists in the DB by this point (created in step 7/customer-form); this button's own save/redirect behavior is still a future phase |

## Out of scope for this phase (flagged, not silently built)
- "ข้อมูลหลักประกัน" (collateral info) "เพิ่ม/แก้ไข" button — visual only; no modal content was specified for it (unlike ข้อมูลลูกค้า).
- The two "เพิ่ม" buttons next to เลขทะเบียน/เลขตัวถัง and ยี่ห้อ/รุ่น — visual only.
- What happens after "บันทึก Lead" is clicked (save destination, further DB writes, navigation).
- The NCB เกรด shown is a random pick made when the `customer_lead` row is created (`src/lib/actions/customer-lead.ts`), simulating a separate eNCB check — not a real eNCB API integration.
