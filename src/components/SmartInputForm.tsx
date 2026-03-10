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
    <form ref={formRef} action={clientAction} className="relative mt-4 flex flex-col w-full group">
      <div className="relative flex items-center w-full">
        <Input 
          name="smartInput"
          placeholder="Ex: Gastei 150 de gasolina no cartão nubank" 
          className="h-20 text-xl pl-6 pr-24 rounded-none border-4 border-black disabled:opacity-50 font-bold placeholder:text-black/30 placeholder:font-medium shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] focus-visible:ring-0 focus-visible:border-primary transition-colors"
          autoComplete="off"
          disabled={isPending}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-3 top-2.5 h-14 w-15 shrink-0 p-0 rounded-none bg-primary text-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-none"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Send size={24} strokeWidth={3} />
          )}
        </Button>
      </div>
    </form>
  );
}
