import { Suspense } from "react";
import LoginForm from "./login-form";
import { PageLoader } from "@/components/ui/loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginForm />
    </Suspense>
  );
}
