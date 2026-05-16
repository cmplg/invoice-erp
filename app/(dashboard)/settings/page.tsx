import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const setting = await prisma.companySetting.findFirst();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">Kelola pengaturan perusahaan, logo, dan informasi pembayaran.</p>
      </div>

      <form
        action="/api/settings"
        method="POST"
        encType="multipart/form-data"
        className="relative overflow-hidden rounded-3xl border border-violet-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-8 space-y-6 max-w-4xl shadow-[0_30px_90px_rgba(35,5,80,0.45)]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute left-8 bottom-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-violet-200 mb-2">
                Nama Perusahaan
              </label>
              <input
                name="companyName"
                defaultValue={setting?.companyName || ""}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-200 mb-2">
                Email Perusahaan
              </label>
              <input
                name="companyEmail"
                type="email"
                placeholder="Email"
                defaultValue={setting?.companyEmail || ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-violet-200 mb-2">
              Alamat Perusahaan
            </label>
            <textarea
              name="companyAddress"
              defaultValue={setting?.companyAddress || ""}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-violet-200 mb-2">
                Nomor HP
              </label>
              <input
                name="companyPhone"
                placeholder="Nomor HP"
                defaultValue={setting?.companyPhone || ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-200 mb-2">
                Logo Perusahaan
              </label>
              <input
                type="file"
                name="companyLogo"
                accept="image/*"
                className="w-full text-sm text-zinc-300 file:bg-violet-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 file:cursor-pointer hover:file:bg-violet-700 transition"
              />
              {setting?.companyLogo && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={setting.companyLogo}
                    alt="Company Logo"
                    className="h-12 object-contain rounded-lg ring-1 ring-white/10"
                  />
                  <span className="text-xs text-zinc-400">Current logo</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Informasi Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">
                  Nama Bank
                </label>
                <input
                  name="bankName"
                  placeholder="Bank"
                  defaultValue={setting?.bankName || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">
                  No Rekening
                </label>
                <input
                  name="bankAccount"
                  placeholder="No Rekening"
                  defaultValue={setting?.bankAccount || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">
                  Atas Nama
                </label>
                <input
                  name="bankHolder"
                  placeholder="Atas Nama"
                  defaultValue={setting?.bankHolder || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-200 mb-2">
              Catatan Pembayaran
            </label>
            <textarea
              name="paymentNote"
              defaultValue={setting?.paymentNote || ""}
              placeholder="Contoh: Mohon lakukan pembayaran maksimal H-3 sebelum acara."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-zinc-500 transition focus:border-violet-400 focus:bg-white/10 resize-none"
              rows={4}
            />
          </div>

          <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}