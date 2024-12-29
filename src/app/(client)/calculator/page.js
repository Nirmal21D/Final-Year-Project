"use client";
import React from "react";
import SideNav from "@/components/SideNav";
import Headers from "@/components/Headers";

import { Box } from "@chakra-ui/react";
import Calc2 from "@/components/Calc2";

const page = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        backgroundImage="url(/images/calbg.png)"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        height="auto"
        width="auto"
        minHeight="100vh"
        minWidth="auto"
      >
        <Box
          id="upper"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="1000"
        >
          <Headers />
        </Box>

        <Box
          id="lower"
          marginTop="17vh" // This accounts for the height of the fixed upper section (9vh + 8vh)
        >
          <Calc2 />
        </Box>
      </Box>
    </>
  );
};

export default page;
