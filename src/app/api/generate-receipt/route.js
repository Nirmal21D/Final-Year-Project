import { db } from "@/firebase"; // Ensure you have access to your Firestore database
import { doc as firestoreDoc, setDoc, getDoc } from "firebase/firestore"; // Renamed to avoid conflict
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export async function POST(req) {
  // Read the request body once
  const body = await req.json();
  console.log("Received request:", req.method, body);
  
  const { userId, planId, amount, planName, timestamp } = body;

  if (!userId || !planId || !amount || !planName || !timestamp) {
    return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
  }

  try {
    // Fetch complete plan data
    const planDoc = await getDoc(firestoreDoc(db, "plans", planId));
    const planData = planDoc.exists() ? planDoc.data() : null;

    if (!planData) {
      return new Response(JSON.stringify({ message: "Plan not found" }), { status: 404 });
    }

    // Create a PDF document
    const pdfDoc = new PDFDocument(); // Renamed to avoid conflict
    const buffers = [];

    // Capture the PDF data in a buffer
    pdfDoc.on('data', buffers.push.bind(buffers));
    pdfDoc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      const base64PDF = pdfData.toString('base64');

      // Store the receipt in Firestore
      const receiptData = {
        userId,
        planId,
        amount,
        planName,
        timestamp,
        receiptPDF: base64PDF, // Store the PDF in base64 format
      };

      const receiptDocRef = firestoreDoc(db, "receipts", `${userId}_${planId}_${timestamp}`);
      await setDoc(receiptDocRef, receiptData);

      return new Response(JSON.stringify({ message: "Receipt generated successfully", receipt: receiptData }), { status: 200 });
    });

    // PDF content
    pdfDoc.fontSize(25).text('Receipt', { align: 'center' });
    pdfDoc.moveDown();
    pdfDoc.fontSize(16).text(`User ID: ${userId}`);
    pdfDoc.text(`Plan ID: ${planId}`);
    pdfDoc.text(`Plan Name: ${planName}`);
    pdfDoc.text(`Amount: ₹${amount}`);
    pdfDoc.text(`Status: Paid`); // Show as paid on receipt
    pdfDoc.text(`Timestamp: ${new Date(timestamp).toLocaleString()}`);
    
    // Include complete plan data
    pdfDoc.moveDown();
    pdfDoc.fontSize(18).text('Plan Details:', { underline: true });
    Object.entries(planData).forEach(([key, value]) => {
      pdfDoc.fontSize(16).text(`${key}: ${value}`);
    });

    pdfDoc.end(); // Finalize the PDF and end the stream
  } catch (error) {
    console.error("Error generating receipt:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};