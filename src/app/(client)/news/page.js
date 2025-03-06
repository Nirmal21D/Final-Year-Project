"use client";

import { useState, useEffect } from "react";
import Headers from "@/components/Headers";
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Spinner,
  useToast,
  Image,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const fetchNews = async () => {
    setLoading(true);
    setError("");

    // Get a date 7 days ago to ensure we have news
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const formattedDate = sevenDaysAgo.toISOString().split("T")[0];

    const url =
      "https://newsapi.org/v2/everything?" +
      "q=Finance OR stocks OR market&" +
      `from=${formattedDate}&` +
      "language=en&" +
      "sortBy=publishedAt&" +
      "apiKey=10138ae2c8ac434ab7e43203f0206dd5";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.articles || data.articles.length === 0) {
        throw new Error("No articles found");
      }

      const filteredArticles = data.articles.filter(
        (article) => article.title && article.description && article.urlToImage
      );

      setNews(filteredArticles);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);

      toast({
        title: "News Fetch Error",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    fetchNews();
  };

  // Helper function to get sentiment color
  const getSentimentColor = (sentiment) => {
    if (!sentiment) return "gray";
    sentiment = sentiment.toLowerCase();
    if (sentiment.includes("positive")) return "green";
    if (sentiment.includes("negative")) return "red";
    return "blue";
  };

  return (
    <>
      <Box id="upper" position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>
      <Box
        bg="gray.50"
        bgPosition="center"
        bgSize="cover"
        bgAttachment="fixed"
        bgRepeat="no-repeat"
        minHeight="100vh"
        py={10}
        px={5}
        pt={{ base: "100px", md: "120px" }}
      >
        <Box
          bg="rgba(45, 55, 72, 0.8)"
          color="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          mb={6}
          textAlign="center"
          marginTop={18}
        >
          <Heading mb={2}>Latest Finance News</Heading>
          <Text>Stay updated with the latest financial market news.</Text>
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={4}
            flexWrap="wrap"
          >
            <Button
              colorScheme="blue"
              onClick={handleRefresh}
              isLoading={loading}
            >
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
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                : "Loading..."}
            </Text>
          </Box>
        </Box>

        {error && (
          <Box textAlign="center" color="red.500" mb={4}>
            <Text fontWeight="bold">Error: {error}</Text>
            <Text fontSize="sm">Unable to fetch latest news</Text>
          </Box>
        )}

        {loading ? (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" />
            <Text mt={4}>Fetching the latest news...</Text>
          </Box>
        ) : news.length === 0 ? (
          <Box textAlign="center">
            <Text>No finance news available at the moment.</Text>
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
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
                _hover={{
                  boxShadow: "lg",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
                display="flex"
                flexDirection="column"
                height="100%"
              >
                <Box mb={3} borderRadius="md" overflow="hidden">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                  />
                </Box>
                <Heading size="md" mb={2}>
                  {article.title}
                </Heading>
                <Box
                  mb={2}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Text fontSize="sm" color="gray.500">
                    {article.source.name} |{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Text>
                </Box>
                <Text fontSize="sm" noOfLines={3} mb={4} flex="1">
                  {article.description}
                </Text>
                <Button
                  as="a"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="blue"
                  size="sm"
                  alignSelf="flex-start"
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
