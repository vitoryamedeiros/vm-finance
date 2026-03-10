import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const incomes = [
  { source: "Salário", amount: 1251.92, status: "Recebido", date: "2026-03-05" },
  { source: "Salário", amount: 1200.00, status: "Recebido", date: "2026-03-05" },
  { source: "Terceiros", amount: 16.00, status: "Recebido", date: "2026-03-10" },
  { source: "Terceiros", amount: 107.00, status: "Recebido", date: "2026-03-10" },
  { source: "Terceiros", amount: 106.39, status: "Recebido", date: "2026-03-10" },
  { source: "Terceiros", amount: 69.82, status: "Recebido", date: "2026-03-10" },
]

const expenses = [
  { product: "Parcelas da Moto", amount: 872.83, category: "Motu", payment_method: "Pix", installment: "2/48", date: "2026-03-01" },
  { product: "Seguro da Moto", amount: 132.55, category: "Motu", payment_method: "C6Bank", installment: "2/10", date: "2026-03-01" },
  { product: "Gasosa SBM", amount: 16.00, category: "Motu", payment_method: "Pix", installment: "Mensal", date: "2026-03-02" },
  { product: "Gasosa SBM", amount: 250.00, category: "Motu", payment_method: "Pix", installment: "Mensal", date: "2026-03-03" },
  { product: "Gasosa SBM/ inter", amount: 50.00, category: "Motu", payment_method: "Inter", installment: "Unica", date: "2026-03-04" },
  { product: "Revisão 1000km", amount: 59.95, category: "Motu", payment_method: "NuBank", installment: "1/2", date: "2026-03-05" },
  { product: "Slider Sandim", amount: 100.27, category: "Motu", payment_method: "NuBank", installment: "1/3", date: "2026-03-06" },
  { product: "Academia", amount: 99.90, category: "Autocuidado", payment_method: "C6Bank", installment: "FIXO", date: "2026-03-07" },
  { product: "Shein", amount: 59.14, category: "memimei", payment_method: "NuBank", installment: "2/3", date: "2026-03-08" },
  { product: "Cabelo", amount: 91.51, category: "Autocuidado", payment_method: "NuBank", installment: "Unica", date: "2026-03-09" },
  { product: "Renner/Reveillon", amount: 89.95, category: "memimei", payment_method: "C6Bank", installment: "2/2", date: "2026-03-10" },
  { product: "Shein", amount: 104.55, category: "memimei", payment_method: "C6Bank", installment: "2/2", date: "2026-03-11" },
  { product: "Uber", amount: 91.49, category: "Transporte", payment_method: "Inter", installment: "Unica", date: "2026-03-12" },
  { product: "Presente Theus", amount: 66.87, category: "Autocuidado", payment_method: "NuBank", installment: "1/2", date: "2026-03-13" },
  { product: "IPVA", amount: 50.97, category: "Motu", payment_method: "Pix", installment: "Unica", date: "2026-03-14" },
  { product: "Torta ficr", amount: 14.00, category: "Alimentação", payment_method: "Inter", installment: "Unica", date: "2026-03-15" },
  { product: "remedio de bento", amount: 106.39, category: "Gastos de Terceiros", payment_method: "Inter", installment: "Unica", date: "2026-03-16" },
  { product: "Aniv mae", amount: 107.00, category: "Gastos de Terceiros", payment_method: "Inter", installment: "Unica", date: "2026-03-17" },
  { product: "Cine Theus", amount: 48.00, category: "memimei", payment_method: "Inter", installment: "Unica", date: "2026-03-18" },
  { product: "Mix Matheus", amount: 69.82, category: "Gastos de Terceiros", payment_method: "Inter", installment: "Unica", date: "2026-03-19" },
  { product: "Aomosso", amount: 17.00, category: "Gastos de Terceiros", payment_method: "Inter", installment: "Unica", date: "2026-03-20" },
  { product: "Gasosa FEV SBM/ inter", amount: 50.00, category: "Gastos de Terceiros", payment_method: "Inter", installment: "Unica", date: "2026-03-21" },
]

async function runImport() {
  console.log("🚀 Iniciando importação de dados da planilha...")

  // Insert Incomes
  const { error: incomeError } = await supabase.from('incomes').insert(incomes)
  if (incomeError) {
    console.error("❌ Erro ao importar receitas:", incomeError)
  } else {
    console.log("✅ Receitas importadas com sucesso!")
  }

  // Insert Expenses
  const { error: expenseError } = await supabase.from('expenses').insert(expenses)
  if (expenseError) {
    console.error("❌ Erro ao importar despesas:", expenseError)
  } else {
    console.log("✅ Despesas importadas com sucesso!")
  }

  console.log("🏁 Importação finalizada.")
}

runImport()
