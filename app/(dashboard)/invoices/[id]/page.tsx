import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Pencil, Printer, Download, CreditCard } from "lucide-react";
import CancelInvoiceButton from "@/components/invoice/cancel-invoice-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("id-ID");
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-300",
  PARTIAL: "bg-sky-500/15 text-sky-300",
  PAID: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-rose-500/15 text-rose-300",
};

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
    },
  });

  const company = await prisma.companySetting.findFirst();

  if (!invoice) {
    notFound();
  }

  const remaining = invoice.grandTotal - invoice.paidAmount;
  const badgeClass = STATUS_STYLES[invoice.status] ?? "bg-zinc-500/10 text-zinc-300";

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Detail Invoice</h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">{invoice.invoiceNumber}</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Link
            href={`/invoices/${invoice.id}/edit`}
            title="Edit Invoice"
            className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
          >
            <Pencil size={20} />
          </Link>

          <button
            title="Print Invoice"
            className="flex items-center justify-center w-11 h-11 bg-zinc-800 text-white rounded-2xl hover:bg-zinc-700 transition"
          >
            <Printer size={20} />
          </button>

          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            title="Export as PDF"
            className="flex items-center justify-center w-11 h-11 bg-white text-black rounded-2xl hover:bg-zinc-200 transition"
          >
            <Download size={20} />
          </a>

          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
            <Link
              href={`/invoices/${invoice.id}/payments/add`}
              title="Add Payment"
              className="flex items-center justify-center w-11 h-11 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
            >
              <CreditCard size={20} />
            </Link>
          )}

          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
            <CancelInvoiceButton id={invoice.id} />
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between border-b border-zinc-800 pb-8 mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {company?.companyLogo && (
                <img
                  src={company.companyLogo}
                  alt={company.companyName || "Company Logo"}
                  className="h-16 w-16 object-contain rounded-2xl bg-white/5 p-2"
                />
              )}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {company?.companyName || "Invoice ERP"}
                </h2>
                <p className="text-zinc-400 mt-1 max-w-xl text-sm sm:text-base">
                  {company?.companyAddress || "Professional Business Invoice"}
                </p>
              </div>
            </div>
            <div className="grid gap-2 text-sm sm:text-base text-zinc-300">
              {company?.companyPhone && <p>Telp: {company.companyPhone}</p>}
              {company?.companyEmail && <p>Email: {company.companyEmail}</p>}
            </div>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-zinc-400 text-sm">Invoice No.</p>
            <p className="font-bold text-xl sm:text-2xl">{invoice.invoiceNumber}</p>
            <p className="text-zinc-400 mt-5 text-sm">Tanggal</p>
            <p>{formatDate(invoice.invoiceDate)}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 border-b border-zinc-800 pb-8 mb-8">
          <div className="space-y-3">
            <p className="text-zinc-400 text-sm">Ditagihkan kepada:</p>
            <h3 className="text-xl font-bold">{invoice.customer.name}</h3>
            <p className="text-zinc-300 text-sm">{invoice.customer.phone || "-"}</p>
            <p className="text-zinc-300 text-sm">{invoice.customer.address || "-"}</p>
          </div>
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">Status Pembayaran:</p>
            <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}>
              {invoice.status}
            </span>
            {invoice.eventDate && (
              <div>
                <p className="text-zinc-400 text-sm">Tanggal Acara:</p>
                <p>{formatDate(invoice.eventDate)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950">
          <table className="min-w-full text-sm sm:text-base">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-4">Deskripsi</th>
                <th className="text-right px-4 py-4">Qty</th>
                <th className="text-right px-4 py-4">Harga</th>
                <th className="text-right px-4 py-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800">
                  <td className="px-4 py-4">{item.description}</td>
                  <td className="px-4 py-4 text-right">{item.quantity}</td>
                  <td className="px-4 py-4 text-right">{formatRupiah(item.price)}</td>
                  <td className="px-4 py-4 text-right font-semibold">{formatRupiah(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoice.notes && (
          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold mb-3">Catatan Invoice</h3>
            <p className="text-zinc-300 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] mt-10">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-xl font-semibold mb-4">Informasi Pembayaran</h3>
            <div className="grid gap-3 text-sm text-zinc-300">
              <div className="flex justify-between">
                <span>Bank</span>
                <span className="font-semibold text-white">{company?.bankName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>No Rekening</span>
                <span className="font-semibold text-white">{company?.bankAccount || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Atas Nama</span>
                <span className="font-semibold text-white">{company?.bankHolder || "-"}</span>
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-zinc-400 text-sm">Catatan</p>
                <p className="mt-2 text-zinc-300 text-sm">{company?.paymentNote || "-"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-md space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>{formatRupiah(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Dibayar</span>
                <span>{formatRupiah(invoice.paidAmount)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-4 flex justify-between text-2xl font-bold">
                <span>Sisa</span>
                <span>{formatRupiah(remaining)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-4 flex justify-between text-3xl font-bold">
                <span>Grand Total</span>
                <span>{formatRupiah(invoice.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
