"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
  ModalCloseButton,
  ModalFooter,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiDollarSign, FiCreditCard } from "react-icons/fi";
import AdminSideNav from "@/adminComponents/AdminSideNav";

export default function AllPlansPage() {
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ id: null, type: null });
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [investmentSnapshot, loanSnapshot] = await Promise.all([
          getDocs(collection(db, "investmentplans")),
          getDocs(collection(db, "loanplans"))
        ]);

        setInvestmentPlans(investmentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        setLoanPlans(loanSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

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

    fetchPlans();
  }, [toast]);

  const handleDeletePlan = async () => {
    setDeleting(true);
    try {
      const collectionName = selectedPlan.type === 'investment' ? 'investmentplans' : 'loanplans';
      await deleteDoc(doc(db, collectionName, selectedPlan.id));
      
      if (selectedPlan.type === 'investment') {
        setInvestmentPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id));
      } else {
        setLoanPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id));
      }

      toast({
        title: "Plan deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting plan: ", error);
      toast({
        title: "Error deleting plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  // Update the renderPlanDetails function with enhanced loan details
  const renderPlanDetails = (plan, type) => {
    const commonDetails = [
      { label: "Plan Name", value: plan.planName || plan.loanName },
      { label: "Description", value: plan.description },
      { label: "Status", value: plan.status },
      { label: "Created Date", value: plan.createdAt?.toDate().toLocaleDateString() },
      { label: "Last Updated", value: plan.lastUpdated?.toDate().toLocaleDateString() },
      { label: "Verified", value: plan.isVerified ? "Yes" : "No" },
      { label: "Tags", value: plan.tags?.join(", ") || "None" },
    ];

    const investmentDetails = [
      // ... existing investment details ...
    ];

    const loanDetails = [
      { label: "Loan Category", value: plan.loanCategory },
      { label: "Loan Sub Category", value: plan.loanSubCategory },
      { label: "Loan Type", value: plan.loanType },
      { label: "Interest Rate", value: `${plan.interestRate}%` },
      { label: "Interest Rate Type", value: plan.interestRateType },
      { label: "Amount Range", value: `₹${plan.minAmount?.toLocaleString()} - ₹${plan.maxAmount?.toLocaleString()}` },
      { label: "Tenure", value: `${plan.tenure} months` },
      { label: "CIBIL Score Required", value: plan.cibilScore || "Not specified" },
      { label: "Employment Type", value: plan.employmentType },
      { label: "Age Eligibility", value: `${plan.minAge} - ${plan.maxAge} years` },
      { label: "Minimum Monthly Income", value: `₹${parseInt(plan.minMonthlyIncome).toLocaleString()}` },
      { label: "Purpose", value: plan.purpose },
      { label: "Documentation Required", value: plan.documentationRequired },
      { label: "Payment Frequency", value: plan.paymentFrequency },
      { label: "Repayment Schedule", value: plan.repaymentSchedule },
      { label: "Processing Fee", value: plan.processingFeeType === 'fixed' 
        ? `₹${plan.processingFeeAmount}` 
        : `${plan.processingFeePercentage}%`
      },
      { label: "Prepayment", value: `${plan.prepaymentAllowed === 'yes' ? 'Allowed' : 'Not Allowed'}${plan.prepaymentCharges ? ` (Charges: ${plan.prepaymentCharges}%)` : ''}`},
      { label: "Collateral Required", value: plan.collateralRequired },
      { label: "Guarantor Required", value: plan.guarantorRequired },
      { label: "Insurance Required", value: plan.isInsuranceRequired },
      { label: "Indemnity Required", value: plan.indemnityRequired },
      { label: "Tax Benefits", value: plan.taxBenefits },
      { label: "Tax Benefit Details", value: plan.taxBenefitDetails || "Not specified" },
      { label: "Flexibility Score", value: plan.flexibilityScore?.toString() || "Not specified" },
    ];

    return (
      <Stack spacing={6} divider={<Divider />}>
        <Box>
          <Heading size="sm" mb={4} color="gray.700">Basic Details</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {commonDetails.map((detail, index) => (
              detail.value && (
                <Box key={index}>
                  <Text fontWeight="bold" color="gray.600" fontSize="sm">
                    {detail.label}
                  </Text>
                  <Text fontSize="md">{detail.value}</Text>
                </Box>
              )
            ))}
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="sm" mb={4} color="gray.700">
            {type === 'investment' ? 'Investment Details' : 'Loan Details'}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {(type === 'investment' ? investmentDetails : loanDetails)
              .map((detail, index) => (
                detail.value && (
                  <Box key={index} p={3} borderRadius="md" borderWidth="1px">
                    <Text fontWeight="bold" color="gray.600" fontSize="sm">
                      {detail.label}
                    </Text>
                    <Text fontSize="md">{detail.value}</Text>
                  </Box>
                )
              ))}
          </SimpleGrid>
        </Box>

        {type === 'loan' && (
          <Box>
            <Heading size="sm" mb={4} color="gray.700">Additional Requirements</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {[
                { label: "Insurance", value: plan.isInsuranceRequired },
                { label: "Collateral", value: plan.collateralRequired },
                { label: "Guarantor", value: plan.guarantorRequired },
                { label: "Indemnity", value: plan.indemnityRequired },
                { label: "Tax Benefits", value: plan.taxBenefits },
              ].map((requirement, index) => (
                <Badge
                  key={index}
                  colorScheme={requirement.value === "Yes" ? "green" : "gray"}
                  p={2}
                  borderRadius="md"
                  textAlign="center"
                >
                  {requirement.label}: {requirement.value}
                </Badge>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    );
  };

  return (
    <Box bg="gray.50" minH="100vh" display="flex">
      <Box w="20%" bg="gray.800" color="white" p={4} position="fixed" h="full">
        <AdminSideNav />
      </Box>

      <Box flex="1" ml="20%">
        <Box p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading color="green.400" size="lg">
              Plans Management
            </Heading>
            <Avatar src="/admin-avatar.png" size="md" />
          </Flex>

          {loading ? (
            <Flex justify="center" py={10}>
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Tabs isFitted variant="enclosed" colorScheme="green">
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
                {/* Investment Plans Panel */}
                <TabPanel>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                    {investmentPlans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        variant="outline" 
                        transition="all 0.2s" 
                        _hover={{ shadow: "xl", cursor: "pointer" }}
                        onClick={() => {
                          setSelectedPlanDetails({ ...plan, type: 'investment' });
                          setIsDetailsOpen(true);
                        }}
                      >
                        <CardBody>
                          <Flex justify="space-between" align="start" mb={4}>
                            <Heading size="md" color="gray.800">{plan.planName}</Heading>
                            <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                              {plan.investmentCategory}
                            </Badge>
                          </Flex>

                          <Text color="gray.600" mb={4} noOfLines={2}>{plan.description}</Text>

                          <Stack spacing={2} fontSize="sm" color="gray.500">
                            <Flex align="center">
                              <Text mr={2}>💰</Text>
                              <Text>Interest Rate: {plan.interestRate}%</Text>
                            </Flex>
                            <Flex align="center">
                              <Text mr={2}>📊</Text>
                              <Text>Risk Level: {plan.riskLevel}</Text>
                            </Flex>
                            <Flex align="center">
                              <Text mr={2}>💵</Text>
                              <Text>Minimum Investment: ₹{plan.minAmount}</Text>
                            </Flex>
                          </Stack>

                          <Flex justify="flex-end" mt={6}>
                            <Button
                              onClick={() => {
                                setSelectedPlan({ id: plan.id, type: 'investment' });
                                onOpen();
                              }}
                              colorScheme="red"
                              size="sm"
                              isLoading={deleting && selectedPlan.id === plan.id}
                            >
                              Delete
                            </Button>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </Grid>
                </TabPanel>

                {/* Loan Plans Panel */}
                <TabPanel>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                    {loanPlans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        variant="outline" 
                        transition="all 0.2s" 
                        _hover={{ shadow: "xl", cursor: "pointer" }}
                        onClick={() => {
                          setSelectedPlanDetails({ ...plan, type: 'loan' });
                          setIsDetailsOpen(true);
                        }}
                      >
                        <CardBody>
                          <Flex justify="space-between" align="start" mb={4}>
                            <Heading size="md" color="gray.800">{plan.loanName || plan.planName}</Heading>
                            <Badge colorScheme="purple" px={2} py={1} borderRadius="md">
                              {plan.loanSubCategory || plan.loanCategory}
                            </Badge>
                          </Flex>

                          <Text color="gray.600" mb={4} noOfLines={2}>{plan.description}</Text>

                          <Stack spacing={2} fontSize="sm" color="gray.500">
                            <Flex align="center">
                              <Text mr={2}>💰</Text>
                              <Text>Interest Rate: {plan.interestRate}%</Text>
                            </Flex>
                            <Flex align="center">
                              <Text mr={2}>⏱️</Text>
                              <Text>Tenure: {plan.tenure} months</Text>
                            </Flex>
                            <Flex align="center">
                              <Text mr={2}>💵</Text>
                              <Text>Amount: ₹{plan.minAmount?.toLocaleString()} - ₹{plan.maxAmount?.toLocaleString()}</Text>
                            </Flex>
                            <Flex align="center">
                              <Text mr={2}>👥</Text>
                              <Text>CIBIL Required: {plan.cibilScore || "Not specified"}</Text>
                            </Flex>
                          </Stack>
                        </CardBody>
                      </Card>
                    ))}
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Box>

      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <Text>{selectedPlanDetails?.planName}</Text>
              <Badge 
                colorScheme={selectedPlanDetails?.type === 'investment' ? "blue" : "purple"}
                px={2} 
                py={1} 
                borderRadius="md"
              >
                {selectedPlanDetails?.type === 'investment' 
                  ? selectedPlanDetails?.investmentCategory 
                  : selectedPlanDetails?.loanCategory}
              </Badge>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody py={6}>
            {selectedPlanDetails && renderPlanDetails(selectedPlanDetails, selectedPlanDetails.type)}
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3}
              size="sm"
              onClick={() => {
                setSelectedPlan({ id: selectedPlanDetails.id, type: selectedPlanDetails.type });
                setIsDetailsOpen(false);
                onOpen();
              }}
            >
              Delete Plan
            </Button>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Plan
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDeletePlan} 
                ml={3}
                isLoading={deleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
