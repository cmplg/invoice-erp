import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const data: {
      companyName: string;
      companyAddress: string;
      companyPhone: string;
      companyEmail: string;
      bankName: string;
      bankAccount: string;
      bankHolder: string;
      paymentNote: string;
      companyLogo?: string | null;
    } = {
      companyName: String(formData.get("companyName") || ""),
      companyAddress: String(formData.get("companyAddress") || ""),
      companyPhone: String(formData.get("companyPhone") || ""),
      companyEmail: String(formData.get("companyEmail") || ""),
      bankName: String(formData.get("bankName") || ""),
      bankAccount: String(formData.get("bankAccount") || ""),
      bankHolder: String(formData.get("bankHolder") || ""),
      paymentNote: String(formData.get("paymentNote") || ""),
    };

    const logoFile = formData.get("companyLogo");

    if (logoFile instanceof File && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = logoFile.type || "image/png";

      data.companyLogo = `data:${mimeType};base64,${base64}`;
    }

    const existing = await prisma.companySetting.findFirst();

    if (existing) {
      await prisma.companySetting.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.companySetting.create({
        data,
      });
    }

    return NextResponse.redirect(new URL("/settings?saved=true", req.url), {
      status: 303,
    });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}