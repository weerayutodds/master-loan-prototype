# Business Flow: RateBook (ทำรายการสินเชื่อ)

Source: `image_figma/MainPage.png`, `image_figma/RateBookPage.png`

Entry point: Home (`/`) → "Ratebook" quick-action card → `/ratebook`.

## Flow

| # | Trigger | Result | Notes |
|---|---------|--------|-------|
| 1 | Start | User lands on Home (`/`) | Sidebar + dashboard with Quick Actions & Shortcuts |
| 2 | Click "Ratebook" quick-action card | Navigates to `/ratebook` | `href="/ratebook"`, defined in `src/lib/mock.ts` (`quickActions`) |
| 3 | `/ratebook` page loads | Page title "ทำรายการสินเชื่อ" renders with two panels | Loan purpose defaults to "ต้องการเงิน" (pre-selected); customer info, ID card, NCB, collateral fields all empty; "บันทึก Lead" disabled |
| 4 | Click "เพิ่ม/แก้ไข" on ข้อมูลลูกค้า (customer info) | Customer Info modal opens | `CustomerInfoModal` — ชื่อ / นามสกุล / เบอร์โทรศัพท์ fields |
| 5a | Fill name/phone → click "บันทึก" | Modal closes; left panel shows saved name + phone plus a progress badge (`filled sections / 4`); "บันทึก Lead" becomes enabled | Progress counts: customer info, เลขบัตรประชาชน, เลขทะเบียน/เลขตัวถัง, ยี่ห้อ/รุ่น |
| 5b | Click "ยกเลิก", the backdrop, or `Esc` | Modal closes; no changes saved | |
| 6 | Click any option card (loan purpose / collateral type / refinance status) | That card becomes selected within its group (single-select per group, independent groups) | `LoanQuestionsPanel` — no cross-panel dependency |
| 7 | Click "บันทึก Lead" (once enabled) | **Not yet wired to a destination or persistence** | No `leads`/`customers` DB schema exists yet (`db/schema.sql` is still a stub) — this is UI-state only for this phase; next step (save/redirect) is a future phase |

## Out of scope for this phase (flagged, not silently built)
- "Dipchip" / "ตรวจ eNCB" buttons (ID card / NCB check) — visual only, no defined behavior in the Figma reference.
- "ข้อมูลหลักประกัน" (collateral info) "เพิ่ม/แก้ไข" button — visual only; no modal content was specified for it (unlike ข้อมูลลูกค้า).
- The two "เพิ่ม" buttons next to เลขทะเบียน/เลขตัวถัง and ยี่ห้อ/รุ่น — visual only.
- What happens after "บันทึก Lead" is clicked (save destination, DB write, navigation).
