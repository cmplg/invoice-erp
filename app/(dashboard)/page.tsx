import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function buildRevenueSeries(invoices: Array<{ invoiceDate: Date; grandTotal: number }>) {
  const now = new Date();
  const months: Array<{ label: string; key: string; value: number }> = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    months.push({ label: getMonthLabel(date), key, value: 0 });
  }

  const monthMap = new Map(months.map((month) => [month.key, month]));

  invoices.forEach((invoice) => {
    const date = new Date(invoice.invoiceDate);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const month = monthMap.get(key);
    if (month) {
      month.value += invoice.grandTotal;
    }
  });

  return months;
}

export default async function DashboardPage() {
  const invoices = await prisma.invoice.findMany({
    select: {
      invoiceDate: true,
      grandTotal: true,
      paidAmount: true,
      status: true,
    },
    orderBy: {
      invoiceDate: "asc",
    },
  });

  const customers = await prisma.customer.findMany({
    include: {
      invoices: {
        select: {
          grandTotal: true,
        },
      },
    },
  });

  const company = await prisma.companySetting.findFirst();

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.paidAmount,
    0
  );

  const totalInvoices = invoices.length;

  const totalOutstanding = invoices.reduce(
    (sum, invoice) => sum + (invoice.grandTotal - invoice.paidAmount),
    0
  );

  const totalCustomers = customers.length;

  const statusCounts = invoices.reduce(
    (acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const revenueSeries = buildRevenueSeries(invoices);
  const maxRevenue = Math.max(...revenueSeries.map((month) => month.value), 1);

  const topCustomers = customers
    .map((customer) => {
      const total = customer.invoices.reduce(
        (sum, invoice) => sum + invoice.grandTotal,
        0
      );
      return {
        id: customer.id,
        name: customer.name,
        total,
        invoiceCount: customer.invoices.length,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 xl:px-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 mt-2 max-w-2xl">
            Ringkasan pendapatan, status invoice, dan pelanggan utama.
          </p>
        </div>

        {company?.companyLogo && (
          <div className="hidden sm:block">
            <img
              src={company.companyLogo}
              alt={company.companyName}
              className="h-24 w-24 object-contain rounded-2xl shadow-lg ring-1 ring-white/10"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-cyan-950 via-slate-950 to-slate-900 p-5 sm:p-6 shadow-[0_20px_80px_rgba(8,27,48,0.45)] transition duration-500 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute left-4 bottom-4 h-24 w-24 rounded-full bg-white/5 blur-3xl" />
          <p className="text-cyan-200 text-sm">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-3 text-white">{formatCurrency(totalRevenue)}</h2>
          <p className="text-cyan-100/70 mt-3 text-sm">Pendapatan yang sudah diterima.</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-5 sm:p-6 shadow-[0_20px_80px_rgba(20,6,82,0.45)] transition duration-500 hover:-translate-y-1">
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute right-6 bottom-6 h-20 w-20 rounded-full bg-white/5 blur-3xl" />
          <p className="text-violet-200 text-sm">Total Invoices</p>
          <h2 className="text-3xl font-bold mt-3 text-white">{totalInvoices}</h2>
          <p className="text-violet-100/70 mt-3 text-sm">Semua invoice yang dibuat.</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-rose-500/10 bg-gradient-to-br from-rose-950 via-fuchsia-950 to-slate-900 p-5 sm:p-6 shadow-[0_20px_80px_rgba(79,30,69,0.45)] transition duration-500 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-10 top-10 h-28 w-28 rounded-full bg-rose-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute left-6 bottom-6 h-20 w-20 rounded-full bg-white/5 blur-3xl" />
          <p className="text-rose-200 text-sm">Outstanding Payment</p>
          <h2 className="text-3xl font-bold mt-3 text-rose-300">{formatCurrency(totalOutstanding)}</h2>
          <p className="text-rose-100/70 mt-3 text-sm">Total sisa pembayaran belum lunas.</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 p-5 sm:p-6 shadow-[0_20px_80px_rgba(12,60,34,0.45)] transition duration-500 hover:-translate-y-1">
          <div className="pointer-events-none absolute -left-10 bottom-10 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-white/5 blur-3xl" />
          <p className="text-emerald-200 text-sm">Total Customers</p>
          <h2 className="text-3xl font-bold mt-3 text-white">{totalCustomers}</h2>
          <p className="text-emerald-100/70 mt-3 text-sm">Jumlah pelanggan yang terdaftar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5 sm:p-6 shadow-[0_30px_90px_rgba(8,30,48,0.55)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute left-8 bottom-10 h-32 w-32 rounded-full bg-slate-800/80 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Pendapatan Bulanan</h2>
                <p className="text-cyan-200/70 mt-2 text-sm">6 bulan terakhir berdasarkan total invoice.</p>
              </div>
              <span className="inline-flex rounded-full bg-white/10 text-cyan-200 px-3 py-1 text-sm font-semibold ring-1 ring-white/10 backdrop-blur">
                {formatCurrency(revenueSeries.reduce((sum, month) => sum + month.value, 0))}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 items-end h-52 sm:h-56">
              {revenueSeries.map((month) => {
                const percent = (month.value / maxRevenue) * 100;
                return (
                  <div key={month.key} className="flex flex-col items-center gap-2">
                    <div className="relative w-full rounded-3xl bg-slate-950 overflow-hidden h-full flex items-end">
                      <div
                        className="w-full rounded-t-3xl bg-gradient-to-t from-emerald-400 via-cyan-400 to-sky-300 transition-all duration-700 ease-out"
                        style={{ height: `${percent}%` }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-2 bg-white/10" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/70 text-center">{month.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-cyan-100">
              {revenueSeries.map((month) => (
                <div key={`${month.key}-details`} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/5 backdrop-blur">
                  <p className="font-semibold text-white">{month.label}</p>
                  <p className="mt-2 text-cyan-100">{formatCurrency(month.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-sky-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 sm:p-6 shadow-[0_30px_80px_rgba(7,33,55,0.55)]">
            <div className="pointer-events-none absolute right-8 top-6 h-28 w-28 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-6 bottom-6 h-28 w-8 rounded-full bg-sky-400/10 blur-2xl" />
            <h2 className="text-2xl font-bold text-white mb-4">Invoice Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Pending", key: "PENDING", color: "bg-yellow-500/10 text-yellow-300" },
                { label: "Partial", key: "PARTIAL", color: "bg-sky-500/10 text-sky-300" },
                { label: "Paid", key: "PAID", color: "bg-emerald-500/10 text-emerald-300" },
                { label: "Cancelled", key: "CANCELLED", color: "bg-rose-500/10 text-rose-300" },
              ].map((status) => (
                <div key={status.key} className="relative overflow-hidden rounded-3xl border border-white/10 p-4 bg-white/5 shadow-inner shadow-black/10">
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <p className="text-3xl font-bold text-white">{statusCounts[status.key] || 0}</p>
                    <div className="h-16 w-1.5 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
                  </div>
                  <p className="text-cyan-100/70 mt-1 text-sm">Invoice</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 sm:p-6 shadow-[0_30px_80px_rgba(9,45,35,0.55)]">
            <div className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-8 top-20 h-20 w-20 rounded-full bg-white/5 blur-3xl" />
            <h2 className="text-2xl font-bold text-white mb-4">Top Customers</h2>
            <div className="space-y-4">
              {topCustomers.length === 0 ? (
                <p className="text-cyan-100/70">Belum ada data customer.</p>
              ) : (
                topCustomers.map((customer, index) => (
                  <div key={customer.id} className="relative overflow-hidden rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
                    <div className="absolute right-4 top-2 h-16 w-1.5 rounded-full bg-emerald-400/30" />
                    <div className="flex items-center justify-between gap-4 relative">
                      <div>
                        <p className="font-semibold text-white">{index + 1}. {customer.name}</p>
                        <p className="text-cyan-100/70 text-sm">{customer.invoiceCount} invoice</p>
                      </div>
                      <p className="font-bold text-white">{formatCurrency(customer.total)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
