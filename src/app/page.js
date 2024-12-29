"use client";
import React from "react";

import { Box } from "@chakra-ui/react";
import Welcome from "../components/Welcome";

import Headers from "@/components/Headers";
const ProfilePage = () => {
  return (
    <>
      <Box
        id="main"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        backgroundImage="url(/images/newbg.png)"
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
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box
            id="welcome"
            m="40px"
            height="30vh"
            width="90%"
            borderRadius="xl"
            boxShadow="lg"
            backdropFilter="blur(50px)"
            bg="rgba(255, 255, 255, 0.1)"
            border="1px solid rgba(255, 255, 255)"
            marginTop="calc(17vh + 40px)" // 17vh (navbar height) + original margin
          >
            <Welcome />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
