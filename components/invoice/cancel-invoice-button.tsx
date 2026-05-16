"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type CancelInvoiceButtonProps = {
  id: string;
};

export default function CancelInvoiceButton({ id }: CancelInvoiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Yakin ingin membatalkan invoice ini?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/invoices/${id}/cancel`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Gagal membatalkan invoice");
        return;
      }

      alert("Invoice berhasil dibatalkan");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membatalkan invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="flex items-center justify-center w-11 h-11 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition disabled:opacity-50"
      title="Cancel Invoice"
    >
      <X size={20} />
    </button>
  );
}
