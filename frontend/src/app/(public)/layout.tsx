import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="bg-[#0b0f17] text-slate-100 flex min-h-[calc(100vh-112px)]">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}