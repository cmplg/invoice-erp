"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function AddPaymentPage({ params }: PageProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      const response = await fetch(`/api/invoices/${id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Pembayaran berhasil dicatat");
      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Tambah Pembayaran</h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Masukkan jumlah dan metode pembayaran untuk invoice ini.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Jumlah Pembayaran</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Metode Pembayaran</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
            >
              <option value="Transfer">Transfer</option>
              <option value="Cash">Cash</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Mencatat..." : "Catat Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
}
