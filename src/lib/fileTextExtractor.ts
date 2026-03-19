import * as pdfjsLib from "pdfjs-dist";

// Use local worker copy (copied from node_modules/pdfjs-dist/build/ to public/)
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export interface ExtractionResult {
  text: string;
  confidence?: number;
  source: "pdf" | "ocr";
}

/**
 * Extract text from a PDF file using pdfjs-dist
 */
async function extractTextFromPDF(file: File): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    pages.push(pageText);
  }

  return {
    text: pages.join("\n"),
    source: "pdf",
  };
}

/**
 * Extract text from an image file using Tesseract.js OCR
 */
async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ExtractionResult> {
  // Dynamic import to avoid SSR issues
  const Tesseract = await import("tesseract.js");

  const imageUrl = URL.createObjectURL(file);

  try {
    const result = await Tesseract.recognize(imageUrl, "por", {
      logger: (m: any) => {
        if (m.status === "recognizing text" && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });

    return {
      text: result.data.text,
      confidence: result.data.confidence,
      source: "ocr",
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

const PDF_TYPES = ["application/pdf"];
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

/**
 * Determine file type and extract text accordingly
 */
export async function extractTextFromFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ExtractionResult> {
  if (PDF_TYPES.includes(file.type)) {
    return extractTextFromPDF(file);
  }

  if (IMAGE_TYPES.includes(file.type) || file.type.startsWith("image/")) {
    return extractTextFromImage(file, onProgress);
  }

  throw new Error(
    `Tipo de arquivo não suportado: ${file.type}. Use PDF ou imagens (PNG, JPG, WEBP).`
  );
}
