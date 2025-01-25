import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_NJWnOpRjPVFmkA', // Replace with your Razorpay key ID
  key_secret: 'PoEGvuA244aGEQAPE9mJ4NNB', // Replace with your Razorpay key secret
});

export async function POST(req) {
  const { amount } = await req.json();
  
  if ( !amount) {
    return NextResponse.json(
      { message: 'Input and amount are required' },
      { status: 400 }
    );
  }

  try {
    // Create a new order with Razorpay
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
      payment_capture: 1, // Automatically capture payment
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.log('Error processing input:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function processAIInput(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  return input.split('').reverse().join('');
}
