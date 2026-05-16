"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Item = {
  id?: string;
  description: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  invoiceDate: string;
  eventDate: string;
  items: Item[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditInvoicePage({ params }: PageProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadInvoice() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/invoices/${id}`);
        const data = await response.json();

        if (response.ok) {
          const invoice: Invoice = data.invoice;
          setCustomerName(invoice.customer.name);
          setCustomerPhone(invoice.customer.phone || "");
          setCustomerAddress(invoice.customer.address || "");
          setInvoiceDate(invoice.invoiceDate.split('T')[0]);
          setEventDate(invoice.eventDate ? invoice.eventDate.split('T')[0] : "");
          setItems(invoice.items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [params]);

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
    (acc, item) =>
      acc + item.quantity * item.price,
    0
  );

  async function saveInvoice() {
    try {
      const { id } = await params;
      const response = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
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

      alert("Invoice berhasil diupdate");
      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          Edit Invoice
        </h1>

        <button
          onClick={saveInvoice}
          className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
        >
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Customer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Customer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value)
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
            />

            <textarea
              placeholder="Customer Address"
              value={customerAddress}
              onChange={(e) =>
                setCustomerAddress(e.target.value)
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none md:col-span-2"
            />
          </div>
        </div>

        {/* Invoice Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Invoice Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) =>
                setInvoiceDate(e.target.value)
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="date"
              value={eventDate}
              onChange={(e) =>
                setEventDate(e.target.value)
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
            />
          </div>
        </div>

        {/* Items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Invoice Items
            </h2>

            <button
              onClick={addItem}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-semibold"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>

          <div className="space-y-5">
            {items.map((item, index) => {
              const total = item.quantity * item.price;

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
                >
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center text-xl font-bold">
                    {formatCurrency(total)}
                  </div>

                  <div className="md:col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Grand Total
          </h2>

          <div className="text-4xl font-bold">
            {formatCurrency(grandTotal)}
          </div>
        </div>
      </div>
    </div>
  );
}