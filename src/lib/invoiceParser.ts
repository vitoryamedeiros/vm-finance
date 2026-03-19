export interface InvoiceTransaction {
  date: string;
  description: string;
  amount: number;
  rawLine: string;
}

/**
 * Parse extracted text from a Brazilian credit card invoice and identify transaction lines.
 *
 * Supports common formats:
 *  - "15/03 UBER *TRIP 25,90"
 *  - "15 MAR UBER *TRIP R$ 25,90"
 *  - "15/03/2025 UBER *TRIP R$25,90"
 *  - "UBER *TRIP 25,90"  (no date)
 */
export function parseInvoiceText(rawText: string): InvoiceTransaction[] {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const transactions: InvoiceTransaction[] = [];

  // Pattern: optional date + description + monetary value
  // Brazilian invoices typically have the value at the end of the line
  const VALUE_REGEX = /R?\$?\s?(\d{1,3}(?:\.\d{3})*(?:[.,]\d{2}))\s*$/;
  const DATE_REGEX = /^(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?\s+/;
  const MONTH_NAMES_REGEX =
    /^(\d{1,2})\s+(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\s+/i;

  // Lines to skip (headers, totals, footer noise)
  const SKIP_PATTERNS = [
    /total/i, /pagamento/i, /saldo/i, /fatura/i, /limite/i,
    /vencimento/i, /resumo/i, /encargos/i, /juros/i,
    /IOF/i, /anuidade/i, /cr[eé]dito/i, /d[eé]bito/i, /^=+$/,
    /^-+$/, /PGTO/i, /m[ií]nimo/i, /anterior/i,
  ];

  const currentYear = new Date().getFullYear();

  for (const line of lines) {
    // Skip known noise
    if (SKIP_PATTERNS.some((p) => p.test(line))) continue;

    // Try to find a monetary value at the end
    const valueMatch = line.match(VALUE_REGEX);
    if (!valueMatch) continue;

    // Parse the value
    let amountStr = valueMatch[1];
    // Handle Brazilian thousands separator: 1.234,56 → 1234.56
    amountStr = amountStr.replace(/\./g, "").replace(",", ".");
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) continue;

    // Remove the value portion to get description + date
    let remaining = line.slice(0, valueMatch.index).trim();
    // Also remove R$ or $ prefix near the value
    remaining = remaining.replace(/R?\$\s*$/, "").trim();

    let date = "";
    let description = remaining;

    // Try to extract date (DD/MM or DD/MM/YYYY)
    const dateMatch = remaining.match(DATE_REGEX);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, "0");
      const month = dateMatch[2].padStart(2, "0");
      const year = dateMatch[3]
        ? dateMatch[3].length === 2
          ? `20${dateMatch[3]}`
          : dateMatch[3]
        : String(currentYear);
      date = `${year}-${month}-${day}`;
      description = remaining.slice(dateMatch[0].length).trim();
    } else {
      // Try month name format: "15 MAR ..."
      const monthNameMatch = remaining.match(MONTH_NAMES_REGEX);
      if (monthNameMatch) {
        const day = monthNameMatch[1].padStart(2, "0");
        const monthNames: Record<string, string> = {
          JAN: "01", FEV: "02", MAR: "03", ABR: "04",
          MAI: "05", JUN: "06", JUL: "07", AGO: "08",
          SET: "09", OUT: "10", NOV: "11", DEZ: "12",
        };
        const month = monthNames[monthNameMatch[2].toUpperCase()] || "01";
        date = `${currentYear}-${month}-${day}`;
        description = remaining.slice(monthNameMatch[0].length).trim();
      }
    }

    // Clean up description
    description = description
      .replace(/\s{2,}/g, " ")
      .replace(/[*_]+/g, " ")
      .trim();

    if (description.length < 2) description = "Compra";

    transactions.push({
      date: date || new Date().toISOString().split("T")[0],
      description,
      amount,
      rawLine: line,
    });
  }

  return transactions;
}

/**
 * Convert a parsed invoice transaction into a natural language string
 * that the existing parseSmartInput() can process.
 */
export function transactionToSmartInput(tx: InvoiceTransaction): string {
  return `Gastei ${tx.amount.toFixed(2).replace(".", ",")} ${tx.description}`;
}
