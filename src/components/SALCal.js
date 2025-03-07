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
  Flex,
  Container,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Stack,
  Heading,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useToast,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  VStack,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { 
  FaRupeeSign, 
  FaCalculator, 
  FaInfoCircle, 
  FaUndo, 
  FaDownload, 
  FaCopy, 
  FaPercentage,
  FaMoneyBillWave,
  FaChartPie
} from "react-icons/fa";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { useClipboard } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const InputForm = ({
  basicSalary,
  setBasicSalary,
  hra,
  setHra,
  ta,
  setTa,
  pf,
  setPf,
  tax,
  setTax,
  otherDeductions,
  setOtherDeductions,
  otherAllowances,
  setOtherAllowances,
  onCalculate,
  resetForm,
  isCalculating,
}) => {
  // Colors - matching with other calculators
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sliderColor = useColorModeValue("blue.500", "blue.300");
  const sliderTrackColor = useColorModeValue("gray.100", "gray.700");
  const inputBg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

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
      setTempValue(value.toLocaleString('en-IN'));
    }, [value]);

    const handleInputChange = (e) => {
      setTempValue(e.target.value);
      const val = parseFloat(e.target.value.replace(/,/g, ''));
      if (!isNaN(val)) {
        setValue(Math.min(Math.max(val, min), max));
      }
    };

    const handleInputBlur = () => {
      if (tempValue === '' || isNaN(parseFloat(tempValue.replace(/,/g, '')))) {
        setTempValue(value.toLocaleString('en-IN'));
      } else {
        setTempValue(value.toLocaleString('en-IN'));
      }
    };

    // Generate marks for the slider with better formatting
    let marks = [];
    if (max > 1000) {
      // For large values like salary amounts
      const markStep = max / 4;
      marks = [
        { value: min, label: min >= 100000 ? `${(min/100000).toFixed(1)}L` : min >= 1000 ? `${(min/1000).toFixed(0)}K` : min.toLocaleString() },
        { value: markStep, label: markStep >= 100000 ? `${(markStep/100000).toFixed(1)}L` : `${(markStep/1000).toFixed(0)}K` },
        { value: markStep * 2, label: markStep * 2 >= 100000 ? `${(markStep*2/100000).toFixed(1)}L` : `${(markStep*2/1000).toFixed(0)}K` },
        { value: markStep * 3, label: markStep * 3 >= 100000 ? `${(markStep*3/100000).toFixed(1)}L` : `${(markStep*3/1000).toFixed(0)}K` },
        { value: max, label: max >= 100000 ? `${(max/100000).toFixed(1)}L` : `${(max/1000).toFixed(0)}K` }
      ];
    } else {
      // For smaller values like percentages
      const markStep = max / 4;
      for (let i = 0; i <= 4; i++) {
        const markValue = min + markStep * i;
        marks.push({
          value: markValue,
          label: markValue.toFixed(max > 100 ? 0 : 1) + (unit === "%" ? "%" : "")
        });
      }
    }

    return (
      <Box mb={5} width="100%">
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
              setTempValue(v.toLocaleString('en-IN'));
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
                <Text color="gray.500">{unit || ""}</Text>
              </InputRightElement>
            </InputGroup>
          )}
        </Flex>
      </Box>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onCalculate();
    }
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
      onKeyDown={handleKeyPress}
    >
      <CardHeader pb={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md" mb={2} color={useColorModeValue("blue.600", "blue.300")} textAlign="center">
            Salary Calculator
          </Heading>
          <Tooltip label="Reset to defaults">
            <IconButton
              icon={<FaUndo />}
              aria-label="Reset form"
              onClick={resetForm}
              variant="ghost"
              colorScheme="blue"
              size="sm"
            />
          </Tooltip>
        </Flex>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Calculate your take-home salary and breakdown
        </Text>
      </CardHeader>
      
      <Divider my={3} />
      
      <CardBody pt={4}>
        {renderSliderWithTextbox(
          "Basic Salary",
          basicSalary,
          setBasicSalary,
          5000,
          500000,
          1000,
          <FaRupeeSign />,
          "₹", 
          "Your base salary before allowances and deductions"
        )}

        <Box mb={4}>
          <Text fontSize="md" fontWeight="medium" color={textColor} mb={3}>Allowances</Text>
          <Divider mb={3} borderColor={borderColor} opacity={0.4} />
        </Box>

        {renderSliderWithTextbox(
          "HRA (House Rent Allowance)",
          hra,
          setHra,
          0,
          60,
          1,
          <FaPercentage />,
          "%", 
          "Percentage of basic salary"
        )}

        {renderSliderWithTextbox(
          "Travel Allowance",
          ta,
          setTa,
          0,
          50000,
          1000,
          <FaRupeeSign />,
          "₹", 
          "Monthly travel reimbursement"
        )}

        {renderSliderWithTextbox(
          "Other Allowances",
          otherAllowances,
          setOtherAllowances,
          0,
          50000,
          1000,
          <FaRupeeSign />,
          "₹", 
          "Special, medical or other allowances"
        )}

        <Box mb={4} mt={6}>
          <Text fontSize="md" fontWeight="medium" color={textColor} mb={3}>Deductions</Text>
          <Divider mb={3} borderColor={borderColor} opacity={0.4} />
        </Box>

        {renderSliderWithTextbox(
          "Provident Fund (PF)",
          pf,
          setPf,
          0,
          12,
          0.1,
          <FaPercentage />,
          "%", 
          "Percentage of basic salary contributed to PF"
        )}

        {renderSliderWithTextbox(
          "Income Tax",
          tax,
          setTax,
          0,
          100000,
          1000,
          <FaRupeeSign />,
          "₹", 
          "Monthly income tax deduction"
        )}

        {renderSliderWithTextbox(
          "Other Deductions",
          otherDeductions,
          setOtherDeductions,
          0,
          50000,
          500,
          <FaRupeeSign />,
          "₹", 
          "Other deductions like loans, advances, etc."
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
            Calculate Salary
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const SalaryCalculator = () => {
  // Base state
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hra, setHra] = useState(40);
  const [ta, setTa] = useState(5000);
  const [otherAllowances, setOtherAllowances] = useState(3000);
  const [pf, setPf] = useState(12);
  const [tax, setTax] = useState(5000);
  const [otherDeductions, setOtherDeductions] = useState(2000);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState({
    grossSalary: 0,
    netSalary: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    breakdown: {
      basicSalary: 0,
      hraAmount: 0,
      ta: 0,
      otherAllowances: 0,
      pfAmount: 0,
      tax: 0,
      otherDeductions: 0
    },
    annual: {
      grossAnnual: 0,
      netAnnual: 0
    }
  });
  
  const resultsRef = useRef(null);
  const toast = useToast();
  
  // Colors - matching with other calculators
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const bgColor = useColorModeValue("white", "gray.800");
  const tableBg = useColorModeValue("gray.50", "gray.700");
  const tableBorderColor = useColorModeValue("gray.200", "gray.600");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  
  const summaryText = `Salary Summary\n` +
    `Basic Salary: ₹${basicSalary.toLocaleString('en-IN')}\n` +
    `Gross Salary: ₹${salaryDetails.grossSalary.toLocaleString('en-IN')}\n` +
    `Total Deductions: ₹${salaryDetails.totalDeductions.toLocaleString('en-IN')}\n` +
    `Net Salary: ₹${salaryDetails.netSalary.toLocaleString('en-IN')}\n` +
    `Annual Net Salary: ₹${salaryDetails.annual.netAnnual.toLocaleString('en-IN')}`;
  
  const { hasCopied, onCopy } = useClipboard(summaryText);

  // Reset form to defaults
  const resetForm = () => {
    setBasicSalary(50000);
    setHra(40);
    setTa(5000);
    setOtherAllowances(3000);
    setPf(12);
    setTax(5000);
    setOtherDeductions(2000);
    setShowResults(false);
    setSalaryDetails({
      grossSalary: 0,
      netSalary: 0,
      totalAllowances: 0,
      totalDeductions: 0,
      breakdown: {
        basicSalary: 0,
        hraAmount: 0,
        ta: 0,
        otherAllowances: 0,
        pfAmount: 0,
        tax: 0,
        otherDeductions: 0
      },
      annual: {
        grossAnnual: 0,
        netAnnual: 0
      }
    });
  };

  // Calculate salary
  const calculateSalary = () => {
    setIsCalculating(true);
    
    // Short delay to show loading state
    setTimeout(() => {
      try {
        const hraAmount = basicSalary * (hra / 100);
        const pfAmount = basicSalary * (pf / 100);
        
        const totalAllowances = hraAmount + ta + otherAllowances;
        const totalDeductions = pfAmount + tax + otherDeductions;
        
        const grossSalary = basicSalary + totalAllowances;
        const netSalary = grossSalary - totalDeductions;
        
        const grossAnnual = grossSalary * 12;
        const netAnnual = netSalary * 12;
        
        setSalaryDetails({
          grossSalary,
          netSalary,
          totalAllowances,
          totalDeductions,
          breakdown: {
            basicSalary,
            hraAmount,
            ta,
            otherAllowances,
            pfAmount,
            tax,
            otherDeductions
          },
          annual: {
            grossAnnual,
            netAnnual
          }
        });
        
        setShowResults(true);
        
        toast({
          title: "Calculation Complete",
          description: `Your monthly take-home salary is ₹${netSalary.toLocaleString('en-IN')}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Calculation Error",
          description: "There was an error calculating your salary",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  // Chart data for earnings vs deductions
  const earningsVsDeductionsData = {
    labels: ['Take-Home Salary', 'Total Deductions'],
    datasets: [
      {
        data: [salaryDetails.netSalary, salaryDetails.totalDeductions],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for salary breakdown
  const salaryBreakdownData = {
    labels: ['Basic', 'HRA', 'TA', 'Other Allowances'],
    datasets: [
      {
        data: [
          salaryDetails.breakdown.basicSalary, 
          salaryDetails.breakdown.hraAmount, 
          salaryDetails.breakdown.ta,
          salaryDetails.breakdown.otherAllowances
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for deductions breakdown
  const deductionsBreakdownData = {
    labels: ['PF', 'Income Tax', 'Other Deductions'],
    datasets: [
      {
        data: [
          salaryDetails.breakdown.pfAmount,
          salaryDetails.breakdown.tax,
          salaryDetails.breakdown.otherDeductions
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)'
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
        position: 'bottom',
        labels: {
          color: textColor
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return new Intl.NumberFormat('en-IN', { 
              style: 'currency', 
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(context.parsed || context.raw);
          }
        }
      }
    }
  };

   // Download PDF
   const downloadPDF = async () => {
    if (!resultsRef.current) return;
    
    setIsExporting(true);
    
    toast({
      title: "Preparing PDF",
      description: "Your report is being generated",
      status: "info",
      duration: 3000,
    });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const content = resultsRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: bgColor // Use the variable here instead of the hook
      });
      
      // Rest of your function remains the same
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
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight * ratio);
      pdf.save(`Salary_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your report has been saved",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate your PDF report",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

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
        Salary Calculator
      </Heading>
      
      {!showResults ? (
        <InputForm
          basicSalary={basicSalary}
          setBasicSalary={setBasicSalary}
          hra={hra}
          setHra={setHra}
          ta={ta}
          setTa={setTa}
          pf={pf}
          setPf={setPf}
          tax={tax}
          setTax={setTax}
          otherDeductions={otherDeductions}
          setOtherDeductions={setOtherDeductions}
          otherAllowances={otherAllowances}
          setOtherAllowances={setOtherAllowances}
          onCalculate={calculateSalary}
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
              basicSalary={basicSalary}
              setBasicSalary={setBasicSalary}
              hra={hra}
              setHra={setHra}
              ta={ta}
              setTa={setTa}
              pf={pf}
              setPf={setPf}
              tax={tax}
              setTax={setTax}
              otherDeductions={otherDeductions}
              setOtherDeductions={setOtherDeductions}
              otherAllowances={otherAllowances}
              setOtherAllowances={setOtherAllowances}
              onCalculate={calculateSalary}
              resetForm={resetForm}
              isCalculating={isCalculating}
            />
          </GridItem>

          <GridItem>
            <div ref={resultsRef}>
              <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden">
                <CardHeader bg={headerBg} pb={3}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md" color={accentColor}>
                      Salary Breakdown
                    </Heading>
                    <Badge 
                      colorScheme="green" 
                      variant="solid"
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      Monthly
                    </Badge>
                  </Flex>
                </CardHeader>
                
                <CardBody>
                  <Box mb={6}>
                    <Stat>
                      <StatLabel color={textColor}>Gross Salary</StatLabel>
                      <StatNumber color={accentColor}>₹{salaryDetails.grossSalary.toLocaleString('en-IN')}</StatNumber>
                      <StatHelpText color="green.500">
                        ₹{salaryDetails.annual.grossAnnual.toLocaleString('en-IN')} annually
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel color={textColor}>Total Deductions</StatLabel>
                      <StatNumber color="red.500">₹{salaryDetails.totalDeductions.toLocaleString('en-IN')}</StatNumber>
                    </Stat>
                    
                    <Stat>
                      <StatLabel color={textColor}>Net Take-Home Salary</StatLabel>
                      <Flex alignItems="baseline">
                        <StatNumber fontSize="2xl" fontWeight="bold" color={accentColor}>
                          ₹{salaryDetails.netSalary.toLocaleString('en-IN')}
                        </StatNumber>
                        <Text ml={2} fontSize="sm" color={secondaryTextColor}>per month</Text>
                      </Flex>
                      <StatHelpText color="green.500">
                        ₹{salaryDetails.annual.netAnnual.toLocaleString('en-IN')} annually
                      </StatHelpText>
                    </Stat>
                  </Box>
                  
                  <Tabs mt={4} index={activeTab} onChange={setActiveTab} colorScheme="blue" variant="enclosed">
                    <TabList>
                      <Tab _selected={{ color: accentColor, borderColor: 'currentColor' }}>Summary</Tab>
                      <Tab _selected={{ color: accentColor, borderColor: 'currentColor' }}>Breakdown</Tab>
                      <Tab _selected={{ color: accentColor, borderColor: 'currentColor' }}>Charts</Tab>
                    </TabList>
                    
                    <TabPanels>
                      {/* Summary Tab */}
                      <TabPanel px={0}>
                        <VStack spacing={4} align="stretch">
                          <Box p={4} borderRadius="md" borderWidth="1px" borderColor={tableBorderColor}>
                            <Text fontWeight="bold" color={accentColor} mb={2}>Salary Components</Text>
                            <HStack justify="space-between" mb={1}>
                              <Text color={textColor}>Basic Salary</Text>
                              <Text color={textColor} fontWeight="medium">₹{basicSalary.toLocaleString('en-IN')}</Text>
                            </HStack>
                            <HStack justify="space-between" mb={1}>
                              <Text color={textColor}>Total Allowances</Text>
                              <Text color={textColor} fontWeight="medium">₹{salaryDetails.totalAllowances.toLocaleString('en-IN')}</Text>
                            </HStack>
                            <HStack justify="space-between" mb={1}>
                              <Text color={textColor}>Total Deductions</Text>
                              <Text color="red.500" fontWeight="medium">₹{salaryDetails.totalDeductions.toLocaleString('en-IN')}</Text>
                            </HStack>
                            <Divider my={2} />
                            <HStack justify="space-between">
                              <Text color={textColor} fontWeight="bold">Net Take-Home</Text>
                              <Text color={accentColor} fontWeight="bold">₹{salaryDetails.netSalary.toLocaleString('en-IN')}</Text>
                            </HStack>
                          </Box>
                          
                          <Box height="260px" mt={2}>
                            <Doughnut data={earningsVsDeductionsData} options={chartOptions} />
                          </Box>
                        </VStack>
                      </TabPanel>
                      
                      {/* Detailed Breakdown Tab */}
                      <TabPanel px={0}>
                        <Table variant="simple" size="sm" mt={2}>
                          <Thead bg={tableBg}>
                            <Tr>
                              <Th borderColor={tableBorderColor}>Component</Th>
                              <Th borderColor={tableBorderColor} isNumeric>Amount</Th>
                              <Th borderColor={tableBorderColor} isNumeric>% of Total</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {/* Earnings Section */}
                            <Tr bg={tableBg}>
                              <Td colSpan={3} fontWeight="bold" borderColor={tableBorderColor}>Earnings</Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>Basic Salary</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{basicSalary.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((basicSalary / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>House Rent Allowance (HRA)</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.breakdown.hraAmount.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.breakdown.hraAmount / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>Travel Allowance</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.breakdown.ta.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.breakdown.ta / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>Other Allowances</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.breakdown.otherAllowances.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.breakdown.otherAllowances / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr fontWeight="bold" bg={tableBg}>
                              <Td borderColor={tableBorderColor}>Total Gross</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.grossSalary.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>100%</Td>
                            </Tr>
                            
                            {/* Deductions Section */}
                            <Tr bg={tableBg}>
                              <Td colSpan={3} fontWeight="bold" borderColor={tableBorderColor}>Deductions</Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>Provident Fund (PF)</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.breakdown.pfAmount.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.breakdown.pfAmount / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>Income Tax</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.breakdown.tax.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.breakdown.tax / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr>
                              <Td borderColor={tableBorderColor}>Other Deductions</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.breakdown.otherDeductions.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.breakdown.otherDeductions / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            <Tr fontWeight="bold" bg={tableBg}>
                              <Td borderColor={tableBorderColor}>Total Deductions</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.totalDeductions.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.totalDeductions / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                            
                            {/* Net Salary */}
                            <Tr fontWeight="bold" bg={tableBg}>
                              <Td borderColor={tableBorderColor}>Net Salary</Td>
                              <Td borderColor={tableBorderColor} isNumeric>₹{salaryDetails.netSalary.toLocaleString('en-IN')}</Td>
                              <Td borderColor={tableBorderColor} isNumeric>
                                {((salaryDetails.netSalary / salaryDetails.grossSalary) * 100).toFixed(1)}%
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TabPanel>
                      
                      {/* Charts Tab */}
                      <TabPanel px={0}>
                        <VStack spacing={6}>
                          <Box width="100%" height="260px">
                            <Text fontWeight="bold" textAlign="center" mb={2} color={accentColor}>Salary Composition</Text>
                            <Pie data={salaryBreakdownData} options={chartOptions} />
                          </Box>
                          <Box width="100%" height="260px">
                            <Text fontWeight="bold" textAlign="center" mb={2} color={accentColor}>Deduction Breakdown</Text>
                            <Doughnut data={deductionsBreakdownData} options={chartOptions} />
                          </Box>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </div>
            
            <HStack spacing={4} mt={6} justifyContent="center">
              <Button
                leftIcon={<FaDownload />}
                colorScheme="blue"
                onClick={downloadPDF}
                isLoading={isExporting}
                loadingText="Exporting..."
              >
                Download PDF
              </Button>
              
              <Button
                leftIcon={<FaCopy />}
                variant="outline"
                colorScheme="blue"
                onClick={onCopy}
              >
                {hasCopied ? "Copied" : "Copy Summary"}
              </Button>
            </HStack>
          </GridItem>
        </Grid>
      )}
      
      {/* Info card */}
      {showResults && (
        <Card mt={8} p={5} borderRadius="xl" shadow="md" borderLeft="4px solid" borderColor="blue.400">
          <Heading size="sm" mb={2}>Understanding Your Salary Structure</Heading>
          <Text fontSize="sm">
            Your salary structure consists of basic salary, allowances (HRA, TA, etc.), and deductions (PF, income tax, etc.).
            The basic salary typically forms the largest component, while allowances provide tax benefits. Deductions include
            mandatory contributions to PF and income tax based on your tax bracket.
          </Text>
        </Card>
      )}
    </Container>
  );
};

export default SalaryCalculator;
