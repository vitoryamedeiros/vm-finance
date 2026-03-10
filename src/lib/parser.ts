import { z } from "zod";

// --- SCHEMAS ---
export const IncomeSchema = z.object({
  type: z.literal("receita"),
  source: z.string().min(1, "Fonte é obrigatória"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  status: z.enum(["Pago", "Pendente"]).default("Pago"),
  date: z.string().default(() => new Date().toISOString().split("T")[0]),
  notes: z.string().optional(),
});

export const ExpenseSchema = z.object({
  type: z.literal("gasto"),
  product: z.string().min(1, "Nome do produto/serviço é obrigatório"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória"),
  paymentMethod: z.string().min(1, "Forma de pagamento é obrigatória"),
  installment: z.string().default("Única"),
  date: z.string().default(() => new Date().toISOString().split("T")[0]),
  notes: z.string().optional(),
});

export type IncomeData = z.infer<typeof IncomeSchema>;
export type ExpenseData = z.infer<typeof ExpenseSchema>;
export type ParsedResult = { success: true; data: IncomeData | ExpenseData } | { success: false; error: string };

// --- DICTIONARIES & REGEX ---
const INCOME_KEYWORDS = ["recebi", "ganhei", "salário", "salario", "transferência", "pagamento", "freela", "receita"];
const EXPENSE_KEYWORDS = ["gastei", "comprei", "paguei", "compra", "uber", "ifood", "gasolina", "custo", "pagar"];

const CATEGORY_MAP: Record<string, string[]> = {
  "Alimentação": ["ifood", "mc", "bk", "hamburguer", "pizza", "mercado", "supermercado", "comida", "lanche", "padaria", "zeca", "restaurante"],
  "Transporte": ["uber", "99", "gasolina", "posto", "passagem", "ônibus", "metro", "estacionamento", "pedágio"],
  "Motu": ["motu", "moto", "manutenção", "óleo"],
  "Autocuidado": ["farmácia", "remédio", "skincare", "cabelo", "barbearia", "salão", "shampoo", "creme"],
  "memimei": ["memimei", "presente", "roupa", "tênis", "sapato", "jogo", "ps5", "steam", "cinema", "ingresso", "show"],
  "Desnecessário": ["besteira", "doce", "sorvete", "açai", "chopp", "cerveja", "bar", "balada"],
};

const PAYMENT_METHODS: Record<string, string[]> = {
  "Pix": ["pix"],
  "C6Bank": ["c6", "c6bank"],
  "NuBank": ["nubank", "nu", "roxinho", "cartão"], // Default to NuBank if 'cartão'
  "Inter": ["inter", "banco inter", "laranjinha"],
};

// --- PARSER LOGIC ---
export function parseSmartInput(input: string): ParsedResult {
  if (!input || input.trim() === "") {
    return { success: false, error: "Digite algo para registrar." };
  }

  const normalized = input.toLowerCase();

  // 1. Extract Amount
  const amountMatch = normalized.match(/(?:r\$?|R\$?)?\s?(\d+(?:[.,]\d{1,2})?)/);
  if (!amountMatch) {
    return { success: false, error: "Não consegui identificar o valor. Tente colocar um número, como '150' ou 'R$ 50,00'." };
  }
  const amountStr = amountMatch[1].replace(",", ".");
  const amount = parseFloat(amountStr);

  // 2. Determine Type (Income vs Expense)
  let isIncome = false;
  if (INCOME_KEYWORDS.some(kw => normalized.includes(kw))) {
    isIncome = true;
  }

  // Generate today's date
  const today = new Date().toISOString().split("T")[0];

  if (isIncome) {
    // Determine source
    let source = "Terceiros";
    if (normalized.includes("salário") || normalized.includes("salario")) source = "Salário";
    if (normalized.includes("freela")) source = "Freela";

    const data = {
      type: "receita",
      source,
      amount,
      status: "Pago",
      date: today,
      notes: input,
    };

    const parsed = IncomeSchema.safeParse(data);
    if (parsed.success) return { success: true, data: parsed.data };
    return { success: false, error: parsed.error.issues[0].message };
  } else {
    // Determine Expense specifics
    
    // Payment Method
    let paymentMethod = "NuBank"; // Default fallback
    for (const [method, keywords] of Object.entries(PAYMENT_METHODS)) {
      if (keywords.some(kw => normalized.includes(kw))) {
        paymentMethod = method;
        break;
      }
    }

    // Category
    let category = "Desnecessário"; // Default fallback
    for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
      if (keywords.some(kw => normalized.includes(kw))) {
        category = cat;
        break;
      }
    }

    // Product guess (remove value, keywords)
    let product = input.replace(amountMatch[0], "").trim();
    if (product.length < 3) product = "Compra";
    
    // Optional installment extraction
    let installment = "Única";
    const instMatch = normalized.match(/em (\d+)\s?(?:x|vezes|parcelas)/);
    if (instMatch) {
        installment = `1/${instMatch[1]}`;
    }

    const data = {
      type: "gasto",
      product,
      amount,
      category,
      paymentMethod,
      installment,
      date: today,
      notes: input,
    };

    const parsed = ExpenseSchema.safeParse(data);
    if (parsed.success) return { success: true, data: parsed.data };
    return { success: false, error: parsed.error.issues[0].message };
  }
}
