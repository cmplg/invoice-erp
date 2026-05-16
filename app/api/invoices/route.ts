import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type InvoiceItemInput = {
  description: string;
  quantity: number;
  price: number;
};

type CreateInvoiceBody = {
  customerName: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  invoiceDate: string;
  eventDate?: string | null;
  items: InvoiceItemInput[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateInvoiceBody;

    const {
      customerName,
      customerPhone,
      customerAddress,
      invoiceDate,
      eventDate,
      items,
    } = body;

    // find or create customer
    let customer;
    if (customerPhone) {
      customer = await prisma.customer.findFirst({
        where: {
          phone: customerPhone,
        },
      });
    }

    if (!customer && customerAddress) {
      customer = await prisma.customer.findFirst({
        where: {
          address: customerAddress,
          name: customerName,
        },
      });
    }

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
        },
      });
    }

    // calculate total
    const subtotal = items.reduce(
      (acc: number, item: InvoiceItemInput) =>
        acc + item.quantity * item.price,
      0
    );

    // invoice number
    const invoiceNumber =
      "INV-" + Date.now();

    // create invoice
    const invoice =
      await prisma.invoice.create({
        data: {
          invoiceNumber,

          customerId: customer.id,

          invoiceDate:
            new Date(invoiceDate),

          eventDate: eventDate
            ? new Date(eventDate)
            : null,

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
      invoice,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create invoice",
      },
      {
        status: 500,
      }
    );
  }
}