"use client";
import React, { useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import Welcome from "@/components/Welcome";
import Headers from "@/components/Headers";
import Chat from "@/components/chat";

const MainPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

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
            bg="rgba(45, 55, 72, 0.2)"
            marginTop="calc(17vh + 40px)"
          >
            <Welcome />
          </Box>
          
          {isChatOpen && (
            <Box
              position="fixed"
              bottom="20"
              right="4"
              width="350px"
              height="500px"
              borderRadius="xl"
              boxShadow="lg"
              backdropFilter="blur(50px)"
              bg="rgba(45, 55, 72, 0.2)"
              zIndex={999}
            >
              <Chat />
            </Box>
          )}
        </Box>
        
        <IconButton
          position="fixed"
          bottom="4"
          right="4"
          size="lg"
          borderRadius="full"
          colorScheme={isChatOpen ? "red" : "blue"}
          icon={<ChatIcon />}
          boxShadow="lg"
          zIndex={1000}
          aria-label={isChatOpen ? "Close Chat" : "Open Chat"}
          onClick={toggleChat}
        />
      </Box>
    </>
  );
};

export default MainPage;
