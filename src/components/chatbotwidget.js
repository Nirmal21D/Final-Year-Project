import { useState } from "react"
import { Box, IconButton } from "@chakra-ui/react"
import { ChatIcon } from "@chakra-ui/icons"
import ChatComponent from "./ChatComponent"

export default function ChatbotWidget() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <Box position="fixed" bottom="4" right="4">
      {isChatbotOpen && <ChatComponent />}
      <IconButton
        icon={<ChatIcon />}
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        colorScheme="blue"
        rounded="full"
        size="lg"
        shadow="lg"
      />
    </Box>
  )
}

