import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar user={session.user} />
      <div className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
