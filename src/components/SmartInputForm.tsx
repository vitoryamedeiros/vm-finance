"use client";

import { useTransition, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Paperclip, X, Check, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { processSmartInput, processBatchTransactions } from "@/app/actions";
import { toast } from "sonner";
import { extractTextFromFile, type ExtractionResult } from "@/lib/fileTextExtractor";
import { parseInvoiceText, transactionToSmartInput, type InvoiceTransaction } from "@/lib/invoiceParser";

interface PendingTransaction extends InvoiceTransaction {
  id: string;
  selected: boolean;
  smartInput: string;
}

export function SmartInputForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Attachment states
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionSource, setExtractionSource] = useState<"pdf" | "ocr" | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [rawExtractedText, setRawExtractedText] = useState("");
  const [showRawText, setShowRawText] = useState(false);
  const [fileName, setFileName] = useState("");

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

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);
    setExtractionProgress(0);
    setPendingTransactions([]);
    setRawExtractedText("");

    try {
      const result: ExtractionResult = await extractTextFromFile(file, (p) => {
        setExtractionProgress(p);
      });

      setExtractionSource(result.source);
      setRawExtractedText(result.text);

      // Parse invoice lines
      const transactions = parseInvoiceText(result.text);

      if (transactions.length === 0) {
        toast.warning("Nenhuma transação encontrada no arquivo. Verifique o texto extraído.");
        setShowRawText(true);
      } else {
        toast.success(`${transactions.length} transação(ões) encontrada(s)!`);
      }

      const pending: PendingTransaction[] = transactions.map((tx, idx) => ({
        ...tx,
        id: `tx-${idx}-${Date.now()}`,
        selected: true,
        smartInput: transactionToSmartInput(tx),
      }));

      setPendingTransactions(pending);
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar arquivo.");
    } finally {
      setIsExtracting(false);
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const toggleTransaction = (id: string) => {
    setPendingTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, selected: !tx.selected } : tx))
    );
  };

  const removeTransaction = (id: string) => {
    setPendingTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const updateTransactionText = (id: string, newText: string) => {
    setPendingTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, smartInput: newText } : tx))
    );
  };

  const handleBatchSubmit = () => {
    const selected = pendingTransactions.filter((tx) => tx.selected);
    if (selected.length === 0) {
      toast.error("Selecione pelo menos uma transação.");
      return;
    }

    startTransition(async () => {
      const inputs = selected.map((tx) => tx.smartInput);
      const result = await processBatchTransactions(inputs);

      if (result.success) {
        toast.success(result.message || `${result.count} lançamentos registrados!`);
        setPendingTransactions([]);
        setRawExtractedText("");
        setFileName("");
        setShowRawText(false);
      } else {
        toast.error(result.error || "Erro ao registrar lançamentos.");
      }
    });
  };

  const clearAttachment = () => {
    setPendingTransactions([]);
    setRawExtractedText("");
    setFileName("");
    setShowRawText(false);
    setExtractionSource(null);
  };

  const selectedCount = pendingTransactions.filter((tx) => tx.selected).length;

  return (
    <div className="w-full space-y-4">
      <form ref={formRef} action={clientAction} className="relative mt-4 flex flex-col w-full group">
        <div className="relative flex items-center w-full">
          {/* Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending || isExtracting}
            className="absolute left-3 top-2.5 h-14 w-12 shrink-0 p-0 flex items-center justify-center text-black/40 hover:text-primary transition-colors disabled:opacity-30 z-10"
            title="Anexar fatura (PDF ou imagem)"
          >
            <Paperclip size={22} strokeWidth={2.5} />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />

          <Input 
            name="smartInput"
            placeholder="Ex: Gastei 150 de gasolina no cartão nubank" 
            className="h-20 text-xl pl-16 pr-24 rounded-none border-4 border-black disabled:opacity-50 font-bold placeholder:text-black/30 placeholder:font-medium shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] focus-visible:ring-0 focus-visible:border-primary transition-colors"
            autoComplete="off"
            disabled={isPending || isExtracting}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-3 top-2.5 h-14 w-15 shrink-0 p-0 rounded-none bg-primary text-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-none"
            disabled={isPending || isExtracting}
          >
            {isPending ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Send size={24} strokeWidth={3} />
            )}
          </Button>
        </div>
      </form>

      {/* Extraction Progress */}
      {isExtracting && (
        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_#000] space-y-3">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="font-bold text-sm uppercase tracking-wide">
              {extractionSource === "ocr" ? "Lendo imagem com OCR..." : "Extraindo texto do PDF..."}
            </span>
          </div>
          {extractionSource === "ocr" && (
            <div className="w-full bg-black/10 h-3 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
                style={{ width: `${extractionProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* File Indicator */}
      {fileName && !isExtracting && (
        <div className="flex items-center gap-3 px-4 py-3 bg-black/5 border-2 border-black/10">
          {extractionSource === "pdf" ? (
            <FileText size={16} className="text-primary shrink-0" />
          ) : (
            <ImageIcon size={16} className="text-primary shrink-0" />
          )}
          <span className="text-sm font-bold truncate flex-1">{fileName}</span>
          {rawExtractedText && (
            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline shrink-0"
            >
              {showRawText ? "Esconder texto" : "Ver texto bruto"}
            </button>
          )}
          <button
            type="button"
            onClick={clearAttachment}
            className="text-black/40 hover:text-red-600 transition-colors shrink-0"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Raw Extracted Text */}
      {showRawText && rawExtractedText && (
        <div className="border-4 border-black/10 bg-black/5 p-4 max-h-48 overflow-y-auto">
          <pre className="text-xs font-mono whitespace-pre-wrap break-words text-black/70">
            {rawExtractedText}
          </pre>
        </div>
      )}

      {/* Pending Transactions List */}
      {pendingTransactions.length > 0 && (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0_0_#000] overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-5 py-3 flex items-center justify-between">
            <span className="font-heading uppercase text-sm tracking-wide">
              {pendingTransactions.length} transações encontradas
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              {selectedCount} selecionadas
            </span>
          </div>

          {/* Transaction items */}
          <div className="divide-y-2 divide-black/5 max-h-80 overflow-y-auto">
            {pendingTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-start gap-3 px-5 py-3 transition-colors ${
                  tx.selected ? "bg-white" : "bg-black/5 opacity-50"
                }`}
              >
                {/* Select checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTransaction(tx.id)}
                  className={`mt-1 w-6 h-6 shrink-0 border-2 flex items-center justify-center transition-all ${
                    tx.selected
                      ? "bg-primary border-primary text-white"
                      : "border-black/20 text-transparent hover:border-black/40"
                  }`}
                >
                  <Check size={14} strokeWidth={3} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {tx.date && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 shrink-0">
                        {tx.date.split("-").reverse().join("/")}
                      </span>
                    )}
                    <span className="font-heading text-lg truncate">
                      R$ {tx.amount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={tx.smartInput}
                    onChange={(e) => updateTransactionText(tx.id, e.target.value)}
                    className="w-full text-sm font-medium bg-transparent border-b border-dashed border-black/10 focus:border-primary outline-none py-1 transition-colors"
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeTransaction(tx.id)}
                  className="mt-1 text-black/20 hover:text-red-600 transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="border-t-4 border-black px-5 py-4 flex items-center justify-between gap-4 bg-black/[0.02]">
            <button
              type="button"
              onClick={clearAttachment}
              className="text-sm font-bold uppercase tracking-wide text-black/40 hover:text-red-600 transition-colors"
            >
              Cancelar
            </button>
            <Button
              type="button"
              onClick={handleBatchSubmit}
              disabled={isPending || selectedCount === 0}
              className="h-12 px-8 rounded-none bg-primary text-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:shadow-none font-heading uppercase text-sm tracking-wide gap-2"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Check size={18} strokeWidth={3} />
                  Registrar {selectedCount > 1 ? `${selectedCount} lançamentos` : "lançamento"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
