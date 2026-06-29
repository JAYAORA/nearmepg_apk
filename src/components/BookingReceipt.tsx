"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
// import { formatINR } from "@/lib/utils";

interface ReceiptProps {
  booking: any;
}

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto.ttf",
});

// custom formatting
const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const COLORS = {
  slate900: "#0f172a",
  slate600: "#475569",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  indigo600: "#4f46e5",
  emerald700: "#047857",
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    color: COLORS.slate900,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: "column",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.slate900,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.slate600,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  receiptNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.indigo600,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.slate600,
  },
  infoSection: {
    flexDirection: "row",
    marginBottom: 40,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.slate400,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.slate900,
    marginBottom: 4,
  },
  infoSubValue: {
    fontSize: 12,
    color: COLORS.slate600,
    marginBottom: 2,
  },
  staySection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    borderTopStyle: "dashed",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    borderBottomStyle: "dashed",
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 40,
  },
  stayHeader: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: COLORS.slate900,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  stayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  stayItem: {
    width: "33.33%",
    marginBottom: 16,
  },
  stayItemLabel: {
    fontSize: 10,
    color: COLORS.slate400,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  stayItemValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.slate600,
  },
  statusSuccess: {
    color: COLORS.emerald700,
  },
  table: {
    width: "100%",
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate900,
  },
  tableHeaderCol1: {
    flex: 1,
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: COLORS.slate600,
  },
  tableHeaderCol2: {
    width: 100,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: COLORS.slate600,
  },
  tableRow: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate100,
  },
  tableCol1: {
    flex: 1,
    fontSize: 13,
    color: COLORS.slate900,
  },
  tableCol2: {
    width: 100,
    textAlign: "right",
    fontSize: 13,
    color: COLORS.slate900,
  },
  tableFooter: {
    flexDirection: "row",
    paddingTop: 20,
  },
  tableFooterCol1: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.slate900,
  },
  tableFooterCol2: {
    width: 150,
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.indigo600,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
    paddingTop: 24,
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: COLORS.slate400,
    marginBottom: 4,
  },
});

const BookingReceipt = ({ booking }: ReceiptProps) => {
  if (!booking) return null;

  const b = booking;
  const p = b.property || {};
  const r = b.room || {};

  const tenantName = b.tenant_name || b.tenant_email || "Guest";
  const checkIn = b.checkIn || b.booking_details?.checkIn || b.created_at;
  const checkOut =
    b.checkOut ||
    b.booking_details?.checkOut ||
    b.booking_details?.actualEndDate;
  const amount = Number(
    b.totalPrice || b.pricing_breakdown?.finalAmountPaid || 0,
  );

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const capitalize = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#0f172a" }}
                >
                  Near
                  <Text style={{ color: "#d97706" }}>Me</Text>
                  PG
                </Text>

                <Text
                  style={{
                    fontSize: 9,
                    marginLeft: 2,
                    marginTop: 2,
                    color: "#0f172a",
                  }}
                >
                  TM
                </Text>
              </View>
              <Text style={styles.subtitle}>Payment Receipt</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.receiptNumber}>
                # {b.booking_code || b.id?.slice(0, 8)}
              </Text>
              <Text style={styles.date}>
                Issued : {formatDate(b.created_at)}
              </Text>
            </View>
          </View>

          {/* Customer + Property */}
          <View style={styles.infoSection}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Customer Details</Text>
              <Text style={styles.infoValue}>{tenantName}</Text>
              <Text style={styles.infoSubValue}>{b.tenant_email}</Text>
              {b.tenant_phone && (
                <Text style={styles.infoSubValue}>{b.tenant_phone}</Text>
              )}
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Community / Premises</Text>
              <Text style={styles.infoValue}>{p.hostelName || "N/A"}</Text>
              <Text style={styles.infoSubValue}>{p.location || "N/A"}</Text>
              {p.owner_email && (
                <Text style={styles.infoSubValue}>{p.owner_email}</Text>
              )}
            </View>
          </View>

          {/* Stay Details */}
          <View style={styles.staySection}>
            <Text style={styles.stayHeader}>Accommodation Details</Text>
            <View style={styles.stayGrid}>
              <View style={styles.stayItem}>
                <Text style={styles.stayItemLabel}>Unit</Text>
                <Text style={styles.stayItemValue}>
                  {r.roomName || r.roomId || "N/A"}
                </Text>
              </View>
              <View style={styles.stayItem}>
                <Text style={styles.stayItemLabel}>Allotted Bed</Text>
                <Text style={styles.stayItemValue}>
                  {r.bedId ? `Bed ${r.bedId}` : "N/A"}
                </Text>
              </View>
              <View style={styles.stayItem}>
                <Text style={styles.stayItemLabel}>Status</Text>
                <Text style={[styles.stayItemValue, styles.statusSuccess]}>
                  {capitalize(b.booking_status || b.status || "CONFIRMED")}
                </Text>
              </View>
              <View style={styles.stayItem}>
                <Text style={styles.stayItemLabel}>Check In</Text>
                <Text style={styles.stayItemValue}>{formatDate(checkIn)}</Text>
              </View>
              <View style={styles.stayItem}>
                <Text style={styles.stayItemLabel}>Check Out</Text>
                <Text style={styles.stayItemValue}>{formatDate(checkOut)}</Text>
              </View>
              <View style={styles.stayItem}>
                <Text style={styles.stayItemLabel}>Payment</Text>
                <Text style={[styles.stayItemValue, styles.statusSuccess]}>
                  {capitalize(b.payment_status || "SUCCESS")}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCol1}>Item Breakdown</Text>
              <Text style={styles.tableHeaderCol2}>Price</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCol1}>
                Monthly Accomodation Rental / Reservation Deposit
              </Text>
              <Text style={styles.tableCol2}>{formatINR(amount)}</Text>
            </View>

            {b.pricing_breakdown?.convenienceFee > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCol1}>
                  Gateway Platform & Convenience Fees
                </Text>
                <Text style={styles.tableCol2}>
                  {formatINR(b.pricing_breakdown.convenienceFee)}
                </Text>
              </View>
            )}

            <View style={styles.tableFooter}>
              <Text style={styles.tableFooterCol1}>Amount Paid</Text>
              <Text style={styles.tableFooterCol2}>{formatINR(amount)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for staying with us.</Text>
          <Text style={styles.footerText}>
            This is a system verified document. No seal or signature required.
          </Text>
          <Text style={styles.footerText}>
            Downloaded on{" "}
            {new Date().toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BookingReceipt;
