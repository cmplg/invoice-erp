import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type InvoiceItemInput = {
  description: string;
  quantity: number;
  price: number;
};

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = (await req.json()) as {
      customerName: string;
      customerPhone?: string | null;
      customerAddress?: string | null;
      invoiceDate: string;
      eventDate?: string | null;
      items: InvoiceItemInput[];
    };

    const {
      customerName,
      customerPhone,
      customerAddress,
      invoiceDate,
      eventDate,
      items,
    } = body;

    // update customer
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    await prisma.customer.update({
      where: { id: invoice.customerId },
      data: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
      },
    });

    // calculate new total
    const subtotal = items.reduce(
      (acc: number, item: InvoiceItemInput) =>
        acc + item.quantity * item.price,
      0
    );

    // delete existing items and create new ones
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    await prisma.invoice.update({
      where: { id },
      data: {
        invoiceDate: new Date(invoiceDate),
        eventDate: eventDate ? new Date(eventDate) : null,
        subtotal,
        grandTotal: subtotal,
        items: {
          create: items.map((item: InvoiceItemInput) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}