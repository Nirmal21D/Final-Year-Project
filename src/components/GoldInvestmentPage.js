"use client"; // Mark this component as a client component

import React from "react";
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const GoldInvestmentPage = () => {
  return (
    <>
      {/* Main Content Section */}
      <Box
        p={5}
        borderRadius="md"
        boxShadow="lg"
        bg="white"
        maxWidth="900px"
        margin="auto"
        mt={5} // Adjusted to ensure compatibility with Chakra UI
      >
        <Heading as="h2" size="lg" mb={4} textAlign="center" color="teal.600">
          Gold Investment in India
        </Heading>
        <Text mb={4}>
          Investing in gold can be a great way to diversify your portfolio. Gold has been a store of value for centuries and is often seen as a hedge against inflation and economic uncertainty.
        </Text>
        <Text mb={4}>Here are some ways to invest in gold:</Text>

        {/* Comparison of Gold Investment Types */}
        <Heading as="h3" size="md" mb={2}>
          Comparison of Gold Investment Types
        </Heading>
        <Table variant="striped" colorScheme="teal" mb={6}>
          <Thead>
            <Tr>
              <Th>Investment Type</Th>
              <Th>Liquidity</Th>
              <Th>Storage</Th>
              <Th>Risk Level</Th>
              <Th>Potential Returns</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[
              ["Physical Gold (Bars, Coins)", "Low", "Requires secure storage", "Medium", "Moderate"],
              ["Gold ETFs", "High", "No physical storage needed", "Low", "Market-dependent"],
              ["Gold Mining Stocks", "High", "No physical storage needed", "High", "High potential returns"],
              ["Gold Futures", "High", "No physical storage needed", "Very High", "High potential returns"],
              ["Gold Certificates", "Medium", "No physical storage needed", "Medium", "Moderate"],
              ["Gold Savings Schemes", "Medium", "No physical storage needed", "Low", "Market-dependent"],
              ["Digital Gold", "High", "No physical storage needed", "Medium", "Market-dependent"],
            ].map(([type, liquidity, storage, risk, returns], index) => (
              <Tr key={index}>
                <Td>{type}</Td>
                <Td>{liquidity}</Td>
                <Td>{storage}</Td>
                <Td>{risk}</Td>
                <Td>{returns}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Text mb={4}>
          Each type of gold investment has its own advantages and disadvantages. It's essential to consider your investment goals, risk tolerance, and market conditions before making a decision.
        </Text>

        {/* Detailed Comparison */}
        <Heading as="h3" size="md" mb={2}>
          Detailed Comparison of Gold Investment Types
        </Heading>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Investment Type</Th>
              <Th>Initial Investment</Th>
              <Th>Management Fees</Th>
              <Th>Tax Implications</Th>
              <Th>Market Volatility</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[
              ["Physical Gold", "High", "None", "Capital gains tax applies", "Low to Medium"],
              ["Gold ETFs", "Medium", "Low (annual fees)", "Capital gains tax applies", "Medium"],
              ["Gold Mining Stocks", "Medium", "None", "Capital gains tax applies", "High"],
              ["Gold Futures", "Low", "None", "Capital gains tax applies", "Very High"],
              ["Gold Certificates", "Medium", "Low", "Capital gains tax applies", "Medium"],
              ["Gold Savings Schemes", "Low to Medium", "None", "Capital gains tax applies", "Low"],
              ["Digital Gold", "Low", "None", "Capital gains tax applies", "Medium"],
            ].map(([type, investment, fees, tax, volatility], index) => (
              <Tr key={index}>
                <Td>{type}</Td>
                <Td>{investment}</Td>
                <Td>{fees}</Td>
                <Td>{tax}</Td>
                <Td>{volatility}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default GoldInvestmentPage;
