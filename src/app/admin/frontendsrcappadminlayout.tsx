export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root-wrapper">
      {/* Yeh layout parent public navbar ko bypass karke sirf admin content render karega */}
      {children}
    </div>
  );
}