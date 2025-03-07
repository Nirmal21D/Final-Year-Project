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
  Checkbox,
  VStack,
  Heading,
  Badge,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  useClipboard,
  HStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spacer
} from "@chakra-ui/react";
import { 
  FaRupeeSign, 
  FaCalculator, 
  FaInfoCircle, 
  FaUndo, 
  FaDownload, 
  FaCopy, 
  FaChartPie,
  FaPercentage,
  FaCalendarAlt
} from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const InputForm = ({ 
  income, 
  setIncome, 
  onCalculate, 
  deductions, 
  setDeductions, 
  taxRegime, 
  setTaxRegime,
  resetForm,
  isCalculating
}) => {
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

  const renderDeductionOption = (label, key, maxLimit = null) => (
    <Box key={key} mb={4} opacity={taxRegime === "new" ? 0.6 : 1}>
      <Checkbox
        isChecked={deductions[key]?.enabled}
        onChange={() =>
          setDeductions((prev) => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled },
          }))
        }
        isDisabled={taxRegime === "new"}
      >
        {label}
        {maxLimit && (
          <Badge ml={2} colorScheme="green" fontSize="xs">
            Max: ₹{parseInt(maxLimit).toLocaleString('en-IN')}
          </Badge>
        )}
      </Checkbox>
      {deductions[key]?.enabled && taxRegime === "old" && (
        <InputGroup mt={2} size="sm">
          <InputLeftElement pointerEvents="none">
            <FaRupeeSign color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Enter amount"
            value={deductions[key]?.amount || ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setDeductions((prev) => ({
                ...prev,
                [key]: { 
                  ...prev[key], 
                  amount: isNaN(val) ? 0 : val,
                },
              }))
            }}
            type="number"
          />
        </InputGroup>
      )}
    </Box>
  );

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
            Income Tax Calculator
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
          Calculate your income tax liability under both regimes
        </Text>
      </CardHeader>
      
      <Divider my={3} />
      
      <CardBody pt={4}>
        <Box mb={6}>
          <Flex align="center" mb={2}>
            <Box mr={2} color={sliderColor}><FaCalculator /></Box>
            <Text fontWeight="medium" color={textColor}>Tax Regime</Text>
            <Tooltip label="Different tax rates apply based on regime" placement="top" hasArrow>
              <Box as="span" ml={1} cursor="help">
                <FaInfoCircle size="0.8em" color={useColorModeValue("gray.400", "gray.500")} />
              </Box>
            </Tooltip>
          </Flex>
          <Flex wrap="wrap" gap={2}>
            {[
              { value: "old", label: "Old Regime" },
              { value: "new", label: "New Regime" }
            ].map((option) => (
              <Badge
                key={option.value}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                variant={taxRegime === option.value ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setTaxRegime(option.value)}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-1px)" }}
                width="48%"
                textAlign="center"
              >
                {option.label}
              </Badge>
            ))}
          </Flex>
          {taxRegime === "new" && (
            <Text fontSize="xs" color="orange.500" mt={1}>
              Note: Deductions are not applicable in new regime
            </Text>
          )}
        </Box>

        {renderSliderWithTextbox(
          "Annual Income",
          income,
          setIncome,
          100000,
          1500000,
          10000,
          <FaRupeeSign />,
          "₹",
          "Your total yearly income before deductions"
        )}

        <Accordion allowToggle width="100%" mb={6}>
          <AccordionItem border="none">
            <AccordionButton px={0}>
              <Box flex="1" textAlign="left">
                <Flex align="center">
                  <Box mr={2} color={sliderColor}><FaPercentage /></Box>
                  <Text fontWeight="medium" color={textColor}>Deduction Options</Text>
                  {taxRegime === "new" && 
                    <Badge ml={2} colorScheme="red" fontSize="xs">
                      Not Applicable
                    </Badge>
                  }
                </Flex>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pt={2}>
              <VStack align="start" spacing={3}>
                {renderDeductionOption("Section 80C (Investments)", "section80C", 150000)}
                {renderDeductionOption("Section 80D (Medical Insurance)", "section80D", 25000)}
                {renderDeductionOption("Section 80E (Education Loan Interest)", "section80E", 50000)}
                {renderDeductionOption("Section 80G (Donations)", "section80G")}
                {renderDeductionOption("Section 24(b) (Home Loan Interest)", "section24B", 200000)}
                {renderDeductionOption("Section 10(13A) (HRA)", "section10HRA")}
                {renderDeductionOption("Section 80TTA (Savings Interest)", "section80TTA", 10000)}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

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
            Calculate Tax
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const IncomeTaxCalculator = () => {
  // Base state
  const [income, setIncome] = useState(500000);
  const [tax, setTax] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [taxRegime, setTaxRegime] = useState("old");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const resultsRef = useRef(null);
  const toast = useToast();
  
  // Detailed tax information
  const [taxDetails, setTaxDetails] = useState({
    taxableIncome: 0,
    standardDeduction: 0,
    totalDeductions: 0,
    grossTax: 0,
    cess: 0,
    totalTax: 0,
    effectiveTaxRate: 0,
    taxSlabs: []
  });
  
  const [deductions, setDeductions] = useState({
    section80C: { enabled: false, amount: 0, maxLimit: 150000 },
    section80D: { enabled: false, amount: 0, maxLimit: 25000 },
    section80E: { enabled: false, amount: 0, maxLimit: 50000 },
    section80G: { enabled: false, amount: 0 },
    section24B: { enabled: false, amount: 0, maxLimit: 200000 },
    section10HRA: { enabled: false, amount: 0 },
    section80TTA: { enabled: false, amount: 0, maxLimit: 10000 },
  });

  // Colors and styling
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const bgColor = useColorModeValue("white", "gray.800");
  
  const { hasCopied, onCopy } = useClipboard(
    `Income Tax Summary (${taxRegime === "old" ? "Old" : "New"} Regime)\n` +
    `Annual Income: ₹${income.toLocaleString('en-IN')}\n` +
    `Taxable Income: ₹${taxDetails.taxableIncome.toLocaleString('en-IN')}\n` +
    `Total Deductions: ₹${taxDetails.totalDeductions.toLocaleString('en-IN')}\n` +
    `Tax Payable: ₹${tax ? parseFloat(tax).toLocaleString('en-IN') : "0"}\n` +
    `Effective Tax Rate: ${taxDetails.effectiveTaxRate.toFixed(2)}%`
  );
  
  // Reset form to defaults
  const resetForm = () => {
    setIncome(500000);
    setTaxRegime("old");
    setDeductions({
      section80C: { enabled: false, amount: 0, maxLimit: 150000 },
      section80D: { enabled: false, amount: 0, maxLimit: 25000 },
      section80E: { enabled: false, amount: 0, maxLimit: 50000 },
      section80G: { enabled: false, amount: 0 },
      section24B: { enabled: false, amount: 0, maxLimit: 200000 },
      section10HRA: { enabled: false, amount: 0 },
      section80TTA: { enabled: false, amount: 0, maxLimit: 10000 },
    });
    setShowResults(false);
    setTax(null);
    setTaxDetails({
      taxableIncome: 0,
      standardDeduction: 0,
      totalDeductions: 0,
      grossTax: 0,
      cess: 0,
      totalTax: 0,
      effectiveTaxRate: 0,
      taxSlabs: []
    });
  };

  // Calculate tax
  const calculateTax = () => {
    setIsCalculating(true);
    
    // Add slight delay to show loading state
    setTimeout(() => {
      let totalDeductions = 0;
      let taxableIncome = income;
      let standardDeduction = taxRegime === "old" ? 50000 : 0; // Standard deduction only in old regime
      
      // Apply deductions only in old tax regime
      if (taxRegime === "old") {
        const limitedDeductions = {
          section80C: Math.min(deductions.section80C.enabled ? deductions.section80C.amount : 0, 150000),
          section80D: Math.min(deductions.section80D.enabled ? deductions.section80D.amount : 0, 25000),
          section80E: Math.min(deductions.section80E.enabled ? deductions.section80E.amount : 0, 50000),
          section80G: deductions.section80G.enabled ? deductions.section80G.amount : 0,
          section24B: Math.min(deductions.section24B.enabled ? deductions.section24B.amount : 0, 200000),
          section10HRA: deductions.section10HRA.enabled ? deductions.section10HRA.amount : 0,
          section80TTA: Math.min(deductions.section80TTA.enabled ? deductions.section80TTA.amount : 0, 10000),
        };
  
        const deductionSum = Object.values(limitedDeductions).reduce((sum, amount) => sum + amount, 0);
        totalDeductions = deductionSum + standardDeduction;
        taxableIncome = Math.max(0, income - totalDeductions);
      }
  
      // Define tax slabs based on regime
      let taxSlabs = [];
      let taxAmount = 0;
      
      if (taxRegime === "old") {
        // Old tax regime slabs
        taxSlabs = [
          { min: 0, max: 250000, rate: 0, tax: 0 },
          { min: 250000, max: 500000, rate: 5, tax: 0 },
          { min: 500000, max: 1000000, rate: 20, tax: 0 },
          { min: 1000000, max: Infinity, rate: 30, tax: 0 }
        ];
      } else {
        // New tax regime slabs
        taxSlabs = [
          { min: 0, max: 300000, rate: 0, tax: 0 },
          { min: 300000, max: 600000, rate: 5, tax: 0 },
          { min: 600000, max: 900000, rate: 10, tax: 0 },
          { min: 900000, max: 1200000, rate: 15, tax: 0 },
          { min: 1200000, max: 1500000, rate: 20, tax: 0 },
          { min: 1500000, max: Infinity, rate: 30, tax: 0 }
        ];
      }
      
      // Calculate tax for each slab
      for (let i = 0; i < taxSlabs.length; i++) {
        const slab = taxSlabs[i];
        if (taxableIncome > slab.min) {
          const slabAmount = Math.min(taxableIncome - slab.min, slab.max - slab.min);
          slab.tax = slabAmount * (slab.rate / 100);
          taxAmount += slab.tax;
        }
      }
  
      // Calculate education & health cess (4%)
      const cess = taxAmount * 0.04;
      const totalTaxAmount = taxAmount + cess;
      
      setTaxDetails({
        taxableIncome,
        standardDeduction,
        totalDeductions,
        grossTax: taxAmount,
        cess,
        totalTax: totalTaxAmount,
        effectiveTaxRate: income > 0 ? (totalTaxAmount / income) * 100 : 0,
        taxSlabs
      });
  
      setTax(totalTaxAmount.toFixed(2));
      setShowResults(true);
      setIsCalculating(false);
      
      // Show toast notification
      toast({
        title: "Tax Calculation Complete",
        description: `Your tax liability is ₹${Math.round(totalTaxAmount).toLocaleString('en-IN')}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 500);
  };

  // Chart data for tax breakdown
  const taxBreakdownData = {
    labels: ['Basic Tax', 'Education & Health Cess (4%)'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [taxDetails.grossTax || 0, taxDetails.cess || 0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }
    ]
  };
  
  // Chart data for income breakdown
  const incomeBreakdownData = {
    labels: ['Taxable Income', 'Total Deductions'],
    datasets: [
      {
        data: [taxDetails.taxableIncome || 0, taxDetails.totalDeductions || 0],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
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

  // Download PDF report
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
      pdf.save(`IncomeTax_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      
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
        Income Tax Calculator FY 2024-25
      </Heading>
      
      {!showResults ? (
        <InputForm
          income={income}
          setIncome={setIncome}
          onCalculate={calculateTax}
          deductions={deductions}
          setDeductions={setDeductions}
          taxRegime={taxRegime}
          setTaxRegime={setTaxRegime}
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
              income={income}
              setIncome={setIncome}
              onCalculate={calculateTax}
              deductions={deductions}
              setDeductions={setDeductions}
              taxRegime={taxRegime}
              setTaxRegime={setTaxRegime}
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
                      Income Tax Results
                    </Heading>
                    <Badge 
                      colorScheme={taxRegime === "old" ? "blue" : "purple"} 
                      variant="solid"
                      px={3}
                      py={1}
                      borderRadius="md"
                      >
                      {taxRegime === "old" ? "Old Regime" : "New Regime"}
                    </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                    <StatLabel color={textColor}>Annual Income</StatLabel>
                    <StatNumber color={accentColor}>₹{income.toLocaleString('en-IN')}</StatNumber>
                      </Stat>
                      <Stat>
                    <StatLabel color={textColor}>Taxable Income</StatLabel>
                    <StatNumber color={accentColor}>₹{taxDetails.taxableIncome.toLocaleString('en-IN')}</StatNumber>
                      </Stat>
                      <Stat>
                    <StatLabel color={textColor}>Total Deductions</StatLabel>
                    <StatNumber color={accentColor}>₹{taxDetails.totalDeductions.toLocaleString('en-IN')}</StatNumber>
                      </Stat>
                      <Stat>
                    <StatLabel color={textColor}>Tax Payable</StatLabel>
                    <StatNumber color={accentColor}>₹{tax ? parseFloat(tax).toLocaleString('en-IN') : "0"}</StatNumber>
                      </Stat>
                      <Stat>
                    <StatLabel color={textColor}>Effective Tax Rate</StatLabel>
                    <StatNumber color={accentColor}>{taxDetails.effectiveTaxRate.toFixed(2)}%</StatNumber>
                      </Stat>
                    </CardBody>
                      </Card>
                      <Tabs mt={6} index={activeTab} onChange={setActiveTab}>
                    <TabList>
                      <Tab>Tax Breakdown</Tab>
                      <Tab>Income Breakdown</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                    <Box height="300px">
                      <Bar data={taxBreakdownData} options={chartOptions} />
                    </Box>
                      </TabPanel>
                      <TabPanel>
                    <Box height="300px">
                      <Doughnut data={incomeBreakdownData} options={chartOptions} />
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
                    </Container>
                      );
                    };
                    
                    export default IncomeTaxCalculator;
                    
