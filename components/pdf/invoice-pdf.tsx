import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { Invoice, InvoiceItem } from "@prisma/client";

type CompanySetting = {
  companyName: string;
  companyLogo?: string | null;
  companyAddress?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  paymentNote?: string | null;
};

type InvoicePDFProps = {
  invoice: Invoice & {
    customer: {
      name: string;
      phone?: string | null;
      address?: string | null;
    };
    items: InvoiceItem[];
  };
  company?: CompanySetting | null;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    alignItems: "flex-start",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
    objectFit: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  muted: {
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    padding: 14,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    width: "48%",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #111827",
    paddingBottom: 8,
    marginBottom: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 8,
  },
  colDesc: {
    width: "50%",
  },
  colSmall: {
    width: "15%",
    textAlign: "right",
  },
  colTotal: {
    width: "20%",
    textAlign: "right",
  },
  totals: {
    marginTop: 24,
    alignSelf: "flex-end",
    width: "45%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  grand: {
    borderTop: "1px solid #111827",
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e5e7eb",
    marginTop: 32,
    paddingTop: 12,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLogo: {
    width: 50,
    height: 50,
    objectFit: "contain",
    marginRight: 12,
  },
});

function rupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function InvoicePDF({ invoice, company }: InvoicePDFProps) {
  const remaining = invoice.grandTotal - invoice.paidAmount;
  const companyName = company?.companyName || "Invoice ERP";
  const companyLogo = company?.companyLogo;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {companyLogo ? (
              <Image style={styles.logo} src={companyLogo} />
            ) : null}
            <Text style={styles.title}>{companyName}</Text>
            {company?.companyAddress ? (
              <Text style={styles.muted}>{company.companyAddress}</Text>
            ) : null}
            {company?.companyPhone ? (
              <Text style={styles.muted}>Telp: {company.companyPhone}</Text>
            ) : null}
            {company?.companyEmail ? (
              <Text style={styles.muted}>Email: {company.companyEmail}</Text>
            ) : null}
          </View>

          <View>
            <Text>Invoice No.</Text>
            <Text style={styles.title}>{invoice.invoiceNumber}</Text>
            <Text style={styles.muted}>
              {new Date(invoice.invoiceDate).toLocaleDateString("id-ID")}
            </Text>
          </View>
        </View>

        <View style={[styles.row, styles.section]}>
          <View style={styles.box}>
            <Text>Ditagihkan kepada:</Text>
            <Text style={{ marginTop: 8, fontSize: 14 }}>{invoice.customer.name}</Text>
            <Text style={styles.muted}>{invoice.customer.phone || "-"}</Text>
            <Text style={styles.muted}>{invoice.customer.address || "-"}</Text>
          </View>

          <View style={styles.box}>
            <Text>Status:</Text>
            <Text style={{ marginTop: 8 }}>{invoice.status}</Text>
            {invoice.eventDate ? (
              <>
                <Text style={{ marginTop: 14 }}>Tanggal Acara:</Text>
                <Text style={styles.muted}>
                  {new Date(invoice.eventDate).toLocaleDateString("id-ID")}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Deskripsi</Text>
          <Text style={styles.colSmall}>Qty</Text>
          <Text style={styles.colSmall}>Harga</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {invoice.items.map((item: InvoiceItem) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colSmall}>{item.quantity}</Text>
            <Text style={styles.colSmall}>{rupiah(item.price)}</Text>
            <Text style={styles.colTotal}>{rupiah(item.total)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{rupiah(invoice.subtotal)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Dibayar</Text>
            <Text>{rupiah(invoice.paidAmount)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Sisa</Text>
            <Text>{rupiah(remaining)}</Text>
          </View>

          <View style={[styles.totalRow, styles.grand]}>
            <Text>Grand Total</Text>
            <Text>{rupiah(invoice.grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            {companyLogo ? (
              <Image style={styles.footerLogo} src={companyLogo} />
            ) : null}
            <View>
              <Text style={{ fontWeight: "bold" }}>{companyName}</Text>
              {company?.companyAddress ? (
                <Text style={styles.muted}>{company.companyAddress}</Text>
              ) : null}
              {company?.paymentNote ? (
                <Text style={styles.muted}>{company.paymentNote}</Text>
              ) : null}
            </View>
          </View>
          <Text style={styles.muted}>Generated by Invoice ERP</Text>
        </View>
      </Page>
    </Document>
  );
}
