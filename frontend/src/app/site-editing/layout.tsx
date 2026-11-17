import AdminShell from "@/components/admin/AdminShell";

export default function SiteEditingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}