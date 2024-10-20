"use client";
import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  PointElement,
} from "chart.js";
import SideNav from "/src/components/SideNav";
import SearchBox from "/src/components/SearchBar";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  PointElement
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

const API_KEY = "f7bc23a8877434fdec964e11";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`;

const InflationPage = () => {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [years, setYears] = useState(5);
  const [inflationRate, setInflationRate] = useState(2);
  const [predictedValues, setPredictedValues] = useState([]);
  const [roiValues, setRoiValues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [currencySymbol, setCurrencySymbol] = useState(countryOptions["India"]);
  const [totalFutureValue, setTotalFutureValue] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchExchangeRates();
  }, []);

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

    const totalFutureValueCalculation = investmentAmount * Math.pow(1 + inflationRate / 100, years);
    setTotalFutureValue(totalFutureValueCalculation.toFixed(2));
  };

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
            bg="rgba(255, 255, 255, 0.1)"
            border="1px solid white"
          />
        </Flex>
      </Box>
    );
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setCurrencySymbol(countryOptions[selected]);
  };

  const chartData = {
    labels: Array.from({ length: years }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Predicted Investment Value",
        data: predictedValues.map((value) => {
          const currencyRate = exchangeRates[selectedCountry] || 1;
          return (value / currencyRate).toFixed(2);
        }),
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
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={10}
      justifyItems="center"
      p={5}
      backgroundImage="url(/images/body-background.png)"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      height="100vh"
      width="100%"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#48BB78",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#2F855A",
        },
        "&::-webkit-scrollbar-track": {
          background: "#1A202C",
        },
      }}
    >
      {/* Sidebar and SearchBox */}
      <Box display="flex" gap={10} justifyItems="center">
        <SideNav />
        <SearchBox />
      </Box>

      {/* Inflation Calculator Section */}
      <VStack spacing={8} alignItems="center" p={10}>
        <Heading color="white">Investment Calculator</Heading>

        <Box width="100%" maxWidth="400px">
          <Text mb={2} color="white">
            Select Country:
          </Text>
          <Select
            value={selectedCountry}
            onChange={handleCountryChange}
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            borderColor="white"
          >
            {Object.keys(countryOptions).map((country) => (
              <option
                key={country}
                value={country}
                style={{ backgroundColor: "black", color: "white" }}
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
        {renderSliderWithTextbox("Inflation Rate (%)", inflationRate, setInflationRate, 0, 20, 0.1, "%")}
        {renderSliderWithTextbox("Years", years, setYears, 1, 30, 1)}

        <Button colorScheme="teal" onClick={calculatePredictions} width="100%" mb={4}>
          Calculate Predictions and ROI
        </Button>

        {predictedValues.length > 0 && (
          <Box width="100%" height="400px" maxWidth="600px">
            <Text fontSize="lg" color="white" mb={2}>
              Predicted Investment Value
            </Text>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return `${currencySymbol}${value}`;
                      },
                    },
                  },
                },
              }}
              height={200}
            />
          </Box>
        )}

        {roiValues.length > 0 && (
          <Box mt={6} width="100%" height="400px" maxWidth="600px">
            <Text fontSize="lg" color="white" mb={2}>
              ROI Over Time (%)
            </Text>
            <Line
              data={roiChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return `${value}%`;
                      },
                    },
                  },
                },
              }}
              height={200}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default InflationPage;
