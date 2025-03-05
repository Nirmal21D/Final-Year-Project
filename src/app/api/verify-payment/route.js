import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({
        verified: false,
        message: "Missing required parameters"
      }, { status: 400 });
    }
    
    // Get secret key from environment variable
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET environment variable not set");
      return NextResponse.json({
        verified: false,
        message: "Server configuration error"
      }, { status: 500 });
    }
    
    // Verification logic
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");
    
    // Compare signatures
    const isAuthentic = digest === razorpay_signature;
    
    if (isAuthentic) {
      return NextResponse.json({
        verified: true,
        message: "Payment verified successfully"
      });
    } else {
      return NextResponse.json({
        verified: false,
        message: "Invalid signature"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({
      verified: false,
      message: "Payment verification failed",
      error: error.message
    }, { status: 500 });
  }
}