import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <AuthForm mode="customer-login" title="Customer login" endpoint="/api/auth/customer-login" alternateHref="/register" alternateText="Create an account" />;
}
