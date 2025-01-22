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
  Tooltip,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
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
    GoldInvestments: ["Physical Gold", "Digital Gold", "Gold ETFs", "Sovereign Gold Bonds"],
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
          router.push('/login');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

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

    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        mb={4}
        bg="rgba(0, 0, 0, 0.1)"
      >
        <Heading size="md" color="teal.300">
          {type === "loan" ? plan.loanName : plan.planName}
        </Heading>
        <Text color="gray.600">Interest Rate: <Badge colorScheme="teal">{plan.interestRate}%</Badge></Text>
        <Text color="gray.600">Amount Range: {`${Number(plan.minAmount).toLocaleString()} - ${Number(plan.maxAmount).toLocaleString()}`}</Text>
        <Text color="gray.600">Tenure: {plan.tenure} months</Text>
        {type === "investment" && (
          <>
            <Text color="gray.600">Category: {plan.investmentCategory}</Text>
            <Text color="gray.600">Sub Category: {plan.investmentSubCategory}</Text>
          </>
        )}
        <Text color="gray.600">Description: {plan.description}</Text>
        <HStack spacing={2} mt={4}>
          <Button size="sm" colorScheme="teal" onClick={() => router.push(`/editplan/${plan.id}`)}>
            Edit
          </Button>
          <Button size="sm" colorScheme="red" onClick={() => handleDeleteClick(plan.id, type)}>
            Delete
          </Button>
        </HStack>
      </Box>
    );
  };

  return (
    <Container maxW="container.xl" p={5}>
      <Box
        p={6}
        borderRadius="lg"
        bg="rgba(15, 21, 53, 0.95)"
        color="white"
        boxShadow="xl"
      >
        <Heading mb={4} color="teal.300" size="lg">
          Bank Panel
        </Heading>
        <Text color="gray.600" mb={6}>
          Welcome, {user.email}
        </Text>
        <Divider mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {investmentPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} type="investment" />
          ))}
          {loanPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} type="loan" />
          ))}
        </SimpleGrid>

        {rejectedPlans.length > 0 && (
          <Box mt={6}>
            <Heading size="md" color="red.300">Rejected Plans</Heading>
            {rejectedPlans.map((rejectedPlan, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="rgba(255, 0, 0, 0.1)" mb={4}>
                <Text color="red.500">{rejectedPlan.name} - Reason: {rejectedPlan.reason}</Text>
              </Box>
            ))}
          </Box>
        )}

        {editPlan && (
          <Box mt={6} p={6} borderRadius="md" bg="rgba(255, 255, 255, 0.05)">
            <Heading size="md" mb={4} color="teal.300">
              Edit {isEditingLoan ? "Loan" : "Investment"} Plan
            </Heading>
            <form onSubmit={handleSubmitEdit}>
              <VStack spacing={4} align="stretch">
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
                <HStack>
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
                </HStack>
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
                {!isEditingLoan && (
                  <>
                    <Select
                      placeholder="Select Category"
                      value={formData.investmentCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investmentCategory: e.target.value,
                        })
                      }
                      isRequired
                    >
                      <option value="Bonds">Bonds</option>
                      <option value="MutualFunds">Mutual Funds</option>
                      <option value="FixedDeposits">Fixed Deposits</option>
                      <option value="GoldInvestments">Gold Investments</option>
                      <option value="ProvidentFunds">Provident Funds</option>
                    </Select>
                    <Select
                      color={"black"}
                      placeholder="Select Sub Category"
                      value={formData.investmentSubCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investmentSubCategory: e.target.value,
                        })
                      }
                      isRequired
                    >
                      {subCategories[formData.investmentCategory]?.map(
                        (subCategory) => (
                          <option key={subCategory} value={subCategory}>
                            {subCategory}
                          </option>
                        )
                      )}
                    </Select>
                  </>
                )}
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description"
                  isRequired
                />
                <HStack spacing={4}>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isLoading}
                    loadingText="Updating..."
                    width="full"
                  >
                    Update Plan
                  </Button>
                  <Button
                    onClick={() => {
                      setEditPlan(null);
                      setFormData(initialFormData);
                    }}
                    colorScheme="gray"
                    width="full"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        )}
      </Box>
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
