"use client";
import React from "react";
import SideNav from "@/app/components/SideNav";

import { Box } from "@chakra-ui/react";
import Calc1 from "@/app/components/Calc1";
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
        // Add background image here
        backgroundImage="url(/images/body-background.png)" // Set the image path
        backgroundPosition="center" // Adjust position of the background image
        backgroundRepeat="no-repeat" // Prevent the image from repeating
        backgroundSize="cover" // Ensure the image covers the entire background
        height="100vh" // Set height to full viewport
        width="100%" // Set width to 100%
      >
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
        </Box>
        {/* <Calc1 /> */}
        <Calc2 />
      </Box>
    </>
  );
};

export default page;
