import { jsPDF } from "jspdf";
import type { PlanOutputs } from "@/types/plan";

const SECTION_GAP = 10;

export function exportPlanToPdf(name: string, outputs: PlanOutputs) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let cursorY = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`AI Life Organizer – ${name}`, pageWidth / 2, cursorY, { align: "center" });
  cursorY += SECTION_GAP * 2;

  const sections: Array<{ title: string; text: string }> = [
    { title: "Plan financiero", text: outputs.finanzas },
    { title: "Hábitos esenciales", text: outputs.habitos },
    { title: "Horario sugerido", text: outputs.horario },
    { title: "Prioridades próximos 7 días", text: outputs.sieteDias },
  ];

  sections.forEach(({ title, text }) => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, cursorY);
    cursorY += SECTION_GAP;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 14 + SECTION_GAP;

    if (cursorY > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      cursorY = margin;
    }
  });

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  doc.save(`plan-${slug || "organizer"}.pdf`);
}
