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
} from "@chakra-ui/react";
import { doc, getDoc, collection, query, where, getDocs, setDoc, arrayUnion  } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiClock, FiDollarSign, FiPercent, FiTrendingUp } from "react-icons/fi";
import Headers from "@/components/Headers";
import Script from "next/script";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation


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
    const intersection = planA.tags.filter(tag => planB.tags.includes(tag));
    const union = [...new Set([...planA.tags, ...planB.tags])];
    return intersection.length / union.length;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/login');
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
          router.push('/plans');
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
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== planId);

        const plansWithScores = allPlans.map(p => ({
          ...p,
          similarityScore: calculateSimilarity(currentPlan, p)
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
    if (amount < plan.minimumInvestment) {
      toast({
        title: "Error",
        description: `Minimum investment amount is ${plan.minimumInvestment}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Investment request submitted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose(); // Close the modal after investment is confirmed
  };

  const handlePayment = async (amount) => {
    try {
      const response = await fetch('/api/process-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: 'Investment Payment', amount }),
      });

      const data = await response.json();

      if (response.ok) {
        const options = {
          key: "rzp_test_NJWnOpRjPVFmkA", // Replace with your Razorpay key
          amount: data.order.amount, // Amount in paise
          currency: "INR",
          name: "Investment",
          description: "Investment Payment",
          order_id: data.order.id, // Use the order ID returned from the server
          handler: async function (response) {
            console.log(response);
            toast({
              title: "Success",
              description: "Payment successful",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            // Store investment info in user database
            if (user) {
              const userDocRef = doc(db, "users", user.uid);
              const pdfBase64 = await generateReceiptPDF(user, plan, investmentAmount);
              await setDoc(userDocRef, {
                investments: arrayUnion({
                  planId: planId,
                  amount: parseFloat(investmentAmount),
                  planName: plan.planName,
                  timestamp: new Date(),
                  receipts: [pdfBase64] // Store PDF in base64 format
                })
              }, { merge: true });
              
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        // Check if Razorpay is loaded before creating an instance
        if (window.Razorpay) {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          throw new Error("Razorpay SDK not loaded");
        }
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const generateReceiptPDF = async (user, plan, investmentAmount) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Investment Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`User Name: ${user.name}`, 20, 40);
    doc.text(`User Email: ${user.email}`, 20, 50);
    doc.text(`Plan Name: ${plan.planName}`, 20, 60);
    doc.text(`Investment Amount: ₹${investmentAmount}`, 20, 70);
    doc.text(`Investment Date: ${new Date().toLocaleString()}`, 20, 80);
    
    const pdfOutput = doc.output('datauristring'); // Get PDF as base64
    return pdfOutput; // Return base64 string
  };

  if (loading) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text fontSize="xl">Loading...</Text>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text fontSize="xl">Plan not found</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Script 
      type ="text/javascript"
      src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <Headers />

      <Container maxW="container.xl" py={4}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <Box bg="white" p={8} borderRadius="xl" shadow="lg">
              <Stack spacing={6}>
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

                <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiPercent} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Interest Rate</Text>
                        <Text fontSize="xl" color="blue.600">{plan.interestRate}%</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiClock} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Tenure</Text>
                        <Text fontSize="xl" color="blue.600">{plan.tenure} months</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiDollarSign} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Minimum Investment</Text>
                        <Text fontSize="xl" color="blue.600">₹{plan.minimumInvestment}</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiTrendingUp} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Maximum Investment</Text>
                        <Text fontSize="xl" color="blue.600">₹{plan.maxAmount}</Text>
                      </Box>
                    </HStack>
                  </Box>
                </Grid>

                <Divider />

                <Text fontSize="lg" color="gray.700">
                  <strong>Investment Category:</strong> {plan.investmentCategory}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Investment SubCategory:</strong> {plan.investmentSubCategory}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Plan Type:</strong> {plan.planType}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Created At:</strong> {plan.createdAt.toDate().toString()}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Last Updated:</strong> {plan.lastUpdated.toDate().toString()}
                </Text>

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={onOpen}
                  height="16"
                  fontSize="lg"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Invest Now
                </Button>
              </Stack>
            </Box>
          </GridItem>

          <GridItem>
            <Box bg="white" p={6} borderRadius="xl" shadow="lg">
              <Heading size="md" mb={6}>Similar Investment Plans</Heading>
              <Stack spacing={4}>
                {relatedPlans.map((relatedPlan) => (
                  <Box 
                    key={relatedPlan.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => router.push(`/plans/${relatedPlan.id}`)}
                    _hover={{ 
                      bg: "blue.50",
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    }}
                    transition="all 0.2s"
                  >
                    <Text fontWeight="bold" fontSize="lg" mb={2}>{relatedPlan.planName}</Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                      {relatedPlan.description}
                    </Text>
                    <Flex justify="space-between" align="center">
                      <HStack spacing={1} color="blue.600">
                        <Icon as={FiPercent} />
                        <Text fontSize="sm" fontWeight="semibold">{relatedPlan.interestRate}%</Text>
                      </HStack>
                      <HStack spacing={1} color="blue.600">
                        <Icon as={FiClock} />
                        <Text fontSize="sm" fontWeight="semibold">{relatedPlan.tenure} months</Text>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </Box>
          </GridItem>
        </Grid>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
                    Minimum: ₹{plan.minAmount}
                    <br />
                    Maximum: ₹{plan.maxAmount}
                  </Text>
                </VStack>
              </Alert>
              
              <FormControl>
                <FormLabel fontSize="lg">Investment Amount (₹)</FormLabel>
                <NumberInput
                  min={plan.minimumInvestment}
                  max={plan.maxAmount}
                  value={investmentAmount}
                  onChange={(value) => setInvestmentAmount(value)}
                  size="lg"
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <Button
                colorScheme="blue"
                size="lg"
                mt={6}
                width="full"
                onClick={() => {
                  handlePayment(parseFloat(investmentAmount));
                  onClose(); // Close the modal after payment is initiated
                }}
                height="16"
                fontSize="lg"
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