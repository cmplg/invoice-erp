"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Item = {
  description: string;
  quantity: number;
  price: number;
};

export default function CreateInvoicePage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [items, setItems] = useState<Item[]>([
    {
      description: "",
      quantity: 1,
      price: 0,
    },
  ]);

  function addItem() {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(index: number) {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  }

  function updateItem(
    index: number,
    field: keyof Item,
    value: string | number
  ) {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setItems(updated);
  }

  const grandTotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  async function saveInvoice() {
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          invoiceDate,
          eventDate,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Invoice berhasil dibuat");
      window.location.href = "/invoices";
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Buat Invoice</h1>
          <p className="text-zinc-400 mt-2 max-w-2xl text-sm sm:text-base">
            Lengkapi data pelanggan dan detail item untuk membuat invoice yang rapi dan mobile-friendly.
          </p>
        </div>

        <button
          onClick={saveInvoice}
          className="w-full sm:w-auto bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:bg-zinc-200 transition"
        >
          Simpan Invoice
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-5">Detail Pelanggan</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Pelanggan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
            />
            <input
              type="text"
              placeholder="Nomor Telepon"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
            />
            <textarea
              placeholder="Alamat Pelanggan"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none lg:col-span-2 min-h-[120px]"
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-5">Info Invoice</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              Tanggal Invoice
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              Tanggal Acara
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-sm sm:text-base bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
              />
            </label>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Item Invoice</h2>
            <button
              onClick={addItem}
              className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-2xl font-semibold hover:bg-zinc-200 transition"
            >
              <Plus size={18} />
              Tambah Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const total = item.quantity * item.price;
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-4"
                >
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      placeholder="Deskripsi item"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      className="w-full text-sm sm:text-base bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      className="w-full text-sm sm:text-base bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Harga"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", Number(e.target.value))
                      }
                      className="w-full text-sm sm:text-base bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-end text-right text-sm sm:text-base font-semibold text-white">
                    {formatCurrency(total)}
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-zinc-400 text-sm sm:text-base">Total akhir invoice.</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">{formatCurrency(grandTotal)}</h2>
          </div>

          <button
            onClick={saveInvoice}
            className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-zinc-200 transition"
          >
            Simpan Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
