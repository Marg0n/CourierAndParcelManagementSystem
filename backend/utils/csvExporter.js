import { Parser } from "json2csv";

export function exportParcelsToCSV(parcels, res) {
  const parser = new Parser();
  const csv = parser.parse(parcels);
  res.attachment("parcels.csv").send(csv);
}
