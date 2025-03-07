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
  Grid,
  GridItem,
  Stack,
  Heading,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  HStack,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Progress,
  Spacer,
  useToast
} from "@chakra-ui/react";
import { FaRupeeSign, FaPercentage, FaCalendarAlt, FaInfoCircle, FaDownload, FaCalculator, FaUndo } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  principal,
  setPrincipal,
  rate,
  setRate,
  time,
  setTime,
  compoundFrequency,
  setCompoundFrequency,
  taxRate,
  setTaxRate,
  inflation,
  setInflation,
  onCalculate,
  isCalculating,
  resetForm,
}) => {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sliderColor = useColorModeValue("blue.500", "blue.300");
  const sliderTrackColor = useColorModeValue("gray.100", "gray.700");
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

    // Generate marks for the slider with better formatting
    let marks = [];
    if (max > 1000) {
      // For large values like principal amounts
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
                <Text color="gray.500">{unit || "yr"}</Text>
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
      bg={useColorModeValue("white", "gray.700")}
      width="100%"
      maxW="450px"
      mx="auto"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardHeader pb={2}>
        <Heading size="md" mb={2} color={useColorModeValue("blue.600", "blue.300")} textAlign="center">
          Fixed Deposit Calculator
        </Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Calculate the maturity amount and interest earned on your Fixed Deposit
        </Text>
      </CardHeader>
      
      <Divider my={3} />
      
      <CardBody pt={4}>
        {renderSliderWithTextbox(
          "Principal Amount",
          principal,
          setPrincipal,
          1000,
          5000000,
          1000,
          <FaRupeeSign />,
          "₹",
          "The amount you want to deposit initially"
        )}

        {renderSliderWithTextbox(
          "Interest Rate",
          rate,
          setRate,
          2,
          12,
          0.1,
          <FaPercentage />,
          "%",
          "Annual interest rate offered by the bank"
        )}

        {renderSliderWithTextbox(
          "Time Period",
          time,
          setTime,
          0.25,
          10,
          0.25,
          <FaCalendarAlt />,
          "yr",
          "Duration of your fixed deposit in years"
        )}
        
        <Box mb={6}>
          <Flex align="center" mb={2}>
            <Text fontWeight="medium" color={textColor}>Compounding Frequency</Text>
            <Tooltip label="How often the interest is calculated and added to your deposit" placement="top" hasArrow>
              <Box as="span" ml={1} cursor="help">
                <FaInfoCircle size="0.8em" color={useColorModeValue("gray.400", "gray.500")} />
              </Box>
            </Tooltip>
          </Flex>
          <Flex wrap="wrap" gap={2}>
            {[
              { value: "1", label: "Annually" },
              { value: "2", label: "Semi-Annually" },
              { value: "4", label: "Quarterly" },
              { value: "12", label: "Monthly" }
            ].map((option) => (
              <Badge
                key={option.value}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                variant={compoundFrequency === option.value ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setCompoundFrequency(option.value)}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-1px)" }}
              >
                {option.label}
              </Badge>
            ))}
          </Flex>
        </Box>
        
        <Box mb={6}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex align="center">
              <Text fontWeight="medium" color={textColor}>Advanced Options</Text>
              <Tooltip label="Optional settings for more accurate calculations" placement="top" hasArrow>
                <Box as="span" ml={1} cursor="help">
                  <FaInfoCircle size="0.8em" color={useColorModeValue("gray.400", "gray.500")} />
                </Box>
              </Tooltip>
            </Flex>
          </Flex>
          <Divider my={2} />
          
          {renderSliderWithTextbox(
            "Tax Rate",
            taxRate,
            setTaxRate,
            0,
            30,
            1,
            <FaPercentage />,
            "%",
            "Your applicable income tax rate for interest income"
          )}
          
          {renderSliderWithTextbox(
            "Inflation Rate",
            inflation,
            setInflation,
            0,
            10,
            0.1,
            <FaPercentage />,
            "%",
            "Expected annual inflation rate to calculate real returns"
          )}
        </Box>

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
            Calculate Returns
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const FDCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(6.5);
  const [time, setTime] = useState(3);
  const [compoundFrequency, setCompoundFrequency] = useState("4");
  const [taxRate, setTaxRate] = useState(10);
  const [inflation, setInflation] = useState(5);
  
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const resultsRef = useRef(null);
  const toast = useToast();

  // State for calculation results
  const [fdResults, setFdResults] = useState({
    maturityAmount: 0,
    totalInterest: 0,
    effectiveYield: 0,
    inflationAdjustedValue: 0,
    taxOnInterest: 0,
    postTaxReturn: 0,
    yearlyData: []
  });

  const resetForm = () => {
    setPrincipal(100000);
    setRate(6.5);
    setTime(3);
    setCompoundFrequency("4");
    setTaxRate(10);
    setInflation(5);
    setShowResults(false);
  };

  const calculateFD = () => {
    setIsCalculating(true);
    
    // Small delay for UI feedback
    setTimeout(() => {
      try {
        const freq = parseInt(compoundFrequency);
        const timeInYears = time;
        
        // Calculate maturity amount with compound interest
        const maturityAmount = principal * Math.pow(1 + (rate / 100) / freq, freq * timeInYears);
        const totalInterest = maturityAmount - principal;
        
        // Calculate effective annual yield
        const effectiveYield = (Math.pow(1 + (rate / 100) / freq, freq) - 1) * 100;
        
        // Calculate tax on interest
        const taxOnInterest = totalInterest * (taxRate / 100);
        const postTaxReturn = (totalInterest - taxOnInterest) / principal * 100 / timeInYears;
        
        // Calculate inflation-adjusted value
        const inflationAdjustedValue = maturityAmount / Math.pow(1 + inflation / 100, timeInYears);
        
        // Generate yearly data
        const yearlyData = [];
        for (let year = 0; year <= Math.ceil(timeInYears); year++) {
          // Don't exceed the actual time period
          const actualYear = Math.min(year, timeInYears);
          const yearMaturity = principal * Math.pow(1 + (rate / 100) / freq, freq * actualYear);
          const yearInterest = yearMaturity - principal;
          const yearTax = yearInterest * (taxRate / 100);
          const yearInflationAdjusted = yearMaturity / Math.pow(1 + inflation / 100, actualYear);
          
          yearlyData.push({
            year: year,
            balance: yearMaturity,
            interest: yearInterest,
            tax: yearTax,
            realValue: yearInflationAdjusted
          });
        }
        
        setFdResults({
          maturityAmount,
          totalInterest,
          effectiveYield,
          inflationAdjustedValue,
          taxOnInterest,
          postTaxReturn,
          yearlyData
        });
        
        setShowResults(true);
        
        toast({
          title: "Calculation complete",
          description: "Your FD returns have been calculated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Calculation error:", error);
        toast({
          title: "Calculation error",
          description: "There was an error calculating your returns",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
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
      pdf.save(`FixedDeposit_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      
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

  // Generate chart data
  const pieChartData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [principal, fdResults.totalInterest],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
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
    }
  };

  const lineChartData = {
    labels: fdResults.yearlyData.map(data => `Year ${data.year}`),
    datasets: [
      {
        label: 'FD Value',
        data: fdResults.yearlyData.map(data => data.balance),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Real Value (Inflation Adjusted)',
        data: fdResults.yearlyData.map(data => data.realValue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        borderDash: [5, 5],
        fill: false
      }
    ]
  };
  
  const lineChartOptions = {
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
  
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const bgColor = useColorModeValue("white", "gray.800");

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
        Fixed Deposit Calculator
      </Heading>
      
      {!showResults ? (
        <InputForm
          principal={principal}
          setPrincipal={setPrincipal}
          rate={rate}
          setRate={setRate}
          time={time}
          setTime={setTime}
          compoundFrequency={compoundFrequency}
          setCompoundFrequency={setCompoundFrequency}
          taxRate={taxRate}
          setTaxRate={setTaxRate}
          inflation={inflation}
          setInflation={setInflation}
          onCalculate={calculateFD}
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
              time={time}
              setTime={setTime}
              compoundFrequency={compoundFrequency}
              setCompoundFrequency={setCompoundFrequency}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              inflation={inflation}
              setInflation={setInflation}
              onCalculate={calculateFD}
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
                      Fixed Deposit Results
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
                      <Tab>Analysis</Tab>
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
                            <Text fontSize="sm">Maturity Amount</Text>
                            <Heading size="lg" color={textColor}>
                              ₹{Math.round(fdResults.maturityAmount).toLocaleString('en-IN')}
                            </Heading>
                            <Text fontSize="xs" color={useColorModeValue("blue.600", "blue.200")} mt={1}>
                              After {time} years
                            </Text>
                          </Card>
                          
                          <Card bg={useColorModeValue("green.50", "green.900")} p={4}>
                            <Text fontSize="sm">Interest Earned</Text>
                            <Heading size="lg" color={textColor}>
                              ₹{Math.round(fdResults.totalInterest).toLocaleString('en-IN')}
                            </Heading>
                            <Text fontSize="xs" color={useColorModeValue("green.600", "green.200")} mt={1}>
                              {((fdResults.totalInterest / principal) * 100).toFixed(2)}% of principal
                            </Text>
                          </Card>
                          
                          <Card bg={useColorModeValue("purple.50", "purple.900")} p={4}>
                            <Text fontSize="sm">Effective Annual Yield</Text>
                            <Heading size="lg" color={textColor}>
                              {fdResults.effectiveYield.toFixed(2)}%
                            </Heading>
                            <Text fontSize="xs" color={useColorModeValue("purple.600", "purple.200")} mt={1}>
                              Compounded {compoundFrequency === "1" ? "annually" : 
                                compoundFrequency === "2" ? "semi-annually" :
                                compoundFrequency === "4" ? "quarterly" :
                                "monthly"}
                            </Text>
                          </Card>
                          
                          <Card bg={useColorModeValue("orange.50", "orange.900")} p={4}>
                            <Text fontSize="sm">Post-Tax Annual Return</Text>
                            <Heading size="lg" color={textColor}>
                              {fdResults.postTaxReturn.toFixed(2)}%
                            </Heading>
                            <Text fontSize="xs" color={useColorModeValue("orange.600", "orange.200")} mt={1}>
                              After {taxRate}% tax on interest
                            </Text>
                          </Card>
                        </Grid>
                        
                        <Box mb={6}>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Deposit Breakdown</Text>
                          <Box height="250px">
                            <Doughnut 
                              data={pieChartData} 
                              options={pieChartOptions} 
                            />
                          </Box>
                        </Box>
                        
                        <Divider my={4} />
                        
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Key Details</Text>
                          <TableContainer>
                            <Table variant="simple" size="sm">
                              <Tbody>
                                <Tr>
                                  <Td fontWeight="medium">Principal Amount</Td>
                                  <Td isNumeric>₹{principal.toLocaleString('en-IN')}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Interest Rate</Td>
                                  <Td isNumeric>{rate}% per annum</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Time Period</Td>
                                  <Td isNumeric>{time} years</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Compounding Frequency</Td>
                                  <Td isNumeric>
                                    {compoundFrequency === "1" ? "Annually" : 
                                      compoundFrequency === "2" ? "Semi-Annually" :
                                      compoundFrequency === "4" ? "Quarterly" :
                                      "Monthly"}
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Tax Rate</Td>
                                  <Td isNumeric>{taxRate}%</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="medium">Inflation Rate</Td>
                                  <Td isNumeric>{inflation}%</Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </TabPanel>
                      
                      {/* Charts Tab */}
                      <TabPanel>
                        <Box mb={6}>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>FD Value Over Time</Text>
                          <Box height="300px">
                            <Line 
                              data={lineChartData} 
                              options={lineChartOptions} 
                            />
                          </Box>
                        </Box>
                      </TabPanel>
                      
                      {/* Analysis Tab */}
                      <TabPanel>
                        <Box mb={6}>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Yearly Breakdown</Text>
                          <TableContainer>
                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Year</Th>
                                  <Th isNumeric>Balance (₹)</Th>
                                  <Th isNumeric>Interest (₹)</Th>
                                  <Th isNumeric>Tax (₹)</Th>
                                  <Th isNumeric>Real Value (₹)</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {fdResults.yearlyData.map((data, index) => (
                                  <Tr key={index}>
                                    <Td>{data.year}</Td>
                                    <Td isNumeric>{Math.round(data.balance).toLocaleString('en-IN')}</Td>
                                    <Td isNumeric>{Math.round(data.interest).toLocaleString('en-IN')}</Td>
                                    <Td isNumeric>{Math.round(data.tax).toLocaleString('en-IN')}</Td>
                                    <Td isNumeric>{Math.round(data.realValue).toLocaleString('en-IN')}</Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
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

export default FDCalculator;
