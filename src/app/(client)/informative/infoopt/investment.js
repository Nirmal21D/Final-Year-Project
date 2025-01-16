"use client"; // Mark this component as a client component

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const InvestmentInformationPage = () => {
  return (
    <Box
      p={5}
      borderRadius="md"
      boxShadow="lg"
      bg="rgba(255, 255, 255, 0.9)"
      maxWidth="800px"
      margin="auto"
      mt={5}
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center" color="teal.600">
        Investment Information
      </Heading>
      <Text>
        Here you can provide information about different types of investments, strategies, and market analysis.
      </Text>
    </Box>
  );
};

export default InvestmentInformationPage; // Ensure this is the default export 