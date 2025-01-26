"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, query, where, getDoc } from "firebase/firestore";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Stack,
  Avatar,
  useToast,
  Spinner,
  Textarea
} from "@chakra-ui/react";

export default function PlanVerifyPage() {
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUnverifiedPlans = async () => {
      try {
        const investmentPlansRef = collection(db, "investmentplans");
        const loanPlansRef = collection(db, "loanplans");
        
        const investmentQuery = query(investmentPlansRef, where("status", "==", "pending"));
        const loanQuery = query(loanPlansRef, where("status", "==", "pending"));

        const investmentSnapshot = await getDocs(investmentQuery);
        const loanSnapshot = await getDocs(loanQuery);

        const pendingInvestmentPlans = investmentSnapshot.docs.map(async (docSnapshot) => {
          const planData = docSnapshot.data();
          const bankRef = doc(db, "Banks", planData.createdBy);
          const bankDoc = await getDoc(bankRef);
          const bankData = bankDoc.data();
          return {
            id: docSnapshot.id,
            ...planData,
            bankName: bankData?.bankName || 'N/A',
          };
        });

        const pendingLoanPlans = loanSnapshot.docs.map(async (docSnapshot) => {
          const planData = docSnapshot.data();
          const bankRef = doc(db, "Banks", planData.createdBy);
          const bankDoc = await getDoc(bankRef);
          const bankData = bankDoc.data();
          return {
            id: docSnapshot.id,
            ...planData,
            bankName: bankData?.bankName || 'N/A',
          };
        });

        const resolvedInvestmentPlans = await Promise.all(pendingInvestmentPlans);
        const resolvedLoanPlans = await Promise.all(pendingLoanPlans);

        setInvestmentPlans(resolvedInvestmentPlans);
        setLoanPlans(resolvedLoanPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast({
          title: "Error fetching plans",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUnverifiedPlans();
  }, [toast]);

  const handleVerifyPlan = async (planId, isApproved, isLoanPlan = false) => {
    try {
      const planRef = doc(db, isLoanPlan ? "loanplans" : "investmentplans", planId);
      if (isApproved) {
        await updateDoc(planRef, {
          isVerified: true,
          status: "approved",
          lastUpdated: new Date(),
        });
        if (isLoanPlan) {
          setLoanPlans(loanPlans.filter((plan) => plan.id !== planId));
        } else {
          setInvestmentPlans(investmentPlans.filter((plan) => plan.id !== planId));
        }
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error updating plan status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRejectClick = (planId) => {
    setSelectedPlanId(planId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Please provide a reason for rejection",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const planRef = doc(db, "investmentplans", selectedPlanId);
      await updateDoc(planRef, {
        isVerified: false,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        lastUpdated: new Date(),
      });
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedPlanId(null);
      setInvestmentPlans(investmentPlans.filter((plan) => plan.id !== selectedPlanId));
    } catch (error) {
      console.error("Error rejecting plan:", error);
      toast({
        title: "Error rejecting plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCloseModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedPlanId(null);
  };

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Flex justify="center" py={10}>
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box bg="#F0F4FB" minH="100vh">
      <Container maxW="85%" py={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading colorScheme="green" size="lg">Verify Investment and Loan Plans</Heading>
          <Flex align="center" gap={4}>
            <Text color="gray.600">Hello, Admin</Text>
            <Avatar src="/admin-avatar.png" size="md" />
          </Flex>
        </Flex>

        <Heading size="md" mb={4}>Investment Plans</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {investmentPlans.map((plan) => (
            <Card key={plan.id} variant="outline" transition="all 0.2s" _hover={{ shadow: "xl" }}>
              <CardBody>
                <Flex justify="space-between" align="start" mb={4}>
                  <Heading size="md" color="gray.800">{plan.name}</Heading>
                  <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                    {plan.investmentCategory}
                  </Badge>
                </Flex>

                <Text color="gray.600" mb={4} noOfLines={2}>
                  {plan.description}
                </Text>

                <Stack spacing={2} mb={4}>
                  <Text color="gray.500"><span className="font-semibold">Bank:</span> {plan.bankName}</Text>
                  <Text color="gray.500"><span className="font-semibold">Interest Rate:</span> {plan.interestRate}%</Text>
                  <Text color="gray.500"><span className="font-semibold">Duration:</span> {plan.duration} months</Text>
                  <Text color="gray.500"><span className="font-semibold">Minimum Investment:</span> ${plan.minimumInvestment}</Text>
                  <Text color="gray.500"><span className="font-semibold">Maximum Investment:</span> ${plan.maximumInvestment}</Text>
                  <Text color="gray.500"><span className="font-semibold">Risk Level:</span> {plan.riskLevel}</Text>
                </Stack>

                <Flex justify="space-between" gap={4} mb={4}>
                  <Button
                    onClick={() => handleVerifyPlan(plan.id, true)}
                    colorScheme="green"
                    size="md"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectClick(plan.id)}
                    colorScheme="red"
                    size="md"
                  >
                    Reject
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Heading size="md" mb={4} mt={8}>Loan Plans</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {loanPlans.map((plan) => (
            <Card key={plan.id} variant="outline" transition="all 0.2s" _hover={{ shadow: "xl" }}>
              <CardBody>
                <Flex justify="space-between" align="start" mb={4}>
                  <Heading size="md" color="gray.800">{plan.name}</Heading>
                  <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                    {plan.loanCategory}
                  </Badge>
                </Flex>

                <Text color="gray.600" mb={4} noOfLines={2}>
                  {plan.description}
                </Text>

                <Stack spacing={2} mb={4}>
                  <Text color="gray.500"><span className="font-semibold">Bank:</span> {plan.bankName}</Text>
                  <Text color="gray.500"><span className="font-semibold">Interest Rate:</span> {plan.interestRate}%</Text>
                  <Text color="gray.500"><span className="font-semibold">Duration:</span> {plan.duration} months</Text>
                  <Text color="gray.500"><span className="font-semibold">Minimum Loan:</span> ${plan.minimumLoan}</Text>
                  <Text color="gray.500"><span className="font-semibold">Maximum Loan:</span> ${plan.maximumLoan}</Text>
                  <Text color="gray.500"><span className="font-semibold">Risk Level:</span> {plan.riskLevel}</Text>
                </Stack>

                <Flex justify="space-between" gap={4} mb={4}>
                  <Button
                    onClick={() => handleVerifyPlan(plan.id, true, true)}
                    colorScheme="green"
                    size="md"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectClick(plan.id)}
                    colorScheme="red"
                    size="md"
                  >
                    Reject
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Grid>

        {showRejectModal && (
          <Box position="fixed" inset={0} bg="blackAlpha.300" zIndex={50}>
            <Box bg="white" rounded="lg" p={6} maxW="md" mx="auto" mt="20vh">
              <Heading size="md" mb={4}>Reject Plan</Heading>
              <Text mb={4}>Please provide a reason for rejection</Text>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                size="md"
                resize="vertical"
              />
              <Flex justify="end" gap={4} mt={4}>
                <Button onClick={handleCloseModal} colorScheme="gray" size="md">Cancel</Button>
                <Button onClick={handleRejectSubmit} colorScheme="red" size="md">Reject Plan</Button>
              </Flex>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
