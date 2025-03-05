"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Button,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { FiPlus, FiFileText, FiUsers, FiBarChart2 } from "react-icons/fi";
import BankHeaders from "@/bankComponents/BankHeaders";
import BankSidenav from "@/bankComponents/BankSidenav";
import DashStats from "@/bankComponents/DashStats";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from "@/utils/formatters"; // Create this utility

// Add these functions before the BankDashboard component
const processDailyData = (users) => {
  const dailyData = {};
  const now = new Date();
  const last30Days = new Date(now.setDate(now.getDate() - 30));

  users.forEach(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate();
    if (createdAt && createdAt >= last30Days) {
      const dateStr = createdAt.toLocaleDateString();
      dailyData[dateStr] = (dailyData[dateStr] || 0) + 1;
    }
  });

  return Object.entries(dailyData)
    .map(([date, count]) => ({
      date,
      registrations: count
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processPlansData = (plans) => {
  const categories = {};
  
  plans.forEach(doc => {
    const data = doc.data();
    const category = data.investmentCategory || data.loanCategory || 'Other';
    categories[category] = (categories[category] || 0) + 1;
  });

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }));
};

const processBankLocations = (banks) => {
  const locations = {};
  
  banks.forEach(doc => {
    const data = doc.data();
    const location = data.city || 'Unknown';
    locations[location] = (locations[location] || 0) + 1;
  });

  return Object.entries(locations)
    .map(([name, value]) => ({ name, value }));
};

const processInvestmentTrends = (loanApps) => {
  const trends = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    trends.push({
      month: month.toLocaleString('default', { month: 'short', year: 'numeric' }),
      amount: 0
    });
  }

  loanApps.forEach(doc => {
    const data = doc.data();
    if (data.status === 'approved' && data.loanAmount) {
      const date = data.approvedAt?.toDate();
      if (date) {
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        const trend = trends.find(t => t.month === monthYear);
        if (trend) {
          trend.amount += Number(data.loanAmount);
        }
      }
    }
  });

  return trends;
};

const processUserActivity = (users, loanApps) => {
  const activityData = {};
  const now = new Date();
  
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

  users.forEach(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate();
    if (createdAt) {
      const dateStr = createdAt.toLocaleDateString('default', { weekday: 'short' });
      if (activityData[dateStr]) {
        activityData[dateStr].newUsers++;
        activityData[dateStr].interactions++;
      }
    }
  });

  loanApps.forEach(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate();
    if (createdAt) {
      const dateStr = createdAt.toLocaleDateString('default', { weekday: 'short' });
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
    const data = plan.data();
    const category = data.investmentCategory || data.loanCategory || 'Other';
    if (!performance[category]) {
      performance[category] = {
        category,
        applications: 0,
        approved: 0,
        totalAmount: 0
      };
    }
  });

  loanApps.forEach(doc => {
    const data = doc.data();
    const category = data.category || 'Other';
    if (performance[category]) {
      performance[category].applications++;
      if (data.status === 'approved') {
        performance[category].approved++;
        performance[category].totalAmount += Number(data.loanAmount || 0);
      }
    }
  });

  return Object.values(performance);
};

