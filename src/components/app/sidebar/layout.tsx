import AdminPanelLayout from "@/layouts/AdminLayout";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
