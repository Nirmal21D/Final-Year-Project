"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AdminSideNav from "@/adminComponents/AdminSideNav";
import AdminHeader from "@/adminComponents/AdminHeader";
import {
  Box, Flex, Heading, Text, Button, Grid, Table, Thead, Tbody, Tr, Th, Td, Avatar,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid,
  Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Spinner, Center,
  useToast, IconButton, Menu, MenuButton, MenuList, MenuItem, ButtonGroup
} from "@chakra-ui/react";
import { 
  FiUsers, FiDatabase, FiCheckCircle, FiXCircle, FiClock,
  FiTrendingUp, FiBarChart2, FiDollarSign, FiActivity, FiChevronDown, FiEye
} from "react-icons/fi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  AreaChart, Area, ComposedChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [totalBanks, setTotalBanks] = useState(0);
  const [totalPlans, setTotalPlans] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [verifiedBanks, setVerifiedBanks] = useState(0);
  const [rejectedBanks, setRejectedBanks] = useState(0);
  const [banks, setBanks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    dailyRegistrations: [],
    planCategories: [],
    bankLocations: [],
    investmentTrends: [],
    userActivity: [],
    planPerformance: [],
    bankMetrics: [],
    revenueStats: []
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const toast = useToast();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const [bankFilter, setBankFilter] = useState('all');
  const [planStats, setPlanStats] = useState({});



  useEffect(() => {
    const fetchBankAndPlanData = async () => {
      try {
        setLoading(true);
        const banksRef = collection(db, "Banks");
        const plansRef = collection(db, "investmentplans");
        const usersRef = collection(db, "users");
        const loanAppsRef = collection(db, "loanApplications");
    
        // Fetch all data in parallel
        const [banksSnap, plansSnap, usersSnap, loanAppsSnap] = await Promise.all([
          getDocs(banksRef),
          getDocs(plansRef),
          getDocs(usersRef),
          getDocs(loanAppsRef)
        ]);
    
        // Process banks data
        const banksData = banksSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBanks(banksData);
    
        // Process plans data
        const plansData = plansSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
    
        // Update counts
        setTotalBanks(banksSnap.size);
        setTotalPlans(plansSnap.size);
        setPendingVerifications(banksData.filter(bank => !bank.isVerified && !bank.isRejected).length);
        setVerifiedBanks(banksData.filter(bank => bank.isVerified).length);
        setRejectedBanks(banksData.filter(bank => bank.isRejected).length);
    
        // Process analytics data
        const analytics = processAnalytics(banksData, plansData, usersSnap.docs, loanAppsSnap.docs);
        setAnalyticsData(analytics);
    
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: "Please try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBankAndPlanData();
  }, []);

  useEffect(() => {
    const fetchAllPlanStats = async () => {
      const stats = {};
      for (const bank of banks) {
        stats[bank.id] = await fetchBankPlanStats(bank.id);
        
      }
      setPlanStats(stats);
     
    };

    if (banks.length > 0) {
      fetchAllPlanStats();
    }
  }, [banks]);

  const processAnalytics = (banks, plans, users, loanApps) => {
  return {
    dailyRegistrations: processDailyData(users),
    planCategories: processPlansData(plans),
    bankLocations: processBankLocations(banks),
    investmentTrends: processInvestmentTrends(loanApps),
    userActivity: processUserActivity(users, loanApps),
    planPerformance: processPlanPerformance(plans, loanApps),
    bankMetrics: processBankMetrics(banks, loanApps),
    revenueStats: processRevenueStats(loanApps)
  };
};

  // Add these data processing functions after the existing processAnalytics function
const processDailyData = (users) => {
  const dailyData = {};
  users.forEach(doc => {
    const data = doc.data();
    // Handle both Firestore Timestamp and regular date objects
    const timestamp = data.createdAt;
    let date;
    
    if (timestamp?.seconds) {
      // Handle Firestore Timestamp
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    }

    if (date) {
      const dateString = date.toLocaleDateString();
      dailyData[dateString] = (dailyData[dateString] || 0) + 1;
    }
  });
  
  return Object.entries(dailyData)
    .map(([date, count]) => ({
      date,
      registrations: count
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30); // Last 30 days
};

const processPlansData = (plans) => {
  const categories = {};
  plans.forEach(plan => {
    const category = plan.category || 'Other';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return Object.entries(categories).map(([name, value]) => ({
    name,
    value
  }));
};

const processBankLocations = (banks) => {
  const locations = {};
  banks.forEach(bank => {
    const location = bank.location || 'Unknown';
    locations[location] = (locations[location] || 0) + 1;
  });
  
  return Object.entries(locations).map(([name, value]) => ({
    name,
    value
  }));
};

const processInvestmentTrends = (loanApps) => {
  const monthlyData = {};
  loanApps.forEach(doc => {
    const data = doc.data();
    const date = data.createdAt?.toDate();
    if (date && data.loanAmount) {
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + Number(data.loanAmount);
    }
  });
  
  return Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      amount
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
};

const processUserActivity = (users, loanApps) => {
  const activityData = {};
  const now = new Date();
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('default', { weekday: 'short' });
    activityData[dateStr] = {
      date: dateStr,
      newUsers: 0,
      applications: 0,
      interactions: 0
    };
  }

  // Process user registrations with safe timestamp handling
  users.forEach(doc => {
    const data = doc.data();
    const timestamp = data.createdAt;
    let date;

    if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    }

    if (date) {
      const dateStr = date.toLocaleDateString('default', { weekday: 'short' });
      if (activityData[dateStr]) {
        activityData[dateStr].newUsers++;
        activityData[dateStr].interactions++;
      }
    }
  });

  // Process loan applications with safe timestamp handling
  loanApps.forEach(doc => {
    const data = doc.data();
    const timestamp = data.createdAt;
    let date;

    if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    }

    if (date) {
      const dateStr = date.toLocaleDateString('default', { weekday: 'short' });
      if (activityData[dateStr]) {
        activityData[dateStr].applications++;
        activityData[dateStr].interactions++;
      }
    }
  });

  return Object.values(activityData);
};

const processPlanPerformance = (plans, loanApps) => {
  const performance = {};
  
  plans.forEach(plan => {
    const category = plan.category || 'Other';
    if (!performance[category]) {
      performance[category] = {
        category,
        applications: 0,
        approved: 0,
        avgAmount: 0,
        totalAmount: 0
      };
    }
  });

  loanApps.forEach(doc => {
    const data = doc.data();
    const category = data.loanCategory || 'Other';
    if (performance[category]) {
      performance[category].applications++;
      if (data.status === 'approved') {
        performance[category].approved++;
        performance[category].totalAmount += Number(data.loanAmount || 0);
      }
    }
  });

  // Calculate averages
  Object.values(performance).forEach(cat => {
    cat.avgAmount = cat.approved > 0 ? cat.totalAmount / cat.approved : 0;
  });

  return Object.values(performance);
};

const fetchBankPlanStats = async (bankId) => {
  try {
    const [investmentPlans, loanPlans] = await Promise.all([
      getDocs(query(collection(db, "investmentplans"), where("createdBy", "==", bankId))),
      getDocs(query(collection(db, "loanplans"), where("createdBy", "==", bankId)))
    ]);

    return {
      totalInvestmentPlans: investmentPlans.size,
      totalLoanPlans: loanPlans.size,
      activeInvestmentPlans: investmentPlans.docs.filter(doc => doc.data().isVerified).length,
      activeLoanPlans: loanPlans.docs.filter(doc => doc.data().isVerified).length
    };
  } catch (error) {
    console.error("Error fetching plan stats:", error);
    return null;
  }
};

  const handleRejectBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await updateDoc(bankRef, {
        isRejected: true,
        isVerified: false,
      });

      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === bankId
            ? { ...bank, isRejected: true, isVerified: false }
            : bank
        )
      );

      toast({
        title: "Bank rejected",
        description: "The bank has been successfully rejected",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error rejecting bank:", error);
      toast({
        title: "Error",
        description: "Failed to reject bank. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVerifyBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await updateDoc(bankRef, {
        isVerified: true,
        isRejected: false,
      });

      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === bankId
            ? { ...bank, isVerified: true, isRejected: false }
            : bank
        )
      );

      toast({
        title: "Bank verified",
        description: "The bank has been successfully verified",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error verifying bank:", error);
      toast({
        title: "Error",
        description: "Failed to verify bank. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Flex bg="#F0F4FB" minH="100vh">
        <Box
          w="20%"
          bg="gray.800"
          color="white"
          p={4}
          position="fixed"
          h="full"
        >
          <AdminSideNav />
        </Box>

        {/* Main Content */}
        <Box flex="1" ml="20%">
          <Box mb={6}>
            {/* <AdminHeader /> */}
            <Flex justify="space-between" align="center" mt={2} px={6}>
              <Heading size="lg" color="emerald.400">
                Admin Dashboard
              </Heading>
              <Flex align="center" gap={4}>
                <Text color="gray.600">Hello, Admin</Text>
                <Avatar src="/admin-avatar.png" size="md" />
              </Flex>
            </Flex>
          </Box>

          {/* Dashboard Cards */}
          <Box px={6} py={4}>
            {/* Overview Stats */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
              <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="blue.500">
                <StatLabel fontSize="md">Total Banks</StatLabel>
                <StatNumber fontSize="2xl">{totalBanks}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {((verifiedBanks / totalBanks) * 100).toFixed(1)}% verified
                </StatHelpText>
              </Stat>

              <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="green.500">
                <StatLabel fontSize="md">Verified Banks</StatLabel>
                <StatNumber fontSize="2xl">{verifiedBanks}</StatNumber>
                <StatHelpText>Active and verified</StatHelpText>
              </Stat>

              <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="orange.500">
                <StatLabel fontSize="md">Pending Verifications</StatLabel>
                <StatNumber fontSize="2xl">{pendingVerifications}</StatNumber>
                <StatHelpText>Awaiting review</StatHelpText>
              </Stat>

              <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="red.500">
                <StatLabel fontSize="md">Rejected Banks</StatLabel>
                <StatNumber fontSize="2xl">{rejectedBanks}</StatNumber>
                <StatHelpText>Not approved</StatHelpText>
              </Stat>
            </SimpleGrid>
          
            {/* Analytics Tabs */}
            {loading ? (
              <Center p={8}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
              </Center>
            ) : (
              <Tabs variant="enclosed" colorScheme="blue" bg="white" borderRadius="lg" boxShadow="sm" p={4}>
                <TabList>
                  <Tab><FiActivity className="mr-2" /> Activity Overview</Tab>
                  <Tab><FiBarChart2 className="mr-2" /> Plans Analysis</Tab>
                  <Tab><FiUsers className="mr-2" /> Bank Distribution</Tab>
                  <Tab><FiTrendingUp className="mr-2" /> Trends</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Box height="400px">
                      <Heading size="sm" mb={4}>User Activity & Engagement</Heading>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={analyticsData.userActivity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="newUsers" fill="#8884d8" name="New Users" />
                          <Bar yAxisId="left" dataKey="applications" fill="#82ca9d" name="Applications" />
                          <Line yAxisId="right" type="monotone" dataKey="interactions" stroke="#ff7300" name="Interactions" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  </TabPanel>

                  <TabPanel>
                    <Box height="400px">
                      <Heading size="sm" mb={4}>Plan Performance Analysis</Heading>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={150} data={analyticsData.planPerformance}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis />
                          <Radar name="Applications" dataKey="applications" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Radar name="Approved" dataKey="approved" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Box>
                  </TabPanel>

                  <TabPanel>
                    <Box height="400px">
                      <Heading size="sm" mb={4}>Bank Distribution & Performance</Heading>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.bankMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="#8884d8" fill="#8884d8" />
                          <Area type="monotone" dataKey="completedLoans" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                          <Area type="monotone" dataKey="pendingApplications" stackId="1" stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </TabPanel>

                  <TabPanel>
                    <Box height="400px">
                      <Heading size="sm" mb={4}>Investment & Revenue Trends</Heading>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={analyticsData.revenueStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                          <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ff7300" name="Growth Rate" />
                          <Scatter yAxisId="left" dataKey="transactions" fill="#82ca9d" name="Transactions" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          
            {/* Banks Management Section */}
            <Box mt={8}>
  <Flex justify="space-between" align="center" mb={4}>
    <Heading size="md">Banks Management</Heading>
    <ButtonGroup>
      <Menu>
        <MenuButton as={Button} rightIcon={<FiChevronDown />}>
          {bankFilter === 'all' ? 'All Banks' :
           bankFilter === 'pending' ? 'Pending Verification' :
           bankFilter === 'verified' ? 'Verified' : 'Rejected'}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setBankFilter('all')}>All Banks</MenuItem>
          <MenuItem onClick={() => setBankFilter('pending')}>Pending Verification</MenuItem>
          <MenuItem onClick={() => setBankFilter('verified')}>Verified</MenuItem>
          <MenuItem onClick={() => setBankFilter('rejected')}>Rejected</MenuItem>
        </MenuList>
      </Menu>
    </ButtonGroup>
  </Flex>
  
  <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Bank Details</Th>
          <Th>Investment Plans</Th>
          <Th>Loan Plans</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {banks
          .filter(bank => {
            if (bankFilter === 'pending') return !bank.isVerified && !bank.isRejected;
            if (bankFilter === 'verified') return bank.isVerified;
            if (bankFilter === 'rejected') return bank.isRejected;
            return true;
          })
          .map((bank) => (
            <Tr key={bank.id}>
              <Td>
                <Flex align="center" gap={3}>
                  <Avatar size="sm" name={bank.bankName} src={bank.logo} />
                  <Box>
                    <Text fontWeight="medium">{bank.bankName}</Text>
                    <Text fontSize="sm" color="gray.500">{bank.email}</Text>
                  </Box>
                </Flex>
              </Td>
              <Td>
                <SimpleGrid columns={2} spacing={2}>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Total</StatLabel>
                    <StatNumber fontSize="md">{planStats[bank.id]?.totalInvestmentPlans || 0}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Active</StatLabel>
                    <StatNumber fontSize="md">{planStats[bank.id]?.activeInvestmentPlans || 0}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </Td>
              <Td>
                <SimpleGrid columns={2} spacing={2}>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Total</StatLabel>
                    <StatNumber fontSize="md">{planStats[bank.id]?.totalLoanPlans || 0}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Active</StatLabel>
                    <StatNumber fontSize="md">{planStats[bank.id]?.activeLoanPlans || 0}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </Td>
              <Td>
                <Badge
                  colorScheme={
                    bank.isVerified ? 'green' : 
                    bank.isRejected ? 'red' : 'yellow'
                  }
                >
                  {bank.isVerified ? 'Verified' : 
                   bank.isRejected ? 'Rejected' : 'Pending'}
                </Badge>
              </Td>
              <Td>
                <Flex gap={2} justify="center">
                  {!bank.isVerified && !bank.isRejected ? (
                    <>
                      <IconButton
                        size="sm"
                        colorScheme="green"
                        icon={<FiCheckCircle />}
                        onClick={() => handleVerifyBank(bank.id)}
                        aria-label="Verify bank"
                        title="Verify Bank"
                      />
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        icon={<FiXCircle />}
                        onClick={() => handleRejectBank(bank.id)}
                        aria-label="Reject bank"
                        title="Reject Bank"
                      />
                    </>
                  ) : null}
                </Flex>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  </Box>
</Box>

          </Box>

          {/* Footer */}
          <Box mt={12} mb={6} textAlign="center" color="gray.600">
            <Text>© 5 Admin Panel. All Rights Reserved.</Text>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default AdminDashboard;
