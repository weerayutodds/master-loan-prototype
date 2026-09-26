import { CustomerVerificationPanel } from "@/components/organisms/CustomerVerificationPanel";
import { customerTypeOptions, verificationMethodOptions } from "@/lib/mock";

export default function CustomerFormPage() {
  return (
    <CustomerVerificationPanel
      customerTypeOptions={customerTypeOptions}
      verificationMethodOptions={verificationMethodOptions}
    />
  );
}
