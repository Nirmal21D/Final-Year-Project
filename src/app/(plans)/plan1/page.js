"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/SideNav";
import SearchBox from "../../../components/SearchBar";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Input,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
} from "@chakra-ui/react";
import Plancards from "@/components/Plancards";
import { db, auth } from "@/firebase";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Headers from "@/components/Headers";

const Page = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [bankName, setBankName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [calculatedReturn, setCalculatedReturn] = useState(null);
  const [error, setError] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);

  const handleCalculate = () => {
    const amount = parseFloat(investmentAmount);
    if (
      isNaN(amount) ||
      amount < selectedPlan.minAmount ||
      amount > selectedPlan.maxAmount
    ) {
      setError(
        `Please enter an amount between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}.`
      );
      setCalculatedReturn(null);
      return;
    }
    setError("");
    const returnAmount =
      amount +
      (amount * selectedPlan.interestRate * selectedPlan.tenure) / 1200;
    setCalculatedReturn(returnAmount.toFixed(2));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        const investmentPlansQuery = query(collection(db, "investmentplans"));
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
          const bankDocRef = doc(db, "Banks", selectedPlan.createdBy);
          const bankDocSnap = await getDoc(bankDocRef);

          if (bankDocSnap.exists()) {
            const bankData = bankDocSnap.data();
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

  useEffect(() => {
    let filtered = plans;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (plan) =>
          plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (categoryFilter.length > 0) {
      filtered = filtered.filter((plan) =>
        categoryFilter.includes(plan.investmentCategory)
      );
    }

    // Filter by subcategories
    if (subCategoryFilter.length > 0) {
      filtered = filtered.filter((plan) =>
        subCategoryFilter.includes(plan.investmentSubCategory)
      );
    }

    setFilteredPlans(filtered);
  }, [plans, searchTerm, categoryFilter, subCategoryFilter]);

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
        id="main"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        backgroundImage="url(/images/newbg.png)"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        height="auto"
        width="auto"
        minHeight="100vh"
        minWidth="auto"
      >
        <Box
          id="upper"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="1000"
        >
          <Headers />
        </Box>
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={5}
          mt={32}
        >
          <Box bg="white" p={5} borderRadius="md" boxShadow="lg" width="100%">
            <CheckboxGroup
              value={categoryFilter}
              onChange={setCategoryFilter}
              mb={4}
            >
              <Text fontWeight="bold" color="#2C319F">
                Categories:
              </Text>
              <Checkbox value="Bonds">Bonds</Checkbox>
              <Checkbox value="MutualFunds">Mutual Funds</Checkbox>
              <Checkbox value="FixedDeposits">Fixed Deposits</Checkbox>
              <Checkbox value="GoldInvestments">Gold Investments</Checkbox>
              <Checkbox value="ProvidentFunds">Provident Funds</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup
              value={subCategoryFilter}
              onChange={setSubCategoryFilter}
            >
              <Text fontWeight="bold" color="#2C319F">
                Subcategories:
              </Text>
              {categoryFilter.includes("Bonds") && (
                <>
                  <Checkbox value="Government Bonds">Government Bonds</Checkbox>
                  <Checkbox value="Corporate Bonds">Corporate Bonds</Checkbox>
                  <Checkbox value="Tax-Free Bonds">Tax-Free Bonds</Checkbox>
                </>
              )}
              {categoryFilter.includes("MutualFunds") && (
                <>
                  <Checkbox value="Equity Funds">Equity Funds</Checkbox>
                  <Checkbox value="Hybrid Funds">Hybrid Funds</Checkbox>
                  <Checkbox value="Index Funds">Index Funds</Checkbox>
                  <Checkbox value="Real Estate Funds">
                    Real Estate Funds
                  </Checkbox>
                </>
              )}
              {categoryFilter.includes("GoldInvestments") && (
                <>
                  <Checkbox value="Physical Gold">Physical Gold</Checkbox>
                  <Checkbox value="Digital Gold">Digital Gold</Checkbox>
                  <Checkbox value="Gold ETFs">Gold ETFs</Checkbox>
                  <Checkbox value="Sovereign Gold Bonds">
                    Sovereign Gold Bonds
                  </Checkbox>
                </>
              )}
              {categoryFilter.includes("Provident Funds") && (
                <>
                  <Checkbox value="Employee Provident Fund (EPF)">
                    Employee Provident Fund (EPF)
                  </Checkbox>
                  <Checkbox value="Public Provident Fund (PPF)">
                    Public Provident Fund (PPF)
                  </Checkbox>
                  <Checkbox value="General Provident Fund (GPF)">
                    General Provident Fund (GPF)
                  </Checkbox>
                </>
              )}
            </CheckboxGroup>
          </Box>
          <Flex wrap="wrap" justifyContent="center" mt={5}>
            {filteredPlans.map((plan) => (
              <Box key={plan.id} m={2}>
                <Plancards
                  header={plan.planName}
                  summary={plan.description}
                  investmentCategory={plan.investmentCategory}
                  investmentSubCategory={plan.investmentSubCategory}
                  onClick={() => handlePlanClick(plan)}
                />
              </Box>
            ))}
          </Flex>
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
                <Text mb={4} fontSize="md" lineHeight="1.6">
                  <strong>Category:</strong> {selectedPlan.investmentCategory}
                </Text>
                <Text mb={4} fontSize="md" lineHeight="1.6">
                  <strong>Sub Category:</strong>{" "}
                  {selectedPlan.investmentSubCategory}
                </Text>

                {/* ROI Calculator */}
                <Text mb={4} fontSize="md" fontWeight="bold" color="#2C319F">
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

export default Page;
