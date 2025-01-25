"use client";
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
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
const DashStats = () => {
  // const [stats, setStats] = useState([]);

  // useEffect(() => {
  //   const newStats = [
  //     { label: "New Clients", value: Math.floor(Math.random() * 5000) },
  //     { label: "Total Revenue", value: Math.floor(Math.random() * 5000) },
  //     { label: "Active Users", value: Math.floor(Math.random() * 5000) },
  //     {
  //       label: "Pending Transactions",
  //       value: Math.floor(Math.random() * 5000),
  //     },
  //   ];
  //   setStats(newStats);
  // }, []);

  return (
    <>
      {/* <Grid
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
              <StatLabel fontSize="lg" fontWeight="bold">
                {stat.label}
              </StatLabel>
              <StatNumber fontSize="2xl">+ {stat.value}</StatNumber>
              <StatHelpText fontSize="sm" color="gray.400">
                Updated just now
              </StatHelpText>
            </Stat>
          </GridItem>
        ))}
      </Grid> */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {/* <GridItem bg="white" p={4} shadow="md" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">
            Total Plans
          </Text>
          <Text fontSize="2xl" color="green.500" mt={2}>
            15
          </Text>
        </GridItem>

        <GridItem bg="white" p={4} shadow="md" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">
            Active Plans
          </Text>
          <Text fontSize="2xl" color="blue.500" mt={2}>
            12
          </Text>
        </GridItem>

        <GridItem bg="white" p={4} shadow="md" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">
            User Engagement
          </Text>
          <Text fontSize="2xl" color="orange.500" mt={2}>
            1,245 views
          </Text>
        </GridItem> */}

        <GridItem colSpan={2} bg="white" p={4} shadow="md" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">
            Add New Plan
          </Text>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Add details for your new financial plan, including interest rates,
            tenure, and features.
          </Text>
          <Link href="/addplans">
            <Button mt={4} colorScheme="teal">
              Create Plan
            </Button>
          </Link>
        </GridItem>

        {/* <GridItem colSpan={1} bg="white" p={4} shadow="md" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">
            Notifications
          </Text>
          <Text fontSize="sm" color="gray.600" mt={2}>
            You have 3 new inquiries from users.
          </Text>
          <Button mt={4} colorScheme="blue">
            View Notifications
          </Button>
        </GridItem> */}
      </Grid>
    </>
  );
};

export default DashStats;
