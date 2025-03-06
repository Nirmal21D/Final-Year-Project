"use client";
import {
  Box,
  Heading,
  Grid,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  IconButton
} from "@chakra-ui/react";
import CICal from "./CICal";
import EMICal from "./EMICal";
import FDCal from "./FDCal";
import IncomeTaxCal from "./IncomeTaxCal";
import SICal from "./SICal";
import SALCal from "./SALCal";
import SIPCal from "./SIPCal";

import { useState, useEffect } from "react";
import { 
  FaPercent, 
  FaChartLine, 
  FaMoneyBillWave, 
  FaCalculator, 
  FaPiggyBank, 
  FaFileInvoiceDollar, 
  FaCoins,
  FaBars
} from "react-icons/fa";

// Calculator config data
const calculatorOptions = [
  { id: "CI", name: "Compound Interest", icon: FaPercent, description: "Calculate how your investments grow over time with compound interest" },
  { id: "SIP", name: "SIP Calculator", icon: FaChartLine, description: "Plan your systematic investment plan and see potential returns" },
  { id: "EMI", name: "EMI Calculator", icon: FaMoneyBillWave, description: "Calculate your equated monthly installments for loans" },
  { id: "FD", name: "Fixed Deposit", icon: FaPiggyBank, description: "Estimate returns on your fixed deposit investments" },
  { id: "IT", name: "Income Tax", icon: FaFileInvoiceDollar, description: "Calculate your income tax liability" },
  { id: "SI", name: "Simple Interest", icon: FaCalculator, description: "Calculate basic interest on principal amount" },
  { id: "SAL", name: "Salary Calculator", icon: FaCoins, description: "Calculate take-home salary after deductions" },
];

const Calc2 = () => {
  const [selectedCal, setSelectedCal] = useState("CI"); // Default calculator
  const [lastUsed, setLastUsed] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Background colors
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, gray.100)", 
    "linear(to-br, gray.900, gray.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const menuBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(26, 32, 44, 0.9)"
  );

  // Load last used calculators from localStorage
  useEffect(() => {
    const savedLastUsed = localStorage.getItem('lastUsedCalculators');
    if (savedLastUsed) {
      setLastUsed(JSON.parse(savedLastUsed));
    }
  }, []);

  // Track calculator usage for "Recently Used" section
  const handleSelectCalculator = (calId) => {
    setSelectedCal(calId);
    
    // Update last used calculators
    const updatedLastUsed = [calId, ...lastUsed.filter(id => id !== calId)].slice(0, 3);
    setLastUsed(updatedLastUsed);
    localStorage.setItem('lastUsedCalculators', JSON.stringify(updatedLastUsed));
    
    // Close drawer on mobile when a calculator is selected
    if (isMobile) {
      onClose();
    }
  };

  // Render the calculator sidebar/menu
  const CalculatorMenu = () => (
    <Box
      bg={menuBg}
      backdropFilter="blur(8px)"
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      width="100%"
      height="100%"
      overflowY="auto"
    >
      <Heading size="lg" mb={6} color={accentColor} textAlign="center">
        Financial Calculators
      </Heading>

      {lastUsed.length > 0 && (
        <Box mb={6}>
          <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor} opacity={0.8}>
            RECENTLY USED
          </Text>
          <Flex wrap="wrap" gap={2}>
            {lastUsed.map(calId => {
              const cal = calculatorOptions.find(opt => opt.id === calId);
              if (!cal) return null;
              
              return (
                <Button
                  key={cal.id}
                  size="sm"
                  leftIcon={<Icon as={cal.icon} />}
                  colorScheme="blue"
                  variant={selectedCal === cal.id ? "solid" : "outline"}
                  onClick={() => handleSelectCalculator(cal.id)}
                >
                  {cal.name}
                </Button>
              );
            })}
          </Flex>
        </Box>
      )}
      
      <Text fontSize="sm" fontWeight="medium" mb={3} color={textColor} opacity={0.8}>
        ALL CALCULATORS
      </Text>
      
      <Grid templateColumns="1fr" gap={3}>
        {calculatorOptions.map((cal) => (
          <Button
            key={cal.id}
            py={6}
            justifyContent="flex-start"
            colorScheme="blue"
            variant={selectedCal === cal.id ? "solid" : "ghost"}
            leftIcon={<Icon as={cal.icon} boxSize={5} />}
            onClick={() => handleSelectCalculator(cal.id)}
            _hover={{ 
              bg: selectedCal === cal.id ? "blue.500" : "blue.50",
              transform: "translateY(-2px)",
              boxShadow: "md"
            }}
            transition="all 0.2s"
          >
            <Flex direction="column" alignItems="flex-start">
              <Text>{cal.name}</Text>
              <Text fontSize="xs" opacity={0.8} fontWeight="normal" noOfLines={1}>
                {cal.description}
              </Text>
            </Flex>
          </Button>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box 
      minHeight="calc(100vh - 58px)"
      bgGradient={bgGradient}
      pt={4}
      pb={8}
    >
      <Container maxW="8xl" px={4}>
        <Flex direction="column" width="100%">
          <Flex 
            justifyContent="space-between" 
            alignItems="center" 
            mb={6}
            display={{ base: "flex", md: "none" }}
          >
            <Heading size="lg" color={textColor}>
              {calculatorOptions.find(cal => cal.id === selectedCal)?.name || "Calculator"}
            </Heading>
            <IconButton
              icon={<FaBars />}
              aria-label="Open calculator menu"
              onClick={onOpen}
              colorScheme="blue"
            />
          </Flex>

          <Flex gap={6} width="100%" position="relative">
            {/* Desktop Sidebar */}
            <Box 
              width="320px" 
              display={{ base: "none", md: "block" }}
              position="sticky"
              top="70px"
              alignSelf="flex-start"
              height="calc(100vh - 90px)"
            >
              <CalculatorMenu />
            </Box>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">Choose Calculator</DrawerHeader>
                <DrawerBody py={4}>
                  <CalculatorMenu />
                </DrawerBody>
              </DrawerContent>
            </Drawer>

            {/* Calculator Content Area */}
            <Box 
              flex={1} 
              bg={cardBg}
              borderRadius="xl"
              boxShadow="lg"
              p={{ base: 4, md: 8 }}
              minHeight="600px"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Box width="100%">
                {/* Current calculator title - desktop only */}
                <Flex 
                  mb={6} 
                  display={{ base: "none", md: "flex" }}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Heading size="lg" color={textColor}>
                    {calculatorOptions.find(cal => cal.id === selectedCal)?.name || "Calculator"}
                  </Heading>
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="md">
                    {calculatorOptions.find(cal => cal.id === selectedCal)?.id || ""}
                  </Badge>
                </Flex>
                
                {/* Calculator components */}
                <Box width="100%">
                  {selectedCal === "CI" && <CICal />}
                  {selectedCal === "EMI" && <EMICal />}
                  {selectedCal === "FD" && <FDCal />}
                  {selectedCal === "IT" && <IncomeTaxCal />}
                  {selectedCal === "SI" && <SICal />}
                  {selectedCal === "SAL" && <SALCal />}
                  {selectedCal === "SIP" && <SIPCal />}
                </Box>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Calc2;
