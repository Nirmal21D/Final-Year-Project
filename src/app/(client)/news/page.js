"use client";

import { useState, useEffect } from "react";
import Headers from "@/components/Headers";

import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation"; // Ensure you are using next/navigation

const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const fetchNewsFromSources = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date(endDate - 3 * 24 * 60 * 60 * 1000);

      const newsFromApi = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: "finance AND (India OR Indian)",
          apiKey: "e5e428d182c34d8087eb8698d7c2c1c7",
          language: "en",
          pageSize: 50,
          sortBy: "publishedAt",
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          domains:
            "economictimes.indiatimes.com,moneycontrol.com,livemint.com,business-standard.com,financialexpress.com,ndtv.com/business,thehindu.com/business,businesstoday.in,zeebiz.com,businessinsider.in",
        },
      });

      const filteredNews = newsFromApi.data.articles || [];
      setNews(filteredNews.slice(0, 3)); // Display the latest 3 news
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news.");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNewsFromSources();
  }, []);

  const handleRefresh = () => {
    fetchNewsFromSources();
  };

  return (
    <>
      <Box id="upper" position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>
      {/* Add padding to the content to prevent overlap with the fixed header */}
      <Box
        bgImage="url(/images/newbg.png)"
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
        minHeight="100vh"
        py={10}
        px={5}
        pt={{ base: "100px", md: "120px" }} // Add top padding
      >
        <Box
          bg="rgba(45, 55, 72, 0.8)"
          color="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          mb={6}
          textAlign="center"
          marginTop={50}
        >
          <Heading mb={2}>Latest Finance News</Heading>
          <Text>Stay updated with the latest Indian finance news.</Text>
          <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={4}>
            <Button colorScheme="blue" onClick={handleRefresh} isLoading={loading}>
              Refresh News
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                if (typeof window !== "undefined") {
                  router.push("./informative");
                }
              }}
            >
              Informative
            </Button>
            <Text fontSize="sm">
              {lastUpdated ?' Last updated: ${lastUpdated.toLocaleTimeString()}' : "Loading..."}
            </Text>
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" />
            <Text mt={4}>Fetching the latest news...</Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" color="red.500">
            <Text>{error}</Text>
          </Box>
        ) : news.length === 0 ? (
          <Box textAlign="center">
            <Text>No finance news available at the moment.</Text>
          </Box>
        ) : (
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {news.map((article, index) => (
              <GridItem
                key={index}
                bg="white"
                color="gray.800"
                p={5}
                borderRadius="md"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
              >
                <Heading size="md" mb={2}>
                  {article.title}
                </Heading>
                <Text fontSize="sm" noOfLines={3} mb={4}>
                  {article.description}
                </Text>
                <Button
                  as="a"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="blue"
                  size="sm"
                >
                  Read more
                </Button>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default NewsPage;