"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Flex,
  Container,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Grid,
  GridItem,
  Stack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  HStack,
  VStack,
  Tag,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Badge,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaRupeeSign, FaPercentage, FaCalendarAlt, FaCalculator, FaChartPie, FaInfoCircle, FaDownload, FaUndo } from "react-icons/fa";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const InputForm = ({
  principal,
  setPrincipal,
  rate,
  setRate,
  tenure,
  setTenure,
  loanType,
  setLoanType,
  onCalculate,
  resetForm,
  isCalculating,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const sliderColor = useColorModeValue("blue.500", "blue.300");
  const sliderTrackColor = useColorModeValue("blue.100", "blue.800");
  const inputBg = useColorModeValue("white", "gray.700");
  
  const loanTypes = [
    { id: 'home', name: 'Home Loan', icon: '🏠', defaultRate: 8.5, maxTenure: 360, maxAmount: 10000000 },
    { id: 'car', name: 'Car Loan', icon: '🚗', defaultRate: 9.5, maxTenure: 84, maxAmount: 2000000 },
    { id: 'personal', name: 'Personal Loan', icon: '💼', defaultRate: 12.0, maxTenure: 60, maxAmount: 1500000 },
    { id: 'education', name: 'Education Loan', icon: '🎓', defaultRate: 7.5, maxTenure: 180, maxAmount: 5000000 },
    { id: 'business', name: 'Business Loan', icon: '📊', defaultRate: 11.0, maxTenure: 120, maxAmount: 8000000 },
  ];

  const handleLoanTypeChange = (type) => {
    const selectedLoan = loanTypes.find(loan => loan.id === type);
    setLoanType(type);
    setRate(selectedLoan.defaultRate);
    
    // Adjust tenure if current tenure is higher than max tenure for this loan type
    if (tenure > selectedLoan.maxTenure) {
      setTenure(selectedLoan.maxTenure);
    }
    
    // Adjust loan amount if it's higher than max amount for this loan type
    if (principal > selectedLoan.maxAmount) {
      setPrincipal(selectedLoan.maxAmount);
    }
  };

  const renderSliderWithTextbox = (
    label,
    value,
    setValue,
    min,
    max,
    step,
    icon,
    unit = "",
    tooltip = ""
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tempValue, setTempValue] = useState(value.toString());

    useEffect(() => {
      setTempValue(value.toString());
    }, [value]);

    const handleInputChange = (e) => {
      setTempValue(e.target.value);
      const val = parseFloat(e.target.value.replace(/,/g, ''));
      if (!isNaN(val)) {
        setValue(Math.min(Math.max(val, min), max));
      }
    };

    const handleInputBlur = () => {
      if (tempValue === '' || isNaN(parseFloat(tempValue))) {
        setTempValue(value.toString());
      }
    };

    // Generate marks for the slider with better formatting
    let marks = [];
    if (max > 1000) {
      // For large values like loan amounts
      const markStep = max / 4;
      marks = [
        { value: min, label: min >= 100000 ? `${(min/100000).toFixed(1)}L` : min >= 1000 ? `${(min/1000).toFixed(0)}K` : min.toLocaleString() },
        { value: markStep, label: markStep >= 100000 ? `${(markStep/100000).toFixed(1)}L` : `${(markStep/1000).toFixed(0)}K` },
        { value: markStep * 2, label: markStep * 2 >= 100000 ? `${(markStep*2/100000).toFixed(1)}L` : `${(markStep*2/1000).toFixed(0)}K` },
        { value: markStep * 3, label: markStep * 3 >= 100000 ? `${(markStep*3/100000).toFixed(1)}L` : `${(markStep*3/1000).toFixed(0)}K` },
        { value: max, label: max >= 100000 ? `${(max/100000).toFixed(1)}L` : `${(max/1000).toFixed(0)}K` }
      ];
    } else {
      // For smaller values like interest rates
      const markStep = max / 4;
      for (let i = 0; i <= 4; i++) {
        const markValue = min + markStep * i;
        marks.push({
          value: markValue,
          label: markValue.toFixed(max > 100 ? 0 : 1)
        });
      }
    }

    return (
      <Box mb={6} width="100%">
        <Flex align="center" mb={2}>
          <Box mr={2} color={sliderColor}>{icon}</Box>
          <Text fontWeight="medium" color={textColor}>{label}</Text>
          {tooltip && (
            <Tooltip label={tooltip} placement="top" hasArrow>
              <Box as="span" ml={1} cursor="help">
                <FaInfoCircle size="0.8em" color={useColorModeValue("gray.400", "gray.500")} />
              </Box>
            </Tooltip>
          )}
        </Flex>
        <Flex alignItems="center">
          <Slider
            flex="1"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(v) => {
              setValue(v);
              setTempValue(v.toString());
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            colorScheme="blue"
            mr={4}
          >
            {marks.map((mark) => (
              <SliderMark 
                key={mark.value} 
                value={mark.value} 
                mt="2" 
                ml="-2.5" 
                fontSize="xs"
                color={textColor}
                opacity={0.6}
              >
                {mark.label}
              </SliderMark>
            ))}
            <SliderTrack bg={sliderTrackColor}>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${unit === "₹" ? "₹" : ""}${value.toLocaleString()}${unit === "%" ? "%" : (unit ? ` ${unit}` : "")}`}
            >
              <SliderThumb boxSize={6}>
                <Box color="blue.500" />
              </SliderThumb>
            </Tooltip>
          </Slider>
          
          {unit === "₹" ? (
            <InputGroup size="md" width="150px">
              <InputLeftElement pointerEvents="none">
                <FaRupeeSign color="gray.500" />
              </InputLeftElement>
              <Input
                value={tempValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                bg={inputBg}
                borderColor={borderColor}
                textAlign="right"
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
              />
            </InputGroup>
          ) : unit === "%" ? (
            <InputGroup size="md" width="100px">
              <Input
                value={tempValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                bg={inputBg}
                borderColor={borderColor}
                textAlign="right"
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
              />
              <InputRightElement pointerEvents="none">
                <Text color="gray.500">%</Text>
              </InputRightElement>
            </InputGroup>
          ) : (
            <InputGroup size="md" width="100px">
              <Input
                width="100px"
                value={tempValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                bg={inputBg}
                borderColor={borderColor}
                textAlign="right"
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
              />
              <InputRightElement pointerEvents="none">
                <Text color="gray.500">{unit || "mo"}</Text>
              </InputRightElement>
            </InputGroup>
          )}
        </Flex>
      </Box>
    );
  };

  return (
    <Card 
      p={5} 
      borderRadius="xl" 
      shadow="md" 
      bg={bgColor}
      width="100%"
      maxW="450px"
      mx="auto"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardHeader pb={2}>
        <Heading size="md" mb={2} color={useColorModeValue("blue.600", "blue.300")} textAlign="center">
          EMI Calculator
        </Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Calculate your loan EMI and total interest payable
        </Text>
      </CardHeader>
      
      <Divider my={3} />
      
      <CardBody pt={4}>
        <Box mb={6}>
          <Text mb={2} fontWeight="medium" color={textColor}>Loan Type</Text>
          <Flex wrap="wrap" gap={2}>
            {loanTypes.map(loan => (
              <Tag 
                key={loan.id}
                size="lg" 
                variant={loanType === loan.id ? "solid" : "outline"}
                colorScheme="blue"
                cursor="pointer"
                onClick={() => handleLoanTypeChange(loan.id)}
                py={2}
                px={3}
                _hover={{
                  transform: loanType !== loan.id ? "translateY(-2px)" : "none",
                  shadow: loanType !== loan.id ? "md" : "none"
                }}
                transition="all 0.2s"
              >
                <span style={{ marginRight: '5px' }}>{loan.icon}</span> {loan.name}
              </Tag>
            ))}
          </Flex>
        </Box>

        {renderSliderWithTextbox(
          "Loan Amount",
          principal,
          setPrincipal,
          10000,
          loanTypes.find(loan => loan.id === loanType)?.maxAmount || 10000000,
          10000,
          <FaRupeeSign />,
          "₹",
          "The principal loan amount you need"
        )}

        {renderSliderWithTextbox(
          "Interest Rate",
          rate,
          setRate,
          4,
          24,
          0.1,
          <FaPercentage />,
          "%",
          "Annual interest rate for your loan"
        )}

        {renderSliderWithTextbox(
          "Loan Tenure",
          tenure,
          setTenure,
          3,
          loanTypes.find(loan => loan.id === loanType)?.maxTenure || 360,
          1,
          <FaCalendarAlt />,
          "",
          "Duration of your loan in months"
        )}

        <HStack spacing={4} mt={6}>
          <Button
            leftIcon={<FaUndo />}
            variant="outline"
            colorScheme="blue"
            onClick={resetForm}
            width="40%"
          >
            Reset
          </Button>
          
          <Button
            leftIcon={<FaCalculator />}
            colorScheme="blue"
            onClick={onCalculate}
            width="60%"
            isLoading={isCalculating}
            loadingText="Calculating..."
          >
            Calculate EMI
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const EMICalculatorPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);
  const [loanType, setLoanType] = useState('home');
  const [emi, setEmi] = useState(null);
  const [interest, setInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  
  const resultsRef = useRef(null);
  const toast = useToast();
  
  const resetForm = () => {
    setPrincipal(1000000);
    setRate(8.5);
    setTenure(60);
    setLoanType('home');
    setShowResults(false);
  };

  const calculateEMI = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        // Validation
        if (principal <= 0) {
          toast({
            title: "Invalid loan amount",
            description: "Please enter a positive loan amount",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsCalculating(false);
          return;
        }
        
        if (tenure <= 0) {
          toast({
            title: "Invalid tenure",
            description: "Please enter a valid tenure period",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsCalculating(false);
          return;
        }
        
        // Convert annual rate to monthly rate
        const monthlyRate = rate / 12 / 100;
        
        // Calculate EMI using formula
        const emiAmount =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
          (Math.pow(1 + monthlyRate, tenure) - 1);

        // Calculate total payment and interest
        const totalWithInterest = emiAmount * tenure;
        const interestAmount = totalWithInterest - principal;

        // Generate amortization schedule
        let schedule = [];
        let remainingPrincipal = principal;
        let totalPaid = 0;
        let totalPrincipalPaid = 0;
        let totalInterestPaid = 0;
        
        for (let month = 1; month <= tenure; month++) {
          // Calculate interest for this month
          const interestForMonth = remainingPrincipal * monthlyRate;
          
          // Calculate principal for this month
          const principalForMonth = emiAmount - interestForMonth;
          
          // Update remaining principal
          remainingPrincipal -= principalForMonth;
          
          // Update totals
          totalPaid += emiAmount;
          totalPrincipalPaid += principalForMonth;
          totalInterestPaid += interestForMonth;
          
          // Add to schedule
          schedule.push({
            month,
            emi: emiAmount,
            principal: principalForMonth,
            interest: interestForMonth,
            totalPrincipalPaid,
            totalInterestPaid,
            balance: Math.max(0, remainingPrincipal),
            year: Math.ceil(month / 12)
          });
        }

        // Generate yearly breakdown for visualization
        const years = Math.ceil(tenure / 12);
        let yearData = [];
        
        for (let year = 1; year <= years; year++) {
          const yearlyRecords = schedule.filter(item => item.year === year);
          const yearlyPrincipal = yearlyRecords.reduce((sum, item) => sum + item.principal, 0);
          const yearlyInterest = yearlyRecords.reduce((sum, item) => sum + item.interest, 0);
          
          yearData.push({
            year,
            principalPaid: yearlyPrincipal,
            interestPaid: yearlyInterest,
            totalPaid: yearlyPrincipal + yearlyInterest,
            remainingBalance: yearlyRecords[yearlyRecords.length - 1].balance
          });
        }

        // Update state with calculated values
        setEmi(emiAmount);
        setInterest(interestAmount);
        setTotalAmount(totalWithInterest);
        setAmortizationSchedule(schedule);
        setYearlyBreakdown(yearData);
        setShowResults(true);
        
        toast({
          title: "Calculation Complete",
          description: "Your EMI details have been calculated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Calculation error:", error);
        toast({
          title: "Calculation Error",
          description: "There was a problem calculating your EMI",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  const downloadPDF = async () => {
    if (!resultsRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Use html-to-image instead of html2canvas
      const dataUrl = await toPng(resultsRef.current);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight * ratio);
      pdf.save(`EMI_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      
      // Success toast...
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Error toast...
    } finally {
      setIsExporting(false);
    }
  };
  
  // Prepare chart data for pie chart
  const pieChartData = {
    labels: ['Principal Amount', 'Interest Amount'],
    datasets: [
      {
        data: [principal, interest],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value / totalAmount) * 100).toFixed(1);
            return `${label}: ₹${Math.round(value).toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Yearly breakdown chart data
  const yearlyChartData = {
    labels: yearlyBreakdown.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Principal Paid',
        data: yearlyBreakdown.map(item => item.principalPaid),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Interest Paid',
        data: yearlyBreakdown.map(item => item.interestPaid),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };
  
  const yearlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + (value >= 1000000 
              ? (value/1000000).toFixed(1) + 'M' 
              : value >= 1000 
                ? (value/1000).toFixed(0) + 'K' 
                : value);
          }
        }
      }
    }
  };
  
  // Balance progression chart data
  const balanceChartData = {
    labels: yearlyBreakdown.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: yearlyBreakdown.map(item => item.remainingBalance),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  const loanTypes = [
    { id: 'home', name: 'Home Loan', icon: '🏠', defaultRate: 8.5 },
    { id: 'car', name: 'Car Loan', icon: '🚗', defaultRate: 9.5 },
    { id: 'personal', name: 'Personal Loan', icon: '💼', defaultRate: 12.0 },
    { id: 'education', name: 'Education Loan', icon: '🎓', defaultRate: 7.5 },
    { id: 'business', name: 'Business Loan', icon: '📊', defaultRate: 11.0 },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <Heading 
        as="h1"
        size="xl"
        textAlign="center"
        mb={8}
        bgGradient="linear(to-r, blue.400, blue.600)"
        bgClip="text"
      >
        EMI Calculator
      </Heading>
      
      {!showResults ? (
        <InputForm
          principal={principal}
          setPrincipal={setPrincipal}
          rate={rate}
          setRate={setRate}
          tenure={tenure}
          setTenure={setTenure}
          loanType={loanType}
          setLoanType={setLoanType}
          onCalculate={calculateEMI}
          resetForm={resetForm}
          isCalculating={isCalculating}
        />
      ) : (
        <Grid
          templateColumns={{ base: "1fr", lg: "350px 1fr" }}
          gap={6}
        >
          <GridItem>
            <InputForm
              principal={principal}
              setPrincipal={setPrincipal}
              rate={rate}
              setRate={setRate}
              tenure={tenure}
              setTenure={setTenure}
              loanType={loanType}
              setLoanType={setLoanType}
              onCalculate={calculateEMI}
              resetForm={resetForm}
              isCalculating={isCalculating}
            />
          </GridItem>

          <GridItem>
            <div ref={resultsRef}>
              <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden">
                <CardHeader pb={0}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md" color={accentColor}>
                      EMI Calculation Results
                    </Heading>
                    <Button
                      size="sm"
                      leftIcon={<FaDownload />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={downloadPDF}
                      isLoading={isExporting}
                      loadingText="Exporting"
                    >
                      Download Report
                    </Button>
                  </Flex>
                </CardHeader>
                
                <CardBody>
                  <Tabs colorScheme="blue" isFitted>
                    <TabList>
                      <Tab>Summary</Tab>
                      <Tab>Charts</Tab>
                      <Tab>Repayment Schedule</Tab>
                    </TabList>
                    
                    <TabPanels>
                      {/* Summary Tab */}
                      <TabPanel>
                        <Grid 
                          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                          gap={6}
                        >
                          <GridItem>
                            <Stat>
                              <StatLabel>EMI Amount</StatLabel>
                              <StatNumber>₹{emi.toFixed(2).toLocaleString('en-IN')}</StatNumber>
                              <StatHelpText>per month</StatHelpText>
                            </Stat>
                          </GridItem>
                          <GridItem>
                            <Stat>
                              <StatLabel>Total Interest</StatLabel>
                              <StatNumber>₹{Math.round(interest).toLocaleString('en-IN')}</StatNumber>
                            </Stat>
                          </GridItem>
                          <GridItem>
                            <Stat>
                              <StatLabel>Total Payment</StatLabel>
                              <StatNumber>₹{Math.round(totalAmount).toLocaleString('en-IN')}</StatNumber>
                            </Stat>
                          </GridItem>
                        </Grid>
                      </TabPanel>
                      
                      {/* Charts Tab */}
                      <TabPanel>
                        <VStack spacing={6}>
                          <Box width="100%" height="300px">
                            <Doughnut data={pieChartData} options={pieChartOptions} />
                          </Box>
                          <Box width="100%" height="300px">
                            <Bar data={yearlyChartData} options={yearlyChartOptions} />
                          </Box>
                          <Box width="100%" height="300px">
                            <Line data={balanceChartData} options={yearlyChartOptions} />
                          </Box>
                        </VStack>
                      </TabPanel>
                      
                      {/* Repayment Schedule Tab */}
                      <TabPanel>
                        <TableContainer>
                          <Table size="sm" variant="striped" colorScheme="blue">
                            <Thead>
                              <Tr>
                                <Th>Month</Th>
                                <Th>Principal Paid</Th>
                                <Th>Interest Paid</Th>
                                <Th>EMI</Th>
                                <Th>Balance</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {amortizationSchedule.map((item, index) => (
                                <Tr key={index}>
                                  <Td>{item.month}</Td>
                                  <Td>₹{Math.round(item.principal).toLocaleString('en-IN')}</Td>
                                  <Td>₹{Math.round(item.interest).toLocaleString('en-IN')}</Td>
                                  <Td>₹{Math.round(item.emi).toLocaleString('en-IN')}</Td>
                                  <Td>₹{Math.round(item.balance).toLocaleString('en-IN')}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </div>
          </GridItem>
        </Grid>
      )}
    </Container>
  );
};

export default EMICalculatorPage;
