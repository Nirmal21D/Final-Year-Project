"use client";
import React, { useState, useEffect, useRef } from "react";
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
  InputGroup,
  InputLeftElement,
  InputRightElement,
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
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Select,
  HStack,
  IconButton,
  useToast,
  Badge,
  VStack,
  Heading,
  useClipboard,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { 
  FaRupeeSign, 
  FaPercentage, 
  FaCalendarAlt, 
  FaCalculator,
  FaChartLine,
  FaChartBar,
  FaTable,
  FaDownload,
  FaInfoCircle,
  FaUndo,
  FaCopy,
  FaArrowLeft,
  FaPrint,
  FaShareAlt
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import { toPng } from 'html-to-image';

ChartJS.register(
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
  additionalDeposit,
  setAdditionalDeposit,
  depositFrequency,
  setDepositFrequency,
  onCalculate,
  resetForm,
  isCalculating,
}) => {
  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();

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

    return (
      <Box mb={6} width="100%">
        <Flex align="center" mb={2}>
          <Box mr={2}>{icon}</Box>
          <Text fontWeight="medium" color={textColor}>{label}</Text>
          {tooltip && (
            <Tooltip label={tooltip} placement="top">
              <Box as="span" ml={1} cursor="help">
                <FaInfoCircle size="0.8em" />
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
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${unit}${value.toLocaleString()}`}
            >
              <SliderThumb boxSize={6}>
                <Box color="blue.500" />
              </SliderThumb>
            </Tooltip>
          </Slider>
          
          {unit === "₹" ? (
            <InputGroup size="md" width="120px">
              <InputLeftElement pointerEvents="none">
                <FaRupeeSign color="gray.300" />
              </InputLeftElement>
              <Input
                value={value}
                onChange={(e) => {
                  const val = parseFloat(e.target.value.replace(/,/g, ''));
                  if (!isNaN(val)) {
                    setValue(Math.min(Math.max(val, min), max));
                  } else if (e.target.value === '') {
                    setValue(0);
                  }
                }}
                borderColor={borderColor}
                textAlign="right"
              />
            </InputGroup>
          ) : unit === "%" ? (
            <InputGroup size="md" width="120px">
              <Input
                value={value}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    setValue(Math.min(Math.max(val, min), max));
                  } else if (e.target.value === '') {
                    setValue(0);
                  }
                }}
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
              value={value}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setValue(Math.min(Math.max(val, min), max));
                } else if (e.target.value === '') {
                  setValue(0);
                }
              }}
              borderColor={borderColor}
              textAlign="right"
            />
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
      bg={bgColor}
      borderRadius="xl"
      shadow="md"
      width="100%"
      borderColor={borderColor}
      borderWidth="1px"
      onKeyDown={handleKeyPress}
    >
      <CardHeader pb={0}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg" textAlign="center" color={textColor}>
            Compound Interest Calculator
          </Heading>
          <Tooltip label="Reset to defaults">
            <IconButton
              icon={<FaUndo />}
              aria-label="Reset form"
              onClick={resetForm}
              variant="ghost"
              colorScheme="gray"
              size="sm"
            />
          </Tooltip>
        </Flex>
        <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
          Calculate how your investment grows over time with compound interest
        </Text>
      </CardHeader>

      <CardBody>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            {renderSliderWithTextbox(
              "Principal Amount",
              principal,
              setPrincipal,
              1000,
              10000000,
              1000,
              <FaRupeeSign />,
              "₹",
              "Initial investment amount"
            )}

            {renderSliderWithTextbox(
              "Interest Rate",
              rate,
              setRate,
              0.1,
              50,
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
              50,
              1,
              <FaCalendarAlt />,
              " years",
              "Investment duration in years"
            )}

          </GridItem>

          <GridItem>
            <Box mb={6}>
              <Flex align="center" mb={2}>
                <Box mr={2}><FaCalculator /></Box>
                <Text fontWeight="medium" color={textColor}>Compound Frequency</Text>
                <Tooltip label="How often the interest is compounded" placement="top">
                  <Box as="span" ml={1} cursor="help">
                    <FaInfoCircle size="0.8em" />
                  </Box>
                </Tooltip>
              </Flex>
              <Select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                borderColor={borderColor}
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </Select>
            </Box>

            {renderSliderWithTextbox(
              "Additional Deposit",
              additionalDeposit,
              setAdditionalDeposit,
              0,
              500000,
              1000,
              <FaRupeeSign />,
              "₹",
              "Regular additional contributions (optional)"
            )}

            <Box mb={6}>
              <Flex align="center" mb={2}>
                <Box mr={2}><FaCalendarAlt /></Box>
                <Text fontWeight="medium" color={textColor}>Deposit Frequency</Text>
                <Tooltip label="How often you make additional deposits" placement="top">
                  <Box as="span" ml={1} cursor="help">
                    <FaInfoCircle size="0.8em" />
                  </Box>
                </Tooltip>
              </Flex>
              <Select
                value={depositFrequency}
                onChange={(e) => setDepositFrequency(e.target.value)}
                borderColor={borderColor}
                isDisabled={additionalDeposit === 0}
              >
                <option value="0">No Additional Deposits</option>
                <option value="1">Annually</option>
                <option value="12">Monthly</option>
              </Select>
            </Box>
          </GridItem>
        </Grid>

        <Button
          leftIcon={<FaCalculator />}
          colorScheme="blue"
          onClick={onCalculate}
          width="100%"
          size="lg"
          mt={6}
          isLoading={isCalculating}
          loadingText="Calculating..."
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          transition="all 0.2s"
        >
          Calculate
        </Button>
      </CardBody>
    </Card>
  );
};

const CompoundInterestCalculator = () => {
  // Base state
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [time, setTime] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState("1"); // 1 = annually
  const [additionalDeposit, setAdditionalDeposit] = useState(0);
  const [depositFrequency, setDepositFrequency] = useState("0"); // 0 = none
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [yearlyData, setYearlyData] = useState([]);
  const [summary, setSummary] = useState({
    totalInterest: 0,
    totalAmount: 0,
    totalDeposits: 0
  });
  const [activeTab, setActiveTab] = useState(0);
  const resultsRef = useRef(null);
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(
    `Compound Interest Summary\n` +
    `Principal: ₹${principal.toLocaleString('en-IN')}\n` +
    `Interest Rate: ${rate}%\n` +
    `Time Period: ${time} years\n` +
    `Final Amount: ₹${Math.round(summary.totalAmount).toLocaleString('en-IN')}\n` +
    `Total Interest: ₹${Math.round(summary.totalInterest).toLocaleString('en-IN')}`
  );
  
  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const highlightColor = useColorModeValue("blue.600", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  
  // Reset form to defaults
  const resetForm = () => {
    setPrincipal(100000);
    setRate(8);
    setTime(10);
    setCompoundFrequency("1");
    setAdditionalDeposit(0);
    setDepositFrequency("0");
    setShowResults(false);
  };

  // Calculate compound interest with additional deposits
  const calculateCompound = () => {
    setIsCalculating(true);
    
    // Short delay to allow UI to show loading state
    setTimeout(() => {
      const n = parseInt(compoundFrequency); // Compounding frequency
      const p = principal; // Initial principal
      const r = rate / 100; // Interest rate as decimal
      const t = time; // Time in years
      const deposit = additionalDeposit; // Additional deposit amount
      const depFreq = parseInt(depositFrequency); // Deposit frequency
      
      const yearlyResults = [];
      let totalInterest = 0;
      let currentPrincipal = p;
      let totalDeposits = p;
      
      for (let year = 0; year <= t; year++) {
        // For year 0, just show the initial amount
        if (year === 0) {
          yearlyResults.push({
            year,
            startBalance: currentPrincipal,
            deposits: 0,
            interest: 0,
            endBalance: currentPrincipal,
            totalDeposits: currentPrincipal,
            totalInterest: 0
          });
          continue;
        }
        
        let yearlyDeposits = 0;
        let yearStartBalance = currentPrincipal;
        
        // Calculate compound interest with periodic deposits
        if (depFreq > 0) {
          // Calculate future value with periodic deposits
          const depositsPerYear = depFreq;
          yearlyDeposits = deposit * depositsPerYear;
          totalDeposits += yearlyDeposits;
          
          // For more precise calculations, we need to compound each period
          let balance = yearStartBalance;
          const periodsPerYear = Math.max(n, depFreq);
          
          for (let period = 0; period < periodsPerYear; period++) {
            // Add deposit at start of period if applicable
            if (period % (periodsPerYear / depFreq) === 0) {
              balance += deposit;
            }
            
            // Apply interest for this period
            if (n > 0) { // Only compound if frequency > 0
              balance *= (1 + r/n);
            }
          }
          
          currentPrincipal = balance;
        } else {
          // Simple compound interest without additional deposits
          // A = P(1 + r/n)^(nt)
          currentPrincipal = p * Math.pow(1 + r/n, n * year);
        }
        
        const yearEndBalance = currentPrincipal;
        const yearInterest = yearEndBalance - yearStartBalance - yearlyDeposits;
        totalInterest += yearInterest;
        
        yearlyResults.push({
          year,
          startBalance: yearStartBalance,
          deposits: yearlyDeposits,
          interest: yearInterest,
          endBalance: yearEndBalance,
          totalDeposits,
          totalInterest
        });
      }
      
      setYearlyData(yearlyResults);
      setSummary({
        totalInterest,
        totalAmount: currentPrincipal,
        totalDeposits
      });
      setShowResults(true);
      setIsCalculating(false);
      
      toast({
        title: "Calculation Complete",
        description: `Your investment will grow to ₹${Math.round(currentPrincipal).toLocaleString('en-IN')} in ${time} years`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 500);
  };
  
  // Chart data and options
  const chartData = {
    labels: yearlyData.map(data => `Year ${data.year}`),
    datasets: [
      {
        label: 'Principal & Deposits',
        data: yearlyData.map(data => data.totalDeposits),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Interest',
        data: yearlyData.map(data => data.totalInterest),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
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
  
  const lineChartData = {
    labels: yearlyData.map(data => `Year ${data.year}`),
    datasets: [
      {
        label: 'Balance Growth',
        data: yearlyData.map(data => data.endBalance),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
      pdf.save(`Compound_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      
      // Success toast...
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Error toast...
    } finally {
      setIsExporting(false);
    }
  };
  

  // Calculate effective annual rate
  const effectiveAnnualRate = (
    (Math.pow(1 + (rate/100) / parseInt(compoundFrequency), parseInt(compoundFrequency)) - 1) * 100
  ).toFixed(2);

  return (
    <Container maxW="7xl" p={0} bg={bgColor}>
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
          additionalDeposit={additionalDeposit}
          setAdditionalDeposit={setAdditionalDeposit}
          depositFrequency={depositFrequency}
          setDepositFrequency={setDepositFrequency}
          onCalculate={calculateCompound}
          resetForm={resetForm}
          isCalculating={isCalculating}
        />
      ) : (
        <Box ref={resultsRef}>
          <Flex 
            justify="space-between" 
            mb={6} 
            align="center" 
            wrap="wrap"
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading size="md" color={textColor}>
              Compound Interest Results
            </Heading>
            <HStack>
              <Badge colorScheme="blue" p={2} borderRadius="md">
                {rate}% interest rate
              </Badge>
              <Badge colorScheme="green" p={2} borderRadius="md">
                {time} years
              </Badge>
            </HStack>
          </Flex>
          
          {/* Summary Cards */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={4}
            mb={6}
          >
            <Card bg={cardBg} boxShadow="md" borderLeft="4px solid" borderLeftColor="blue.400">
              <CardBody>
                <Stat>
                  <StatLabel>Total Amount</StatLabel>
                  <StatNumber color={highlightColor}>
                    ₹{Math.round(summary.totalAmount).toLocaleString('en-IN')}
                  </StatNumber>
                  <StatHelpText>After {time} years</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} boxShadow="md" borderLeft="4px solid" borderLeftColor="green.400">
              <CardBody>
                <Stat>
                  <StatLabel>Total Interest</StatLabel>
                  <StatNumber color="green.500">
                    ₹{Math.round(summary.totalInterest).toLocaleString('en-IN')}
                  </StatNumber>
                  <StatHelpText>
                    {((summary.totalInterest / summary.totalDeposits) * 100).toFixed(1)}% return
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} boxShadow="md" borderLeft="4px solid" borderLeftColor="purple.400">
              <CardBody>
                <Stat>
                  <StatLabel>Total Deposits</StatLabel>
                  <StatNumber color="purple.500">
                    ₹{Math.round(summary.totalDeposits).toLocaleString('en-IN')}
                  </StatNumber>
                  <StatHelpText>
                    Principal + Additional Deposits
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>
          
          <Card bg={cardBg} boxShadow="lg" mb={6}>
            <CardHeader pb={0}>
              <Text fontSize="lg" fontWeight="bold">Additional Information</Text>
            </CardHeader>
            <CardBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <Box>
                  <Text fontWeight="medium" mb={2}>Investment Details:</Text>
                  <Grid templateColumns="1fr 1fr" gap={2}>
                    <Text>Principal Amount:</Text>
                    <Text fontWeight="semibold">₹{principal.toLocaleString('en-IN')}</Text>
                    
                    <Text>Interest Rate:</Text>
                    <Text fontWeight="semibold">{rate}% per year</Text>
                    
                    <Text>Time Period:</Text>
                    <Text fontWeight="semibold">{time} years</Text>
                    
                    <Text>Compound Frequency:</Text>
                    <Text fontWeight="semibold">
                      {compoundFrequency === "1" ? "Annually" : 
                       compoundFrequency === "2" ? "Semi-Annually" :
                       compoundFrequency === "4" ? "Quarterly" :
                       compoundFrequency === "12" ? "Monthly" : "Daily"}
                    </Text>
                  </Grid>
                </Box>
                
                <Box>
                  <Text fontWeight="medium" mb={2}>Additional Contributions:</Text>
                  <Grid templateColumns="1fr 1fr" gap={2}>
                    <Text>Regular Deposit:</Text>
                    <Text fontWeight="semibold">₹{additionalDeposit.toLocaleString('en-IN')}</Text>
                    
                    <Text>Deposit Frequency:</Text>
                    <Text fontWeight="semibold">
                      {depositFrequency === "0" ? "None" :
                       depositFrequency === "1" ? "Annually" : "Monthly"}
                    </Text>
                    
                    <Text>Effective Annual Rate:</Text>
                    <Text fontWeight="semibold">{effectiveAnnualRate}%</Text>
                    
                    <Text>Final Growth:</Text>
                    <Text fontWeight="semibold">{((summary.totalAmount / principal - 1) * 100).toFixed(1)}%</Text>
                  </Grid>
                </Box>
              </Grid>
            </CardBody>
          </Card>
          
          <Tabs isFitted variant="enclosed" colorScheme="blue" mb={8}>
            <TabList>
              <Tab><Box as="span" mr={2}><FaChartLine /></Box>Growth Chart</Tab>
              <Tab><Box as="span" mr={2}><FaChartBar /></Box>Breakdown</Tab>
              <Tab><Box as="span" mr={2}><FaTable /></Box>Year by Year</Tab>
            </TabList>
            
            <TabPanels>
              {/* Growth Chart Tab */}
              <TabPanel>
                <Card bg={cardBg} boxShadow="md">
                  <CardBody>
                    <Box height="400px">
                      <Line data={lineChartData} options={lineChartOptions} />
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Breakdown Chart Tab */}
              <TabPanel>
                <Card bg={cardBg} boxShadow="md">
                  <CardBody>
                    <Box height="400px">
                      <Bar data={chartData} options={chartOptions} />
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Yearly Data Tab */}
              <TabPanel>
                <Card bg={cardBg} boxShadow="md" overflowX="auto">
                  <CardBody p={0}>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Year</Th>
                          <Th isNumeric>Starting Balance</Th>
                          <Th isNumeric>Deposits</Th>
                          <Th isNumeric>Interest</Th>
                          <Th isNumeric>Ending Balance</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {yearlyData.map((data, index) => (
                          <Tr key={index}>
                            <Td>{data.year}</Td>
                            <Td isNumeric>₹{Math.round(data.startBalance).toLocaleString('en-IN')}</Td>
                            <Td isNumeric>₹{Math.round(data.deposits).toLocaleString('en-IN')}</Td>
                            <Td isNumeric>₹{Math.round(data.interest).toLocaleString('en-IN')}</Td>
                            <Td isNumeric>₹{Math.round(data.endBalance).toLocaleString('en-IN')}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          <Flex justify="space-between" align="center" wrap="wrap" mb={6}>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={() => setShowResults(false)}
              colorScheme="gray"
              variant="outline"
              size="lg"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Back to Calculator
            </Button>
            
            <HStack spacing={4}>
              <Button
                leftIcon={<FaCopy />}
                onClick={onCopy}
                colorScheme="blue"
                variant="outline"
                size="lg"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                {hasCopied ? "Copied" : "Copy Summary"}
              </Button>
              
              <Button
                leftIcon={<FaDownload />}
                onClick={downloadPDF}
                colorScheme="blue"
                size="lg"
                isLoading={isExporting}
                loadingText="Exporting..."
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Download PDF
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}
    </Container>
  );
};

export default CompoundInterestCalculator;
