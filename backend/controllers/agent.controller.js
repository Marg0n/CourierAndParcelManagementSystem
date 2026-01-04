import { parcelsCollection } from "../db/mongo.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import stream from "stream";
import { ObjectId } from "mongodb";

//* Get assigned parcels
export const getAssignedParcels = async (req, res) => {
  try {
    const email = req.decoded.email;
    const parcels = await parcelsCollection.find({ agentEmail: email }).toArray();
    res.send(parcels);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

//* Update parcel status
export const updateParcelStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["Picked Up", "In Transit", "Delivered", "Failed"];

  if (!allowedStatuses.includes(status)) return res.status(400).send({ message: "Invalid status" });

  const result = await parcelsCollection.updateOne(
    { _id: new ObjectId(id), agentEmail: req.decoded.email },
    { $set: { status } }
  );

  res.send(result);
};

//* Update parcel location
export const updateParcelLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;
    const timestamp = new Date();

    const result = await parcelsCollection.updateOne(
      { _id: new ObjectId(id), agentEmail: req.decoded.email },
      { $set: { currentLocation: { lat, lng } }, $push: { trackingHistory: { lat, lng, timestamp } } }
    );

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

//* Export parcels as CSV
export const exportParcelsCSV = async (req, res) => {
  try {
    const email = req.decoded.email;
    const parcels = await parcelsCollection.find({ agentEmail: email }).toArray();

    if (!parcels.length) return res.status(404).send({ message: "No parcels to export" });

    const fields = [
      "customerEmail","contact","pickupAddress","deliveryAddress","deliveryDate",
      "parcelType","size","paymentType","price","status","agentEmail","deliveryInstructions","barcode","createdAt"
    ];
    const csv = new Parser({ fields }).parse(parcels);

    res.header("Content-Type", "text/csv");
    res.attachment("parcels.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "CSV export failed" });
  }
};

//* Export parcels as PDF
export const exportParcelsPDF = async (req, res) => {
  try {
    const email = req.decoded.email;
    const parcels = await parcelsCollection.find({ agentEmail: email }).toArray();

    if (!parcels.length) return res.status(404).send({ message: "No parcels assigned" });

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const bufferStream = new stream.PassThrough();
    res.setHeader("Content-Disposition", "attachment; filename=parcels.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(bufferStream);
    bufferStream.pipe(res);

    doc.fontSize(18).text(`Parcels Assigned to: ${email}`, { align: "center" }).moveDown(2);
    // ... (table drawing can remain the same as before)
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "PDF export failed" });
  }
};
/*
import { parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import stream from "stream";

export const getAssignedParcels = async (req, res) => {
    try {
        const email = req.decoded.email;
        const parcels = await parcelsCollection.find({ agentEmail: email }).toArray();
        res.json(parcels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateParcelStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["Picked Up", "In Transit", "Delivered", "Failed"];
        if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

        const result = await parcelsCollection.updateOne(
            { _id: new ObjectId(id), agentEmail: req.decoded.email },
            { $set: { status } }
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateCurrentLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lng } = req.body;

        const locationUpdate = { lat, lng, timestamp: new Date() };

        const result = await parcelsCollection.updateOne(
            { _id: new ObjectId(id), agentEmail: req.decoded.email },
            { $set: { currentLocation: { lat, lng } }, $push: { trackingHistory: locationUpdate } }
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const exportCSV = async (req, res) => {
    try {
        const email = req.decoded.email;
        const parcels = await parcelsCollection.find({ agentEmail: email }).toArray();

        if (!parcels.length) return res.status(404).json({ message: "No parcels found" });

        const fields = ["customerEmail","contact","pickupAddress","deliveryAddress","deliveryDate","parcelType","size","paymentType","price","status","agentEmail","deliveryInstructions","barcode","createdAt"];
        const parser = new Parser({ fields });
        const csv = parser.parse(parcels);

        res.header("Content-Type", "text/csv");
        res.attachment("parcels.csv");
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "CSV export failed" });
    }
};

export const exportPDF = async (req, res) => {
    try {
        const email = req.decoded.email;
        const parcels = await parcelsCollection.find({ agentEmail: email }).toArray();
        if (!parcels.length) return res.status(404).json({ message: "No parcels found" });

        const doc = new PDFDocument({ margin: 40, size: "A4" });
        const bufferStream = new stream.PassThrough();
        res.setHeader("Content-Disposition", "attachment; filename=parcels.pdf");
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(bufferStream);
        bufferStream.pipe(res);

        doc.fontSize(18).text(`Parcels Assigned to: ${email}`, { align: "center" }).moveDown(2);

        // You can keep table drawing logic here like before
        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "PDF export failed" });
    }
};

*/