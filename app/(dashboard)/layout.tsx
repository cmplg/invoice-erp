import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-zinc-950 text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-10 pt-20 md:pt-10">
        {children}
      </main>
    </div>
  );
}
