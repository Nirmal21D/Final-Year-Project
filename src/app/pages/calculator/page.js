"use client";
import React from "react";
import SideNav from "@/app/components/SideNav";

import { Box } from "@chakra-ui/react";
import Calc2 from "@/components/Calc2";

const page = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={10}
        justifyItems="center"
        p={5}
        backgroundImage="url(/images/body-background.png)"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        height="auto"
        width="auto"
        minHeight="100vh" // Ensures the background covers at least the full viewport height
        minWidth="auto" // Ensures the background covers the full viewport width
      >
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
        </Box>

        <Calc2 />
      </Box>
    </>
  );
};

export default page;
