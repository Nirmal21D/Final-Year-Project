"use client";

import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import BankPanel from "@/components/addplans";


const BankPanelPage = () => {
  return (
    <Flex>
      <Box flex="1" p={4}>
        <BankPanel />
      </Box>
    </Flex>
  );
};

export default BankPanelPage;
