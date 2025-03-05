import React from "react";
import { Box, Text, VStack, Heading, List, ListItem } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" bg="gray.800" color="white" py={8} px={6} textAlign="center">
      <VStack spacing={6} maxW="6xl" mx="auto">
        {/* Disclaimer Section */}
        <Box textAlign="left">
          <Heading as="h3" size="md" mb={2} color="teal.300">
            Finance Mastery Disclaimer (RBI Compliance)
          </Heading>
          <Text fontSize="sm">
            The financial information, investment strategies, and educational content provided 
            on this website are for informational and educational purposes only. We are not 
            registered with the Reserve Bank of India (RBI) or the Securities and Exchange 
            Board of India (SEBI) as a financial institution, investment advisor, or broker. 
            Users should consult with a certified financial professional before making 
            financial decisions.
          </Text>
        </Box>

        {/* Regulatory Compliance Notice */}
        <Box textAlign="left">
          <Heading as="h3" size="md" mb={2} color="teal.300">
            Regulatory Compliance Notice
          </Heading>
          <List spacing={2} fontSize="sm">
            <ListItem>
              <strong>No Guaranteed Returns:</strong> Investments, including mutual funds, SIPs, 
              and other financial products, are subject to market risks. Past performance does 
              not guarantee future results.
            </ListItem>
            <ListItem>
              <strong>No Direct Financial Transactions:</strong> This website does not facilitate 
              direct investment, financial transactions, or lending services regulated by RBI.
            </ListItem>
            <ListItem>
              <strong>Third-Party Responsibility:</strong> Any third-party links, financial tools, 
              or calculators provided on this platform are for reference only. We do not endorse 
              or guarantee their accuracy or reliability.
            </ListItem>
            <ListItem>
              <strong>User Due Diligence:</strong> Users are advised to verify all financial 
              information with RBI-regulated financial institutions or SEBI-registered advisors 
              before investing.
            </ListItem>
            <ListItem>
              <strong>Cybersecurity Warning:</strong> Beware of phishing, fraud, and unauthorized 
              financial activities. RBI never asks for sensitive banking details. Always transact 
              through verified channels.
            </ListItem>
          </List>
        </Box>

        {/* Copyright Section */}
        <Text fontSize="sm" opacity={0.8}>
          © {new Date().getFullYear()} Finance Mastery. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
