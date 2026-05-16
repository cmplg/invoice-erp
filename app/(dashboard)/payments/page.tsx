import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
export const dynamic = 'force-dynamic';
export default async function PaymentsPage() {
  const invoices = await prisma.invoice.findMany({
    where: {
      status: {
        in: ["PENDING", "PARTIAL"],
      },
    },
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Payments</h1>
          <p className="text-zinc-400 mt-2">Pantau pembayaran pending dan partial</p>
        </div>

        <button
          title="Record Payment"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition w-full sm:w-auto shadow-lg"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Record</span>
        </button>
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block relative overflow-hidden rounded-3xl border border-sky-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 shadow-[0_30px_90px_rgba(7,33,55,0.55)]">
        <div className="pointer-events-none absolute right-8 top-6 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
        <table className="w-full relative z-10">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="text-left p-5 text-sky-200 font-semibold">Invoice</th>
              <th className="text-left p-5 text-sky-200 font-semibold">Customer</th>
              <th className="text-left p-5 text-sky-200 font-semibold">Total Amount</th>
              <th className="text-left p-5 text-sky-200 font-semibold">Paid Amount</th>
              <th className="text-left p-5 text-sky-200 font-semibold">Remaining</th>
              <th className="text-left p-5 text-sky-200 font-semibold">Status</th>
              <th className="text-left p-5 text-sky-200 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-400">
                  No pending payments.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => {
                const remaining = invoice.grandTotal - invoice.paidAmount;

                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
                  >
                    <td className="p-5 font-semibold">
                      {invoice.invoiceNumber}
                    </td>

                    <td className="p-5">
                      {invoice.customer.name}
                    </td>

                    <td className="p-5 font-bold">
                      {formatCurrency(invoice.grandTotal)}
                    </td>

                    <td className="p-5 text-green-400">
                      {formatCurrency(invoice.paidAmount)}
                    </td>

                    <td className="p-5 text-red-400 font-semibold">
                      {formatCurrency(remaining)}
                    </td>

                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        invoice.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {invoice.status}
                      </span>
                    </td>

                    <td className="p-5">
                      <Link
                        href={`/invoices/${invoice.id}/payments/add`}
                        title="Add Payment"
                        className="flex items-center justify-center w-9 h-9 bg-white text-black rounded-lg hover:bg-zinc-200 transition transform hover:scale-110 active:scale-95"
                      >
                        <ArrowRight size={18} />
                      </Link>
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
        {invoices.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-sky-500/10 bg-gradient-to-br from-slate-950 to-sky-950 p-6 text-center text-zinc-400 shadow-lg">
            <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 rounded-full bg-sky-500/20 blur-3xl" />
            No pending payments.
          </div>
        ) : (
          invoices.map((invoice) => {
            const remaining = invoice.grandTotal - invoice.paidAmount;

            return (
              <div
                key={invoice.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-lg">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {invoice.customer.name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-zinc-400">Total</p>
                    <p className="font-bold text-green-400 text-xs">
                      {formatCurrency(invoice.grandTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Paid</p>
                    <p className="font-semibold text-xs">
                      {formatCurrency(invoice.paidAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Remaining</p>
                    <p className="font-bold text-red-400 text-xs">
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/invoices/${invoice.id}/payments/add`}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-zinc-200 transition"
                >
                  <ArrowRight size={18} />
                  Pay
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}