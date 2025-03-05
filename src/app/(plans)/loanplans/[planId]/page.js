"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Text,
  Stack,
  Divider,
  Tag,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
  useToast,
  Icon,
  VStack,
  HStack,
  Heading,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Table,
  Tbody,
  Tr,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  NumberInput,
  NumberInputField,
  FormLabel,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  Select,
  Checkbox,
  FormErrorMessage,
  Progress,
  Textarea,
  FormHelperText,
  Link,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiClock, FiDollarSign, FiPercent, FiTrendingUp, FiArrowLeft, FiCheck, FiShield, FiSend, FiArrowRight } from "react-icons/fi";
import Headers from "@/components/Headers";

const LoanPlanDetails = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanAmount, setLoanAmount] = useState(null);
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    purpose: "",
    loanAmount: null,
    income: "",
    employmentType: "Salaried",
    employmentDuration: "",
    companyName: "",
    designation: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    existingLoans: "No",
    existingEmi: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    panCard: "",
    aadhaarNumber: "",
    agreeTerms: false,
    agreeDataSharing: false
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  // Add this to your state declarations
  const [applicationStep, setApplicationStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  // Calculate EMI function
  const calculateEMI = (principal, interestRate, tenureMonths) => {
    if (!principal || !interestRate || !tenureMonths) return 0;
    
    const monthlyRate = interestRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    return isNaN(emi) || !isFinite(emi) ? 0 : emi;
  };

  // Handle application form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Enhanced validation function
  const validateApplicationForm = () => {
    const errors = {};
    
    if (!applicationData.purpose) errors.purpose = "Loan purpose is required";
    if (!applicationData.income) errors.income = "Income information is required";
    else if (isNaN(applicationData.income) || parseFloat(applicationData.income) < emi * 3) 
      errors.income = `Monthly income should be at least ₹${Math.round(emi * 3).toLocaleString()} (3x EMI)`;
    
    if (!applicationData.employmentDuration) errors.employmentDuration = "Employment duration is required";
    if (!applicationData.companyName) errors.companyName = "Company name is required";
    
    if (!applicationData.phoneNumber) errors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(applicationData.phoneNumber)) 
      errors.phoneNumber = "Please enter a valid 10-digit phone number";
    
    if (!applicationData.address) errors.address = "Address is required";
    if (!applicationData.city) errors.city = "City is required";
    if (!applicationData.pincode) errors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(applicationData.pincode)) 
      errors.pincode = "Please enter a valid 6-digit PIN code";
    
    if (applicationData.existingLoans === "Yes" && !applicationData.existingEmi)
      errors.existingEmi = "Please enter your existing EMI amount";
    
    if (!applicationData.panCard) errors.panCard = "PAN card number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(applicationData.panCard))
      errors.panCard = "Please enter a valid PAN card format";
    
    if (!applicationData.agreeTerms) 
      errors.agreeTerms = "You must agree to the terms and conditions";
    
    if (!applicationData.agreeDataSharing)
      errors.agreeDataSharing = "You must agree to data sharing for processing your application";
      
    return errors;
  };

  // Fix the serverTimestamp error in handleApplyForLoan function

