import { useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Flex,
  List,
  ListItem,
  ListIcon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react"
import { ChevronRightIcon } from "@chakra-ui/icons"

export default function ChatComponent() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Save user input to chat history
      setChatHistory((prevHistory) => [...prevHistory, { role: "user", text: input }])

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`)
      }

      const data = await res.json()

      // Add AI response to chat history
      setChatHistory((prevHistory) => [...prevHistory, { role: "model", text: data.response }])
    } catch (err) {
      console.error("Error fetching AI response:", err)
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
      setInput("") // Reset input field after sending
    }
  }

  const formatAIResponse = (responseText) => {
    // Split the response into individual lines and return each as a bullet point
    return responseText
      .split("\n") // Split by new lines
      .filter((line) => line.trim()) // Remove empty lines
      .map((line, index) => (
        <ListItem key={index}>
          <ListIcon as={ChevronRightIcon} color="green.500" />
          {line.trim()}
        </ListItem>
      ))
  }

  return (
    <Card width="350px" height="500px" display="flex" flexDirection="column">
      <CardHeader>
        <Text fontSize="xl" fontWeight="bold">
          Finance Mastery AI Assistant
        </Text>
      </CardHeader>
      <CardBody flex="1" overflowY="auto">
        <VStack spacing={4} align="stretch">
          {chatHistory.map((msg, index) => (
            <Flex key={index} justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}>
              <HStack spacing={2} alignItems="start">
                {msg.role !== "user" && <Avatar size="sm" name="AI" src="/ai-avatar.png" />}
                <Box
                  bg={msg.role === "user" ? "blue.500" : "gray.100"}
                  color={msg.role === "user" ? "white" : "black"}
                  borderRadius="lg"
                  px={3}
                  py={2}
                  maxWidth="70%"
                >
                  {msg.role === "model" ? (
                    <List spacing={1}>{formatAIResponse(msg.text)}</List>
                  ) : (
                    <Text>{msg.text}</Text>
                  )}
                </Box>
                {msg.role === "user" && <Avatar size="sm" name="User" src="/user-avatar.png" />}
              </HStack>
            </Flex>
          ))}
        </VStack>
      </CardBody>
      <CardFooter>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <HStack>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here..." />
            <Button type="submit" colorScheme="blue" isLoading={loading}>
              Send
            </Button>
          </HStack>
        </form>
      </CardFooter>
      {error && (
        <Text color="red.500" mt={2} px={4} pb={2}>
          Error: {error}
        </Text>
      )}
    </Card>
  )
}

