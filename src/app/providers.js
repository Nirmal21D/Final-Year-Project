// src/app/providers.js
import { ChakraProvider } from "@chakra-ui/react";

// Define the Providers component that wraps its children with ChakraProvider
export function Providers({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
