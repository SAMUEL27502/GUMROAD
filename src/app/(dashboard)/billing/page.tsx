import { Suspense } from "react";
import { PageLoader } from "@/components/ui/loader";
import BillingClient from "./billing-client";

export default function BillingRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BillingClient />
    </Suspense>
  );
}
