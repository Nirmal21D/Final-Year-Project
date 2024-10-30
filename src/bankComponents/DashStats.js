import React, { useEffect, useState } from "react";
import {
  chakra,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const DashStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const newStats = [
      { label: "New Clients", value: Math.floor(Math.random() * 5000) },
      { label: "Total Revenue", value: Math.floor(Math.random() * 5000) },
      { label: "Active Users", value: Math.floor(Math.random() * 5000) },
      { label: "Pending Transactions", value: Math.floor(Math.random() * 5000) },
    ];
    setStats(newStats);
  }, []);

  return (
    <>
      <Grid
        position="relative"
        top={14}
        color="white"
        h="auto"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={6}
        px={6}
      >
        {stats.map((stat, index) => (
          <GridItem
            key={index}
            rowSpan={1}
            colSpan={1}
            bg="rgba(10, 14, 35, 0.7)"
            px={4}
            py={4}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          >
            <Stat>
              <StatLabel fontSize="lg" fontWeight="bold">{stat.label}</StatLabel>
              <StatNumber fontSize="2xl">+ {stat.value}</StatNumber>
              <StatHelpText fontSize="sm" color="gray.400">Updated just now</StatHelpText>
            </Stat>
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default DashStats;