const BankDashboard = () => {
  const [isVerified, setIsVerified] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalInvestmentPlans: 0,
    activeInvestmentPlans: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
    totalLoanPlans: 0,
    activeLoanPlans: 0,
    loanUtilization: 0,
    totalLoanAmount: 0,
    avgLoanAmount: 0,
    totalApplications: 0,
    approvalRate: 0,
    recentActivity: []
  });
  const [timelineData, setTimelineData] = useState([]);
  const [loanDistribution, setLoanDistribution] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const router = useRouter();
  const toast = useToast();

  const handleError = (error, message) => {
    console.error(error);
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

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
            const investmentPlansQuery = query(
              investmentPlansRef,
              where("createdBy", "==", currentUser.uid)
            );
            const investmentPlansSnapshot = await getDocs(investmentPlansQuery);

            const customersRef = collection(db, "Customers");
            const customersQuery = query(
              customersRef,
              where("createdBy", "==", currentUser.uid)
            );
            const customersSnapshot = await getDocs(customersQuery);

            const activeInvestmentPlans = investmentPlansSnapshot.docs.filter(
              (doc) => doc.data().status === "approved"
            ).length;

            // Fetch loan plans data
            const loanPlansRef = collection(db, "loanplans");
            const loanPlansQuery = query(
              loanPlansRef,
              where("createdBy", "==", currentUser.uid)
            );
            const loanPlansSnapshot = await getDocs(loanPlansQuery);

            const activeLoanPlans = loanPlansSnapshot.docs.filter(
              (doc) => doc.data().status === "approved"
            ).length;

            setAnalytics({
              totalInvestmentPlans: investmentPlansSnapshot.size,
              activeInvestmentPlans: activeInvestmentPlans,
              totalCustomers: customersSnapshot.size,
              monthlyGrowth: (
                (activeInvestmentPlans / investmentPlansSnapshot.size) *
                100
              ).toFixed(1),
              totalLoanPlans: loanPlansSnapshot.size,
              activeLoanPlans: activeLoanPlans,
              loanUtilization: (
                (activeLoanPlans / loanPlansSnapshot.size) *
                100
              ).toFixed(1),
            });

            const fetchExtendedAnalytics = async () => {
              setChartsLoading(true);
              try {
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                
                const loanAppsRef = collection(db, "loanApplications");
                // Simplified query without composite index
                const loanAppsQuery = query(
                  loanAppsRef,
                  where("createdBy", "==", currentUser.uid)
                );
                
                const querySnapshot = await getDocs(loanAppsQuery);
            
                // Process data with client-side filtering
                const docs = querySnapshot.docs.filter(doc => {
                  const submitDate = doc.data().applicationStatus?.submittedAt?.toDate();
                  return submitDate && submitDate >= sixMonthsAgo;
                });
            
                // Process data
                const { totalAmount, approvedCount, monthlyData, loanTypes } = processApplicationData(docs);
            
                // Update states
                setAnalytics(prev => ({
                  ...prev,
                  totalLoanAmount: totalAmount,
                  avgLoanAmount: totalAmount / (querySnapshot.size || 1),
                  totalApplications: querySnapshot.size,
                  approvalRate: (approvedCount / (querySnapshot.size || 1) * 100).toFixed(1)
                }));
            
                // Convert monthly data to timeline format
                const formattedTimelineData = Object.entries(monthlyData)
                  .map(([month, data]) => ({
                    month,
                    ...data
                  }))
                  .sort((a, b) => new Date(a.month) - new Date(b.month));
            
                // Convert loan types to distribution format
                const formattedDistribution = Object.entries(loanTypes)
                  .map(([name, value]) => ({
                    name,
                    value
                  }));
            
                setTimelineData(formattedTimelineData);
                setLoanDistribution(formattedDistribution);
            
                const analytics = processAnalytics(banks, [...investmentPlansSnapshot.docs, ...loanPlansSnapshot.docs], customersSnapshot.docs, querySnapshot.docs);
            
              } catch (error) {
                handleError(error, "Failed to fetch analytics data");
              } finally {
                setChartsLoading(false);
              }
            };
            
            fetchExtendedAnalytics();
          }
        }
      } else {
        setUser(null);
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const processApplicationData = (docs) => {
    const monthlyData = {};
    const loanTypes = {};
    let totalAmount = 0;
    let approvedCount = 0;
  
    docs.forEach(doc => {
      const data = doc.data();
      
      // Process amount
      if (data.loanDetails?.loanAmount) {
        totalAmount += parseFloat(data.loanDetails.loanAmount);
      }
      
      // Process status
      if (data.applicationStatus?.status === 'approved') {
        approvedCount++;
      }
      
      // Process timeline
      const submitDate = data.applicationStatus?.submittedAt?.toDate();
      if (submitDate) {
        const monthYear = submitDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { approved: 0, rejected: 0, pending: 0, total: 0 };
        }
        const status = data.applicationStatus?.status || 'pending';
        monthlyData[monthYear][status]++;
        monthlyData[monthYear].total++;
      }
      
      // Process loan types
      const category = data.loanDetails?.loanCategory;
      if (category) {
        loanTypes[category] = (loanTypes[category] || 0) + 1;
      }
    });
  
    return {
      totalAmount,
      approvedCount,
      monthlyData,
      loanTypes
    };
  };

  // Add this function after the processApplicationData function
  const processBankMetrics = (banks, loanApps) => {
    const metrics = [];
    const now = new Date();
    const monthsToShow = 6;
  
    // Initialize last 6 months of data
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      metrics.push({
        name: monthYear,
        activeUsers: 0,
        completedLoans: 0,
        pendingApplications: 0
      });
    }
  
    // Process loan applications
    loanApps.forEach(doc => {
      const data = doc.data();
      const createdAt = data.applicationStatus?.submittedAt?.toDate();
      
      if (createdAt) {
        const monthYear = createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
        const metricEntry = metrics.find(m => m.name === monthYear);
        
        if (metricEntry) {
          metricEntry.pendingApplications++;
          
          if (data.applicationStatus?.status === 'approved') {
            metricEntry.completedLoans++;
          }
          
          // Count unique users
          if (data.userId) {
            metricEntry.activeUsers++;
          }
        }
      }
    });
  
    return metrics;
  };
  
  // Update the processAnalytics function to use processBankMetrics
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

  // Add this function after processBankMetrics
  const processRevenueStats = (loanApps) => {
    const stats = [];
    const now = new Date();
    const monthsToShow = 6;
  
    // Initialize last 6 months of data
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      stats.push({
        month: monthYear,
        revenue: 0,
        growth: 0,
        transactions: 0
      });
    }
  
    // Process loan applications
    loanApps.forEach(doc => {
      const data = doc.data();
      const createdAt = data.applicationStatus?.submittedAt?.toDate();
      
      if (createdAt && data.applicationStatus?.status === 'approved') {
        const monthYear = createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
        const statEntry = stats.find(s => s.month === monthYear);
        
        if (statEntry) {
          const amount = parseFloat(data.loanDetails?.loanAmount || 0);
          statEntry.revenue += amount;
          statEntry.transactions++;
        }
      }
    });
  
    // Calculate growth rates
    for (let i = 1; i < stats.length; i++) {
      const prevRevenue = stats[i - 1].revenue;
      const currentRevenue = stats[i].revenue;
      
      if (prevRevenue > 0) {
        stats[i].growth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
      }
    }
  
    return stats;
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
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
      <Box w="18.8%" bg="gray.800" color="white" p={4}>
        <BankSidenav />
      </Box>

      {/* Main Content */}
      <Box w="80%" bg="gray.50" display="flex" flexDirection="column" overflowY="auto">
        {/* Fixed Header */}
        <Box position="sticky" top={0} zIndex={1}>
          <BankHeaders />
        </Box>

        {/* Scrollable Content */}
        <Box px={6} py={4}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} mb={8}>
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
              <StatHelpText>Currently active</StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Total Customers</StatLabel>
              <StatNumber>{analytics.totalCustomers}</StatNumber>
              <StatHelpText>Registered users</StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Plan Utilization</StatLabel>
              <StatNumber>{analytics.monthlyGrowth}%</StatNumber>
              <StatHelpText>Active vs Total Investment Plans</StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Total Loan Plans</StatLabel>
              <StatNumber>{analytics.totalLoanPlans}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Active Loan Plans</StatLabel>
              <StatNumber>{analytics.activeLoanPlans}</StatNumber>
              <StatHelpText>Currently active</StatHelpText>
            </Stat>
            <Stat p={4} bg="white" borderRadius="lg" boxShadow="sm">
              <StatLabel>Loan Utilization</StatLabel>
              <StatNumber>{analytics.loanUtilization}%</StatNumber>
              <StatHelpText>Active vs Total Loan Plans</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="blue.500">
              <StatLabel fontSize="md">Total Loan Amount</StatLabel>
              <StatNumber fontSize="2xl">
                ₹{(analytics?.totalLoanAmount || 0).toLocaleString()}
              </StatNumber>
              <StatHelpText>Across all applications</StatHelpText>
            </Stat>
            
            <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="green.500">
              <StatLabel fontSize="md">Average Loan Size</StatLabel>
              <StatNumber fontSize="2xl">
                ₹{(Math.round(analytics?.avgLoanAmount) || 0).toLocaleString()}
              </StatNumber>
              <StatHelpText>Per application</StatHelpText>
            </Stat>
            
            <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="purple.500">
              <StatLabel fontSize="md">Approval Rate</StatLabel>
              <StatNumber fontSize="2xl">{analytics?.approvalRate || 0}%</StatNumber>
              <StatHelpText>Of total applications</StatHelpText>
            </Stat>
            
            <Stat p={6} bg="white" borderRadius="lg" boxShadow="sm" borderTop="4px" borderColor="orange.500">
              <StatLabel fontSize="md">Total Applications</StatLabel>
              <StatNumber fontSize="2xl">{analytics?.totalApplications || 0}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Charts Section */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
            {chartsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Box key={i} bg="white" p={6} borderRadius="lg" boxShadow="sm" height="400px">
                  <Center h="100%">
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                  </Center>
                </Box>
              ))
            ) : (
              <>
                {/* Application Timeline - Made Larger */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" height="400px">
                  <Heading size="md" mb={6}>Application Timeline</Heading>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="approved" stroke="#48BB78" strokeWidth={2} />
                      <Line type="monotone" dataKey="pending" stroke="#4299E1" strokeWidth={2} />
                      <Line type="monotone" dataKey="rejected" stroke="#F56565" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                {/* Loan Distribution - Made Larger */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" height="400px">
                  <Heading size="md" mb={6}>Loan Category Distribution</Heading>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={loanDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {loanDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                {/* Quick Actions - Updated */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                  <Heading size="md" mb={6}>Quick Actions</Heading>
                  <SimpleGrid columns={2} spacing={6}>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      height="100px"
                      onClick={() => router.push('/bankplans')}
                      leftIcon={<FiPlus />}
                    >
                      Create New Plan
                    </Button>
                    <Button
                      colorScheme="green"
                      size="lg"
                      height="100px"
                      onClick={() => router.push('/loanApplication')}
                      leftIcon={<FiFileText />}
                    >
                      Review Applications
                    </Button>
                  </SimpleGrid>
                </Box>

                {/* Monthly Activity Overview - Made Larger */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" height="400px">
                  <Heading size="md" mb={6}>Monthly Activity Overview</Heading>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#4299E1" />
                      <Bar dataKey="approved" fill="#48BB78" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
};

export default BankDashboard;
