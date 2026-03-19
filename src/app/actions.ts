"use server";

import { revalidatePath } from "next/cache";
import { parseSmartInput } from "@/lib/parser";
import { supabase } from "@/lib/supabase/client";

export async function processSmartInput(formData: FormData) {
  const input = formData.get("smartInput") as string;
  
  if (!input) {
    return { success: false, error: "Entrada vazia." };
  }

  const result = parseSmartInput(input);

  if (!result.success) {
    return result;
  }

  const { data } = result;

  try {
    if (data.type === "receita") {
      const { error } = await supabase.from("incomes").insert([
        {
          source: data.source,
          amount: data.amount,
          status: data.status,
          date: data.date,
          notes: data.notes,
        },
      ]);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("expenses").insert([
        {
          product: data.product,
          amount: data.amount,
          category: data.category,
          payment_method: data.paymentMethod,
          installment: data.installment,
          date: data.date,
          notes: data.notes,
        },
      ]);
      if (error) throw error;
    }

    revalidatePath("/");
    return { success: true, message: "Adicionado com sucesso!" };
  } catch (error: any) {
    console.error("Supabase Error:", error);
    return { success: false, error: "Erro ao salvar no banco de dados." };
  }
}

export async function processBatchTransactions(inputs: string[]) {
  if (!inputs || inputs.length === 0) {
    return { success: false, error: "Nenhuma transação para processar." };
  }

  let successCount = 0;
  const errors: string[] = [];

  for (const input of inputs) {
    const result = parseSmartInput(input);
    if (!result.success) {
      errors.push(`"${input.slice(0, 30)}...": ${result.error}`);
      continue;
    }

    const { data } = result;

    try {
      if (data.type === "receita") {
        const { error } = await supabase.from("incomes").insert([
          {
            source: data.source,
            amount: data.amount,
            status: data.status,
            date: data.date,
            notes: data.notes,
          },
        ]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("expenses").insert([
          {
            product: data.product,
            amount: data.amount,
            category: data.category,
            payment_method: data.paymentMethod,
            installment: data.installment,
            date: data.date,
            notes: data.notes,
          },
        ]);
        if (error) throw error;
      }
      successCount++;
    } catch (err: any) {
      errors.push(`"${input.slice(0, 30)}...": ${err.message || "Erro DB"}`);
    }
  }

  revalidatePath("/");

  if (successCount === 0) {
    return { success: false, error: `Nenhum lançamento registrado. Erros: ${errors.join("; ")}` };
  }

  return {
    success: true,
    count: successCount,
    message: `${successCount} lançamento(s) registrado(s) com sucesso!${errors.length > 0 ? ` (${errors.length} erro(s))` : ""}`,
  };
}
