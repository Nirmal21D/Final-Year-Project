"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Divider,
  Tag,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  useDisclosure,
  Alert,
  AlertIcon,
  Flex,
  Icon,
  VStack,
  HStack,
  Spinner,
  Center,
  AlertTitle,
  AlertDescription,
  Progress,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { Line as LineChart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { doc, getDoc, collection, query, where, getDocs, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiClock, FiDollarSign, FiPercent, FiTrendingUp, FiArrowLeft, FiArrowRight, FiAward, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import Headers from "@/components/Headers";
import Script from "next/script";
import jsPDF from "jspdf";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PlanDetails = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [relatedPlans, setRelatedPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const calculateSimilarity = (planA, planB) => {
    if (!planA.tags || !planB.tags) return 0;
    const intersection = planA.tags.filter((tag) => planB.tags.includes(tag));
    const union = [...new Set([...planA.tags, ...planB.tags])];
    return intersection.length / union.length;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchPlanAndRelated = async () => {
      try {
        const planDoc = await getDoc(doc(db, "investmentplans", planId));
        if (!planDoc.exists()) {
          toast({
            title: "Error",
            description: "Plan not found",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          router.push("/plans");
          return;
        }

        const currentPlan = { id: planDoc.id, ...planDoc.data() };
        setPlan(currentPlan);

        const plansQuery = query(
          collection(db, "investmentplans"),
          where("status", "==", "approved")
        );
        const querySnapshot = await getDocs(plansQuery);
        const allPlans = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.id !== planId);

        const plansWithScores = allPlans
          .map((p) => ({
            ...p,
            similarityScore: calculateSimilarity(currentPlan, p),
          }))
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, 3);

        setRelatedPlans(plansWithScores);
      } catch (error) {
        console.error("Error fetching plan:", error);
        toast({
          title: "Error",
          description: "Failed to load plan details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanAndRelated();
    }
  }, [planId, router, toast]);

  // Fix property inconsistency between minimumInvestment and minAmount
  const handleInvest = async () => {
    if (!investmentAmount) {
      toast({
        title: "Error",
        description: "Please enter an investment amount",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    // Use plan.minAmount consistently
    if (amount < plan.minAmount) {
      toast({
        title: "Error",
        description: `Minimum investment amount is ₹${plan.minAmount.toLocaleString()}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (amount > plan.maxAmount) {
      toast({
        title: "Error",
        description: `Maximum investment amount is ₹${plan.maxAmount.toLocaleString()}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Now proceed to payment
    handlePayment(amount);
  };

  // Improved payment handler with better error handling
const handlePayment = async (amount) => {
  try {
    // Close the investment modal before opening Razorpay
    onClose(); // Close the current modal first
    
    // Slight delay to ensure modal is fully closed before Razorpay opens
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate amount once more
    if (isNaN(amount) || amount < plan.minAmount || amount > plan.maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount between ₹${plan.minAmount.toLocaleString()} and ₹${plan.maxAmount.toLocaleString()}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Show loading toast
    toast({
      title: "Processing",
      description: "Setting up your payment...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    
    const response = await fetch("/api/process-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        input: "Investment Payment", 
        amount,
        planId: plan.id,
        planName: plan.planName 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment order");
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      // Try loading Razorpay script dynamically if not already loaded
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });
    }

    // Updated Razorpay options - removed prefill section
    const options = {
      key: "rzp_test_NJWnOpRjPVFmkA", // Test key
      amount: data.order.amount, // Amount in paise
      currency: "INR",
      name: "Investment in " + plan.planName,
      description: `${plan.investmentCategory} - Tenure: ${plan.tenure} months`,
      order_id: data.order.id,
      handler: async function (response) {
        try {
          // Verify payment on your backend (best practice)
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          const verifyData = await verifyResponse.json();
          
          // Update the payment handler to also update the plan document with investor details
          if (verifyResponse.ok && verifyData.verified) {
            toast({
              title: "Investment Successful",
              description: "Your investment has been processed successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            
            // Generate receipt and store investment info
            if (user) {
              try {
                const investmentId = `INV-${Date.now().toString().slice(-8)}`;
                const userDocRef = doc(db, "users", user.uid);
                const planDocRef = doc(db, "investmentplans", planId);
                const pdfBase64 = await generateReceiptPDF(user, plan, amount);
                
                // Add investment to user document
                await setDoc(userDocRef, {
                  investments: arrayUnion({
                    id: investmentId,
                    planId: planId,
                    amount: parseFloat(amount),
                    planName: plan.planName,
                    timestamp: new Date(),
                    interestRate: plan.interestRate,
                    tenure: plan.tenure,
                    category: plan.investmentCategory,
                    subcategory: plan.investmentSubCategory,
                    receiptId: investmentId,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    status: "active",
                    maturityDate: new Date(Date.now() + (plan.tenure * 30 * 24 * 60 * 60 * 1000)),
                    receipts: [pdfBase64] // Store PDF in base64 format
                  })
                }, { merge: true });
                
                // Also update the plan document to track investors
                await updateDoc(planDocRef, {
                  investors: arrayUnion({
                    userId: user.uid,
                    investmentId: investmentId,
                    amount: parseFloat(amount),
                    timestamp: new Date(),
                    userName: user.displayName || user.email,
                    status: "active",
                    paymentId: response.razorpay_payment_id
                  }),
                  totalInvestmentCount: (plan.totalInvestmentCount || 0) + 1,
                  totalInvestmentAmount: (plan.totalInvestmentAmount || 0) + parseFloat(amount)
                });
                
                // Navigate user to investment history/profile page
                setTimeout(() => {
                  router.push("/profile");
                }, 3000);
              } catch (error) {
                console.error("Error storing investment data:", error);
                // Still show success but log the error
                toast({
                  title: "Note",
                  description: "Investment successful but there was an issue with some records. Please contact support.",
                  status: "warning",
                  duration: 5000,
                  isClosable: true,
                });
              }
            }
          } else {
            throw new Error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast({
            title: "Verification Issue",
            description: "Your payment was received but we're having trouble verifying it. Please contact support.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      },
      notes: {
        plan_id: planId,
        plan_name: plan.planName,
        user_id: user?.uid || "guest",
      },
      theme: {
        color: "#3182CE",
      },
      modal: {
        escape: false,
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error initiating payment:", error);
    toast({
      title: "Payment Error",
      description: error.message || "We couldn't process your payment. Please try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

  // Enhanced PDF receipt generation with proper error handling
const generateReceiptPDF = async (user, plan, investmentAmount) => {
  try {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');
    
    // Add company logo or header
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Investment Receipt", 105, 20, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add receipt details
    doc.setFontSize(12);
    doc.text("RECEIPT DETAILS", 20, 40);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);
    
    doc.setFontSize(11);
    doc.text(`Receipt Number: INV-${Date.now().toString().slice(-8)}`, 20, 50);
    doc.text(`Date: ${currentDate} ${currentTime}`, 20, 58);
    
    // Investor details
    doc.setFontSize(12);
    doc.text("INVESTOR DETAILS", 20, 70);
    doc.setLineWidth(0.5);
    doc.line(20, 72, 190, 72);
    
    doc.setFontSize(11);
    doc.text(`Name: ${user.name || user.email || "Investor"}`, 20, 80);
    doc.text(`Email: ${user.email || "N/A"}`, 20, 88);
    doc.text(`User ID: ${user.uid}`, 20, 96);
    
    // Investment details
    doc.setFontSize(12);
    doc.text("INVESTMENT DETAILS", 20, 110);
    doc.setLineWidth(0.5);
    doc.line(20, 112, 190, 112);
    
    doc.setFontSize(11);
    doc.text(`Plan Name: ${plan.planName}`, 20, 120);
    doc.text(`Plan ID: ${plan.id}`, 20, 128);
    doc.text(`Category: ${plan.investmentCategory} - ${plan.investmentSubCategory}`, 20, 136);
    doc.text(`Interest Rate: ${plan.interestRate}%`, 20, 144);
    doc.text(`Tenure: ${plan.tenure} months`, 20, 152);
    
    // Payment details
    doc.setFontSize(12);
    doc.text("PAYMENT DETAILS", 20, 166);
    doc.setLineWidth(0.5);
    doc.line(20, 168, 190, 168);
    
    doc.setFontSize(11);
    doc.text(`Investment Amount: ₹${parseFloat(investmentAmount).toLocaleString('en-IN')}`, 20, 176);
    
    // Calculate expected returns (simple calculation)
    const monthlyRate = plan.interestRate / 100 / 12;
    const expectedReturn = parseFloat(investmentAmount) * (1 + monthlyRate * plan.tenure);
    
    doc.text(`Expected Returns: ₹${expectedReturn.toLocaleString('en-IN', {
      maximumFractionDigits: 2
    })}`, 20, 184);
    doc.text(`Maturity Date: ${new Date(Date.now() + (plan.tenure * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN')}`, 20, 192);
    
    // Footer
    doc.setFontSize(8);
    doc.text("This is a computer-generated receipt and does not require a physical signature.", 105, 280, { align: "center" });
    
    // Get PDF as base64
    const pdfOutput = doc.output('datauristring');
    return pdfOutput;
  } catch (error) {
    console.error("Error generating PDF receipt:", error);
    // Return a fallback simple receipt if PDF generation fails
    return `Receipt for ${plan.planName}, Amount: ₹${investmentAmount}, Date: ${new Date().toLocaleString()}`;
  }
};

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Box id="upper" position="fixed" top="0" left="0" right="0" zIndex="1000">
          <Headers />
        </Box>
        <Center minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
            <Text fontSize="lg">Loading plan details...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Box id="upper" position="fixed" top="0" left="0" right="0" zIndex="1000">
          <Headers />
        </Box>
        <Container maxW="container.xl" pt="20vh">
          <Alert status="error" variant="solid" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle fontSize="lg">Plan Not Found</AlertTitle>
              <AlertDescription>
                We couldn't find the investment plan you're looking for.
              </AlertDescription>
            </Box>
          </Alert>
          <Button 
            mt={6} 
            leftIcon={<Icon as={FiArrowLeft} />} 
            onClick={() => router.push("/plan1")}
          >
            Back to Plans
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      ></Script>
      <Box id="upper" position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>

      <Container maxW="container.xl" pt="20vh">
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <Box bg="white" p={8} borderRadius="xl" shadow="lg">
              <Stack spacing={6}>
                <Flex justify="space-between" align="center">
                  <Heading size="xl" color="#2C319F">{plan.planName}</Heading>
                  <Button 
                    leftIcon={<Icon as={FiArrowLeft} />} 
                    variant="outline" 
                    onClick={() => router.push("/plan1")}
                  >
                    Back to Plans
                  </Button>
                </Flex>
                
                <Wrap spacing={2}>
                  {plan.tags?.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag size="lg" colorScheme="blue" borderRadius="full">
                        {tag}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <Text fontSize="xl" color="gray.700" lineHeight="tall">
                  {plan.description}
                </Text>

                <Divider />

                <Heading size="md">Plan Highlights</Heading>
                <Grid templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}} gap={8}>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiPercent} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Interest Rate
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          {plan.interestRate}%
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiClock} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Tenure
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          {plan.tenure} months
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiDollarSign} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Minimum Investment
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          ₹{plan.minAmount?.toLocaleString()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiTrendingUp} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Maximum Investment
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          ₹{plan.maxAmount?.toLocaleString()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </Grid>
                
                {/* New CAGR and Risk Section */}
                <Grid templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}} gap={8}>
                  <Box p={6} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
                    <Heading size="md" mb={4}>Expected Returns</Heading>
                    <Box height="120px">
                      <LineChart
                        data={{
                          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 5', 'Year 10'],
                          datasets: [{
                            label: 'Growth of ₹10,000',
                            data: [
                              10000 * (1 + plan.interestRate/100),
                              10000 * Math.pow((1 + plan.interestRate/100), 2),
                              10000 * Math.pow((1 + plan.interestRate/100), 3),
                              10000 * Math.pow((1 + plan.interestRate/100), 5),
                              10000 * Math.pow((1 + plan.interestRate/100), 10)
                            ],
                            borderColor: '#3182CE',
                            backgroundColor: 'rgba(49, 130, 206, 0.1)',
                            tension: 0.4
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₹' + value.toLocaleString();
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                    <Text fontSize="sm" color="gray.500" mt={4}>
                      *Projected growth assumes reinvestment of returns at same rate
                    </Text>
                  </Box>
                  
                  <Box p={6} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
                    <Heading size="md" mb={4}>Risk Assessment</Heading>
                    
                    {/* Overall Risk Score with improved visualization */}
                    <Flex align="center" mb={6}>
                      <Box position="relative" width="100px" height="100px">
                        <CircularProgress
                          value={plan.riskLevel ? (plan.riskLevel / 5) * 100 : 50}
                          size="100px"
                          thickness="8px"
                          color={
                            plan.riskLevel <= 2 ? "green.400" : 
                            plan.riskLevel <= 3.5 ? "orange.400" : "red.400"
                          }
                          trackColor="gray.100"
                        >
                          <CircularProgressLabel fontWeight="bold" fontSize="xl">
                            {plan.riskLevel}
                          </CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                      <Box ml={5}>
                        <Heading size="sm" mb={1}>Risk Profile</Heading>
                        <Tag 
                          size="lg" 
                          colorScheme={
                            plan.riskLevel <= 2 ? "green" : 
                            plan.riskLevel <= 3.5 ? "orange" : "red"
                          }
                        >
                          {plan.riskLevel <= 2 ? "Low Risk" : 
                           plan.riskLevel <= 3.5 ? "Medium Risk" : "High Risk"}
                        </Tag>
                        <Text mt={2} fontSize="sm" color="gray.600">
                          {plan.riskLevel <= 2 
                            ? "Conservative options with steady returns"
                            : plan.riskLevel <= 3.5
                            ? "Balanced risk-return profile"
                            : "Aggressive growth with higher volatility"}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Risk Components Breakdown */}
                    <Box mb={5}>
                      <Text fontWeight="semibold" mb={2}>Risk Components</Text>
                      <Grid templateColumns="auto 1fr auto" gap={2} alignItems="center">
                        <Text fontSize="sm">Market Risk</Text>
                        <Progress 
                          value={Math.min(plan.riskLevel * 20, 100) - (plan.riskLevel <= 2 ? 10 : 0)} 
                          size="sm" 
                          colorScheme={plan.riskLevel <= 2 ? "green" : plan.riskLevel <= 3.5 ? "orange" : "red"}
                          borderRadius="full"
                        />
                        <Text fontSize="sm" fontWeight="medium">
                          {plan.riskLevel <= 2 ? "Low" : plan.riskLevel <= 3.5 ? "Medium" : "High"}
                        </Text>

                        <Text fontSize="sm">Liquidity Risk</Text>
                        <Progress 
                          value={(plan.tenure / 60) * 100} 
                          size="sm" 
                          colorScheme={plan.tenure <= 12 ? "green" : plan.tenure <= 36 ? "orange" : "red"}
                          borderRadius="full"
                        />
                        <Text fontSize="sm" fontWeight="medium">
                          {plan.tenure <= 12 ? "Low" : plan.tenure <= 36 ? "Medium" : "High"}
                        </Text>

                        <Text fontSize="sm">Volatility</Text>
                        <Progress 
                          value={Math.min((plan.riskLevel * 18) + (Math.random() * 10), 100)} 
                          size="sm" 
                          colorScheme={plan.riskLevel <= 2 ? "green" : plan.riskLevel <= 3.5 ? "orange" : "red"}
                          borderRadius="full"
                        />
                        <Text fontSize="sm" fontWeight="medium">
                          {plan.riskLevel <= 2 ? "Low" : plan.riskLevel <= 3.5 ? "Medium" : "High"}
                        </Text>
                      </Grid>
                    </Box>

                    {/* Risk-Reward Analysis */}
                    <Box mb={4}>
                      <Text fontWeight="semibold" mb={2}>Risk-Reward Analysis</Text>
                      <Flex align="center" justify="space-between" bg="gray.50" p={3} borderRadius="md">
                        <Box>
                          <Text fontSize="sm" color="gray.600">Risk Level</Text>
                          <Text fontWeight="bold">{plan.riskLevel}/5</Text>
                        </Box>
                        <Icon as={FiArrowRight} color="gray.400" />
                        <Box>
                          <Text fontSize="sm" color="gray.600">Expected Return</Text>
                          <Text fontWeight="bold" color="green.600">{plan.interestRate}%</Text>
                        </Box>
                        <Icon as={FiArrowRight} color="gray.400" />
                        <Box>
                          <Text fontSize="sm" color="gray.600">Risk-Return Ratio</Text>
                          <Text fontWeight="bold" color="blue.600">
                            {(plan.interestRate / plan.riskLevel).toFixed(2)}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>

                    {/* Risk Comparisons */}
                    <Box>
                      <Text fontWeight="semibold" mb={2}>Risk Context</Text>
                      <SimpleGrid columns={3} spacing={3}>
                        <Box p={2} bg="green.50" borderRadius="md" textAlign="center">
                          <Text fontSize="xs" color="gray.600">Savings Account</Text>
                          <Text fontSize="sm" fontWeight="bold">0.5-1</Text>
                        </Box>
                        <Box 
                          p={2} 
                          bg={plan.riskLevel <= 2 ? "green.100" : "green.50"} 
                          borderRadius="md" 
                          textAlign="center"
                          border={plan.riskLevel <= 2 ? "2px solid" : "none"}
                          borderColor="green.400"
                        >
                          <Text fontSize="xs" color="gray.600">Fixed Deposits</Text>
                          <Text fontSize="sm" fontWeight="bold">1-2</Text>
                        </Box>
                        <Box 
                          p={2} 
                          bg={plan.riskLevel > 2 && plan.riskLevel <= 3 ? "yellow.100" : "yellow.50"} 
                          borderRadius="md" 
                          textAlign="center"
                          border={plan.riskLevel > 2 && plan.riskLevel <= 3 ? "2px solid" : "none"}
                          borderColor="yellow.400"
                        >
                          <Text fontSize="xs" color="gray.600">Mutual Funds</Text>
                          <Text fontSize="sm" fontWeight="bold">2-3</Text>
                        </Box>
                        <Box 
                          p={2} 
                          bg={plan.riskLevel > 3 && plan.riskLevel <= 4 ? "orange.100" : "orange.50"} 
                          borderRadius="md" 
                          textAlign="center"
                          border={plan.riskLevel > 3 && plan.riskLevel <= 4 ? "2px solid" : "none"}
                          borderColor="orange.400"
                        >
                          <Text fontSize="xs" color="gray.600">Stocks</Text>
                          <Text fontSize="sm" fontWeight="bold">3-4</Text>
                        </Box>
                        <Box 
                          p={2} 
                          bg={plan.riskLevel > 4 ? "red.100" : "red.50"} 
                          borderRadius="md" 
                          textAlign="center"
                          border={plan.riskLevel > 4 ? "2px solid" : "none"}
                          borderColor="red.400"
                        >
                          <Text fontSize="xs" color="gray.600">Crypto</Text>
                          <Text fontSize="sm" fontWeight="bold">4-5</Text>
                        </Box>
                        <Box></Box>
                      </SimpleGrid>
                    </Box>

                    <Alert status="info" mt={4} borderRadius="md" size="sm">
                      <AlertIcon />
                      <Box fontSize="xs">
                        <AlertTitle fontSize="xs">Understand Your Risk</AlertTitle>
                        <AlertDescription fontSize="xs">
                          Higher risk investments may offer greater returns but also come with increased volatility.
                          Always consider your investment horizon and financial goals.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </Box>
                </Grid>

                <Divider />

                <Heading size="md">Plan Details</Heading>
                <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
                  <Text fontSize="md" color="gray.700">
                    <strong>Investment Category:</strong>{" "}
                    {plan.investmentCategory}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Investment SubCategory:</strong>{" "}
                    {plan.investmentSubCategory}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Plan Type:</strong> {plan.planType}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Tax Benefits:</strong> {plan.taxBenefits || "Standard taxation applies"}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Created At:</strong>{" "}
                    {new Date(plan.createdAt.toDate()).toLocaleDateString()}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    <strong>Last Updated:</strong>{" "}
                    {new Date(plan.lastUpdated.toDate()).toLocaleDateString()}
                  </Text>
                </SimpleGrid>
                
                {/* Add a FAQ section if you have plan-specific FAQs */}
                <Divider />
                
                <Heading size="md">Terms & Conditions</Heading>
                <Text fontSize="md" color="gray.600">
                  By investing in this plan, you agree to the terms and conditions of {plan.planName}. 
                  Early withdrawals may be subject to penalties. Returns are subject to market conditions.
                  Please read all scheme related documents carefully.
                </Text>
                
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={onOpen}
                  height="16"
                  fontSize="lg"
                  leftIcon={<Icon as={FiDollarSign} />}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Invest Now
                </Button>
              </Stack>
            </Box>
          </GridItem>

          <GridItem>
            <Box bg="white" p={6} borderRadius="xl" shadow="lg">
              <Heading size="md" mb={6}>
                Similar Investment Plans
              </Heading>
              <Stack spacing={4}>
                {relatedPlans.map((relatedPlan) => (
                  <Box
                    key={relatedPlan.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => router.push(`/plan1/${relatedPlan.id}`)}
                    _hover={{
                      bg: "blue.50",
                      transform: "translateY(-2px)",
                      boxShadow: "md",
                    }}
                    transition="all 0.2s"
                  >
                    <Text fontWeight="bold" fontSize="lg" mb={2}>
                      {relatedPlan.planName}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                      {relatedPlan.description}
                    </Text>
                    <Flex justify="space-between" align="center">
                      <HStack spacing={1} color="blue.600">
                        <Icon as={FiPercent} />
                        <Text fontSize="sm" fontWeight="semibold">
                          {relatedPlan.interestRate}%
                        </Text>
                      </HStack>
                      <HStack spacing={1} color="blue.600">
                        <Icon as={FiClock} />
                        <Text fontSize="sm" fontWeight="semibold">
                          {relatedPlan.tenure} months
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </Box>
          </GridItem>
        </Grid>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="2xl">Invest in {plan.planName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Alert status="info" mb={6} borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">Investment Limits:</Text>
                  <Text fontSize="sm">
                    Minimum: ₹{plan.minAmount?.toLocaleString()}
                    <br />
                    Maximum: ₹{plan.maxAmount?.toLocaleString()}
                  </Text>
                </VStack>
              </Alert>

              <FormControl>
                <FormLabel fontSize="lg">Investment Amount (₹)</FormLabel>
                <NumberInput
                  min={plan.minAmount}
                  max={plan.maxAmount}
                  value={investmentAmount}
                  onChange={(value) => setInvestmentAmount(value)}
                  size="lg"
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              {/* Returns Calculator */}
              {investmentAmount && parseFloat(investmentAmount) >= plan.minAmount && (
                <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                  <Text fontWeight="bold" mb={3}>Investment Calculator</Text>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">Principal Amount</Text>
                      <Text fontWeight="bold" fontSize="lg">₹{parseFloat(investmentAmount).toLocaleString()}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">Interest Rate</Text>
                      <Text fontWeight="bold" fontSize="lg">{plan.interestRate}% p.a.</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">Tenure</Text>
                      <Text fontWeight="bold" fontSize="lg">{plan.tenure} months</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">Maturity Date</Text>
                      <Text fontWeight="bold" fontSize="lg">
                        {new Date(Date.now() + (plan.tenure * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Grid>
                  
                  <Divider my={3} />
                  
                  <Box>
                    <Text fontWeight="medium" fontSize="sm">Expected Returns at Maturity</Text>
                    <Text fontWeight="bold" color="green.600" fontSize="xl">
                      ₹{(parseFloat(investmentAmount) * (1 + (plan.interestRate / 100 / 12) * plan.tenure)).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </Text>
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      *Returns are indicative and subject to market conditions
                    </Text>
                  </Box>
                </Box>
              )}

              <Button
                colorScheme="blue"
                size="lg"
                mt={6}
                width="full"
                onClick={handleInvest} // Using the fixed handleInvest function
                height="16"
                fontSize="lg"
                isDisabled={!investmentAmount || parseFloat(investmentAmount) < plan.minAmount || parseFloat(investmentAmount) > plan.maxAmount}
              >
                Confirm Investment
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default PlanDetails;
