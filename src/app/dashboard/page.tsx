import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SmartInputForm } from "@/components/SmartInputForm";
import { ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from "lucide-react";
import { supabase as sb } from "@/lib/supabase/client";
import { generateInsights } from "@/lib/insights";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  
  const { data: incomesData } = await sb.from("incomes").select("*").order("date", { ascending: false });
  const { data: expensesData } = await sb.from("expenses").select("*").order("date", { ascending: false });

  const incomes = incomesData || [];
  const expenses = expensesData || [];

  const totalIncomes = incomes.filter(i => i.status === "Pago").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const currentBalance = totalIncomes - totalExpenses;

  const c6Invoice = expenses.filter(e => e.payment_method === "C6Bank").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const nubankInvoice = expenses.filter(e => e.payment_method === "NuBank").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const interInvoice = expenses.filter(e => e.payment_method === "Inter").reduce((acc, curr) => acc + Number(curr.amount), 0);

  const { message: insightMessage, tags: insightTags } = generateInsights(expenses, incomes);

  const allTransactions = [
    ...incomes.map(i => ({ ...i, isIncome: true })),
    ...expenses.map(e => ({ ...e, isIncome: false }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary selection:text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
        
        {/* HERO / SMART INPUT SECTION */}
        <section className="flex flex-col gap-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading text-foreground uppercase tracking-tighter leading-[0.85] text-balance">
            Seu Controle <span className="text-primary block">Inteligente.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl text-foreground/80 mt-4 leading-relaxed">
            Escreva o que você gastou ou recebeu em linguagem natural. Nós organizamos o resto.
          </p>
          
          <SmartInputForm />
        </section>

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          
          <Card className="bg-primary text-white border-primary border-4 shadow-[4px_4px_0_0_#111]">
            <CardHeader className="border-white/20 pb-2">
              <CardDescription className="text-white/80 text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                Saldo Atual <Wallet size={18} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl lg:text-5xl xl:text-6xl font-heading leading-none tracking-tighter mt-2 truncate">
                {formatCurrency(currentBalance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-foreground/10 pb-2">
              <CardDescription className="text-foreground/60 text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                Receitas <ArrowUpRight size={18} className="text-green-600" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl lg:text-4xl xl:text-5xl font-heading leading-none tracking-tighter mt-2 truncate">
                {formatCurrency(totalIncomes)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-foreground/10 pb-2">
              <CardDescription className="text-foreground/60 text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                Gastos <ArrowDownRight size={18} className="text-red-600" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl lg:text-4xl xl:text-5xl font-heading leading-none tracking-tighter mt-2 truncate">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-foreground text-white border-foreground border-4">
            <CardHeader className="border-white/20 pb-2">
              <CardDescription className="text-white/60 text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                Faturas <CreditCard size={18} />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                <span className="font-bold text-sm">NUBANK</span>
                <span className="font-heading text-xl tracking-tight text-right w-full">{formatCurrency(nubankInvoice)}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/10 pb-2 pt-1">
                <span className="font-bold text-sm">C6BANK</span>
                <span className="font-heading text-xl tracking-tight text-right w-full">{formatCurrency(c6Invoice)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1 text-orange-400">
                <span className="font-bold text-sm">INTER</span>
                <span className="font-heading text-xl tracking-tight text-right w-full">{formatCurrency(interInvoice)}</span>
              </div>
            </CardContent>
          </Card>

        </section>

        {/* LOWER SECTION: INSIGHTS & TRANSACTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 items-start">
          
          <div className="lg:col-span-1">
             <Card className="bg-muted border-none shadow-none rounded-none relative overflow-hidden h-full min-h-[300px]">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary blur-3xl opacity-10 transform translate-x-10 -translate-y-10 rounded-full pointer-events-none" />
               <CardHeader className="border-none pb-0 relative z-10 w-full">
                 <CardTitle className="text-3xl flex items-center gap-2">
                   Insights <span className="text-primary text-4xl leading-0 pt-2">*</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 pt-4 flex flex-col justify-between h-full">
                 <p className="font-medium text-lg leading-relaxed text-foreground/90">
                   {insightMessage}
                 </p>
                 <div className="mt-8 flex flex-wrap gap-2">
                   {insightTags.map((tag, idx) => (
                     <span key={idx} className="bg-foreground text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
                       {tag}
                     </span>
                   ))}
                 </div>
               </CardContent>
             </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-4xl font-heading uppercase tracking-tighter mb-6">Últimos Lançamentos</h2>
            <div className="flex flex-col space-y-4">
              {allTransactions.length === 0 && (
                <div className="p-8 text-center text-muted-foreground font-medium border-4 border-dashed border-border">
                  Nenhum lançamento recente.
                </div>
              )}
              {allTransactions.map((tx: any) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 bg-white shadow-sm hover:translate-x-1 transition-transform border-l-[6px] border-y-4 border-r-4 ${tx.isIncome ? 'border-primary' : 'border-foreground'}`}>
                  <div>
                    <h4 className="font-bold text-lg">{tx.isIncome ? tx.source : tx.product}</h4>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[11px] mt-1">
                      {tx.isIncome ? `Receita • ${tx.status}` : `${tx.category} • ${tx.payment_method}`}
                    </p>
                  </div>
                  <div className={`font-heading text-2xl md:text-3xl ${tx.isIncome ? 'text-primary' : 'text-foreground'}`}>
                    {tx.isIncome ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
