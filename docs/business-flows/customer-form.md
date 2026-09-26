# Business Flow: Customer Verification (ตรวจสอบข้อมูลลูกค้า)

Source: `image_figma/CustomerForm/customer_form.png`, `customer_form_manaul_keyin.png`, `customer_form_dipchip_loading.png`, `customer_form_dipchip_success.png`

Entry point: Home (`/`) → "ตรวจสอบข้อมูลลูกค้า" button → `/customer-form`.

## Flow

| # | Trigger | Result | Notes |
|---|---------|--------|-------|
| 1 | Start | User lands on Home (`/`) | Dashboard header CTA "ตรวจสอบข้อมูลลูกค้า" |
| 2 | Click "ตรวจสอบข้อมูลลูกค้า" | Navigates to `/customer-form` | `DashboardHeader` `ctaHref`, defined in `src/app/page.tsx` |
| 3 | `/customer-form` page loads | Page title "ตรวจสอบข้อมูลลูกค้า" renders one centered card | ประเภทลูกค้า defaults to "บุคคลธรรมดา"; เสียบบัตรประชาชน tab active by default; card reader shows idle/"พร้อมใช้งาน"; "ดำเนินการต่อ" disabled |
| 4 | Click "กรอกข้อมูลเอง" segment | Switches to manual entry tab | `CustomerVerificationPanel` — ชื่อ / นามสกุล / เบอร์โทรศัพท์ fields appear, reader UI hidden |
| 5 | Fill ชื่อ, นามสกุล, เบอร์โทรศัพท์ (manual tab) | "ดำเนินการต่อ" becomes enabled | All three fields must be non-empty |
| 6 | Click "เสียบบัตรประชาชน" segment | Switches back to card tab | Previously entered manual fields are kept in memory but hidden |
| 7 | Click the card-reader dropzone (idle state) | Reader enters loading state (~1.5s) | Simulated hardware read — no real dipchip integration; overlay shows "กำลังอ่านข้อมูลบัตร..." / "อย่าเพิ่งดึงบัตรออก จนกว่าจะเสร็จสิ้น" |
| 8 | Loading resolves | Green "อ่านข้อมูลบัตรสำเร็จ" banner appears; dropzone is replaced by a customer chip (mock name + เลขบัตรประชาชน) and an empty เบอร์โทรศัพท์ field | Mock data from `src/lib/mock.ts` (`mockCardCustomer`) — ID card doesn't carry a phone number, so it must be keyed in separately |
| 9 | Fill เบอร์โทรศัพท์ (card tab, post-success) | "ดำเนินการต่อ" becomes enabled | |
| 10 | Click "← หน้าหลัก" | Returns to `/` | |
| 11 | Click "ดำเนินการต่อ" (once enabled) | **Not yet wired to a destination or persistence** | UI-state only for this phase, same precedent as "บันทึก Lead" in the ratebook flow |

## Out of scope for this phase (flagged, not silently built)
- Real ID-card reader / dipchip hardware integration — the idle → loading → success sequence is simulated client-side with a timer, not connected to any device.
- ประเภทลูกค้า only has one option ("บุคคลธรรมดา") wired; other customer types (e.g. นิติบุคคล) are not in scope.
- The เมนู (☰) icon in the header — visual only, no menu wired.
- What happens after "ดำเนินการต่อ" is clicked (save destination, DB write, navigation).
