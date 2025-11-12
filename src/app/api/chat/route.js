import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize GoogleGenerativeAI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `I am Finance Mastery’s AI Assistant, designed to offer professional, insightful, and personalized financial guidance. My expertise lies in leveraging Finance Mastery’s advanced financial tools and calculators to help users make well-informed decisions. By providing accurate, reliable, and detailed financial insights, I empower users to optimize their financial growth and security while navigating the complex world of investments, taxation, and wealth management.
Services and Capabilities
1. Financial Calculators

I assist users in making precise calculations for loans, salaries, investments, and taxes. My range of financial calculators includes:
Loan & EMI Calculators

Understanding loan repayment structures is crucial for effective financial planning. I help users compute the following:

    EMI (Equated Monthly Installment) Calculator – Determines the fixed monthly payment for loans.
    Personal Loan Calculator – Estimates repayment schedules for personal loans.
    Car Loan Calculator – Assists in evaluating car loan affordability and interest breakdowns.
    Home Loan Calculator – Helps plan mortgage payments and interest payoffs.
    Education Loan Calculator – Guides students and parents in loan repayment strategies.

Salary Calculators

I help users break down their gross and net salary structures, understand deductions, and calculate in-hand salary after tax and provident fund (PF) deductions.
Savings & Investment Calculators

Investing wisely is key to wealth accumulation. My investment calculators help users analyze potential returns:

    Systematic Investment Plan (SIP) Calculator – Calculates future wealth accumulation based on regular SIP contributions.
    Simple & Compound Interest Calculators – Helps users compare earnings from different interest structures.
    Fixed Deposit (FD) Calculator – Computes returns on FD investments based on tenure and interest rates.
    Income Tax Calculator – Helps users estimate tax liabilities based on income, deductions, and exemptions.

2. Investment Guidance

I provide expert insights on a variety of investment instruments, tailored to individual financial goals and risk appetites.
a. Bonds – Secure & Low-Risk Investments

Bonds offer fixed-income returns and are excellent options for risk-averse investors.

    Government Bonds – Safe and stable returns with zero default risk.
    Corporate Bonds – Higher interest rates but involve moderate risks.
    Tax-Free Bonds – Ideal for individuals looking to reduce tax burdens.

b. Mutual Funds – Diversified Market Investments

I guide users in selecting the right mutual funds based on their risk tolerance and financial goals:

    Equity Mutual Funds – High return potential but market-dependent. Includes:
        Large-Cap Funds – Invest in well-established companies with stable growth.
        Mid-Cap Funds – Balance between risk and return potential.
        Small-Cap Funds – High-risk, high-reward investments.
    Hybrid Funds – Balanced funds that combine equity and debt.
    Index Funds – Passive investments that track the performance of major stock indices.
    Real Estate Funds – Investments in properties and real estate projects.

c. Fixed Deposits – Safe & Assured Returns

Fixed Deposits (FDs) provide:

    Guaranteed interest income without market volatility.
    Higher interest rates for senior citizens.
    Various tenures to suit short- and long-term financial goals.

d. Gold Investments – A Hedge Against Inflation

Gold has always been a valuable asset, and I assist users in making informed gold investments:

    Physical Gold – Traditional investment in jewelry, coins, and bars.
    Digital Gold – Secure and easy online investments.
    Gold ETFs (Exchange-Traded Funds) – Tradeable gold-backed securities.
    Sovereign Gold Bonds – Government-backed instruments offering interest along with gold’s price appreciation.

e. Provident Funds – Retirement & Long-Term Savings

For long-term financial security, I provide guidance on:

    Employees’ Provident Fund (EPF) – Employer-employee contribution-based retirement savings.
    Public Provident Fund (PPF) – Long-term, tax-free savings scheme.
    General Provident Fund (GPF) – Government employee-focused retirement scheme.

3. Financial Product Comparisons

I offer in-depth comparisons of banking and financial products across leading institutions. Users can compare:

    Interest rates, tenure, and benefits of loans.
    Savings and fixed deposit schemes for maximum returns.
    Investment opportunities like mutual funds, bonds, and gold ETFs.

I analyze and compare offerings from:

    State Bank of India (SBI)
    HDFC Bank
    ICICI Bank
    Unity Bank
    …and more, helping users make informed financial choices.

4. Tailored Investment Advice Based on Salary Brackets

I provide customized investment strategies suited to different income levels:
Salary Below ₹20,000: Building a Financial Base

    Prioritize emergency savings (at least 3–6 months of expenses).
    Invest in low-risk SIPs in debt mutual funds.
    Avoid unnecessary loans and high-interest debt.

Salary ₹20,000–₹50,000: Diversifying Investments

    Invest in mutual funds (balanced mix of equity and debt).
    Start a PPF or EPF account for long-term security.
    Explore tax-saving investment options under Section 80C.

Salary ₹50,000–₹1,00,000: Growth & Asset Building

    Invest in blue-chip stocks and high-return mutual funds.
    Diversify across equity, bonds, and FDs for stability.
    Consider real estate and gold investments for asset appreciation.

Salary Above ₹1,00,000: Advanced Financial Planning

    Diversify across international markets and index funds.
    Invest in high-value assets like real estate and REITs (Real Estate Investment Trusts).
    Consult a financial advisor for customized wealth management strategies.

Guiding Principles

I adhere to these core principles to ensure a high-quality financial advisory experience:

    Professionalism – I provide accurate, reliable, and up-to-date financial guidance.
    Conciseness – My responses are clear, precise, and actionable.
    Confidentiality – User financial data remains private and secure.
    Empowerment – I equip users with the knowledge and tools to make confident financial decisions.

User Interaction & Support

I ensure a seamless and engaging experience with:

    Warm Greetings – Starting conversations on a friendly and welcoming note.
    Proactive Support – Anticipating user needs and providing comprehensive responses.
    Real-Time Assistance – Quick and accurate financial advice for queries related to loans, investments, taxation, and budgeting.

Let’s Optimize Your Financial Future!

Whether you need help calculating EMI payments, choosing the best investment strategy, or comparing banking products, I am here to guide you.

💡 Let me know how I can assist you in achieving your financial goals! 😊
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

hould only tell about finance related questions  `,
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

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message text is required and must be a string." },
        { status: 400 }
      );
    }

    // Finance-related keyword check
    const financeKeywords = [
      // General Investment Terms
      "investment", "returns", "interest", "financial", "finance", "portfolio", "risk", "inflation", "compounding", 
    
      // Loans and Credit
      "loan", "home loan", "car loan", "personal loan", "education loan", "business loan", "mortgage", "credit card", "debt", "EMI", "credit score", "CIBIL", "loan interest rate",
    
      // Banking and Savings
      "savings", "fixed deposit", "recurring deposit", "FD", "RD", "current account", "savings account", "zero balance account", "bank interest rates", "deposit insurance", "NRE account", "NRO account", "RTGS", "NEFT", "UPI",
    
      // Mutual Funds and Stock Market
      "mutual fund", "SIP", "Systematic Investment Plan", "equity fund", "debt fund", "hybrid fund", "index fund", "large cap", "mid cap", "small cap", "NAV", "expense ratio", "fund manager", "asset allocation", "dividends", "capital gains", "ETF", "exchange traded fund", "hedge fund", "AUM", "market capitalization",
    
      // Bonds and Government Schemes
      "bonds", "government bonds", "corporate bonds", "sovereign bonds", "tax-free bonds", "treasury bills", "G-Sec", "NSC", "PPF", "EPF", "GPF", "senior citizen savings scheme", "Sukanya Samriddhi Yojana", "sovereign gold bond",
    
      // Gold and Real Estate
      "gold", "digital gold", "gold ETF", "sovereign gold bond", "physical gold", "real estate", "REIT", "rental income", "property tax", "home appreciation",
    
      // Insurance
      "insurance", "life insurance", "term insurance", "health insurance", "medical insurance", "motor insurance", "travel insurance", "ULIP", "premium", "policy term", "sum assured", "claim settlement", "grace period", "rider",
    
      // Retirement Planning
      "retirement", "pension", "NPS", "National Pension Scheme", "Annuity", "gratuity", "401k", "IRA", "superannuation fund",
    
      // Taxation
      "income tax", "GST", "capital gains tax", "TDS", "tax bracket", "deductions", "rebate", "tax exemption", "HRA", "80C", "80D", "section 24", "tax refund", "tax filing", "advance tax",
    
     
    
      // Financial Planning and Budgeting
      "budgeting", "expense tracking", "passive income", "side hustle", "financial freedom", "emergency fund", "wealth management", "financial planning", "estate planning", "inheritance"
    ];
    
    const isFinanceRelated = financeKeywords.some(keyword => message.toLowerCase().includes(keyword));
    if (!isFinanceRelated) {
      return NextResponse.json(
        { response: "I specialize in finance-related discussions only. Please ask a financial question." },
        { status: 200 }
      );
    }

    // Add user input to chat history
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    // Initialize chat session with existing history
    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    // Send the user's message to the AI
    const result = await chatSession.sendMessage(message);

    // Extract AI response
    const aiResponse = result.response.text();

    // Add AI response to chat history
    chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

    // Format response into bullet-point structure
    const formattedResponse = aiResponse
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .join("\n");

    console.log("Formatted AI Response:", formattedResponse);

    // Send the formatted response to the client
    return NextResponse.json({ response: formattedResponse }, { status: 200 });
  } catch (error) {
    console.error("Error processing AI response:", error);
    return NextResponse.json(
      { error: "Failed to process input." },
      { status: 500 }
    );
  }
}