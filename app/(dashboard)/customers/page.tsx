import { prisma } from "@/lib/prisma";
import { Eye, Plus } from "lucide-react";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      invoices: {
        select: {
          id: true,
          grandTotal: true,
          paidAmount: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Customers</h1>
          <p className="text-zinc-400 mt-2">Daftar pelanggan dan riwayat invoice</p>
        </div>

        <button
          title="Add Customer"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition w-full sm:w-auto shadow-lg"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block relative overflow-hidden rounded-3xl border border-rose-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 shadow-[0_30px_90px_rgba(60,20,30,0.55)]">
        <div className="pointer-events-none absolute right-8 top-6 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />
        <table className="w-full relative z-10">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="text-left p-5 text-rose-200 font-semibold">Name</th>
              <th className="text-left p-5 text-rose-200 font-semibold">Email</th>
              <th className="text-left p-5 text-rose-200 font-semibold">Phone</th>
              <th className="text-left p-5 text-rose-200 font-semibold">Total Invoices</th>
              <th className="text-left p-5 text-rose-200 font-semibold">Total Amount</th>
              <th className="text-left p-5 text-rose-200 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-400">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const totalInvoices = customer.invoices.length;
                const totalAmount = customer.invoices.reduce(
                  (sum, invoice) => sum + invoice.grandTotal,
                  0
                );

                return (
                  <tr
                    key={customer.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
                  >
                    <td className="p-5 font-semibold">
                      {customer.name}
                    </td>

                    <td className="p-5 text-zinc-400">
                      {customer.email || "-"}
                    </td>

                    <td className="p-5 text-zinc-400">
                      {customer.phone || "-"}
                    </td>

                    <td className="p-5">
                      {totalInvoices}
                    </td>

                    <td className="p-5 font-bold">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </td>

                    <td className="p-5">
                      <button
                        title="View Customer"
                        className="flex items-center justify-center w-9 h-9 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition transform hover:scale-110 active:scale-95"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-4">
        {customers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-400">
            No customers yet.
          </div>
        ) : (
          customers.map((customer) => {
            const totalInvoices = customer.invoices.length;
            const totalAmount = customer.invoices.reduce(
              (sum, invoice) => sum + invoice.grandTotal,
              0
            );

            return (
              <div
                key={customer.id}
                className="relative overflow-hidden rounded-2xl border border-rose-500/10 bg-gradient-to-br from-slate-950 to-rose-950 p-4 space-y-3 shadow-lg"
              >
                <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-rose-500/20 blur-2xl" />
                <div className="relative z-10">
                  <p className="font-bold text-lg text-white">
                    {customer.name}
                  </p>
                  <p className="text-rose-200/70 text-sm">
                    {customer.email || "No email"}
                  </p>
                  <p className="text-rose-200/70 text-sm">
                    {customer.phone || "No phone"}
                  </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-rose-200/70">Invoices</p>
                    <p className="font-bold text-white">
                      {totalInvoices}
                    </p>
                  </div>
                  <div>
                    <p className="text-rose-200/70">Total</p>
                    <p className="font-bold text-rose-300">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <button
                  title="View Customer"
                  className="relative z-10 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition shadow-lg"
                >
                  <Eye size={18} />
                  View
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}