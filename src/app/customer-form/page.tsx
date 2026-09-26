import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { CustomerVerificationPanel } from "@/components/organisms/CustomerVerificationPanel";
import { customerTypeOptions, verificationMethodOptions } from "@/lib/mock";

export default function CustomerFormPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← หน้าหลัก
        </Link>
        <h1 className="text-xl font-semibold text-foreground">ตรวจสอบข้อมูลลูกค้า</h1>
        <Icon name="menu" className="size-5 text-muted-foreground" />
      </div>

      <CustomerVerificationPanel
        customerTypeOptions={customerTypeOptions}
        verificationMethodOptions={verificationMethodOptions}
      />
    </>
  );
}
