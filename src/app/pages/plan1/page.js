"use client";
import React from "react";
import SideNav from "@/app/components/SideNav";
import SearchBox from "../../components/SearchBar";
import { Box, Text } from "@chakra-ui/react";
import Plancards from "@/app/components/Plancards";

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
          <SearchBox />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={20}
          p={10}
        >
          <Plancards
            header="Plan1"
            summary="
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab animi, nobis voluptatum libero ea consectetur adipisci. Odit deleniti id quibusdam nesciunt mollitia vitae hic ad cum pariatu."
          />
          <Plancards
            header="Plan2"
            summary="
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab animi, nobis voluptatum libero ea consectetur adipisci. Odit deleniti id quibusdam nesciunt mollitia vitae hic ad cum pariatu."
          />
          <Plancards
            header="Plan3"
            summary="
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab animi, nobis voluptatum libero ea consectetur adipisci. Odit deleniti id quibusdam nesciunt mollitia vitae hic ad cum pariatu."
          />
        </Box>
      </Box>

      {/* <Box w="100%" h="200px" bgGradient="linear(to-t, green.200, pink.500)"></Box> */}

      {/* <Box
        w="100%"
        h="200px"
        bgGradient="radial(gray.300, yellow.400, pink.200)"
      />

      <Text
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
      >
        Welcome to Chakra UI
      </Text> */}
    </>
  );
};

export default page;
