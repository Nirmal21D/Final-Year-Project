import React, { useState } from "react";
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
} from "@chakra-ui/react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend
);

const countryOptions = {
  India: "₹",
  USA: "$",
  Europe: "€",
  UK: "£",
  Japan: "¥",
  Australia: "A$",
  Canada: "C$",
  Switzerland: "CHF",
  China: "¥",
  Russia: "₽",
  SouthAfrica: "R",
  Brazil: "R$",
  Singapore: "S$",
  Mexico: "MX$",
};

const InflationPage = () => {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [years, setYears] = useState(5);
  const [inflationRate, setInflationRate] = useState(2);
  const [predictedValues, setPredictedValues] = useState([]);
  const [roiValues, setRoiValues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [currencySymbol, setCurrencySymbol] = useState(countryOptions["India"]);
  const [showResults, setShowResults] = useState(false);

  const renderSliderWithTextbox = (
    label,
    value,
    setValue,
    min,
    max,
    step,
    unit = ""
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <Box mb={6} width="100%">
        <Text mb={2} color="white">
          {label}
        </Text>
        <Flex alignItems="center">
          <Slider
            flex="1"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(v) => setValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            colorScheme="teal"
            mr={4}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${value}${unit}`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
          <Input
            width="100px"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            type="number"
            textAlign="center"
            color="white"
            _placeholder={{ color: "white" }}
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
          />
        </Flex>
      </Box>
    );
  };

  const calculatePredictions = () => {
    let predictions = [];
    let roiValues = [];
    let totalValue = investmentAmount;

    for (let year = 1; year <= years; year++) {
      const futureValue = totalValue * Math.pow(1 + inflationRate / 100, year);
      predictions.push(futureValue.toFixed(2));
      const roi = ((futureValue - investmentAmount) / investmentAmount) * 100;
      roiValues.push(roi.toFixed(2));
    }

    setPredictedValues(predictions);
    setRoiValues(roiValues);
    setShowResults(true);
  };

  const InputSection = () => (
    <VStack
      spacing={4}
      width="100%"
      p={6}
      bg="gray.800"
      borderRadius="lg"
      boxShadow="xl"
    >
      <Heading size="md" color="white">
        Investment Calculator
      </Heading>

      <Box width="100%">
        <Text mb={2} color="white">
          Select Country:
        </Text>
        <Select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setCurrencySymbol(countryOptions[e.target.value]);
          }}
          bg="whiteAlpha.100"
          color="white"
          borderColor="whiteAlpha.300"
        >
          {Object.keys(countryOptions).map((country) => (
            <option
              key={country}
              value={country}
              style={{ backgroundColor: "#2D3748", color: "white" }}
            >
              {country}
            </option>
          ))}
        </Select>
      </Box>

      {renderSliderWithTextbox(
        `Investment Amount (${currencySymbol})`,
        investmentAmount,
        setInvestmentAmount,
        1000,
        1000000,
        1000,
        currencySymbol
      )}
      {renderSliderWithTextbox(
        "Inflation Rate (%)",
        inflationRate,
        setInflationRate,
        0,
        20,
        0.1,
        "%"
      )}
      {renderSliderWithTextbox("Years", years, setYears, 1, 30, 1)}

      <Button
        bg="#567C8D"
        color="white"
        _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#11212d" }}
        onClick={calculatePredictions}
        width="100%"
      >
        Calculate Predictions
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
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  const chartData = {
    labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Predicted Investment Value",
        data: predictedValues,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const roiChartData = {
    labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "ROI (%)",
        data: roiValues,
        backgroundColor: "rgba(255,99,132,0.6)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        tension: 0.1,
      },
    ],
  };

  return (
    <Box minH="100vh" px={4} py={24}>
      {!showResults ? (
        <Center minH="100vh">
          <Container maxW="md">
            <InputSection />
          </Container>
        </Center>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
          my={14}
        >
          <GridItem bg="gray.800" p={4} borderRadius="lg">
            <InputSection />
          </GridItem>

          <GridItem bg="gray.800" p={4} borderRadius="lg">
            <Text fontSize="lg" color="white" mb={2}>
              Predicted Investment Value
            </Text>
            <Box height="320px">
              <Bar
                data={chartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      ticks: {
                        ...chartOptions.scales.y.ticks,
                        callback: (value) => `${currencySymbol}${value}`,
                      },
                    },
                  },
                }}
              />
            </Box>
          </GridItem>

          <GridItem bg="gray.800" p={4} borderRadius="lg">
            <Text fontSize="lg" color="white" mb={2}>
              ROI Over Time (%)
            </Text>
            <Box height="320px">
              <Line
                data={roiChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      ticks: {
                        ...chartOptions.scales.y.ticks,
                        callback: (value) => `${value}%`,
                      },
                    },
                  },
                }}
              />
            </Box>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default InflationPage;
