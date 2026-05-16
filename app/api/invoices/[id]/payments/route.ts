import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { amount, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Jumlah pembayaran tidak valid" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice tidak ditemukan" },
        { status: 404 }
      );
    }

    if (invoice.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Tidak dapat mencatat pembayaran untuk invoice yang dibatalkan" },
        { status: 400 }
      );
    }

    const newPaidAmount = invoice.paidAmount + amount;

    if (newPaidAmount > invoice.grandTotal) {
      return NextResponse.json(
        { error: "Jumlah pembayaran melebihi sisa tagihan" },
        { status: 400 }
      );
    }

    let newStatus = invoice.status;
    if (newPaidAmount === invoice.grandTotal) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }

    const notePrefix = invoice.notes ? `${invoice.notes}\n` : "";
    const notes = paymentMethod
      ? `${notePrefix}Metode pembayaran: ${paymentMethod}`
      : invoice.notes;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mencatat pembayaran" },
      { status: 500 }
    );
  }
}
