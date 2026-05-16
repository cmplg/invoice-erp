"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          Login
        </h1>

        <p className="text-zinc-400 mb-8">
          Masuk ke Invoice ERP
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="admin@erp.com"
              className="mt-2 w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-zinc-200 transition"
          >
            {loading
              ? "Loading..."
              : "Masuk"}
          </button>

        </form>

      </div>

    </main>
  );
}