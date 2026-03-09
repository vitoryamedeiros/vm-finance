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
