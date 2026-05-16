"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-zinc-900 border-b border-zinc-800 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-zinc-800 rounded-xl transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-6 z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold text-white mb-10">
          Invoice ERP
        </h1>

        <nav className="space-y-3 text-zinc-300">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl bg-zinc-800 text-white transition"
          >
            Dashboard
          </Link>

          <Link
            href="/invoices"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Invoices
          </Link>

          <Link
            href="/customers"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Customers
          </Link>

          <Link
            href="/payments"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Payments
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Settings
          </Link>
        </nav>
      </aside>
    </>
  );
}
