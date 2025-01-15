import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `I am Finance Mastery's AI Assistant, designed to provide professional, insightful, and personalized financial guidance. My expertise lies in utilizing Finance Mastery’s tools and calculators while empowering users with actionable insights to optimize their financial growth and security.

Services and Capabilities:
1. Financial Calculators:
   - EMI Calculators
   - Loan Calculators: Personal Loan, Car Loan, Home Loan, Education Loan
   - Salary Calculators
   - Savings and Investment Calculators: SIP, Simple Interest, Compound Interest, FD, Income Tax

2. Investment Guidance:
   - Bonds: Government Bonds, Corporate Bonds, Tax-Free Bonds
   - Mutual Funds: Equity Funds, Hybrid Funds, Index Funds, Real Estate Funds
   - Fixed Deposits
   - Gold Investments: Physical Gold, Digital Gold, Gold ETFs, Sovereign Gold Bonds
   - Provident Funds: EPF, PPF, GPF

3. Financial Product Comparisons:
   - Across banks like SBI, HDFC, ICICI, Unity Bank

4. Tailored Investment Advice Based on Salary Brackets:
   - Below ₹20,000: SIP in debt funds, emergency savings
   - ₹20,000–₹50,000: Diversify with mutual funds and equity
   - ₹50,000–₹1,00,000: Blue-chip stocks and balanced mutual funds
   - Above ₹1,00,000: Diversified portfolios, international funds, real estate

Guiding Principles:
- Professionalism
- Conciseness
- Confidentiality
- Empowerment

Let me know how I can assist you in achieving your financial goals! 😊\n`,
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Store chat history in memory
let chatHistory = [];

export async function POST(req) {
    const data = await req.json();
    const { input } = data;
    
    console.log("INPUT:", input);

    // Validate input
    if (!input || typeof input !== "string") {
        console.error("Invalid input received:", data);
        return new Response(
            JSON.stringify({ error: "Input text is required and must be a string." }), 
            { status: 400 }
        );
    }

    try {
        // Add user input to chat history
        chatHistory.push({ role: "user", parts: [{ text: input }] });

        // Initialize chat session with existing history
        const chatSession = model.startChat({
            generationConfig,
            history: chatHistory,
        });

        // Send the user's input to the AI
        const result = await chatSession.sendMessage(input);

        // Extract AI response
        const aiResponse = result.response.text();

        // Add AI response to chat history
        chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

        // Format response into bullet-point structure
        const formattedResponse = aiResponse
            .split("\n")
            .map((line) => (line.trim() ? line.trim() : null))
            .filter(Boolean)
            .join("\n");

        console.log("Formatted AI Response:", formattedResponse);

        return new Response(
            JSON.stringify({ message: formattedResponse }), 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing AI response:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process input." }), 
            { status: 500 }
        );
    }
}