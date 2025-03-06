import React, { useState, useEffect, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  Box,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Text,
  Flex,
  Input,
  Select,
  VStack,
  Heading,
  Grid,
  GridItem,
  Container,
  Center,
  Card,
  CardBody,
  CardHeader,
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tag,
  HStack,
  useColorModeValue,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { 
  FaDollarSign, 
  FaPercentage, 
  FaChartLine, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaChartBar 
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const countryOptions = {
  India: { symbol: "₹", inflationRate: 5.4 },
  USA: { symbol: "$", inflationRate: 3.2 },
  Europe: { symbol: "€", inflationRate: 2.8 },
  UK: { symbol: "£", inflationRate: 3.7 },
  Japan: { symbol: "¥", inflationRate: 2.2 },
  Australia: { symbol: "A$", inflationRate: 3.6 },
  Canada: { symbol: "C$", inflationRate: 3.0 },
  Switzerland: { symbol: "CHF", inflationRate: 1.8 },
  China: { symbol: "¥", inflationRate: 2.1 },
  Russia: { symbol: "₽", inflationRate: 5.8 },
  SouthAfrica: { symbol: "R", inflationRate: 5.6 },
  Brazil: { symbol: "R$", inflationRate: 4.9 },
  Singapore: { symbol: "S$", inflationRate: 2.5 },
  Mexico: { symbol: "MX$", inflationRate: 4.5 },
};

const investmentOptions = [
  { name: "Cash/Savings", avgReturn: 1.0 },
  { name: "Government Bonds", avgReturn: 4.0 },
  { name: "Corporate Bonds", avgReturn: 6.0 },
  { name: "Balanced Mutual Fund", avgReturn: 8.0 },
  { name: "Index Fund", avgReturn: 9.0 },
  { name: "Real Estate", avgReturn: 7.0 },
  { name: "Gold", avgReturn: 5.0 },
  { name: "Aggressive Stocks", avgReturn: 12.0 },
];

const InflationPage = () => {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(5);
  const [returnRate, setReturnRate] = useState(8);
  const [predictedValues, setPredictedValues] = useState([]);
  const [inflationAdjustedValues, setInflationAdjustedValues] = useState([]);
  const [roiValues, setRoiValues] = useState([]);
  const [realRoiValues, setRealRoiValues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedInvestment, setSelectedInvestment] = useState("Balanced Mutual Fund");
  const [currencySymbol, setCurrencySymbol] = useState(countryOptions["India"].symbol);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const sliderTrackColor = useColorModeValue("gray.200", "gray.600");
  const sliderThumbColor = useColorModeValue("teal.500", "teal.300");

  useEffect(() => {
    // Update inflation rate when country changes
    setInflationRate(countryOptions[selectedCountry].inflationRate);
  }, [selectedCountry]);

  useEffect(() => {
    // Update return rate when investment type changes
    const selectedOption = investmentOptions.find(option => option.name === selectedInvestment);
    if (selectedOption) {
      setReturnRate(selectedOption.avgReturn);
    }
  }, [selectedInvestment]);

  const summary = useMemo(() => {
    if (predictedValues.length === 0) return null;
    
    const initialInvestment = investmentAmount;
    const finalNominalValue = parseFloat(predictedValues[predictedValues.length - 1]);
    const finalRealValue = parseFloat(inflationAdjustedValues[inflationAdjustedValues.length - 1]);
    const nominalGain = finalNominalValue - initialInvestment;
    const realGain = finalRealValue - initialInvestment;
    const lossToInflation = finalNominalValue - finalRealValue;
    const inflationImpactPercentage = (lossToInflation / finalNominalValue) * 100;
    
    return {
      initialInvestment,
      finalNominalValue,
      finalRealValue,
      nominalGain,
      realGain,
      lossToInflation,
      inflationImpactPercentage
    };
  }, [predictedValues, inflationAdjustedValues, investmentAmount]);

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
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (val) => {
      setLocalValue(val);
    };

    const handleInputChange = (e) => {
      const val = parseFloat(e.target.value) || 0;
      setLocalValue(val);
    };

    const handleBlur = () => {
      // Clamp the value within range
      let newValue = localValue;
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      setLocalValue(newValue);
      setValue(newValue);
    };

    return (
      <Box mb={6} width="100%">
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <HStack>
            {icon}
            <Text fontWeight="medium" color={textColor}>
              {label}
            </Text>
          </HStack>
          
          {tooltip && (
            <Tooltip label={tooltip} hasArrow placement="top">
              <Box as={FaInfoCircle} color="gray.500" cursor="help" />
            </Tooltip>
          )}
        </Flex>
        
        <Flex alignItems="center">
          <Slider
            flex="1"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleChange}
            onChangeEnd={(v) => setValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            colorScheme="teal"
            mr={4}
          >
            <SliderTrack bg={sliderTrackColor}>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${localValue}${unit}`}
            >
              <SliderThumb bg={sliderThumbColor} />
            </Tooltip>
          </Slider>
          
          <InputGroup width="120px">
            {unit === "%" && (
              <InputRightElement pointerEvents="none" children="%" color="gray.500" />
            )}
            {unit === currencySymbol && (
              <InputLeftElement pointerEvents="none" children={currencySymbol} color="gray.500" />
            )}
            <Input
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              type="number"
              textAlign={unit === currencySymbol ? "right" : "center"}
              color={textColor}
              borderColor={borderColor}
            />
          </InputGroup>
        </Flex>
      </Box>
    );
  };

  const calculatePredictions = () => {
    // Validation
    if (investmentAmount <= 0) {
      toast({
        title: "Invalid investment amount",
        description: "Please enter a positive investment amount",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (years <= 0) {
      toast({
        title: "Invalid time period",
        description: "Please enter a positive number of years",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let predictions = [];
    let adjustedValues = [];
    let roiValues = [];
    let realRoiValues = [];
    
    // Nominal return rate
    const returnRateDecimal = returnRate / 100;
    // Inflation rate
    const inflationRateDecimal = inflationRate / 100;
    // Real return rate (using Fisher equation)
    const realReturnRate = ((1 + returnRateDecimal) / (1 + inflationRateDecimal) - 1) * 100;
    
    // Initial values
    let nominalValue = investmentAmount;
    let realValue = investmentAmount;

    // Year 0 (starting point)
    predictions.push(nominalValue.toFixed(2));
    adjustedValues.push(realValue.toFixed(2));
    roiValues.push(0);
    realRoiValues.push(0);

    for (let year = 1; year <= years; year++) {
      // Calculate nominal value with compound interest
      nominalValue = nominalValue * (1 + returnRateDecimal);
      predictions.push(nominalValue.toFixed(2));
      
      // Calculate inflation-adjusted (real) value
      realValue = nominalValue / Math.pow(1 + inflationRateDecimal, year);
      adjustedValues.push(realValue.toFixed(2));
      
      // Calculate ROI
      const nominalRoi = ((nominalValue - investmentAmount) / investmentAmount) * 100;
      roiValues.push(nominalRoi.toFixed(2));
      
      // Calculate real ROI
      const realRoi = ((realValue - investmentAmount) / investmentAmount) * 100;
      realRoiValues.push(realRoi.toFixed(2));
    }

    setPredictedValues(predictions);
    setInflationAdjustedValues(adjustedValues);
    setRoiValues(roiValues);
    setRealRoiValues(realRoiValues);
    setShowResults(true);
    
    toast({
      title: "Calculation complete",
      description: "Your inflation-adjusted returns have been calculated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const InputSection = () => (
    <VStack
      spacing={4}
      width="100%"
      p={6}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
    >
      <Heading size="md" color={textColor} mb={2}>
        Inflation Impact Calculator
      </Heading>

      <Divider />

      <Box width="100%">
        <Text mb={2} fontWeight="medium" color={textColor}>
          Select Country:
        </Text>
        <Select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setCurrencySymbol(countryOptions[e.target.value].symbol);
          }}
          color={textColor}
          borderColor={borderColor}
        >
          {Object.keys(countryOptions).map((country) => (
            <option
              key={country}
              value={country}
            >
              {country} ({countryOptions[country].symbol})
            </option>
          ))}
        </Select>
      </Box>

      <Box width="100%">
        <Text mb={2} fontWeight="medium" color={textColor}>
          Investment Type:
        </Text>
        <Select
          value={selectedInvestment}
          onChange={(e) => setSelectedInvestment(e.target.value)}
          color={textColor}
          borderColor={borderColor}
        >
          {investmentOptions.map((option) => (
            <option
              key={option.name}
              value={option.name}
            >
              {option.name} (avg. {option.avgReturn}% return)
            </option>
          ))}
        </Select>
      </Box>

      {renderSliderWithTextbox(
        "Investment Amount",
        investmentAmount,
        setInvestmentAmount,
        1000,
        1000000,
        1000,
        <FaDollarSign />,
        currencySymbol,
        "The initial amount you plan to invest"
      )}
      
      {renderSliderWithTextbox(
        "Expected Return Rate",
        returnRate,
        setReturnRate,
        0,
        30,
        0.1,
        <FaChartLine />,
        "%",
        "Average annual return on your investment before inflation"
      )}
      
      {renderSliderWithTextbox(
        "Inflation Rate",
        inflationRate,
        setInflationRate,
        0,
        20,
        0.1,
        <FaPercentage />,
        "%",
        "Expected average annual inflation rate"
      )}
      
      {renderSliderWithTextbox(
        "Investment Period",
        years,
        setYears,
        1,
        30,
        1,
        <FaCalendarAlt />,
        " years",
        "Number of years you plan to keep your investment"
      )}

      <Button
        colorScheme="teal"
        leftIcon={<FaChartBar />}
        onClick={calculatePredictions}
        width="100%"
        mt={4}
        size="lg"
      >
        Calculate
      </Button>
    </VStack>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        ticks: {
          color: textColor,
        },
        grid: {
          color: borderColor,
        },
        title: {
          display: true,
          text: "Year",
          color: textColor
        }
      },
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          color: textColor,
        },
        grid: {
          color: borderColor,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.yAxisID === 'percentage') {
                label += context.parsed.y.toFixed(2) + '%';
              } else {
                label += currencySymbol + context.parsed.y.toLocaleString();
              }
            }
            return label;
          }
        }
      }
    },
  };

  const valueChartData = {
    labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`),
    datasets: [
      {
        label: "Nominal Value",
        data: predictedValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Inflation-Adjusted Value",
        data: inflationAdjustedValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const roiChartData = {
    labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`),
    datasets: [
      {
        label: "Nominal ROI (%)",
        data: roiValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: {
          target: 'origin',
          above: 'rgba(54, 162, 235, 0.2)',
        },
        tension: 0.4,
      },
      {
        label: "Real ROI (%)",
        data: realRoiValues,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        fill: {
          target: 'origin',
          above: 'rgba(255, 159, 64, 0.2)',
        },
        tension: 0.4,
      },
    ],
  };

  return (
    <Box minH="100vh" p={{ base: 4, md: 8 }} pb={16}>
      <Container maxW="container.xl">
        <VStack spacing={8} mb={8}>
          <Heading 
            as="h1"
            size="xl"
            textAlign="center"
            bgGradient="linear(to-r, teal.500, blue.500)"
            bgClip="text"
          >
            Inflation Impact Calculator
          </Heading>
          
          <Text textAlign="center" fontSize="lg" color={textColor} maxW="2xl">
            Understand how inflation erodes your investment returns over time. Calculate the real value of your money after accounting for inflation.
          </Text>
        </VStack>

        {!showResults ? (
          <Center>
            <Box maxW="md" width="100%">
              <InputSection />
            </Box>
          </Center>
        ) : (
          <Grid
            templateColumns={{ base: "1fr", lg: "300px 1fr" }}
            gap={8}
          >
            <GridItem>
              <InputSection />
            </GridItem>

            <GridItem>
              <Tabs colorScheme="teal" onChange={setActiveTab} variant="enclosed">
                <TabList>
                  <Tab>Summary</Tab>
                  <Tab>Charts</Tab>
                  <Tab>Data Table</Tab>
                </TabList>

                <TabPanels>
                  {/* Summary Tab */}
                  <TabPanel>
                    <Card bg={cardBg} boxShadow="md" mb={6}>
                      <CardHeader pb={0}>
                        <Heading size="md" color={textColor}>
                          Investment Summary
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                          <GridItem>
                            <Stat>
                              <StatLabel>Initial Investment</StatLabel>
                              <StatNumber>{currencySymbol}{summary?.initialInvestment.toLocaleString()}</StatNumber>
                            </Stat>
                          </GridItem>
                          
                          <GridItem>
                            <Stat>
                              <StatLabel>Investment Period</StatLabel>
                              <StatNumber>{years} Years</StatNumber>
                            </Stat>
                          </GridItem>
                          
                          <GridItem>
                            <Stat>
                              <StatLabel>Nominal Final Value</StatLabel>
                              <StatNumber>{currencySymbol}{summary?.finalNominalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</StatNumber>
                              <StatHelpText>
                                +{currencySymbol}{summary?.nominalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({roiValues[years]}%)
                              </StatHelpText>
                            </Stat>
                          </GridItem>
                          
                          <GridItem>
                            <Stat>
                              <StatLabel>Real Final Value</StatLabel>
                              <StatNumber>{currencySymbol}{summary?.finalRealValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</StatNumber>
                              <StatHelpText>
                                +{currencySymbol}{summary?.realGain.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({realRoiValues[years]}%)
                              </StatHelpText>
                            </Stat>
                          </GridItem>
                        </Grid>
                        
                        <Divider my={4} />
                        
                        <Stat mb={4}>
                          <StatLabel>Inflation Impact</StatLabel>
                          <StatNumber>{currencySymbol}{summary?.lossToInflation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</StatNumber>
                          <StatHelpText>
                            <Badge colorScheme="orange" fontSize="md">
                              {summary?.inflationImpactPercentage.toFixed(2)}% of nominal returns lost to inflation
                            </Badge>
                          </StatHelpText>
                        </Stat>
                        
                        <Box p={4} bg="orange.50" borderRadius="md" _dark={{ bg: "orange.900" }}>
                          <Text color={textColor} fontSize="sm">
                            <b>Insight:</b> While your investment appears to grow to {currencySymbol}{summary?.finalNominalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} in {years} years, 
                            its purchasing power will actually be equivalent to {currencySymbol}{summary?.finalRealValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} in today's money. 
                            That's a difference of {currencySymbol}{summary?.lossToInflation.toLocaleString(undefined, { maximumFractionDigits: 0 })} due to inflation.
                          </Text>
                        </Box>
                      </CardBody>
                    </Card>
                    
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                      <Card bg={cardBg} boxShadow="md">
                        <CardHeader pb={0}>
                          <Heading size="md" color={textColor}>
                            Investment Details
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <TableContainer>
                            <Table variant="simple" size="sm">
                              <Tbody>
                                <Tr>
                                  <Td fontWeight="bold">Investment Type</Td>
                                  <Td>{selectedInvestment}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="bold">Country</Td>
                                  <Td>{selectedCountry}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="bold">Annual Return Rate</Td>
                                  <Td>{returnRate}%</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="bold">Inflation Rate</Td>
                                  <Td>{inflationRate}%</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight="bold">Real Return Rate</Td>
                                  <Td>
                                    {((1 + returnRate/100)/(1 + inflationRate/100) - 1) * 100 > 0 ? 
                                      <Tag colorScheme="green">+{(((1 + returnRate/100)/(1 + inflationRate/100) - 1) * 100).toFixed(2)}%</Tag> :
                                      <Tag colorScheme="red">{(((1 + returnRate/100)/(1 + inflationRate/100) - 1) * 100).toFixed(2)}%</Tag>
                                    }
                                  </Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </CardBody>
                      </Card>
                      
                      <Card bg={cardBg} boxShadow="md">
                        <CardHeader pb={0}>
                          <Heading size="md" color={textColor}>
                            Recommendations
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          {inflationRate >= returnRate ? (
                            <Text color="red.500" fontWeight="bold">
                              Warning: Your investment return rate ({returnRate}%) is less than or equal to inflation ({inflationRate}%). 
                              Your investment is losing purchasing power over time.
                            </Text>
                          ) : (
                            <Text color={textColor}>
                              Your investment has a positive real return rate of {(((1 + returnRate/100)/(1 + inflationRate/100) - 1) * 100).toFixed(2)}% 
                              after accounting for inflation.
                            </Text>
                          )}
                          
                          <Text mt={4} color={textColor}>
                            {returnRate < 6 ? 
                              "Consider exploring higher-yield investment options to better outpace inflation." :
                              returnRate > 15 ? 
                                "Your expected return is quite high. Make sure your risk assessment is realistic." :
                                "Your investment strategy has a balanced return profile relative to typical inflation rates."
                            }
                          </Text>
                        </CardBody>
                      </Card>
                    </Grid>
                  </TabPanel>
                  
                  {/* Charts Tab */}
                  <TabPanel>
                    <Card bg={cardBg} boxShadow="md" mb={6}>
                      <CardHeader pb={0}>
                        <Heading size="md" color={textColor}>
                          Investment Value Over Time
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <Text fontSize="sm" mb={4} color="gray.600" _dark={{ color: "gray.400" }}>
                          Shows how your investment grows in both nominal terms and when adjusted for inflation
                        </Text>
                        <Box height="400px">
                          <Line
                            data={valueChartData}
                            options={{
                              ...chartOptions,
                              scales: {
                                ...chartOptions.scales,
                                y: {
                                  ...chartOptions.scales.y,
                                  title: {
                                    display: true,
                                    text: `Value (${currencySymbol})`,
                                    color: textColor
                                  },
                                  ticks: {
                                    ...chartOptions.scales.y.ticks,
                                    callback: (value) => `${currencySymbol}${value.toLocaleString()}`,
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} boxShadow="md">
                      <CardHeader pb={0}>
                        <Heading size="md" color={textColor}>
                          Return on Investment (ROI)
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <Text fontSize="sm" mb={4} color="gray.600" _dark={{ color: "gray.400" }}>
                          Compare nominal returns with inflation-adjusted real returns
                        </Text>
                        <Box height="400px">
                          <Line
                            data={roiChartData}
                            options={{
                              ...chartOptions,
                              scales: {
                                ...chartOptions.scales,
                                y: {
                                  ...chartOptions.scales.y,
                                  title: {
                                    display: true,
                                    text: "Return (%)",
                                    color: textColor
                                  },
                                  ticks: {
                                    ...chartOptions.scales.y.ticks,
                                    callback: (value) => `${value}%`,
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      </CardBody>
                    </Card>
                  </TabPanel>
                  
                  {/* Data Table Tab */}
                  <TabPanel>
                    <Card bg={cardBg} boxShadow="md">
                      <CardHeader pb={0}>
                        <Heading size="md" color={textColor}>
                          Year-by-Year Breakdown
                        </Heading>
                      </CardHeader>
                      <CardBody overflowX="auto">
                        <TableContainer>
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th>Year</Th>
                                <Th isNumeric>Nominal Value</Th>
                                <Th isNumeric>Real Value</Th>
                                <Th isNumeric>Nominal ROI</Th>
                                <Th isNumeric>Real ROI</Th>
                                <Th isNumeric>Inflation Impact</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {Array.from({ length: years + 1 }, (_, i) => (
                                <Tr key={i}>
                                  <Td>{i}</Td>
                                  <Td isNumeric>{currencySymbol}{parseFloat(predictedValues[i]).toLocaleString()}</Td>
                                  <Td isNumeric>{currencySymbol}{parseFloat(inflationAdjustedValues[i]).toLocaleString()}</Td>
                                  <Td isNumeric>{roiValues[i]}%</Td>
                                  <Td isNumeric>{realRoiValues[i]}%</Td>
                                  <Td isNumeric>{currencySymbol}{(parseFloat(predictedValues[i]) - parseFloat(inflationAdjustedValues[i])).toLocaleString()}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default InflationPage;
