"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/SideNav";
import SearchBox from "../../../components/SearchBar";
import { Box, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Input } from "@chakra-ui/react";
import Plancards from "@/components/Plancards";
import { db, auth } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";



const page = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [bankName, setBankName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [calculatedReturn, setCalculatedReturn] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      setError(
        `Please enter an amount between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}.`
      );
      setCalculatedReturn(null);
      return;
    }
    setError("");
    const returnAmount = amount + (amount * selectedPlan.interestRate * selectedPlan.tenure) / 1200;
    setCalculatedReturn(returnAmount.toFixed(2)); 
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/pages/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        const investmentPlansQuery = query(
          collection(db, "investmentplans"),
        );
        const querySnapshot = await getDocs(investmentPlansQuery);
        const plansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching investment plans: ", error);
      }
    };

    if (user) {
      fetchInvestmentPlans();
    }
  }, [user]);

  useEffect(() => {
    const fetchBankName = async () => {
      if (selectedPlan) {
        try {
          const bankQuery = query(
            collection(db, "Banks"),
          
          );
          const querySnapshot = await getDocs(bankQuery);
          if (!querySnapshot.empty) {
            const bankData = querySnapshot.docs[0].data();
           
            setBankName(bankData.bankName || "Unknown Bank");
          } else {
            setBankName("Unknown Bank");
          }
        } catch (error) {
          console.error("Error fetching bank name: ", error);
          setBankName("Unknown Bank");
        }
      }
    };

    fetchBankName();
  }, [selectedPlan]);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    onOpen();
  };

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={10}
        justifyItems="center"
        p={5}
        backgroundImage="url(/images/body-background.png)"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        height="100vh"
        width="100%"
      >
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
          <SearchBox />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={20}
          p={10}
        >
          {plans.map((plan) => (
            <Box key={plan.id}>
              <Plancards
                header={plan.planName}
                summary={plan.description}
                onClick={() => handlePlanClick(plan)}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        sx={{
          bgGradient: "linear(to-b, #2C319F, #0E091E)",
          color: "white",
          borderRadius: "lg",
          boxShadow: "2xl",
          padding: "6",
          maxWidth: "500px",
          mx: "auto",
        }}
      >
        <ModalHeader
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          borderBottom="1px solid rgba(255, 255, 255, 0.2)"
          pb="4"
        >
          Plan Details
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          {selectedPlan && (
            <>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Plan Name:</strong> {selectedPlan.planName}
              </Text>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Description:</strong> {selectedPlan.description}
              </Text>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Interest Rate:</strong> {selectedPlan.interestRate}%
              </Text>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Minimum Amount:</strong> ${selectedPlan.minAmount}
              </Text>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Maximum Amount:</strong> ${selectedPlan.maxAmount}
              </Text>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Tenure:</strong> {selectedPlan.tenure} months
              </Text>
              <Text mb={4} fontSize="md" lineHeight="1.6">
                <strong>Bank Name:</strong> {bankName}
              </Text>

              {/* ROI Calculator */}
              <Text mb={4} fontSize="md" fontWeight="bold">
                Calculate Your Returns:
              </Text>
              <Input
                placeholder="Enter investment amount"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                type="number"
                bg="white"
                color="black"
                mb={2}
              />
              {error && (
                <Text color="red.400" fontSize="sm" mb={2}>
                  {error}
                </Text>
              )}
              <Button
                colorScheme="blue"
                onClick={handleCalculate}
                mb={4}
                w="full"
              >
                Calculate
              </Button>
              {calculatedReturn && (
                <Text fontSize="lg" fontWeight="bold" color="green.300">
                  Estimated Return: ${calculatedReturn}
                </Text>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>


    </>
  );
};

export default page;
