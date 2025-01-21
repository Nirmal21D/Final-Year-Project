import { NextResponse } from 'next/server';

export async function POST(req) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json(
      { message: 'Input is required' },
      { status: 400 }
    );
  }

  try {
    // Simulate AI processing
    const aiResponse = await processAIInput(input);

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Error processing input:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function processAIInput(input) {



  return input.split('').reverse().join('');
}
