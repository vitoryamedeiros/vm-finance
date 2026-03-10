import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase as sb } from "@/lib/supabase/client";
import { generateInsights } from "@/lib/insights";
import { DashboardCharts } from "@/components/dashboard/Charts";
import { MonthPicker } from "@/components/dashboard/MonthPicker";
import { SmartInputForm } from "@/components/SmartInputForm";
import { ArrowUpRight, ArrowDownRight, Wallet, ReceiptText, Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { month, year } = await searchParams;
  
  const now = new Date();
  const filterMonth = Number(month) || now.getMonth() + 1;
  const filterYear = Number(year) || now.getFullYear();

  // Create date range for filtering
  const startDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(filterYear, filterMonth, 0).getDate();
  const endDate = `${filterYear}-${String(filterMonth).padStart(2, '0')}-${lastDay}`;
  
  const { data: incomesData } = await sb.from("incomes")
    .select("*")
    .gte('date', startDate)
    .lte('date', endDate)
    .order("date", { ascending: false });

  const { data: expensesData } = await sb.from("expenses")
    .select("*")
    .gte('date', startDate)
    .lte('date', endDate)
    .order("date", { ascending: false });

  const incomes = incomesData || [];
  const expenses = expensesData || [];

  const totalIncomes = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncomes - totalExpenses;

  const c6Invoice = expenses.filter(e => e.payment_method === 'C6Bank').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const nubankInvoice = expenses.filter(e => e.payment_method === 'NuBank').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const interInvoice = expenses.filter(e => e.payment_method === 'Inter').reduce((acc, curr) => acc + Number(curr.amount), 0);

  const { message: insightMessage, tags: insightTags } = generateInsights(expenses, incomes);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-primary selection:text-white pb-20">
      <Header />
      
      <div className="container mx-auto px-6 pt-12 max-w-7xl">
        {/* HERO SECTION */}
        <div className="mb-16 mt-10">
          <h1 className="text-6xl md:text-8xl font-heading uppercase leading-[0.85] tracking-tighter text-black mb-6">
            SEU CONTROLE <br />
            <span className="text-primary">INTELIGENTE.</span>
          </h1>
          <p className="text-xl font-medium opacity-70 max-w-2xl mb-10 leading-relaxed">
            Escreva o que você gastou ou recebeu em linguagem natural.<br />
            Nós organizamos o resto.
          </p>
          <div className="max-w-3xl">
            <SmartInputForm />
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* SALDO */}
          <div className="bg-primary text-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between min-h-[140px]">
             <div className="flex justify-between items-start border-b border-white/20 pb-2 mb-3">
                <span className="font-heading uppercase text-[10px] tracking-[0.2em] font-black">Saldo Atual</span>
                <Wallet className="w-4 h-4 opacity-80" />
             </div>
             <div className="text-4xl font-heading truncate">
               {formatCurrency(balance)}
             </div>
          </div>

          {/* RECEITAS */}
          <div className="bg-white text-black border-4 border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between min-h-[140px]">
             <div className="flex justify-between items-start border-b-2 border-black/5 pb-2 mb-3">
                <span className="font-heading uppercase text-[10px] tracking-[0.2em] opacity-60">Receitas</span>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
             </div>
             <div className="text-4xl font-heading truncate">
               {formatCurrency(totalIncomes)}
             </div>
          </div>

          {/* GASTOS */}
          <div className="bg-white text-black border-4 border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between min-h-[140px]">
             <div className="flex justify-between items-start border-b-2 border-black/5 pb-2 mb-3">
                <span className="font-heading uppercase text-[10px] tracking-[0.2em] opacity-60">Gastos</span>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
             </div>
             <div className="text-4xl font-heading truncate">
               {formatCurrency(totalExpenses)}
             </div>
          </div>

          {/* FATURAS */}
          <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between min-h-[140px]">
             <div className="flex justify-between items-start border-b border-white/20 pb-2 mb-3">
                <span className="font-heading uppercase text-[10px] tracking-[0.2em] opacity-60 font-black">Faturas</span>
                <ReceiptText className="w-4 h-4 text-primary" />
             </div>
             <div className="space-y-1.5 font-bold text-xs uppercase tracking-tighter">
               <div className="flex justify-between border-b border-white/5 pb-0.5"><span>NUBANK</span> <span className="font-heading text-sm">{formatCurrency(nubankInvoice)}</span></div>
               <div className="flex justify-between border-b border-white/5 pb-0.5"><span>C6BANK</span> <span className="font-heading text-sm">{formatCurrency(c6Invoice)}</span></div>
               <div className="flex justify-between text-primary font-black"><span>INTER</span> <span className="font-heading text-sm">{formatCurrency(interInvoice)}</span></div>
             </div>
          </div>
        </div>

        {/* FILTERS & STATUS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-t-4 border-black pt-10">
          <p className="text-lg font-bold uppercase tracking-tight text-black">
            Mostrando: <span className="text-[#D81176] font-black">{new Date(filterYear, filterMonth - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          </p>
          <MonthPicker />
        </div>

        {/* CHARTS */}
        <DashboardCharts expenses={expenses} incomes={incomes} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* TRANSACTIONS */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <ReceiptText className="text-primary w-10 h-10" />
              <h2 className="font-heading uppercase text-4xl text-black">Lançamentos</h2>
            </div>
            
            <div className="space-y-4">
              {[...expenses, ...incomes.map(i => ({...i, product: i.source, category: 'Receita', isIncome: true}))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item: any, idx) => (
                <div key={idx} className={`group flex flex-col md:flex-row md:items-center justify-between p-6 border-4 shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 ${item.isIncome ? 'bg-white text-black border-black' : 'bg-white text-black border-black/20'}`}>
                  <div className="flex gap-6 items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      <h4 className="font-heading text-xl uppercase tracking-tight">{item.product}</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="flex flex-col items-end">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 ${item.isIncome ? 'border-black text-black' : 'border-primary text-primary'}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold opacity-40 mt-1 uppercase leading-none">{item.payment_method || 'PIX/DINHEIRO'}</span>
                    </div>
                    <div className={`text-3xl font-heading ${item.isIncome ? 'text-black' : 'text-primary'}`}>
                      {item.isIncome ? '+' : '-'} {formatCurrency(Number(item.amount))}
                    </div>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && incomes.length === 0 && (
                <div className="p-20 text-center border-4 border-dashed border-black/20">
                  <p className="font-heading uppercase text-black/20 text-2xl tracking-widest">Sem movimentos</p>
                </div>
              )}
            </div>
          </div>

          {/* INSIGHTS */}
          <div className="space-y-8">
            <div className="bg-white text-black border-4 border-black p-6 shadow-[8px_8px_0_0_#000] sticky top-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-black rounded-full">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading uppercase text-2xl leading-[0.8] mb-1">Insight</h3>
                  <p className="text-primary italic text-lg font-bold uppercase tracking-tighter text-sm">Inteligente</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg font-black leading-tight border-l-4 border-primary pl-4 py-1">
                  {insightMessage}
                </p>
                <div className="flex flex-wrap gap-2">
                  {insightTags.map((tag, idx) => (
                    <span key={idx} className="bg-black text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
