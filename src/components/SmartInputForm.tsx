"use client";

import { useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { processSmartInput } from "@/app/actions";
import { toast } from "sonner";

export function SmartInputForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      const result = await processSmartInput(formData);
      
      if (result.success) {
        toast.success(result.message || "Lançamento adicionado!");
        formRef.current?.reset();
      } else {
        toast.error(result.error || "Erro ao adicionar lançamento.");
      }
    });
  }

  return (
    <form ref={formRef} action={clientAction} className="relative mt-4 flex flex-col w-full max-w-3xl group">
      <div className="relative flex items-center w-full">
        <Input 
          name="smartInput"
          placeholder="Ex: Gastei 150 de gasolina no cartão nubank" 
          className="h-20 text-xl pl-6 pr-24 rounded-none disabled:opacity-50"
          autoComplete="off"
          disabled={isPending}
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="brutal" 
          className="absolute right-3 top-3 h-14 w-14 shrink-0 p-0"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={24} className="animate-spin -ml-1" />
          ) : (
            <Send size={24} strokeWidth={2.5} className="-ml-1" />
          )}
        </Button>
      </div>
    </form>
  );
}
