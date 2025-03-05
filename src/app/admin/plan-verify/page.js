"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
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
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import { FiDollarSign, FiCreditCard, FiCheckCircle, FiXCircle } from "react-icons/fi";
import AdminSideNav from "@/adminComponents/AdminSideNav";

const PlanCard = ({ plan, type, onApprove, onReject }) => {
  return (
    <Card variant="outline" transition="all 0.2s" _hover={{ shadow: "lg" }}>
      <CardBody>
        <Flex justify="space-between" align="start" mb={4}>
          <Heading size="md" color="gray.800">
            {plan.planName || plan.loanName || "Unnamed Plan"}
          </Heading>
          <Badge 
            colorScheme={type === 'investment' ? "blue" : "purple"}
            px={2} 
            py={1} 
            borderRadius="md"
          >
            {type === 'investment' ? plan.investmentCategory : plan.loanCategory}
          </Badge>
        </Flex>

        <Text color="gray.600" mb={4} noOfLines={2}>
          {plan.description}
        </Text>

        <Stack spacing={2} mb={4}>
          <Flex align="center" justify="space-between">
            <Text color="gray.500">Bank:</Text>
            <Text fontWeight="medium">{plan.bankName}</Text>
          </Flex>
          <Flex align="center" justify="space-between">
            <Text color="gray.500">Interest Rate:</Text>
            <Text fontWeight="medium">{plan.interestRate}%</Text>
          </Flex>
          <Flex align="center" justify="space-between">
            <Text color="gray.500">Duration:</Text>
            <Text fontWeight="medium">{plan.tenure} months</Text>
          </Flex>
          <Flex align="center" justify="space-between">
            <Text color="gray.500">Amount Range:</Text>
            <Text fontWeight="medium">
              ₹{Number(plan.minAmount).toLocaleString()} - ₹{Number(plan.maxAmount).toLocaleString()}
            </Text>
          </Flex>
        </Stack>

        <Divider mb={4} />

        <Flex justify="space-between" gap={4}>
          <Button
            onClick={onApprove}
            colorScheme="green"
            size="sm"
            width="full"
            leftIcon={<FiCheckCircle />}
          >
            Approve
          </Button>
          <Button
            onClick={onReject}
            colorScheme="red"
            size="sm"
            width="full"
            leftIcon={<FiXCircle />}
          >
            Reject
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default function PlanVerifyPage() {
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isLoanPlan, setIsLoanPlan] = useState(false);
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
            bankName: bankData?.bankName || "N/A",
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

  const handleRejectClick = (planId, isLoanPlan = false) => {
    setSelectedPlanId(planId);
    setIsLoanPlan(isLoanPlan);
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
      const planRef = doc(db, isLoanPlan ? "loanplans" : "investmentplans", selectedPlanId);
      await updateDoc(planRef, {
        isVerified: false,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        lastUpdated: new Date(),
      });
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedPlanId(null);
      if (isLoanPlan) {
        setLoanPlans(loanPlans.filter((plan) => plan.id !== selectedPlanId));
      } else {
        setInvestmentPlans(investmentPlans.filter((plan) => plan.id !== selectedPlanId));
      }
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
      <Box w="20%" bg="gray.800" color="white" p={4} position="fixed" h="full">
        <AdminSideNav />
      </Box>
      <Box ml="20%" p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading color="green.600" size="lg">Plan Verification Dashboard</Heading>
          <Flex align="center" gap={4}>
            <Badge colorScheme="blue" p={2} borderRadius="md">
              Pending: {investmentPlans.length + loanPlans.length}
            </Badge>
            <Avatar src="/admin-avatar.png" size="md" />
          </Flex>
        </Flex>

        <Tabs isFitted variant="enclosed-colored" colorScheme="green">
          <TabList mb="1em">
            <Tab>
              <Flex align="center" gap={2}>
                <FiDollarSign />
                Investment Plans ({investmentPlans.length})
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" gap={2}>
                <FiCreditCard />
                Loan Plans ({loanPlans.length})
              </Flex>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {investmentPlans.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg" color="gray.500">No pending investment plans to verify</Text>
                </Box>
              ) : (
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                  {/* Investment Plans Cards */}
                  {investmentPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      type="investment"
                      onApprove={() => handleVerifyPlan(plan.id, true)}
                      onReject={() => handleRejectClick(plan.id)}
                    />
                  ))}
                </Grid>
              )}
            </TabPanel>

            <TabPanel>
              {loanPlans.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg" color="gray.500">No pending loan plans to verify</Text>
                </Box>
              ) : (
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                  {/* Loan Plans Cards */}
                  {loanPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      type="loan"
                      onApprove={() => handleVerifyPlan(plan.id, true, true)}
                      onReject={() => handleRejectClick(plan.id, true)}
                    />
                  ))}
                </Grid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Replace the existing modal with this enhanced version */}
      <Modal isOpen={showRejectModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Reject {isLoanPlan ? "Loan" : "Investment"} Plan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Please provide a reason for rejection:</Text>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter detailed reason for rejection..."
              size="md"
              resize="vertical"
              minH="120px"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleRejectSubmit}>
              Reject Plan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
