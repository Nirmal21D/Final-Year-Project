"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  Heading,
  Select,
  Grid,
  GridItem,
  Container,
  Card,
  CardBody,
  CardHeader,
  Stack,
  useBreakpointValue,
  Image,
  InputGroup,
  InputLeftElement,
  useToast,
  Badge,
  Flex,
  Divider,
  IconButton,
  Tooltip,
  useColorModeValue,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Pie, Bar, Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
} from "chart.js";
import { MdRefresh, MdArrowBack, MdDownload, MdInfo } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  RadialLinearScale,
  PointElement
);

const BudgetPlannerPage = () => {
  const [salary, setSalary] = useState("");
  const [formula, setFormula] = useState("50-30-20");
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pie");
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const reportRef = useRef(null);
  
  // Budget data state
  const [budgetData, setBudgetData] = useState({
    investment: 0,
    dailyNeeds: 0,
    savings: 0,
    breakdown: {
      sip: 0,
      mutualFunds: 0,
      bonds: 0,
      realEstate: 0,
      gold: 0,
      fixedDeposits: 0,
    },
    needsBreakdown: {
      housing: 0,
      utilities: 0,
      groceries: 0,
      transportation: 0,
      healthcare: 0,
      miscellaneous: 0
    }
  });

  const calculateBudget = () => {
    // Input validation
    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) {
      setError("Please enter a valid salary amount");
      return;
    }
    
    setError("");
    const salaryNum = Number(salary);
    let investPercentage = 0.3;
    let dailyNeedsPercentage = 0.5;
    let savingsPercentage = 0.2;

    if (formula === "60-20-20") {
      investPercentage = 0.2;
      dailyNeedsPercentage = 0.6;
    } else if (formula === "40-40-20") {
      investPercentage = 0.4;
      dailyNeedsPercentage = 0.4;
    }

    const investment = salaryNum * investPercentage;
    const dailyNeeds = salaryNum * dailyNeedsPercentage;

    setBudgetData({
      investment,
      dailyNeeds,
      savings: salaryNum * savingsPercentage,
      breakdown: {
        sip: investment * 0.2,
        mutualFunds: investment * 0.15,
        bonds: investment * 0.15,
        realEstate: investment * 0.25,
        gold: investment * 0.15,
        fixedDeposits: investment * 0.1,
      },
      needsBreakdown: {
        housing: dailyNeeds * 0.35,
        utilities: dailyNeeds * 0.10,
        groceries: dailyNeeds * 0.25,
        transportation: dailyNeeds * 0.15,
        healthcare: dailyNeeds * 0.10,
        miscellaneous: dailyNeeds * 0.05
      }
    });

    setShowResults(true);
    toast({
      title: "Budget calculated!",
      description: "Your budget has been calculated successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const getFormulaDescription = (formulaType) => {
    switch (formulaType) {
      case "50-30-20":
        return "50% for needs, 30% for investments, 20% for savings";
      case "60-20-20":
        return "60% for needs, 20% for investments, 20% for savings";
      case "40-40-20":
        return "40% for needs, 40% for investments, 20% for savings";
      default:
        return "";
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateBudget();
    }
  };

  // Actual PDF download functionality
  const downloadReport = async () => {
    if (!reportRef.current) return;

    toast({
      title: "Preparing your report",
      description: "Please wait while we generate your PDF",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    try {
      const content = reportRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: cardBg
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Budget_Plan_${salary}_${formula}.pdf`);
      
      toast({
        title: "Report downloaded!",
        description: "Your budget report has been successfully downloaded as PDF",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Chart data for main allocation
  const pieChartData = {
    labels: ["Daily Needs", "Investments", "Savings"],
    datasets: [
      {
        data: [
          budgetData.dailyNeeds,
          budgetData.investment,
          budgetData.savings,
        ],
        backgroundColor: ["#4A5568", "#4299E1", "#68D391"],
        borderColor: ["#2D3748", "#2B6CB0", "#38A169"],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for investment breakdown
  const doughnutChartData = {
    labels: [
      "SIP",
      "Mutual Funds",
      "Bonds",
      "Real Estate",
      "Gold",
      "Fixed Deposits",
    ],
    datasets: [
      {
        data: [
          budgetData.breakdown.sip,
          budgetData.breakdown.mutualFunds,
          budgetData.breakdown.bonds,
          budgetData.breakdown.realEstate,
          budgetData.breakdown.gold,
          budgetData.breakdown.fixedDeposits,
        ],
        backgroundColor: [
          "#4299E1",
          "#48BB78",
          "#ED8936",
          "#38B2AC",
          "#ECC94B",
          "#805AD5",
        ],
        borderColor: ["#2B6CB0", "#2F855A", "#C05621", "#2C7A7B", "#B7791F", "#553C9A"],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for main categories as bar chart
  const barChartData = {
    labels: ["Daily Needs", "Investments", "Savings"],
    datasets: [
      {
        label: "Budget Allocation (₹)",
        data: [
          budgetData.dailyNeeds,
          budgetData.investment,
          budgetData.savings,
        ],
        backgroundColor: ["#4A5568", "#4299E1", "#68D391"],
      },
    ],
  };

  // New chart data for daily needs breakdown
  const polarChartData = {
    labels: [
      "Housing",
      "Utilities",
      "Groceries",
      "Transportation",
      "Healthcare",
      "Miscellaneous"
    ],
    datasets: [
      {
        data: [
          budgetData.needsBreakdown.housing,
          budgetData.needsBreakdown.utilities,
          budgetData.needsBreakdown.groceries,
          budgetData.needsBreakdown.transportation,
          budgetData.needsBreakdown.healthcare,
          budgetData.needsBreakdown.miscellaneous,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <>
      <Container maxW="7xl" py={8}>
        <Heading 
          as="h1"
          size="xl"
          textAlign="center"
          mb={10}
          bgGradient="linear(to-r, blue.400, teal.500)"
          bgClip="text"
        >
          Personal Budget Planner
        </Heading>
        
        {!showResults ? (
          <Card maxW="md" mx="auto" bg={cardBg} boxShadow="xl" borderRadius="lg">
            <CardHeader>
              <Heading size="lg" textAlign="center" color={textColor}>
                Plan Your Budget
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={5}>
                <Box w="100%">
                  <Text fontSize="md" fontWeight="medium" color={textColor} mb={2}>
                    Enter your monthly salary:
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaRupeeSign color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      color={textColor}
                      onKeyPress={handleKeyPress}
                      focusBorderColor="blue.400"
                    />
                  </InputGroup>
                </Box>
                
                <Box w="100%">
                  <Text fontSize="md" fontWeight="medium" color={textColor} mb={2}>
                    Select Budgeting Formula:
                  </Text>
                  <Select
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    color={textColor}
                    focusBorderColor="blue.400"
                  >
                    <option value="50-30-20">50-30-20 Formula</option>
                    <option value="60-20-20">60-20-20 Formula</option>
                    <option value="40-40-20">40-40-20 Formula</option>
                  </Select>
                  <Flex align="center" mt={2}>
                    <MdInfo color="#718096" />
                    <Text fontSize="sm" color="gray.500" ml={1}>
                      {getFormulaDescription(formula)}
                    </Text>
                  </Flex>
                </Box>
                
                <Button 
                  colorScheme="blue" 
                  onClick={calculateBudget} 
                  width="100%" 
                  size="lg"
                  mt={2}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Calculate Budget
                </Button>
                
                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <div ref={reportRef}>
            <Flex justify="space-between" mb={6} align="center" wrap="wrap">
              <Heading size="md" color={textColor}>
                Monthly Budget: ₹{Number(salary).toLocaleString('en-IN')}
              </Heading>
              <Badge colorScheme="blue" p={2} borderRadius="md">
                {formula} Formula
              </Badge>
            </Flex>
            
            {/* Main Budget Allocation Section */}
            <Card bg={cardBg} boxShadow="lg" mb={6}>
              <CardHeader pb={0}>
                <Heading size="md" color={textColor}>
                  Budget Overview
                </Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                  <GridItem>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Category</Th>
                            <Th isNumeric>Amount (₹)</Th>
                            <Th isNumeric>Percentage</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>Daily Needs</Td>
                            <Td isNumeric>{budgetData.dailyNeeds.toLocaleString('en-IN')}</Td>
                            <Td isNumeric>{formula.split('-')[0]}%</Td>
                          </Tr>
                          <Tr>
                            <Td>Investments</Td>
                            <Td isNumeric>{budgetData.investment.toLocaleString('en-IN')}</Td>
                            <Td isNumeric>{formula.split('-')[1]}%</Td>
                          </Tr>
                          <Tr>
                            <Td>Savings</Td>
                            <Td isNumeric>{budgetData.savings.toLocaleString('en-IN')}</Td>
                            <Td isNumeric>{formula.split('-')[2]}%</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </GridItem>
                  <GridItem>
                    <Box height="300px">
                      <Pie data={pieChartData} options={chartOptions} />
                    </Box>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Investment Breakdown Section */}
            <Card bg={cardBg} boxShadow="lg" mb={6}>
              <CardHeader pb={0}>
                <Heading size="md" color={textColor}>
                  Investment Breakdown
                </Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                  <GridItem>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Investment Type</Th>
                            <Th isNumeric>Amount (₹)</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>SIP</Td>
                            <Td isNumeric>{budgetData.breakdown.sip.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Mutual Funds</Td>
                            <Td isNumeric>{budgetData.breakdown.mutualFunds.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Bonds</Td>
                            <Td isNumeric>{budgetData.breakdown.bonds.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Real Estate</Td>
                            <Td isNumeric>{budgetData.breakdown.realEstate.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Gold</Td>
                            <Td isNumeric>{budgetData.breakdown.gold.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Fixed Deposits</Td>
                            <Td isNumeric>{budgetData.breakdown.fixedDeposits.toLocaleString('en-IN')}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </GridItem>
                  <GridItem>
                    <Box height="300px">
                      <Doughnut data={doughnutChartData} options={chartOptions} />
                    </Box>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Daily Needs Breakdown Section */}
            <Card bg={cardBg} boxShadow="lg" mb={6}>
              <CardHeader pb={0}>
                <Heading size="md" color={textColor}>
                  Daily Needs Breakdown
                </Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                  <GridItem>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Category</Th>
                            <Th isNumeric>Amount (₹)</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>Housing</Td>
                            <Td isNumeric>{budgetData.needsBreakdown.housing.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Utilities</Td>
                            <Td isNumeric>{budgetData.needsBreakdown.utilities.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Groceries</Td>
                            <Td isNumeric>{budgetData.needsBreakdown.groceries.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Transportation</Td>
                            <Td isNumeric>{budgetData.needsBreakdown.transportation.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Healthcare</Td>
                            <Td isNumeric>{budgetData.needsBreakdown.healthcare.toLocaleString('en-IN')}</Td>
                          </Tr>
                          <Tr>
                            <Td>Miscellaneous</Td>
                            <Td isNumeric>{budgetData.needsBreakdown.miscellaneous.toLocaleString('en-IN')}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </GridItem>
                  <GridItem>
                    <Box height="300px">
                      <PolarArea data={polarChartData} options={chartOptions} />
                    </Box>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </div>
        )}
      </Container>
      
      {showResults && (
        <Box textAlign="center" mt={8} mb={10}>
          <HStack spacing={4} justify="center">
            <Tooltip label="Go back to input form">
              <Button 
                leftIcon={<MdArrowBack />} 
                colorScheme="gray" 
                onClick={() => setShowResults(false)}
              >
                Go Back
              </Button>
            </Tooltip>
            <Tooltip label="Recalculate with current values">
              <Button 
                leftIcon={<MdRefresh />} 
                colorScheme="blue" 
                onClick={calculateBudget}
              >
                Recalculate
              </Button>
            </Tooltip>
            <Tooltip label="Download budget report">
              <Button 
                leftIcon={<MdDownload />} 
                colorScheme="teal" 
                onClick={downloadReport}
              >
                Download Report
              </Button>
            </Tooltip>
          </HStack>
        </Box>
      )}
    </>
  );
};

export default BudgetPlannerPage;
