import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Eye, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Invoices</h1>
          <p className="text-zinc-400 mt-2">Kelola semua invoice dan pembayaran</p>
        </div>

        <Link
          href="/invoices/create"
          title="Create Invoice"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition w-full sm:w-auto shadow-lg"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Create</span>
        </Link>
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 shadow-[0_30px_90px_rgba(5,60,34,0.45)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
        <table className="w-full relative z-10">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="text-left p-5 text-emerald-200 font-semibold">Invoice</th>
              <th className="text-left p-5 text-emerald-200 font-semibold">Customer</th>
              <th className="text-left p-5 text-emerald-200 font-semibold">Tanggal</th>
              <th className="text-left p-5 text-emerald-200 font-semibold">Total</th>
              <th className="text-left p-5 text-emerald-200 font-semibold">Status</th>
              <th className="text-left p-5 text-emerald-200 font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-400">
                  Belum ada invoice.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
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

                  <td className="p-5 text-zinc-400">
                    {formatDate(invoice.invoiceDate)}
                  </td>

                  <td className="p-5 font-bold">
                    {formatCurrency(invoice.grandTotal)}
                  </td>

                  <td className="p-5">
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      {invoice.status}
                    </span>
                  </td>

                  <td className="p-5">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      title="View Details"
                      className="flex items-center justify-center w-9 h-9 bg-white text-black rounded-lg hover:bg-zinc-200 transition transform hover:scale-110 active:scale-95"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-4">
        {invoices.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-slate-950 to-emerald-950 p-6 text-center text-zinc-400 shadow-lg">
            <div className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-full bg-emerald-500/20 blur-3xl" />
            Belum ada invoice.
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-slate-950 to-emerald-950 p-4 space-y-3 shadow-lg"
            >
              <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className="relative z-10 flex justify-between items-start gap-2">
                <div>
                  <p className="font-bold text-lg text-white">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-emerald-200/70 text-sm">
                    {invoice.customer.name}
                  </p>
                </div>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                  {invoice.status}
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-emerald-200/70">Tanggal</p>
                  <p className="font-semibold text-white">
                    {formatDate(invoice.invoiceDate)}
                  </p>
                </div>
                <div>
                  <p className="text-emerald-200/70">Total</p>
                  <p className="font-bold text-emerald-300">
                    {formatCurrency(invoice.grandTotal)}
                  </p>
                </div>
              </div>

              <Link
                href={`/invoices/${invoice.id}`}
                className="relative z-10 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg"
              >
                <Eye size={18} />
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
