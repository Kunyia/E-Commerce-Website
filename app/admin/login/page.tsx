import { AuthForm } from "@/components/auth-form";

export default function AdminLoginPage() {
  return <AuthForm mode="admin-login" title="Admin login" endpoint="/api/auth/admin-login" alternateHref="/login" alternateText="Customer login" />;
}
