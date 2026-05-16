import React from "react";
import { NextResponse } from "next/server";
import { pdf, DocumentProps } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import InvoicePDF from "@/components/pdf/invoice-pdf";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: RouteProps
) {
  try {
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
      return NextResponse.json(
        { error: "Invoice tidak ditemukan" },
        { status: 404 }
      );
    }

    const document = React.createElement(
      InvoicePDF,
      {
        invoice,
        company,
      }
    );

    const blob = await pdf(
      document as unknown as React.ReactElement<DocumentProps>
    ).toBlob();

    const arrayBuffer =
      await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Gagal membuat PDF",
      },
      {
        status: 500,
      }
    );
  }
}