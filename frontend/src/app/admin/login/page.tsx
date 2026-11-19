import type { Metadata } from "next";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/login");
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login",
    description: "Login on SARJOM EXAM.",
    openGraph: {
      title: "Login | SARJOM EXAM",
      description: "Login on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/admin/login",
    },
  };
}