"use client";
import React from "react";
import SideNav from "@/app/components/SideNav";

import { Box } from "@chakra-ui/react";
import Calc2 from "@/app/components/Calc2";

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
        width="100%"
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
