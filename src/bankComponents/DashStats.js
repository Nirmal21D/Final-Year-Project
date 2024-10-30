import React from "react";
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
  return (
    <>
      <Grid
        position="relative"
        top={14}
        color="white"
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4}
        px={6}
      >
        <GridItem
          rowSpan={1}
          colSpan={1}
          bg="rgba(10, 14, 35, 0.49) 76.65%"
          px={4}
          py={2}
          borderRadius="3xl"
          display="flex"
          alignItems="center"
        >
          <Stat>
            <StatLabel>New Clients</StatLabel>
            <StatNumber>+ 3,462</StatNumber>
          </Stat>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          bg="rgba(10, 14, 35, 0.49) 76.65%"
          px={4}
          py={2}
          borderRadius="3xl"
          display="flex"
          alignItems="center"
        >
          <Stat>
            <StatLabel>New Clients</StatLabel>
            <StatNumber>+ 3,462</StatNumber>
          </Stat>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          bg="rgba(10, 14, 35, 0.49) 76.65%"
          px={4}
          py={2}
          borderRadius="3xl"
          display="flex"
          alignItems="center"
        >
          <Stat>
            <StatLabel>New Clients</StatLabel>
            <StatNumber>+ 3,462</StatNumber>
          </Stat>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={1}
          bg="rgba(10, 14, 35, 0.49) 76.65%"
          px={4}
          py={2}
          borderRadius="3xl"
          display="flex"
          alignItems="center"
        >
          <Stat>
            <StatLabel>New Clients</StatLabel>
            <StatNumber>+ 3,462</StatNumber>
          </Stat>
        </GridItem>
      </Grid>
    </>
  );
};

export default DashStats;
