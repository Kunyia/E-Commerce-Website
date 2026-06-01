import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <AuthForm mode="register" title="Create your account" endpoint="/api/auth/register" alternateHref="/login" alternateText="Already have an account?" />;
}
