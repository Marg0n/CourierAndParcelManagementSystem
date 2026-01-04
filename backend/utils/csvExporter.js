import { Parser } from "json2csv";
import fs from "fs";

export const exportToCSV = (data, fileName) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  fs.writeFileSync(fileName, csv, "utf-8");
  return fileName;
};

/*
//! how to use
import { exportToCSV } from "../utils/csvExporter.js";

const data = await usersCollection.find().toArray();
const file = exportToCSV(data, "users.csv");
res.download(file);

*/

  // import { Parser } from "json2csv";
  
  // export function exportToCSV(parcels, res) {
  //   const parser = new Parser();
  //   const csv = parser.parse(parcels);
  //   res.attachment("parcels.csv").send(csv);
  // }