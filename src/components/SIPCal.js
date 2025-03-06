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
  HStack,
  VStack,
  Heading,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  useToast,
  Progress
} from "@chakra-ui/react";
import { 
  FaRupeeSign, 
  FaChartLine, 
  FaCalendarAlt, 
  FaPercentage,
  FaDownload,
  FaRedo,
  FaInfoCircle,
  FaTable
} from "react-icons/fa";
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'

import html2canvas from 'html2canvas';

// Register chart components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const InputForm = ({
  installment,
  setInstallment,
  rate,
  setRate,
  months,
  setMonths,
  inflationRate,
  setInflationRate,
  onCalculate,
  isCalculating,
  resetForm
}) => {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const sliderColor = useColorModeValue("blue.500", "blue.300");
  const inputBg = useColorModeValue("white", "gray.800");

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

    // Calculate appropriate slider marks
    let marks = [];
    if (max > 1000) {
      const markStep = max / 4;
      for (let i = 1; i <= 3; i++) {
        const markValue = Math.round(markStep * i);
        marks.push({
          value: markValue,
          label: markValue >= 10000 
                    ? `${(markValue/1000).toFixed(0)}K` 
                    : markValue.toString()
        });
      }
    } else {
      const markStep = max / 5;
      for (let i = 1; i < 5; i++) {
        marks.push({
          value: markStep * i,
          label: (markStep * i).toString()
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
                <FaInfoCircle size="0.8em" color="gray.400" />
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
            onChange={(v) => setValue(v)}
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
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${unit === "₹" ? "₹" : ""}${value.toLocaleString('en-IN')}${unit === "%" ? "%" : ""}`}
            >
              <SliderThumb boxSize={6}>
                <Box color="blue.500" />
              </SliderThumb>
            </Tooltip>
          </Slider>
          
          {unit === "₹" ? (
            <InputGroup size="md" width="120px">
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
              />
            </InputGroup>
          ) : unit === "%" ? (
            <InputGroup size="md" width="120px">
              <Input
                value={tempValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                bg={inputBg}
                borderColor={borderColor}
                textAlign="right"
              />
              <InputRightElement pointerEvents="none">
                <Text color="gray.500">%</Text>
              </InputRightElement>
            </InputGroup>
          ) : (
            <Input
              width="120px"
              value={tempValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              bg={inputBg}
              borderColor={borderColor}
              textAlign="right"
            />
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
      bg={cardBg}
      width="100%"
      maxW="450px"
      mx="auto"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardHeader pb={2}>
        <Heading size="md" mb={2} color={textColor} textAlign="center">
          SIP Calculator
        </Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Calculate the future value of your Systematic Investment Plan
        </Text>
      </CardHeader>
      
      <Divider my={3} />
      
      <CardBody pt={4}>
        {renderSliderWithTextbox(
          "Monthly Investment",
          installment,
          setInstallment,
          500,
          100000,
          500,
          <FaRupeeSign />,
          "₹",
          "Amount you invest each month"
        )}
        
        {renderSliderWithTextbox(
          "Expected Return Rate",
          rate,
          setRate,
          1,
          30,
          0.5,
          <FaPercentage />,
          "%",
          "Expected annual returns from your investment"
        )}
        
        {renderSliderWithTextbox(
          "Time Period",
          months,
          setMonths,
          6,
          360,
          6,
          <FaCalendarAlt />,
          " months",
          "Duration of your investment in months"
        )}
        
        {renderSliderWithTextbox(
          "Inflation Rate (Optional)",
          inflationRate,
          setInflationRate,
          0,
          15,
          0.5,
          <FaChartLine />,
          "%",
          "Including inflation gives a more realistic future value"
        )}
        
        <HStack spacing={4} mt={6}>
          <Button
            leftIcon={<FaRedo />}
            variant="outline"
            colorScheme="blue"
            onClick={resetForm}
            width="40%"
          >
            Reset
          </Button>
          
          <Button
            colorScheme="blue"
            onClick={onCalculate}
            width="60%"
            isLoading={isCalculating}
            loadingText="Calculating..."
          >
            Calculate SIP
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const SIPCalculator = () => {
  // State for input values
  const [installment, setInstallment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(60);
  const [inflationRate, setInflationRate] = useState(6);
  
  // State for results
  const [sipResults, setSipResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Refs
  const resultsRef = useRef(null);
  
  // Toast notifications
  const toast = useToast();
  
  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  
  // Reset form to defaults
  const resetForm = () => {
    setInstallment(5000);
    setRate(12);
    setMonths(60);
    setInflationRate(6);
    setShowResults(false);
    setSipResults(null);
  };
  
  // Calculate SIP returns
  const calculateSIP = () => {
    setIsCalculating(true);
    
    // Small delay to allow UI to update
    setTimeout(() => {
      try {
        // Validation
        if (installment <= 0) {
          toast({
            title: "Invalid installment",
            description: "Please enter a positive installment amount",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsCalculating(false);
          return;
        }
        
        // Convert annual rate to monthly
        const monthlyRate = rate / 100 / 12;
        const monthlyInflationRate = inflationRate / 100 / 12;
        
        // Calculate SIP returns
        const totalInvestment = installment * months;
        const futureValue = installment * 
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
          (1 + monthlyRate);
        
        // Inflation adjusted value
        const inflationAdjustedValue = futureValue / 
          Math.pow(1 + monthlyInflationRate, months);
        
        // Calculate returns
        const wealthGained = futureValue - totalInvestment;
        const absoluteReturn = (wealthGained / totalInvestment) * 100;
        const annualizedReturn = Math.pow(futureValue / totalInvestment, 1 / (months / 12)) - 1;
        
        // Generate monthly breakdown data
        const monthlyData = [];
        let runningInvestment = 0;
        let runningValue = 0;
        
        for (let i = 1; i <= months; i++) {
          runningInvestment = installment * i;
          runningValue = installment * 
            ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate) * 
            (1 + monthlyRate);
          
          // Only store data for chart at specific intervals
          if (months <= 60 || i % Math.ceil(months / 60) === 0 || i === 1 || i === months) {
            monthlyData.push({
              month: i,
              invested: runningInvestment,
              value: runningValue,
              returns: runningValue - runningInvestment
            });
          }
        }
        
        // Store results
        setSipResults({
          totalInvestment,
          futureValue,
          wealthGained,
          absoluteReturn,
          annualizedReturn: annualizedReturn * 100,
          inflationAdjustedValue,
          realReturns: (inflationAdjustedValue - totalInvestment) / totalInvestment * 100,
          monthlyData,
          yearlyData: monthlyData.filter(d => d.month % 12 === 0 || d.month === months),
          years: Math.floor(months / 12),
          remainingMonths: months % 12
        });
        
        setShowResults(true);
        
        toast({
          title: "Calculation Complete",
          description: "Your SIP future value has been calculated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Calculation error:", error);
        toast({
          title: "Calculation Error",
          description: "There was a problem calculating your SIP returns",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };
  
  // Download PDF report
  const downloadPDF = async () => {
    if (!resultsRef.current || !sipResults) return;
    
    setIsExporting(true);
    
    toast({
      title: "Preparing PDF",
      description: "Your report is being generated",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    
    try {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(0, 51, 153);
      doc.text('SIP Investment Report', 105, 20, { align: 'center' });
      
      // Add summary section
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text('Investment Summary', 20, 40);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      let y = 50;
      const lineHeight = 8;
      
      doc.text(`Monthly Investment: ₹${installment.toLocaleString('en-IN')}`, 20, y); y += lineHeight;
      doc.text(`Expected Return Rate: ${rate}% per year`, 20, y); y += lineHeight;
      doc.text(`Investment Duration: ${Math.floor(months/12)} years ${months%12} months`, 20, y); y += lineHeight;
      
      if (inflationRate > 0) {
        doc.text(`Inflation Rate: ${inflationRate}% per year`, 20, y);
        y += lineHeight;
      }
      
      y += lineHeight;
      doc.text(`Total Amount Invested: ₹${Math.round(sipResults.totalInvestment).toLocaleString('en-IN')}`, 20, y); y += lineHeight;
      doc.text(`Future Value: ₹${Math.round(sipResults.futureValue).toLocaleString('en-IN')}`, 20, y); y += lineHeight;
      doc.text(`Wealth Gained: ₹${Math.round(sipResults.wealthGained).toLocaleString('en-IN')}`, 20, y); y += lineHeight;
      doc.text(`Absolute Return: ${sipResults.absoluteReturn.toFixed(2)}%`, 20, y); y += lineHeight;
      
      if (inflationRate > 0) {
        doc.text(`Inflation-Adjusted Value: ₹${Math.round(sipResults.inflationAdjustedValue).toLocaleString('en-IN')}`, 20, y); y += lineHeight;
        doc.text(`Real Returns (Inflation Adjusted): ${sipResults.realReturns.toFixed(2)}%`, 20, y); y += lineHeight;
      }
      
      // Add yearly breakdown table
      y += lineHeight * 2;
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text('Yearly Breakdown', 20, y);
      y += 10;
      
      // Create table
      const tableData = sipResults.yearlyData.map(data => [
        Math.floor(data.month / 12),
        `₹${Math.round(data.invested).toLocaleString('en-IN')}`,
        `₹${Math.round(data.value).toLocaleString('en-IN')}`,
        `₹${Math.round(data.returns).toLocaleString('en-IN')}`,
        `${((data.returns / data.invested) * 100).toFixed(2)}%`
      ]);
      
      doc.autoTable({
        startY: y,
        head: [['Year', 'Amount Invested', 'Future Value', 'Returns', 'Return %']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        styles: { fontSize: 10 }
      });
      
      // Add a footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const today = new Date().toLocaleDateString();
        doc.text(`Generated on ${today} | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      // Save PDF
      doc.save(`SIP_Report_${installment}_${rate}pct_${months}months.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your SIP report has been saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Chart data
  const chartData = sipResults ? {
    labels: sipResults.monthlyData.map(data => 
      data.month % 12 === 0 ? `Year ${data.month/12}` : 
      `${Math.floor(data.month/12)}y ${data.month%12}m`
    ),
    datasets: [
      {
        label: 'Amount Invested',
        data: sipResults.monthlyData.map(data => data.invested),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Future Value',
        data: sipResults.monthlyData.map(data => data.value),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        type: 'line',
        fill: false
      }
    ]
  } : null;
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
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
    },
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
    }
  };
  
  // Pie chart data for distribution
  const pieChartData = sipResults ? {
    labels: ['Amount Invested', 'Returns'],
    datasets: [
      {
        data: [
          sipResults.totalInvestment,
          sipResults.wealthGained
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  } : null;
  
  return (
    <Container maxW="7xl" py={8}>
      <Heading 
        as="h1"
        size="xl"
        textAlign="center"
        mb={8}
        bgGradient="linear(to-r, blue.400, teal.500)"
        bgClip="text"
      >
        SIP Calculator
      </Heading>
      
      {!showResults ? (
        <InputForm
          installment={installment}
          setInstallment={setInstallment}
          rate={rate}
          setRate={setRate}
          months={months}
          setMonths={setMonths}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
          onCalculate={calculateSIP}
          isCalculating={isCalculating}
          resetForm={resetForm}
        />
      ) : (
        <Grid
          templateColumns={{ base: "1fr", lg: "350px 1fr" }}
          gap={6}
        >
          <GridItem>
            <InputForm
              installment={installment}
              setInstallment={setInstallment}
              rate={rate}
              setRate={setRate}
              months={months}
              setMonths={setMonths}
              inflationRate={inflationRate}
              setInflationRate={setInflationRate}
              onCalculate={calculateSIP}
              isCalculating={isCalculating}
              resetForm={resetForm}
            />
          </GridItem>

          <GridItem>
            <div ref={resultsRef}>
              <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden">
                <CardHeader pb={0}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md" color={textColor}>
                      SIP Investment Results
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
                      <Tab>Breakdown</Tab>
                    </TabList>
                    
                    <TabPanels>
                      {/* Summary Tab */}
                      <TabPanel>
                        <Grid 
                          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
                          gap={4}
                          mb={6}
                        >
                          <Card bg={useColorModeValue("blue.50", "blue.900")} p={4}>
                            <Text fontSize="sm">Total Investment</Text>
                            <Heading size="lg" color={textColor}>
                              ₹{Math.round(sipResults.totalInvestment).toLocaleString('en-IN')}
                            </Heading>
                          </Card>
                          
                          <Card bg={useColorModeValue("teal.50", "teal.900")} p={4}>
                            <Text fontSize="sm">Future Value</Text>
                            <Heading size="lg" color={textColor}>
                              ₹{Math.round(sipResults.futureValue).toLocaleString('en-IN')}
                            </Heading>
                          </Card>
                          
                          <Card bg={useColorModeValue("green.50", "green.900")} p={4}>
                            <Text fontSize="sm">Wealth Gained</Text>
                            <Heading size="lg" color={textColor}>
                              ₹{Math.round(sipResults.wealthGained).toLocaleString('en-IN')}
                            </Heading>
                          </Card>
                          
                          <Card bg={useColorModeValue("purple.50", "purple.900")} p={4}>
                            <Text fontSize="sm">Total Return</Text>
                            <Heading size="lg" color={textColor}>
                              {sipResults.absoluteReturn.toFixed(2)}%
                            </Heading>
                          </Card>
                        </Grid>
                        
                        {inflationRate > 0 && (
                          <Box mb={6}>
                            <Alert status="info" borderRadius="md">
                              <AlertIcon />
                              <Box>
                                <Text fontWeight="bold">Inflation Adjusted Value</Text>
                                <Text>
                                  ₹{Math.round(sipResults.inflationAdjustedValue).toLocaleString('en-IN')} 
                                  ({sipResults.realReturns.toFixed(2)}% real return)
                                </Text>
                              </Box>
                            </Alert>
                          </Box>
                        )}
                        
                        <Box>
                          <Text fontSize="sm" mb={2}>Investment Distribution</Text>
                          <Box height="250px">
                            <Doughnut 
                              data={pieChartData} 
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  tooltip: {
                                    callbacks: {
                                      label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw;
                                        const percentage = ((value / sipResults.futureValue) * 100).toFixed(1);
                                        return `${label}: ₹${Math.round(value).toLocaleString('en-IN')} (${percentage}%)`;
                                      }
                                    }
                                  }
                                }
                              }} 
                            />
                          </Box>
                        </Box>
                        
                        <Divider my={4} />
                        
                        <Box>
                          <Text fontSize="sm" mb={2}>Key Details</Text>
                          <TableContainer>
                            <Table variant="simple" size="sm">
                              <Tbody>
                                <Tr>
                                  <Td fontWeight="medium">Monthly Investment</Td>
                                  <Td isNumeric>₹{installment.toLocaleString('en-IN')}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Expected Return Rate</Td>
                                  <Td isNumeric>{rate}% per annum</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Time Period</Td>
                                  <Td isNumeric>
                                    {sipResults.years} years
                                    {sipResults.remainingMonths > 0 ? ` ${sipResults.remainingMonths} months` : ''}
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Annualized Return</Td>
                                  <Td isNumeric>{sipResults.annualizedReturn.toFixed(2)}%</Td>
                                </Tr>
                                {inflationRate > 0 && (
                                  <Tr>
                                    <Td fontWeight="medium">Inflation Rate</Td>
                                    <Td isNumeric>{inflationRate}% per annum</Td>
                                  </Tr>
                                )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </TabPanel>
                      
                      {/* Charts Tab */}
                      <TabPanel>
                        <Box height="400px" mb={6}>
                          <Flex justify="space-between" align="center" mb={2}>
                            <Text fontSize="sm" fontWeight="medium">Growth Over Time</Text>
                            <Badge colorScheme="blue" variant="solid" px={2}>
                              Total Returns: {sipResults.absoluteReturn.toFixed(2)}%
                            </Badge>
                          </Flex>
                          <Bar data={chartData} options={chartOptions} />
                        </Box>
                        
                        <Divider my={4} />
                        
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>Investment Growth</Text>
                            <Box height="250px" border="1px solid" borderColor={borderColor} borderRadius="md" p={2}>
                              <Line 
                                data={{
                                  labels: sipResults.monthlyData.filter((_, i) => i % 3 === 0 || i === sipResults.monthlyData.length - 1).map(data => 
                                    data.month % 12 === 0 ? `Y${data.month/12}` : 
                                    `${Math.floor(data.month/12)}.${data.month%12}`
                                  ),
                                  datasets: [
                                    {
                                      label: 'Future Value',
                                      data: sipResults.monthlyData.filter((_, i) => i % 3 === 0 || i === sipResults.monthlyData.length - 1).map(data => data.value),
                                      borderColor: 'rgba(75, 192, 192, 1)',
                                      backgroundColor: 'rgba(75, 192, 192, 0.1)',
                                      tension: 0.4,
                                      fill: true,
                                      pointRadius: 2,
                                      pointHoverRadius: 5
                                    },
                                    {
                                      label: 'Amount Invested',
                                      data: sipResults.monthlyData.filter((_, i) => i % 3 === 0 || i === sipResults.monthlyData.length - 1).map(data => data.invested),
                                      borderColor: 'rgba(54, 162, 235, 1)',
                                      borderDashed: [5, 5],
                                      pointRadius: 0,
                                      borderWidth: 2,
                                      fill: false
                                    }
                                  ]
                                }} 
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  interaction: {
                                    mode: 'index',
                                    intersect: false,
                                  },
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
                                    y: {
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
                                }} 
                              />
                            </Box>
                          </Box>
                          
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>Returns Comparison</Text>
                            <Box height="250px" border="1px solid" borderColor={borderColor} borderRadius="md" p={2}>
                              <Doughnut 
                                data={{
                                  labels: ['Principal', 'Returns', inflationRate > 0 ? 'Inflation Impact' : ''],
                                  datasets: [
                                    {
                                      data: [
                                        sipResults.totalInvestment,
                                        inflationRate > 0 ? sipResults.inflationAdjustedValue - sipResults.totalInvestment : sipResults.wealthGained,
                                        inflationRate > 0 ? sipResults.wealthGained - (sipResults.inflationAdjustedValue - sipResults.totalInvestment) : 0
                                      ].filter(val => val > 0),
                                      backgroundColor: [
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(75, 192, 192, 0.6)',
                                        'rgba(255, 159, 64, 0.6)'
                                      ],
                                      borderColor: [
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(255, 159, 64, 1)'
                                      ],
                                      borderWidth: 1
                                    }
                                  ]
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  cutout: '60%',
                                  plugins: {
                                    tooltip: {
                                      callbacks: {
                                        label: function(context) {
                                          const label = context.label || '';
                                          const value = context.raw;
                                          const percentage = ((value / (sipResults.futureValue)) * 100).toFixed(1);
                                          return `${label}: ₹${Math.round(value).toLocaleString('en-IN')} (${percentage}%)`;
                                        }
                                      }
                                    },
                                    legend: {
                                      position: 'bottom',
                                      labels: {
                                        boxWidth: 15,
                                        padding: 15
                                      }
                                    }
                                  }
                                }} 
                              />
                            </Box>
                          </Box>

                          <Box gridColumn={{ md: "span 2" }}>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>Investment Timeline</Text>
                            <Box height="250px" border="1px solid" borderColor={borderColor} borderRadius="md" p={3}>
                              <HStack spacing={4} mb={3}>
                                <Stat size="sm">
                                  <StatLabel fontSize="xs">Total Principal</StatLabel>
                                  <StatNumber fontSize="md">₹{Math.round(sipResults.totalInvestment).toLocaleString('en-IN')}</StatNumber>
                                  <StatHelpText fontSize="xs" mb={0}>
                                    {sipResults.months} months
                                  </StatHelpText>
                                </Stat>
                                
                                <Stat size="sm">
                                  <StatLabel fontSize="xs">Final Amount</StatLabel>
                                  <StatNumber fontSize="md">₹{Math.round(sipResults.futureValue).toLocaleString('en-IN')}</StatNumber>
                                  <StatHelpText fontSize="xs" mb={0}>
                                    <span style={{ color: useColorModeValue("green.500", "green.300") }}>
                                      +{sipResults.absoluteReturn.toFixed(2)}%
                                    </span>
                                  </StatHelpText>
                                </Stat>
                                
                                <Stat size="sm">
                                  <StatLabel fontSize="xs">Monthly SIP</StatLabel>
                                  <StatNumber fontSize="md">₹{installment.toLocaleString('en-IN')}</StatNumber>
                                  <StatHelpText fontSize="xs" mb={0}>
                                    @{rate}% p.a.
                                  </StatHelpText>
                                </Stat>
                              </HStack>
                              
                              {/* Year indicators with milestones */}
                              {sipResults.years > 0 && (
                                <Box>
                                  <Flex justify="space-between" align="center" mb={1}>
                                    <Text fontSize="xs">Start</Text>
                                    <Text fontSize="xs">{sipResults.years} years</Text>
                                  </Flex>
                                  <Progress
                                    value={100}
                                    size="sm"
                                    colorScheme="blue"
                                    borderRadius="full"
                                    mb={1}
                                  />
                                  
                                  <Box mt={4}>
                                    {sipResults.yearlyData.map((data, index) => {
                                      const year = Math.floor(data.month / 12);
                                      if (year === 0) return null;
                                      if (index % Math.ceil(sipResults.yearlyData.length / 5) !== 0 && 
                                          index !== sipResults.yearlyData.length - 1 && 
                                          year !== 1) return null;
                                      
                                      return (
                                        <Box key={year} mb={3}>
                                          <Flex justify="space-between" align="center" mb={1}>
                                            <Text fontSize="xs" fontWeight="medium">Year {year}</Text>
                                            <Badge colorScheme="green" fontSize="xs">
                                              {((data.returns / data.invested) * 100).toFixed(1)}% return
                                            </Badge>
                                          </Flex>
                                          <HStack spacing={4}>
                                            <Text fontSize="xs" width="80px">Invested:</Text>
                                            <Text fontSize="xs" fontWeight="medium">₹{Math.round(data.invested).toLocaleString('en-IN')}</Text>
                                          </HStack>
                                          <HStack spacing={4}>
                                            <Text fontSize="xs" width="80px">Value:</Text>
                                            <Text fontSize="xs" fontWeight="medium">₹{Math.round(data.value).toLocaleString('en-IN')}</Text>
                                          </HStack>
                                        </Box>
                                      );
                                    })}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        
                        {inflationRate > 0 && (
                          <>
                            <Divider my={4} />
                            <Box>
                              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                                <Text fontSize="sm" fontWeight="medium">Inflation Impact</Text>
                                <Badge colorScheme="orange">{inflationRate}% annual inflation</Badge>
                              </Flex>
                              
                              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                <Card bg={useColorModeValue("blue.50", "blue.900")} p={4} borderRadius="lg">
                                  <Text fontSize="xs" mb={1}>Nominal Future Value</Text>
                                  <Heading size="md" color={textColor}>
                                    ₹{Math.round(sipResults.futureValue).toLocaleString('en-IN')}
                                  </Heading>
                                  <Text fontSize="xs" color={useColorModeValue("blue.600", "blue.200")} mt={1}>
                                    Before inflation adjustment
                                  </Text>
                                </Card>
                                
                                <Card bg={useColorModeValue("orange.50", "orange.900")} p={4} borderRadius="lg">
                                  <Text fontSize="xs" mb={1}>Real Future Value</Text>
                                  <Heading size="md" color={textColor}>
                                    ₹{Math.round(sipResults.inflationAdjustedValue).toLocaleString('en-IN')}
                                  </Heading>
                                  <Text fontSize="xs" color={useColorModeValue("orange.600", "orange.200")} mt={1}>
                                    After inflation adjustment
                                  </Text>
                                </Card>
                                
                                <Box gridColumn={{ md: "span 2" }} mt={2}>
                                  <Alert status="info" variant="left-accent" borderRadius="md">
                                    <AlertIcon />
                                    <Box>
                                      <Text fontWeight="medium">Purchasing Power</Text>
                                      <Text fontSize="sm">
                                        Your investment's real value will be worth approximately {(sipResults.inflationAdjustedValue / sipResults.futureValue * 100).toFixed(1)}% of its nominal value due to inflation's impact over {sipResults.years} years.
                                      </Text>
                                    </Box>
                                  </Alert>
                                </Box>
                              </Grid>
                            </Box>
                          </>
                        )}
                      </TabPanel>

                      {/* Breakdown Tab */}
                      <TabPanel>
                        <Box mb={4}>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Investment Growth Table</Text>
                          <TableContainer maxHeight="500px" overflowY="auto" border="1px solid" borderColor={borderColor} borderRadius="md">
                            <Table variant="simple" size="sm">
                              <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                                <Tr>
                                  <Th>Year</Th>
                                  <Th isNumeric>Month</Th>
                                  <Th isNumeric>Invested</Th>
                                  <Th isNumeric>Value</Th>
                                  <Th isNumeric>Returns</Th>
                                  <Th isNumeric>Return %</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {sipResults.monthlyData
                                  .filter((_, i) => {
                                    // Show specific intervals to keep table manageable
                                    const monthsInYear = 12;
                                    // For short durations, show more detail
                                    if (months <= 24) {
                                      return i % 1 === 0; // Show every month
                                    } else if (months <= 60) {
                                      return i % 3 === 0 || i === sipResults.monthlyData.length - 1; // Show every quarter
                                    } else {
                                      return i % 6 === 0 || i === sipResults.monthlyData.length - 1; // Show every half year
                                    }
                                  })
                                  .map((data, index) => (
                                    <Tr key={index} bg={data.month % 12 === 0 ? useColorModeValue('gray.50', 'gray.700') : undefined}>
                                      <Td fontWeight={data.month % 12 === 0 ? "medium" : "normal"}>
                                        {Math.floor(data.month / 12)}
                                        {data.month % 12 === 0 && (
                                          <Badge ml={2} colorScheme="blue" variant="outline" size="sm">
                                            Year {Math.floor(data.month / 12)}
                                          </Badge>
                                        )}
                                      </Td>
                                      <Td isNumeric>{data.month}</Td>
                                      <Td isNumeric>₹{Math.round(data.invested).toLocaleString('en-IN')}</Td>
                                      <Td isNumeric>₹{Math.round(data.value).toLocaleString('en-IN')}</Td>
                                      <Td isNumeric>
                                        <Text color={data.returns > 0 ? "green.500" : "red.500"}>
                                          ₹{Math.round(data.returns).toLocaleString('en-IN')}
                                        </Text>
                                      </Td>
                                      <Td isNumeric>
                                        <Text color={data.returns > 0 ? "green.500" : "red.500"}>
                                          {((data.returns / data.invested) * 100).toFixed(2)}%
                                        </Text>
                                      </Td>
                                    </Tr>
                                  ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Box>

                        <Box mt={6}>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Investment Analysis</Text>
                          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                            <Card p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                              <Text fontSize="xs" mb={2}>Return on Investment</Text>
                              <Box height="100px">
                                <Stat>
                                  <StatNumber fontSize="2xl">{sipResults.absoluteReturn.toFixed(2)}%</StatNumber>
                                  <StatHelpText>Absolute Return</StatHelpText>
                                </Stat>
                                <Progress 
                                  value={Math.min(sipResults.absoluteReturn, 200)} 
                                  max={200} 
                                  colorScheme="green" 
                                  size="sm" 
                                  borderRadius="full" 
                                />
                              </Box>
                            </Card>
                            
                            <Card p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                              <Text fontSize="xs" mb={2}>Monthly SIP Efficiency</Text>
                              <Box height="100px">
                                <Stat>
                                  <StatNumber fontSize="2xl">
                                    {(sipResults.wealthGained / (installment * months) * 100).toFixed(2)}%
                                  </StatNumber>
                                  <StatHelpText>Return per Rupee Invested</StatHelpText>
                                </Stat>
                              </Box>
                            </Card>
                            
                            <Card p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                              <Text fontSize="xs" mb={2}>Annual Growth Rate</Text>
                              <Box height="100px">
                                <Stat>
                                  <StatNumber fontSize="2xl">{sipResults.annualizedReturn.toFixed(2)}%</StatNumber>
                                  <StatHelpText>CAGR</StatHelpText>
                                </Stat>
                                <Progress 
                                  value={sipResults.annualizedReturn} 
                                  max={30} 
                                  colorScheme="blue" 
                                  size="sm" 
                                  borderRadius="full" 
                                />
                              </Box>
                            </Card>
                          </Grid>
                        </Box>
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

export default SIPCalculator;
