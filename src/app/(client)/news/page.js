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

const getWeekOfMonth = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const diff = date.getDate() - firstDayOfMonth.getDate();
  return Math.floor(diff / 7) + 1;
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [groupedNews, setGroupedNews] = useState({});
  const toast = useToast();
  const router = useRouter();

  const fetchNewsFromSources = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date(endDate - 7 * 24 * 60 * 60 * 1000); // Fetch news from last 7 days instead of 30

      // Try a simpler query first
      const newsFromApi = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "in",
          category: "business",
          apiKey: "e42a0915eef7491d8bc62f3e0b265ac8",
          pageSize: 50,
          language: "en"
        },
      });

      const articles = newsFromApi.data.articles || [];
      const formattedArticles = articles.map((article) => {
        // Add a week and month property to each article
        const publishedDate = new Date(article.publishedAt);
        const weekOfMonth = getWeekOfMonth(publishedDate);
        const month = publishedDate.getMonth() + 1;

        return {
          ...article,
          weekOfMonth,
          month,
          publishedDate,
        };
      });

      setNews(formattedArticles);
      groupNewsByWeek(formattedArticles);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err.response?.data || err.message || err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch news.";
      setError(errorMessage);
      setLoading(false);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const groupNewsByWeek = (articles) => {
    const weeks = {};
    const months = {};

    // Group articles by week and month
    articles.forEach((article) => {
      const weekKey = `${article.publishedDate.getFullYear()}-W${
        article.weekOfMonth
      }`;
      const monthKey = `${article.publishedDate.getFullYear()}-${
        article.month
      }`;

      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(article);

      if (!months[monthKey]) months[monthKey] = [];
      months[monthKey].push(article);
    });

    setGroupedNews({ weeks, months });
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
        // bgImage="url(/images/newbg.png)"
        bg="gray.50"
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
          marginTop={18}
        >
          <Heading mb={2}>Latest Finance News</Heading>
          <Text>Stay updated with the latest Indian finance news.</Text>
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={4}
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
          <Box>
            {/* Render News Grouped by Week */}
            {Object.keys(groupedNews.weeks).map((weekKey) => (
              <Box key={weekKey} mb={10}>
                <Heading size="lg" mb={4}>
                  Week {weekKey} - Latest News
                </Heading>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {groupedNews.weeks[weekKey].map((article, index) => (
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
              </Box>
            ))}

            {/* Render News Grouped by Month */}
            {Object.keys(groupedNews.months).map((monthKey) => (
              <Box key={monthKey} mb={10}>
                <Heading size="lg" mb={4}>
                  Month {monthKey} - Latest News
                </Heading>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {groupedNews.months[monthKey].map((article, index) => (
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
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default NewsPage;
