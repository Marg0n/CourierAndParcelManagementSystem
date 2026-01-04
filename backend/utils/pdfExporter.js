import PDFDocument from "pdfkit";
import fs from "fs";

export function generateAgentParcelPDF(parcels, res, agentEmail) {
  //! full PDF logic here
}

export const exportToPDF = (data, fileName) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(fileName));

  doc.fontSize(16).text("Report", { align: "center" });
  doc.moveDown();

  data.forEach((item) => {
    doc.fontSize(12).text(JSON.stringify(item));
    doc.moveDown();
  });

  doc.end();
  return fileName;
};
