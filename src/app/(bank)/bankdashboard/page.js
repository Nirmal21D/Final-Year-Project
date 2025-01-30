"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Alert, AlertIcon, AlertTitle, AlertDescription, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/react";
import BankHeaders from "@/bankComponents/BankHeaders";
import BankSidenav from "@/bankComponents/BankSidenav";
import DashStats from "@/bankComponents/DashStats";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

const BankDashboard = () => {
  const [isVerified, setIsVerified] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalInvestmentPlans: 0,
    activeInvestmentPlans: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
    totalLoanPlans: 0,
    activeLoanPlans: 0,
    loanUtilization: 0
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const bankDocRef = doc(db, "Banks", currentUser.uid);
        const bankDocSnap = await getDoc(bankDocRef);
        
        if (bankDocSnap.exists()) {
          const bankData = bankDocSnap.data();
          if (!bankData.isVerified) {
            setIsVerified(false);
            await auth.signOut();
          } else {
            // Fetch analytics data
            const investmentPlansRef = collection(db, "investmentplans");
            const investmentPlansQuery = query(investmentPlansRef, where("createdBy", "==", currentUser.uid));
            const investmentPlansSnapshot = await getDocs(investmentPlansQuery);
            
            const customersRef = collection(db, "Customers");
            const customersQuery = query(customersRef, where("createdBy", "==", currentUser.uid));
            const customersSnapshot = await getDocs(customersQuery);

            const activeInvestmentPlans = investmentPlansSnapshot.docs.filter(doc => doc.data().status === 'approved').length;

            // Fetch loan plans data
            const loanPlansRef = collection(db, "loanplans");
            const loanPlansQuery = query(loanPlansRef, where("createdBy", "==", currentUser.uid));
            const loanPlansSnapshot = await getDocs(loanPlansQuery);

            const activeLoanPlans = loanPlansSnapshot.docs.filter(doc => doc.data().status === 'approved').length;

            setAnalytics({
              totalInvestmentPlans: investmentPlansSnapshot.size,
              activeInvestmentPlans: activeInvestmentPlans,
              totalCustomers: customersSnapshot.size,
              monthlyGrowth: ((activeInvestmentPlans / investmentPlansSnapshot.size) * 100).toFixed(1),
              totalLoanPlans: loanPlansSnapshot.size,
              activeLoanPlans: activeLoanPlans,
              loanUtilization: ((activeLoanPlans / loanPlansSnapshot.size) * 100).toFixed(1)
            });
          }
        }
      } else {
        setUser(null);
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!isVerified) {
    return (
      <Alert status="error" variant="subtle" borderRadius="md" mt={4}>
        <AlertIcon />
        <AlertTitle>Bank Not Verified</AlertTitle>
        <AlertDescription>
          Your bank is not verified. Please contact the admin for assistance.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box w="20%" bg="gray.800" color="white" p={4}>
        <BankSidenav />
      </Box>

      {/* Main Content */}
      <Box w="80%" bg="gray.50" display="flex" flexDirection="column">
        {/* Fixed Header */}
        <Box position="fixed" width="80%">
          <BankHeaders />
        </Box>

        {/* Scrollable Content */}
        <Box px={6} mt={24}>
          <SimpleGrid columns={4} spacing={10} mb={8}>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Total Investment Plans</StatLabel>
              <StatNumber>{analytics.totalInvestmentPlans}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                All time
              </StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Active Investment Plans</StatLabel>
              <StatNumber>{analytics.activeInvestmentPlans}</StatNumber>
              <StatHelpText>
                Currently active
              </StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Total Customers</StatLabel>
              <StatNumber>{analytics.totalCustomers}</StatNumber>
              <StatHelpText>
                Registered users
              </StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Plan Utilization</StatLabel>
              <StatNumber>{analytics.monthlyGrowth}%</StatNumber>
              <StatHelpText>
                Active vs Total Investment Plans
              </StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Total Loan Plans</StatLabel>
              <StatNumber>{analytics.totalLoanPlans}</StatNumber>
              <StatHelpText>
                All time
              </StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Active Loan Plans</StatLabel>
              <StatNumber>{analytics.activeLoanPlans}</StatNumber>
              <StatHelpText>
                Currently active
              </StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Loan Utilization</StatLabel>
              <StatNumber>{analytics.loanUtilization}%</StatNumber>
              <StatHelpText>
                Active vs Total Loan Plans
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        
        </Box>
      </Box>
    </Flex>
  );
};

export default BankDashboard;
