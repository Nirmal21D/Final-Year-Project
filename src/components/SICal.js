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
} from "@chakra-ui/react";
import { 
  FaRupeeSign, 
  FaCalculator, 
  FaInfoCircle, 
  FaUndo, 
  FaDownload, 
  FaCopy, 
  FaPercentage,
  FaCalendarAlt,
  FaChartPie
} from "react-icons/fa";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Bar, Pie, Doughnut } from "react-chartjs-2";
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

import useClipboard from "react-use-clipboard";
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
  principal,
  setPrincipal,
  rate,
  setRate,
  time,
  setTime,
  onCalculate,
  resetForm,
  isCalculating,
}) => {
  // Colors - matching with IncomeTaxCal.js
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
      // For smaller values like interest rates or time
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
                <Text color="gray.500">{unit || "yr"}</Text>
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
            Simple Interest Calculator
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
          Calculate your simple interest earnings
        </Text>
      </CardHeader>
      
      <Divider my={3} />
      
      <CardBody pt={4}>
        {renderSliderWithTextbox(
          "Principal Amount",
          principal,
          setPrincipal,
          1000,
          1000000,
          1000,
          <FaRupeeSign />,
          "₹", 
          "Initial investment amount"
        )}

        {renderSliderWithTextbox(
          "Interest Rate",
          rate,
          setRate,
          1,
          20,
          0.1,
          <FaPercentage />,
          "%", 
          "Annual interest rate"
        )}

        {renderSliderWithTextbox(
          "Time Period",
          time,
          setTime,
          1,
          30,
          1,
          <FaCalendarAlt />,
          "years", 
          "Investment duration in years"
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
            Calculate
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const SimpleInterestCalculator = () => {
  // Base state
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    simpleInterest: 0,
    totalAmount: 0,
    monthlyInterest: 0,
    effectiveRate: 0
  });
  
  const resultsRef = useRef(null);
  const toast = useToast();
  
  // Colors - matching with IncomeTaxCal.js
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const bgColor = useColorModeValue("white", "gray.800");
  
  const summaryText = `Simple Interest Summary\n` +
    `Principal: ₹${principal.toLocaleString('en-IN')}\n` +
    `Rate: ${rate}%\n` +
    `Time: ${time} years\n` +
    `Interest: ₹${results.simpleInterest.toLocaleString('en-IN')}\n` +
    `Total Amount: ₹${results.totalAmount.toLocaleString('en-IN')}`;
  
  const { hasCopied, onCopy } = useClipboard(summaryText);

  // Reset form to defaults
  const resetForm = () => {
    setPrincipal(10000);
    setRate(5);
    setTime(1);
    setShowResults(false);
    setResults({
      simpleInterest: 0,
      totalAmount: 0,
      monthlyInterest: 0,
      effectiveRate: 0
    });
  };

  // Calculate SI
  const calculateSI = () => {
    setIsCalculating(true);
    
    // Short delay to show loading state
    setTimeout(() => {
      try {
        const simpleInterest = (principal * rate * time) / 100;
        const totalAmount = principal + simpleInterest;
        const monthlyInterest = simpleInterest / (time * 12);
        const effectiveRate = (simpleInterest / principal / time) * 100;
        
        setResults({
          simpleInterest,
          totalAmount,
          monthlyInterest,
          effectiveRate
        });
        
        setShowResults(true);
        
        toast({
          title: "Calculation Complete",
          description: `Your simple interest is ₹${simpleInterest.toLocaleString('en-IN')}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Calculation Error",
          description: "There was an error calculating the simple interest",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  // Chart data for breakdown
  const breakdownData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [principal, results.simpleInterest],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for yearly growth
  const yearlyGrowthData = {
    labels: Array.from({length: time + 1}, (_, i) => `Year ${i}`),
    datasets: [
      {
        label: 'Balance',
        data: Array.from({length: time + 1}, (_, i) => 
          i === 0 ? principal : principal + (principal * rate * i) / 100
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
      pdf.save(`Simple_Interest_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      
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
        Simple Interest Calculator
      </Heading>
      
      {!showResults ? (
        <InputForm
          principal={principal}
          setPrincipal={setPrincipal}
          rate={rate}
          setRate={setRate}
          time={time}
          setTime={setTime}
          onCalculate={calculateSI}
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
              onCalculate={calculateSI}
              resetForm={resetForm}
              isCalculating={isCalculating}
            />
          </GridItem>

          <GridItem>
            <div ref={resultsRef}>
              <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden">
                <CardHeader bg={headerBg} pb={3}>
                  <Heading size="md" color={accentColor}>
                    Simple Interest Results
                  </Heading>
                </CardHeader>
                
                <CardBody>
                  <Stat>
                    <StatLabel color={textColor}>Principal Amount</StatLabel>
                    <StatNumber color={accentColor}>₹{principal.toLocaleString('en-IN')}</StatNumber>
                  </Stat>
                  
                  <Stat>
                    <StatLabel color={textColor}>Simple Interest</StatLabel>
                    <StatNumber color={accentColor}>₹{results.simpleInterest.toLocaleString('en-IN')}</StatNumber>
                    <StatHelpText color={textColor}>
                      At {rate}% for {time} year{time !== 1 ? 's' : ''}
                    </StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel color={textColor}>Total Amount</StatLabel>
                    <StatNumber color={accentColor}>₹{results.totalAmount.toLocaleString('en-IN')}</StatNumber>
                  </Stat>
                  
                  <Stat>
                    <StatLabel color={textColor}>Monthly Interest</StatLabel>
                    <StatNumber color={accentColor}>₹{results.monthlyInterest.toFixed(2).toLocaleString('en-IN')}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              
              <Tabs mt={6} index={activeTab} onChange={setActiveTab}>
                <TabList>
                  <Tab>Breakdown</Tab>
                  <Tab>Annual Growth</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box height="300px">
                      <Doughnut data={breakdownData} options={chartOptions} />
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box height="300px">
                      <Bar data={yearlyGrowthData} options={chartOptions} />
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
              
              <HStack spacing={4} mt={6}>
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
                  colorScheme="blue"
                  onClick={onCopy}
                >
                  {hasCopied ? "Copied" : "Copy Summary"}
                </Button>
              </HStack>
            </div>
          </GridItem>
        </Grid>
      )}
      
      {/* Information Card */}
      {showResults && (
        <Card mt={8} p={5} borderRadius="xl" shadow="md" borderLeft="4px solid" borderColor="blue.400">
          <Heading size="sm" mb={2}>What is Simple Interest?</Heading>
          <Text fontSize="sm">
            Simple interest is calculated as a percentage of the principal only, using the formula: SI = (P × R × T)/100, 
            where P is the principal amount, R is the rate per annum, and T is the time period in years.
          </Text>
          <Text fontSize="sm" mt={2}>
            Unlike compound interest, simple interest doesn't earn interest on previously earned interest, making it 
            straightforward to calculate but potentially less profitable for long-term investments.
          </Text>
        </Card>
      )}
    </Container>
  );
};

export default SimpleInterestCalculator;
