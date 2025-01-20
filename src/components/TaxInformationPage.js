"use client"; // Mark this component as a client component

import React from "react";
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Divider } from "@chakra-ui/react";        
const TaxInformationPage = () => {
  return (
    <>
    <Box
      p={5}
      borderRadius="md"
      boxShadow="lg"
      bg="rgba(255, 255, 255, 0.9)"
      maxWidth="900px"
      margin="auto"
      mt={5}
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center" color="teal.600">
        Comprehensive Tax Information in India
      </Heading>
      <Text mb={4}>
        Taxes in India are categorized into various types, each serving a specific purpose in economic management. Below is an in-depth exploration of these categories and details presented in tabular formats for clarity.
      </Text>

      <Divider mb={4} />

      <Heading as="h3" size="md" mb={3} color="teal.500">
        Types of Taxes in India
      </Heading>
      <Table variant="striped" colorScheme="teal" mb={4}>
        <Thead>
          <Tr>
            <Th>Type of Tax</Th>
            <Th>Description</Th>
            <Th>Applicability</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Income Tax</Td>
            <Td>Tax levied on individual and corporate income based on income slabs.</Td>
            <Td>Individuals, HUFs, Companies</Td>
          </Tr>
          <Tr>
            <Td>Goods and Services Tax (GST)</Td>
            <Td>A comprehensive indirect tax replacing VAT, service tax, etc.</Td>
            <Td>Businesses and Consumers</Td>
          </Tr>
          <Tr>
            <Td>Corporate Tax</Td>
            <Td>Tax on income earned by companies.</Td>
            <Td>Corporations</Td>
          </Tr>
          <Tr>
            <Td>Capital Gains Tax</Td>
            <Td>Tax on profits from the sale of assets or investments.</Td>
            <Td>Investors</Td>
          </Tr>
          <Tr>
            <Td>Professional Tax</Td>
            <Td>State-level tax for salaried and self-employed individuals.</Td>
            <Td>Working Professionals</Td>
          </Tr>
          <Tr>
            <Td>Customs Duty</Td>
            <Td>Tax on goods imported into India.</Td>
            <Td>Importers</Td>
          </Tr>
        </Tbody>
      </Table>

      <Divider mb={4} />

      <Heading as="h3" size="md" mb={3} color="teal.500">
        Tax Deductions and Exemptions
      </Heading>
      <Table variant="striped" colorScheme="teal" mb={4}>
        <Thead>
          <Tr>
            <Th>Section</Th>
            <Th>Details</Th>
            <Th>Maximum Deduction</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>80C</Td>
            <Td>Investments in PPF, EPF, ELSS, etc.</Td>
            <Td>₹1,50,000</Td>
          </Tr>
          <Tr>
            <Td>80CCD(1B)</Td>
            <Td>Additional contribution to NPS.</Td>
            <Td>₹50,000</Td>
          </Tr>
          <Tr>
            <Td>80D</Td>
            <Td>Premiums for health insurance policies.</Td>
            <Td>₹25,000 (₹50,000 for senior citizens)</Td>
          </Tr>
          <Tr>
            <Td>80E</Td>
            <Td>Interest on education loans.</Td>
            <Td>No limit</Td>
          </Tr>
          <Tr>
            <Td>80G</Td>
            <Td>Donations to charitable institutions.</Td>
            <Td>Varies (50% or 100% of donations)</Td>
          </Tr>
          <Tr>
            <Td>87A</Td>
            <Td>Rebate for taxpayers with income up to ₹5 lakh.</Td>
            <Td>₹12,500</Td>
          </Tr>
        </Tbody>
      </Table>

      <Divider mb={4} />

      <Heading as="h3" size="md" mb={3} color="teal.500">
        Income Tax Slabs for FY 2023-24
      </Heading>
      <Table variant="striped" colorScheme="teal" mb={4}>
        <Thead>
          <Tr>
            <Th>Income Range</Th>
            <Th>Old Regime</Th>
            <Th>New Regime</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Up to ₹2,50,000</Td>
            <Td>No Tax</Td>
            <Td>No Tax</Td>
          </Tr>
          <Tr>
            <Td>₹2,50,001 to ₹5,00,000</Td>
            <Td>5%</Td>
            <Td>5%</Td>
          </Tr>
          <Tr>
            <Td>₹5,00,001 to ₹10,00,000</Td>
            <Td>20%</Td>
            <Td>10%</Td>
          </Tr>
          <Tr>
            <Td>Above ₹10,00,000</Td>
            <Td>30%</Td>
            <Td>15%</Td>
          </Tr>
        </Tbody>
      </Table>

      <Divider mb={4} />

      <Heading as="h3" size="md" mb={3} color="teal.500">
        Tax Saving Investments
      </Heading>
      <Table variant="striped" colorScheme="teal" mb={4}>
        <Thead>
          <Tr>
            <Th>Investment Option</Th>
            <Th>Details</Th>
            <Th>Lock-In Period</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Public Provident Fund (PPF)</Td>
            <Td>Government-backed savings scheme with tax-free returns.</Td>
            <Td>15 Years</Td>
          </Tr>
          <Tr>
            <Td>ELSS</Td>
            <Td>Equity-linked savings scheme offering market-linked returns.</Td>
            <Td>3 Years</Td>
          </Tr>
          <Tr>
            <Td>National Savings Certificate (NSC)</Td>
            <Td>Fixed return investment backed by the government.</Td>
            <Td>5 Years</Td>
          </Tr>
          <Tr>
            <Td>Senior Citizen Savings Scheme (SCSS)</Td>
            <Td>High-interest savings for senior citizens.</Td>
            <Td>5 Years</Td>
          </Tr>
          <Tr>
            <Td>Unit Linked Insurance Plans (ULIPs)</Td>
            <Td>Insurance with investment benefits.</Td>
            <Td>5 Years</Td>
          </Tr>
        </Tbody>
      </Table>

      <Divider mb={4} />

      <Heading as="h3" size="md" mb={3} color="teal.500">
        Conclusion
      </Heading>
      <Text>
        Tax planning is an essential part of financial management. Leveraging the right deductions, exemptions, and investment options can help reduce tax liability while promoting wealth accumulation. Stay informed and consult professionals for personalized advice.
      </Text>
    </Box>
    </>
  );
};

export default TaxInformationPage;
