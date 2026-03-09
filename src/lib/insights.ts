import { ExpenseData, IncomeData } from "./parser";

export function generateInsights(expenses: any[], incomes: any[]): { message: string, tags: string[] } {
  if (expenses.length === 0 && incomes.length === 0) {
    return {
      message: "Seu controle está em branco. Comece mandando o primeiro gasto ou receita pelo chat acima.",
      tags: ["Tudo zerado"]
    };
  }

  if (expenses.length === 0) {
    return {
      message: "Receitas registradas, mas nenhum gasto no radar ainda. O bolso agradece, por enquanto.",
      tags: ["Só lucro"]
    };
  }

  // Calculate category totals
  const categoryTotals: Record<string, number> = {};
  let totalExpenses = 0;
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    totalExpenses += Number(e.amount);
  });

  // Find dominant category
  let topCategory = "";
  let topAmount = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topAmount) {
      topAmount = amt;
      topCategory = cat;
    }
  }

  const isDominant = topAmount > (totalExpenses * 0.4);

  const tags: string[] = [];
  let message = "";

  if (topCategory === "Alimentação") {
    message = "Segura a emoção no delivery, a fatura já está fazendo cosplay de aluguel. A categoria Alimentação dominou seus gastos ultimamente.";
    tags.push("⚠️ Cuidado com iFood");
  } else if (topCategory === "Transporte") {
    message = "Esse mês a categoria Transporte está te cobrando pedágio emocional. Muito Uber/Gasolina registrado.";
    tags.push("🚗 Pé no freio");
  } else if (topCategory === "Desnecessário") {
    message = "Os gastos desnecessários tomaram conta. A fatura não perdoa as comprinhas na emoção.";
    tags.push("🚨 Fatura em risco");
  } else if (topCategory === "Autocuidado" && topAmount > 300) {
    message = "O autocuidado está em dia, mas o bolso está sofrendo o impacto.";
    tags.push("💅 Muito chique");
  } else if (topCategory === "memimei") {
    message = "Muitos mimos pra você mesmo(a). Cuidado para não mimar demais e faltar pro básico.";
    tags.push("🎁 Eu mereço?");
  } else {
    message = `Seus gastos estão distribuídos. A maior parcela no momento é: ${topCategory}.`;
    if (totalExpenses > 3000) {
      tags.push("💸 Alto volume");
    } else {
      tags.push("📊 Sob controle");
    }
  }

  return { message, tags };
}
