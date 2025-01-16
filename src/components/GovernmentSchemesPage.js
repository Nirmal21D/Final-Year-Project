"use client"; // Mark this component as a client component

import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
const GovernmentSchemesPage = () => {
 
  const schemes = [
    {
      name: "Pradhan Mantri Jan Dhan Yojana",
      sector: "Financial Inclusion",
      benefits: "Bank accounts, Insurance",
      eligibility: "Indian citizens",
      website: "https://pmjdy.gov.in"
    },
    {
      name: "Pradhan Mantri Awas Yojana",
      sector: "Housing",
      benefits: "Affordable housing for all",
      eligibility: "Economically weaker sections",
      website: "https://pmaymis.gov.in"
    },
    {
      name: "Atal Pension Yojana",
      sector: "Pension",
      benefits: "Retirement benefits",
      eligibility: "18-40 years old",
      website: "https://npscra.nsdl.co.in"
    },
    {
      name: "Swachh Bharat Abhiyan",
      sector: "Sanitation",
      benefits: "Clean India campaign",
      eligibility: "Nationwide",
      website: "https://swachhbharat.mygov.in"
    },
    {
      name: "Ayushman Bharat",
      sector: "Healthcare",
      benefits: "Free healthcare up to ₹5 lakh per family",
      eligibility: "Economically weaker sections",
      website: "https://pmjay.gov.in"
    },
    {
      name: "Digital India",
      sector: "Digital Empowerment",
      benefits: "Promoting digital literacy and infrastructure",
      eligibility: "Nationwide",
      website: "https://digitalindia.gov.in"
    },
    {
      name: "Make in India",
      sector: "Manufacturing",
      benefits: "Boosting local manufacturing",
      eligibility: "Industries and businesses",
      website: "https://www.makeinindia.com"
    },
    {
      name: "Stand Up India Scheme",
      sector: "Entrepreneurship",
      benefits: "Loans for women and SC/ST entrepreneurs",
      eligibility: "SC/ST and women entrepreneurs",
      website: "https://standupmitra.in"
    },
    {
      name: "Pradhan Mantri Mudra Yojana",
      sector: "Entrepreneurship",
      benefits: "Loans for small businesses",
      eligibility: "Non-corporate small businesses",
      website: "https://www.mudra.org.in"
    },
    {
      name: "Gold Monetization Scheme",
      sector: "Savings",
      benefits: "Earn interest on idle gold",
      eligibility: "Individuals, trusts, and companies",
      website: "https://rbi.org.in"
    },
    {
      name: "Pradhan Mantri Vaya Vandana Yojana",
      sector: "Senior Citizens",
      benefits: "Pension scheme for senior citizens",
      eligibility: "60 years and above",
      website: "https://www.licindia.in"
    },
    {
      name: "Kisan Credit Card Scheme",
      sector: "Agriculture",
      benefits: "Credit for farmers at low-interest rates",
      eligibility: "Farmers",
      website: "https://www.kisancreditcard.com"
    },
    {
      name: "Sovereign Gold Bond Scheme",
      sector: "Investment",
      benefits: "Invest in gold bonds with fixed returns",
      eligibility: "Indian residents",
      website: "https://rbi.org.in"
    },
    {
      name: "National Pension System (NPS)",
      sector: "Pension",
      benefits: "Retirement savings with tax benefits",
      eligibility: "18-65 years old",
      website: "https://www.npscra.nsdl.co.in"
    },
    {
      name: "Startup India",
      sector: "Entrepreneurship",
      benefits: "Tax benefits, funding support",
      eligibility: "Registered startups in India",
      website: "https://www.startupindia.gov.in"
    },
    {
      name: "Beti Bachao Beti Padhao",
      sector: "Women Empowerment",
      benefits: "Encourage education for girls and prevent female foeticide",
      eligibility: "All Indian citizens",
      website: "https://wcd.nic.in"
    },
    {
      name: "National Scheme for Incentive to Girls for Secondary Education",
      sector: "Education",
      benefits: "Encourage girls to continue education",
      eligibility: "SC/ST girls after passing class 8th",
      website: "https://education.gov.in"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      sector: "Agriculture",
      benefits: "Crop insurance for farmers",
      eligibility: "Farmers",
      website: "https://pmfby.gov.in"
    },
    {
      name: "Agri Infrastructure Fund",
      sector: "Agriculture",
      benefits: "Funds for building agricultural infrastructure",
      eligibility: "Farmers, FPOs, and co-operatives",
      website: "https://agriinfra.dac.gov.in"
    },
    {
      name: "Armed Forces Flag Day Fund",
      sector: "Defense",
      benefits: "Welfare schemes for ex-servicemen and their families",
      eligibility: "Ex-servicemen and their dependents",
      website: "https://sainikwelfare.gov.in"
    }
  ];

  return (
    <>
    
    <Box
      p={5}
      borderRadius="md"
      boxShadow="lg"
      bg="white"
      maxWidth="900px"
      margin="auto"
      mt={5}
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center" color="teal.600">
        Government Schemes in India
      </Heading>
      <Text mb={4}>
        Below is a list of major government schemes in India related to finance, women, soldiers, farmers, and more. Each scheme includes its benefits, eligibility criteria, and official website for more details.
      </Text>
      <Table variant="striped" colorScheme="teal" mb={6}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Sector</Th>
            <Th>Benefits</Th>
            <Th>Eligibility</Th>
            <Th>Website</Th>
          </Tr>
        </Thead>
        <Tbody>
          {schemes.map((scheme, index) => (
            <Tr key={index}>
              <Td>{scheme.name}</Td>
              <Td>{scheme.sector}</Td>
              <Td>{scheme.benefits}</Td>
              <Td>{scheme.eligibility}</Td>
              <Td>
                <a href={scheme.website} target="_blank" rel="noopener noreferrer" style={{ color: "teal" }}>
                  Visit
                </a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </>
  );
};

export default GovernmentSchemesPage;