const handleApplyForLoan = async () => {
  if (!user) {
    toast({
      title: "Login Required",
      description: "Please log in to apply for this loan.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    router.push('/login');
    return;
  }

  // Validate form
  const formErrors = validateApplicationForm();
  if (Object.keys(formErrors).length > 0) {
    setFormErrors(formErrors);
    toast({
      title: "Form Incomplete",
      description: "Please fill all required fields correctly",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  try {
    setIsApplying(true);
    setFormErrors({});
    
    // Generate application ID for tracking
    const applicationId = `LOAN-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
    
    // Get current time as string for array elements (can't use serverTimestamp in arrays)
    const currentTimeISO = new Date().toISOString();
    
    // Create loan application document with enhanced fields
    const applicationRef = await addDoc(collection(db, "loanApplications"), {
      applicationId: applicationId,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || "Not provided",
      contactDetails: {
        phone: applicationData.phoneNumber,
        email: applicationData.email || user.email,
        address: applicationData.address,
        city: applicationData.city,
        pincode: applicationData.pincode
      },
      loanDetails: {
        loanPlanId: planId,
        loanPlanName: plan.planName,
        loanCategory: plan.loanCategory,
        loanAmount: parseFloat(loanAmount),
        interestRate: plan.interestRate,
        tenure: plan.tenure,
        emi: emi,
        totalPayment: totalPayment,
        totalInterest: totalInterest,
        purpose: applicationData.purpose
      },
      employmentDetails: {
        type: applicationData.employmentType,
        duration: applicationData.employmentDuration,
        companyName: applicationData.companyName,
        designation: applicationData.designation,
        monthlyIncome: parseFloat(applicationData.income) || 0
      },
      financialDetails: {
        existingLoans: applicationData.existingLoans,
        existingEmi: applicationData.existingEmi ? parseFloat(applicationData.existingEmi) : 0,
        bankAccountNumber: applicationData.bankAccountNumber,
        bankName: applicationData.bankName,
        ifscCode: applicationData.ifscCode
      },
      kycDetails: {
        panCard: applicationData.panCard,
        aadhaarNumber: applicationData.aadhaarNumber
      },
      consentDetails: {
        termsAccepted: applicationData.agreeTerms,
        dataSharingAccepted: applicationData.agreeDataSharing,
        acceptedAt: currentTimeISO
      },
      applicationStatus: {
        status: "pending",
        stage: "initial_review",
        submittedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        statusHistory: [{
          status: "pending",
          stage: "initial_review",
          timestamp: currentTimeISO,  // Use the string timestamp here instead
          notes: "Application submitted"
        }]
      }
    });

    // Also create an entry in the user's applications subcollection for easy querying
    await addDoc(collection(db, `users/${user.uid}/applications`), {
      applicationId: applicationId,
      loanPlanId: planId,
      loanPlanName: plan.planName, 
      loanAmount: parseFloat(loanAmount),
      status: "pending",
      stage: "initial_review",
      createdAt: serverTimestamp(),
      mainDocRef: applicationRef.id
    });

    toast({
      title: "Application Submitted",
      description: `Your application #${applicationId} has been submitted successfully. You can track its status in your dashboard.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Close the modal and redirect to application tracking page
    onClose();
    
    
  } catch (error) {
    console.error("Error submitting application:", error);
    toast({
      title: "Application Failed",
      description: "There was an error submitting your application. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setIsApplying(false);
  }
};

  // Navigation functions for multi-step form
  const nextStep = () => {
    // Validate current step before proceeding
    const errors = {};
    
    if (applicationStep === 1) {
      if (!applicationData.purpose) errors.purpose = "Loan purpose is required";
      if (!applicationData.loanAmount) errors.loanAmount = "Please select a loan amount";
    } else if (applicationStep === 2) {
      if (!applicationData.income) errors.income = "Income information is required";
      if (!applicationData.employmentType) errors.employmentType = "Employment type is required";
      if (!applicationData.companyName) errors.companyName = "Company name is required";
    } else if (applicationStep === 3) {
      if (!applicationData.phoneNumber) errors.phoneNumber = "Phone number is required";
      if (!applicationData.address) errors.address = "Address is required";
      if (!applicationData.city) errors.city = "City is required";
      if (!applicationData.pincode) errors.pincode = "PIN code is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setApplicationStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setApplicationStep(prev => prev - 1);
  };
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Pre-fill some fields from user profile if available
      setApplicationData({
        ...applicationData,
        email: user?.email || "",
        loanAmount: loanAmount,
      });
      setApplicationStep(1);
    }
  }, [isOpen, user]);

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
    const fetchPlan = async () => {
      try {
        const planDoc = await getDoc(doc(db, "loanplans", planId));
        if (!planDoc.exists()) {
          toast({
            title: "Error",
            description: "Loan plan not found",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          router.push('/loanplans');
          return;
        }

        const currentPlan = { id: planDoc.id, ...planDoc.data() };
        setPlan(currentPlan);
        
        // Set initial loan amount to the minimum amount for EMI calculation
        setLoanAmount(currentPlan.minAmount || 100000);
      } catch (error) {
        console.error("Error fetching loan plan:", error);
        toast({
          title: "Error",
          description: "Failed to load loan plan details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId, router, toast]);

  // Calculate EMI whenever loan amount or plan changes
  useEffect(() => {
    if (plan && loanAmount) {
      const calculatedEmi = calculateEMI(loanAmount, plan.interestRate, plan.tenure);
      setEmi(calculatedEmi);
      
      const totalAmount = calculatedEmi * plan.tenure;
      setTotalPayment(totalAmount);
      setTotalInterest(totalAmount - loanAmount);
    }
  }, [plan, loanAmount]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Not available";
    
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <Box>
        <Headers />
        <Center minH="80vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box>
        <Headers />
        <Container maxW="container.xl" pt="20vh">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            Loan plan not found. The plan may have been removed or is unavailable.
          </Alert>
          <Button mt={4} leftIcon={<FiArrowLeft />} onClick={() => router.push("/loanplans")}>
            Back to Loan Plans
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>

      <Container maxW="container.xl" pt="20vh" pb={10}>
        <Button 
          leftIcon={<FiArrowLeft />} 
          variant="outline" 
          onClick={() => router.push("/loanplans")}
          mb={6}
        >
          Back to Loans
        </Button>
        
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <Box bg="white" p={8} borderRadius="xl" shadow="lg">
              <Stack spacing={6}>
                <Heading size="xl" color="#2C319F">{plan.planName}</Heading>
                
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

                <Heading size="md">Loan Highlights</Heading>
                <Grid templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}} gap={8}>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiPercent} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Interest Rate
                        </Text>
                        <Text fontSize="xl" color={plan.interestRate <= 9 ? "green.600" : "blue.600"}>
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
                          Loan Tenure
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          {plan.tenure} months
                          {plan.tenure >= 12 ? ` (${Math.floor(plan.tenure/12)} years${plan.tenure % 12 > 0 ? ` ${plan.tenure % 12} mo` : ''})` : ''}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiDollarSign} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Minimum Loan Amount
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          ₹{(plan.minAmount || 0).toLocaleString()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiTrendingUp} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">
                          Maximum Loan Amount
                        </Text>
                        <Text fontSize="xl" color="blue.600">
                          ₹{(plan.maxAmount || 0).toLocaleString()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </Grid>

                {/* EMI Calculator Section */}
                <Box mt={6} p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
                  <Heading size="md" mb={4} color="blue.700">Loan EMI Calculator</Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                    <Box>
                      <FormLabel>Loan Amount (₹)</FormLabel>
                      <NumberInput 
                        min={plan.minAmount || 10000} 
                        max={plan.maxAmount || 10000000} 
                        value={loanAmount}
                        onChange={(valueString) => setLoanAmount(parseFloat(valueString.replace(/,/g, '')))}
                        format={(val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Box>
                    
                    <Box>
                      <FormLabel>Interest Rate (% p.a.)</FormLabel>
                      <NumberInput 
                        isReadOnly
                        value={plan.interestRate}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </Box>
                  </Grid>
                  
                  <Divider my={6} />
                  
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                    <Stat>
                      <StatLabel>Monthly EMI</StatLabel>
                      <StatNumber color="blue.600">₹{Math.round(emi).toLocaleString()}</StatNumber>
                      <StatHelpText>Equated Monthly Installment</StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Total Payment</StatLabel>
                      <StatNumber color="purple.600">₹{Math.round(totalPayment).toLocaleString()}</StatNumber>
                      <StatHelpText>Principal + Interest</StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Total Interest</StatLabel>
                      <StatNumber color="orange.600">₹{Math.round(totalInterest).toLocaleString()}</StatNumber>
                      <StatHelpText>{((totalInterest/loanAmount)*100).toFixed(2)}% of principal</StatHelpText>
                    </Stat>
                  </Grid>
                </Box>

                {/* Additional Loan Details */}
                <Divider />
                <Heading size="md">Loan Details</Heading>
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Td fontWeight="bold">Loan Category</Td>
                      <Td>{plan.loanCategory?.replace("Loans", " Loan")}</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">Loan Sub-Category</Td>
                      <Td>{plan.loanSubCategory}</Td>
                    </Tr>
                    {plan.prepaymentPenalty !== undefined && (
                      <Tr>
                        <Td fontWeight="bold">Prepayment Penalty</Td>
                        <Td>{plan.prepaymentPenalty}%</Td>
                      </Tr>
                    )}
                    {plan.minCreditScore !== undefined && (
                      <Tr>
                        <Td fontWeight="bold">Minimum Credit Score</Td>
                        <Td>{plan.minCreditScore}</Td>
                      </Tr>
                    )}
                    <Tr>
                      <Td fontWeight="bold">Plan Type</Td>
                      <Td>{plan.planType}</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">Created At</Td>
                      <Td>{formatDate(plan.createdAt)}</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">Last Updated</Td>
                      <Td>{formatDate(plan.lastUpdated)}</Td>
                    </Tr>
                  </Tbody>
                </Table>

                {/* Eligibility Requirements Section */}
                <Divider />
                <Heading size="md">Eligibility Requirements</Heading>
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Stack spacing={3}>
                    <Flex align="center">
                      <Icon as={FiCheck} color="green.500" mr={2} />
                      <Text>Age: 21-65 years</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FiCheck} color="green.500" mr={2} />
                      <Text>Credit Score: {plan.minCreditScore || 700}+</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FiCheck} color="green.500" mr={2} />
                      <Text>Income: Minimum ₹{((plan.minAmount || 100000) * 0.4 * 12).toLocaleString()} annual income</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FiCheck} color="green.500" mr={2} />
                      <Text>Employment: Minimum 1 year of work experience</Text>
                    </Flex>
                  </Stack>
                </Box>
                
                <Button
                  colorScheme="blue"
                  size="lg"
                  height="16"
                  fontSize="lg"
                  leftIcon={<Icon as={FiDollarSign} />}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                  onClick={onOpen}
                >
                  Apply for Loan
                </Button>
              </Stack>
            </Box>
          </GridItem>

          {/* Right Sidebar */}
          <GridItem>
            <Stack spacing={6}>
              {/* Application Steps */}
              <Box bg="white" p={6} borderRadius="xl" shadow="lg">
                <Heading size="md" mb={4}>Application Process</Heading>
                <Stack spacing={4}>
                  <HStack align="flex-start">
                    <Flex 
                      align="center" 
                      justify="center" 
                      bg="blue.500" 
                      color="white" 
                      borderRadius="full" 
                      boxSize="24px"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      1
                    </Flex>
                    <Box>
                      <Text fontWeight="bold">Fill Application</Text>
                      <Text fontSize="sm" color="gray.600">Complete the online application form with your details</Text>
                    </Box>
                  </HStack>
                  
                  <HStack align="flex-start">
                    <Flex 
                      align="center" 
                      justify="center" 
                      bg="blue.500" 
                      color="white" 
                      borderRadius="full" 
                      boxSize="24px"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      2
                    </Flex>
                    <Box>
                      <Text fontWeight="bold">Document Verification</Text>
                      <Text fontSize="sm" color="gray.600">Submit required documents for verification</Text>
                    </Box>
                  </HStack>
                  
                  <HStack align="flex-start">
                    <Flex 
                      align="center" 
                      justify="center" 
                      bg="blue.500" 
                      color="white" 
                      borderRadius="full" 
                      boxSize="24px"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      3
                    </Flex>
                    <Box>
                      <Text fontWeight="bold">Loan Approval</Text>
                      <Text fontSize="sm" color="gray.600">Application review and loan approval</Text>
                    </Box>
                  </HStack>
                  
                  <HStack align="flex-start">
                    <Flex 
                      align="center" 
                      justify="center" 
                      bg="blue.500" 
                      color="white" 
                      borderRadius="full" 
                      boxSize="24px"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      4
                    </Flex>
                    <Box>
                      <Text fontWeight="bold">Disbursement</Text>
                      <Text fontSize="sm" color="gray.600">Loan amount transferred to your account</Text>
                    </Box>
                  </HStack>
                </Stack>
              </Box>
              
              {/* Documents Required */}
              <Box bg="white" p={6} borderRadius="xl" shadow="lg">
                <Heading size="md" mb={4}>Documents Required</Heading>
                <Stack spacing={3}>
                  <HStack align="flex-start">
                    <Icon as={FiCheck} color="green.500" />
                    <Text>Identity Proof (Aadhaar, PAN, Passport)</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiCheck} color="green.500" />
                    <Text>Address Proof (Utility bills, Rental agreement)</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiCheck} color="green.500" />
                    <Text>Income Proof (Salary slips, Form 16, ITR)</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiCheck} color="green.500" />
                    <Text>Bank Statements (Last 6 months)</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiCheck} color="green.500" />
                    <Text>Employment Verification</Text>
                  </HStack>
                </Stack>
              </Box>
              
              {/* Key Benefits */}
              <Box bg="white" p={6} borderRadius="xl" shadow="lg">
                <Heading size="md" mb={4}>Key Benefits</Heading>
                <Stack spacing={3}>
                  <HStack align="flex-start">
                    <Icon as={FiShield} color="blue.500" />
                    <Text>Quick approval process</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiShield} color="blue.500" />
                    <Text>Minimal documentation required</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiShield} color="blue.500" />
                    <Text>Flexible repayment options</Text>
                  </HStack>
                  <HStack align="flex-start">
                    <Icon as={FiShield} color="blue.500" />
                    <Text>No hidden charges</Text>
                  </HStack>
                  {plan.interestRate <= 9 && (
                    <HStack align="flex-start">
                      <Icon as={FiShield} color="blue.500" />
                      <Text>Competitive interest rate</Text>
                    </HStack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </Container>

      {/* Improved Loan Application Modal with multi-step form */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            bg="blue.500" 
            color="white" 
            borderTopRadius="md" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
          >
            <Box>
              Apply for {plan.planName}
              <Text fontSize="sm" fontWeight="normal" mt={1}>Step {applicationStep} of 4</Text>
            </Box>
            <Box>
              <Progress 
                value={(applicationStep / 4) * 100} 
                size="sm" 
                width="120px" 
                colorScheme="green" 
                borderRadius="full"
              />
            </Box>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {/* Step 1: Loan Details */}
            {applicationStep === 1 && (
              <VStack spacing={5} align="stretch">
                <Box>
                  <Heading size="sm" mb={2}>Loan Details</Heading>
                  <Grid templateColumns="1fr 1fr" gap={4} bg="blue.50" p={4} borderRadius="md">
                    <Box>
                      <Text fontSize="sm" color="gray.500">Loan Amount</Text>
                      <Text fontWeight="bold">₹{loanAmount?.toLocaleString()}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Interest Rate</Text>
                      <Text fontWeight="bold">{plan.interestRate}%</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Monthly EMI</Text>
                      <Text fontWeight="bold">₹{Math.round(emi).toLocaleString()}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Tenure</Text>
                      <Text fontWeight="bold">{plan.tenure} months</Text>
                    </Box>
                  </Grid>
                </Box>

                <Divider />

                <FormControl isRequired isInvalid={!!formErrors.purpose}>
                  <FormLabel>Loan Purpose</FormLabel>
                  <Select 
                    name="purpose"
                    value={applicationData.purpose}
                    onChange={handleInputChange}
                    placeholder="Select the purpose for this loan"
                  >
                    {plan.loanCategory === "HomeLoans" && (
                      <>
                        <option value="Home Purchase">Home Purchase</option>
                        <option value="Home Construction">Home Construction</option>
                        <option value="Home Renovation">Home Renovation</option>
                        <option value="Plot Purchase">Plot Purchase</option>
                      </>
                    )}
                    {plan.loanCategory === "PersonalLoans" && (
                      <>
                        <option value="Medical Emergency">Medical Emergency</option>
                        <option value="Debt Consolidation">Debt Consolidation</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Travel">Travel</option>
                        <option value="Education">Education</option>
                        <option value="Home Improvement">Home Improvement</option>
                      </>
                    )}
                    {plan.loanCategory === "CarLoans" && (
                      <>
                        <option value="New Car Purchase">New Car Purchase</option>
                        <option value="Used Car Purchase">Used Car Purchase</option>
                        <option value="Car Refinancing">Car Refinancing</option>
                      </>
                    )}
                    {plan.loanCategory === "BusinessLoans" && (
                      <>
                        <option value="Working Capital">Working Capital</option>
                        <option value="Business Expansion">Business Expansion</option>
                        <option value="Equipment Purchase">Equipment Purchase</option>
                        <option value="Inventory Management">Inventory Management</option>
                      </>
                    )}
                    <option value="Other">Other</option>
                  </Select>
                  {formErrors.purpose && <FormErrorMessage>{formErrors.purpose}</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.loanAmount}>
                  <FormLabel>Loan Amount</FormLabel>
                  <NumberInput
                    min={plan.minAmount || 10000}
                    max={plan.maxAmount || 10000000}
                    value={loanAmount}
                    onChange={(valueString) => {
                      const value = parseFloat(valueString.replace(/,/g, ''));
                      setLoanAmount(value);
                      setApplicationData({...applicationData, loanAmount: value});
                    }}
                    format={(val) => `₹ ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                  >
                    <NumberInputField />
                  </NumberInput>
                  {formErrors.loanAmount && <FormErrorMessage>{formErrors.loanAmount}</FormErrorMessage>}
                </FormControl>

                <Divider />
                
                <Alert status="info" variant="subtle">
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">Important Notice</AlertTitle>
                    <AlertDescription fontSize="sm">
                      The loan amount you select here will be subject to eligibility checks. The final approved amount may differ.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            )}

            {/* Step 2: Employment & Income */}
            {applicationStep === 2 && (
              <VStack spacing={5} align="stretch">
                <Heading size="sm" mb={2}>Employment & Income Details</Heading>
                
                <FormControl isRequired isInvalid={!!formErrors.employmentType}>
                  <FormLabel>Employment Type</FormLabel>
                  <Select 
                    name="employmentType"
                    value={applicationData.employmentType}
                    onChange={handleInputChange}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-employed Professional">Self-employed Professional</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Retired">Retired</option>
                    <option value="Other">Other</option>
                  </Select>
                  {formErrors.employmentType && <FormErrorMessage>{formErrors.employmentType}</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.companyName}>
                  <FormLabel>
                    {applicationData.employmentType === "Business Owner" 
                      ? "Business Name" 
                      : applicationData.employmentType === "Self-employed" 
                      ? "Professional Practice Name" 
                      : "Company Name"}
                  </FormLabel>
                  <Input
                    name="companyName"
                    value={applicationData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company/business name"
                  />
                  {formErrors.companyName && <FormErrorMessage>{formErrors.companyName}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={!!formErrors.designation}>
                  <FormLabel>Designation/Role</FormLabel>
                  <Input
                    name="designation"
                    value={applicationData.designation}
                    onChange={handleInputChange}
                    placeholder="Enter your designation or role"
                  />
                  {formErrors.designation && <FormErrorMessage>{formErrors.designation}</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.employmentDuration}>
                  <FormLabel>Employment Duration</FormLabel>
                  <Select 
                    name="employmentDuration"
                    value={applicationData.employmentDuration}
                    onChange={handleInputChange}
                  >
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-5 years">2-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="More than 10 years">More than 10 years</option>
                  </Select>
                  {formErrors.employmentDuration && <FormErrorMessage>{formErrors.employmentDuration}</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.income}>
                  <FormLabel>Monthly Income (₹)</FormLabel>
                  <NumberInput min={10000}>
                    <NumberInputField 
                      name="income"
                      value={applicationData.income}
                      onChange={handleInputChange}
                      placeholder="Enter your monthly income"
                    />
                  </NumberInput>
                  <FormHelperText color={parseFloat(applicationData.income) < emi * 3 ? "red.500" : "gray.500"}>
                    Minimum recommended: ₹{Math.round(emi * 3).toLocaleString()} (3x EMI)
                  </FormHelperText>
                  {formErrors.income && <FormErrorMessage>{formErrors.income}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={!!formErrors.existingLoans}>
                  <FormLabel>Do you have any existing loans?</FormLabel>
                  <Select 
                    name="existingLoans"
                    value={applicationData.existingLoans}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </Select>
                  {formErrors.existingLoans && <FormErrorMessage>{formErrors.existingLoans}</FormErrorMessage>}
                </FormControl>

                {applicationData.existingLoans === "Yes" && (
                  <FormControl isRequired isInvalid={!!formErrors.existingEmi}>
                    <FormLabel>Total Existing EMI Amount (₹)</FormLabel>
                    <NumberInput min={0}>
                      <NumberInputField 
                        name="existingEmi"
                        value={applicationData.existingEmi}
                        onChange={handleInputChange}
                        placeholder="Enter total existing EMI amount"
                      />
                    </NumberInput>
                    {formErrors.existingEmi && <FormErrorMessage>{formErrors.existingEmi}</FormErrorMessage>}
                  </FormControl>
                )}
              </VStack>
            )}

            {/* Step 3: Contact Details */}
            {applicationStep === 3 && (
              <VStack spacing={5} align="stretch">
                <Heading size="sm" mb={2}>Contact Details</Heading>
                
                <FormControl isRequired isInvalid={!!formErrors.phoneNumber}>
                  <FormLabel>Mobile Number</FormLabel>
                  <Input
                    name="phoneNumber"
                    value={applicationData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {formErrors.phoneNumber && <FormErrorMessage>{formErrors.phoneNumber}</FormErrorMessage>}
                </FormControl>

                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    name="email"
                    value={applicationData.email || user?.email || ""}
                    onChange={handleInputChange}
                    placeholder="Your email address"
                    isReadOnly={!!user?.email}
                  />
                  <FormHelperText>We'll use this email to communicate about your application</FormHelperText>
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.address}>
                  <FormLabel>Current Address</FormLabel>
                  <Textarea
                    name="address"
                    value={applicationData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete current address"
                    rows={3}
                  />
                  {formErrors.address && <FormErrorMessage>{formErrors.address}</FormErrorMessage>}
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4}>
                  <FormControl isRequired isInvalid={!!formErrors.city}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={applicationData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city name"
                    />
                    {formErrors.city && <FormErrorMessage>{formErrors.city}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!formErrors.pincode}>
                    <FormLabel>PIN Code</FormLabel>
                    <Input
                      name="pincode"
                      value={applicationData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                    />
                    {formErrors.pincode && <FormErrorMessage>{formErrors.pincode}</FormErrorMessage>}
                  </FormControl>
                </Grid>
              </VStack>
            )}

            {/* Step 4: Financial Details & Verification */}
            {applicationStep === 4 && (
              <VStack spacing={5} align="stretch">
                <Heading size="sm" mb={2}>Financial & KYC Details</Heading>
                
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <FormControl>
                    <FormLabel>Bank Name</FormLabel>
                    <Input
                      name="bankName"
                      value={applicationData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter your bank name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Account Number</FormLabel>
                    <Input
                      name="bankAccountNumber"
                      value={applicationData.bankAccountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>IFSC Code</FormLabel>
                  <Input
                    name="ifscCode"
                    value={applicationData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="Enter IFSC code"
                  />
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.panCard}>
                  <FormLabel>PAN Card Number</FormLabel>
                  <Input
                    name="panCard"
                    value={applicationData.panCard}
                    onChange={handleInputChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    textTransform="uppercase"
                  />
                  {formErrors.panCard && <FormErrorMessage>{formErrors.panCard}</FormErrorMessage>}
                </FormControl>

                <FormControl>
                  <FormLabel>Aadhaar Number (last 4 digits)</FormLabel>
                  <Input
                    name="aadhaarNumber"
                    value={applicationData.aadhaarNumber}
                    onChange={handleInputChange}
                    placeholder="Enter last 4 digits of Aadhaar"
                    maxLength={4}
                  />
                </FormControl>

                <Divider my={2} />

                <FormControl isRequired isInvalid={!!formErrors.agreeTerms}>
                  <Checkbox 
                    name="agreeTerms"
                    isChecked={applicationData.agreeTerms}
                    onChange={handleInputChange}
                    colorScheme="blue"
                  >
                    I agree to the <Link color="blue.500">terms and conditions</Link>, and confirm that all provided information is accurate.
                  </Checkbox>
                  {formErrors.agreeTerms && <FormErrorMessage>{formErrors.agreeTerms}</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!!formErrors.agreeDataSharing}>
                  <Checkbox 
                    name="agreeDataSharing"
                    isChecked={applicationData.agreeDataSharing}
                    onChange={handleInputChange}
                    colorScheme="blue"
                    mt={3}
                  >
                    I consent to sharing my information for credit verification and processing my loan application.
                  </Checkbox>
                  {formErrors.agreeDataSharing && <FormErrorMessage>{formErrors.agreeDataSharing}</FormErrorMessage>}
                </FormControl>

                <Alert status="info" borderRadius="md" mt={3}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">Application Process</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Your application will be reviewed within 2-3 business days. We may contact you for additional documentation through email or phone.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter bg="gray.50" borderBottomRadius="md">
            {applicationStep > 1 && (
              <Button variant="outline" mr={3} onClick={prevStep} leftIcon={<FiArrowLeft />}>
                Previous
              </Button>
            )}
            
            {applicationStep < 4 ? (
              <Button 
                colorScheme="blue" 
                onClick={nextStep}
                rightIcon={<FiArrowRight />}
              >
                Next
              </Button>
            ) : (
              <Button 
                colorScheme="green" 
                leftIcon={<FiSend />} 
                onClick={handleApplyForLoan}
                isLoading={isApplying}
                loadingText="Submitting"
              >
                Submit Application
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LoanPlanDetails;