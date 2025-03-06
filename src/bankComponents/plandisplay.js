"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  HStack,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Container,
  Divider,
  Badge,
  SimpleGrid,
  Select,
  Card,
  CardBody,
  CardHeader,
  Stack,
  Tag,
  TagLabel,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function PlanDisplay() {
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [editPlan, setEditPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [planToDelete, setPlanToDelete] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const [bankVerified, setBankVerified] = useState(false);

  const initialFormData = {
    planName: "",
    interestRate: "",
    maxAmount: "",
    minAmount: "",
    tenure: "",
    description: "",
    loanName: "",
    investmentCategory: "",
    investmentSubCategory: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isEditingLoan, setIsEditingLoan] = useState(false);
  const [rejectedPlans, setRejectedPlans] = useState([]);

  const subCategories = {
    Bonds: ["Government Bonds", "Corporate Bonds", "Municipal Bonds"],
    MutualFunds: ["Equity Funds", "Debt Funds", "Balanced Funds"],
    FixedDeposits: ["Short-Term FD", "Long-Term FD", "Recurring Deposit"],
    GoldInvestments: [
      "Physical Gold",
      "Digital Gold",
      "Gold ETFs",
      "Sovereign Gold Bonds",
    ],
    ProvidentFunds: ["EPF", "PPF", "GPF"],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          await Promise.all([
            fetchInvestmentPlans(currentUser.uid),
            fetchLoanPlans(currentUser.uid),
          ]);
        } else {
          setUser(null);
          setInvestmentPlans([]);
          setLoanPlans([]);
          router.push("/login");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchBankStatus = async () => {
      if (user) {
        try {
          const bankDocRef = doc(db, "Banks", user.uid);
          const bankDocSnap = await getDoc(bankDocRef);
          if (bankDocSnap.exists()) {
            setBankVerified(bankDocSnap.data().isVerified || false);
          }
        } catch (err) {
          console.error("Error fetching bank status:", err);
        }
      }
    };

    fetchBankStatus();
  }, [user]);

  const fetchInvestmentPlans = async (userId) => {
    try {
      const q = query(
        collection(db, "investmentplans"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
      }));
      setInvestmentPlans(plans);
    } catch (error) {
      throw new Error(`Error fetching investment plans: ${error.message}`);
    }
  };

  const fetchLoanPlans = async (userId) => {
    try {
      const q = query(
        collection(db, "loanplans"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
      }));
      setLoanPlans(plans);
    } catch (error) {
      throw new Error(`Error fetching loan plans: ${error.message}`);
    }
  };

  const handleDeleteClick = (planId, type) => {
    setPlanToDelete({ id: planId, type });
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      const collectionName =
        planToDelete.type === "loan" ? "loanplans" : "investmentplans";
      await deleteDoc(doc(db, collectionName, planToDelete.id));

      if (planToDelete.type === "loan") {
        setLoanPlans((prev) =>
          prev.filter((plan) => plan.id !== planToDelete.id)
        );
      } else {
        setInvestmentPlans((prev) =>
          prev.filter((plan) => plan.id !== planToDelete.id)
        );
      }

      toast({
        title: "Plan Deleted",
        description: `The ${planToDelete.type} plan has been successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete the ${planToDelete.type} plan: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setPlanToDelete(null);
    }
  };

  const handleEdit = (plan, type) => {
    setIsEditingLoan(type === "loan");
    setEditPlan(plan.id);
    setFormData({
      planName: type === "loan" ? plan.loanName : plan.planName,
      interestRate: plan.interestRate,
      maxAmount: plan.maxAmount,
      minAmount: plan.minAmount,
      tenure: plan.tenure,
      description: plan.description,
      investmentCategory: plan.investmentCategory || "",
      investmentSubCategory: plan.investmentSubCategory || "",
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const collectionName = isEditingLoan ? "loanplans" : "investmentplans";
      await setDoc(doc(db, collectionName, editPlan), {
        ...formData,
        updatedAt: new Date(),
      });

      if (isEditingLoan) {
        setLoanPlans((prev) =>
          prev.map((plan) =>
            plan.id === editPlan ? { ...plan, ...formData } : plan
          )
        );
      } else {
        setInvestmentPlans((prev) =>
          prev.map((plan) =>
            plan.id === editPlan ? { ...plan, ...formData } : plan
          )
        );
      }

      toast({
        title: "Success",
        description: "Plan updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditPlan(null);
      setFormData(initialFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error:</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please log in to access the bank panel.
        </AlertDescription>
      </Alert>
    );
  }

  const PlanCard = ({ plan, type }) => {
    const router = useRouter();
    const hasRejection = Boolean(plan.rejectionReason);
    const planStatus = plan.status || "pending";
  
    return (
      <Card
        variant="elevated"
        shadow="sm"
        transition="all 0.2s"
        _hover={{ shadow: "md", transform: "translateY(-2px)" }}
        borderLeft={hasRejection ? "4px solid" : !bankVerified ? "4px solid" : "none"}
        borderColor={hasRejection ? "red.600" : !bankVerified ? "orange.500" : "none"}
        bg={hasRejection ? "red.50" : !bankVerified ? "orange.50" : "white"}
      >
        <CardHeader pb={0}>
          <Flex justify="space-between" align="center">
            <Heading size="md" color={hasRejection ? "red.700" : !bankVerified ? "orange.700" : "teal.600"}>
              {type === "loan" ? plan.loanName : plan.planName}
            </Heading>
            <HStack spacing={2}>
              {hasRejection && (
                <Tag size="sm" colorScheme="red" variant="solid">
                  <TagLabel>Rejected</TagLabel>
                </Tag>
              )}
              {!hasRejection && planStatus === "pending" && (
                <Tag size="sm" colorScheme="yellow">
                  <TagLabel>Pending</TagLabel>
                </Tag>
              )}
              {!hasRejection && planStatus === "approved" && (
                <Tag size="sm" colorScheme="green">
                  <TagLabel>Approved</TagLabel>
                </Tag>
              )}
              {!bankVerified && !hasRejection && (
                <Tag size="sm" colorScheme="orange">
                  <TagLabel>Unverified Bank</TagLabel>
                </Tag>
              )}
              <Tag size="sm" colorScheme={type === "loan" ? "purple" : "teal"}>
                <TagLabel>{type === "loan" ? "Loan" : "Investment"}</TagLabel>
              </Tag>
            </HStack>
          </Flex>
        </CardHeader>
  
        <CardBody>
          <Stack spacing={3}>
            <Box>
              <Stack spacing={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Interest Rate
                  </Text>
                  <Badge colorScheme={hasRejection ? "red" : "green"}>
                    {plan.interestRate}%
                  </Badge>
                </HStack>
  
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Amount Range
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    ₹{Number(plan.minAmount).toLocaleString()} - ₹
                    {Number(plan.maxAmount).toLocaleString()}
                  </Text>
                </HStack>
  
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Tenure
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {plan.tenure} months
                  </Text>
                </HStack>
  
                {type === "investment" && (
                  <>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Category
                      </Text>
                      <Badge colorScheme={hasRejection ? "red" : "blue"}>
                        {plan.investmentCategory}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Sub Category
                      </Text>
                      <Badge colorScheme={hasRejection ? "red" : "purple"}>
                        {plan.investmentSubCategory}
                      </Badge>
                    </HStack>
                  </>
                )}
  
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Description
                  </Text>
                  <Text fontSize="sm" noOfLines={3}>
                    {plan.description}
                  </Text>
                </Box>
              </Stack>
            </Box>
            <Divider />
  
            {/* Show rejection reason when it exists */}
            {hasRejection && (
              <Alert status="error" size="sm" borderRadius="md" variant="left-accent">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Rejection Reason</AlertTitle>
                  <AlertDescription fontSize="sm">
                    {plan.rejectionReason}
                  </AlertDescription>
                </Box>
              </Alert>
            )}
            
            {/* Only show unverified message for non-rejected plans */}
            {!bankVerified && !hasRejection && (
              <Alert status="warning" size="sm" borderRadius="md">
                <AlertIcon />
                <Text fontSize="xs">
                  This plan is not visible to customers until your bank is verified
                </Text>
              </Alert>
            )}
  
            <HStack justify="flex-end" spacing={2}>
              <Button
                size="sm"
                colorScheme={hasRejection ? "red" : "teal"}
                variant="outline"
                onClick={() => router.push(`/editplan/${plan.id}`)}
              >
                {hasRejection ? "Edit & Resubmit" : "Edit"}
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleDeleteClick(plan.id, type)}
              >
                Delete
              </Button>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" color="gray.700" mb={2}>
            Bank Dashboard
          </Heading>
          <Text color="gray.500">Welcome back, {user?.email}</Text>
        </Box>

        {/* Summary of rejected plans */}
        {(investmentPlans.some(plan => plan.rejectionReason) || loanPlans.some(plan => plan.rejectionReason)) && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Rejected Plans</AlertTitle>
              <AlertDescription>
                You have {investmentPlans.concat(loanPlans).filter(plan => plan.rejectionReason).length} rejected plan(s). 
                Please review the rejection reasons and make necessary changes before resubmitting.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {investmentPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} type="investment" />
          ))}
          {loanPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} type="loan" />
          ))}
        </SimpleGrid>

        {rejectedPlans.length > 0 && (
          <Box>
            <Heading size="md" color="red.500" mb={4}>
              Rejected Plans
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {rejectedPlans.map((rejectedPlan, index) => (
                <Alert
                  key={index}
                  status="error"
                  variant="left-accent"
                  borderRadius="md"
                >
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{rejectedPlan.name}</AlertTitle>
                    <AlertDescription>
                      Reason: {rejectedPlan.reason}
                    </AlertDescription>
                  </Box>
                </Alert>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {editPlan && (
          <Card variant="elevated" mt={6}>
            <CardHeader>
              <Heading size="md" color="teal.600">
                Edit {isEditingLoan ? "Loan" : "Investment"} Plan
              </Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmitEdit}>
                <VStack spacing={4}>
                  <Input
                    name="planName"
                    value={formData.planName}
                    onChange={(e) =>
                      setFormData({ ...formData, planName: e.target.value })
                    }
                    placeholder={isEditingLoan ? "Loan Name" : "Plan Name"}
                    isRequired
                  />
                  <NumberInput
                    min={0}
                    value={formData.interestRate}
                    onChange={(valueString) =>
                      setFormData({ ...formData, interestRate: valueString })
                    }
                    isRequired
                  >
                    <NumberInputField placeholder="Interest Rate (%)" />
                  </NumberInput>
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <NumberInput
                      min={0}
                      value={formData.minAmount}
                      onChange={(valueString) =>
                        setFormData({ ...formData, minAmount: valueString })
                      }
                      isRequired
                    >
                      <NumberInputField placeholder="Min Amount" />
                    </NumberInput>
                    <NumberInput
                      min={0}
                      value={formData.maxAmount}
                      onChange={(valueString) =>
                        setFormData({ ...formData, maxAmount: valueString })
                      }
                      isRequired
                    >
                      <NumberInputField placeholder="Max Amount" />
                    </NumberInput>
                  </SimpleGrid>
                  <NumberInput
                    min={1}
                    value={formData.tenure}
                    onChange={(valueString) =>
                      setFormData({ ...formData, tenure: valueString })
                    }
                    isRequired
                  >
                      <NumberInputField placeholder="Tenure (months)" />
                  </NumberInput>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description"
                    isRequired
                  />
                  <HStack spacing={4} w="full">
                    <Button
                      type="submit"
                      colorScheme="teal"
                      isLoading={isLoading}
                      loadingText="Updating..."
                      flex={1}
                    >
                      Update Plan
                    </Button>
                    <Button
                      onClick={() => {
                        setEditPlan(null);
                        setFormData(initialFormData);
                      }}
                      colorScheme="gray"
                      flex={1}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this {planToDelete?.type} plan? This
            action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
