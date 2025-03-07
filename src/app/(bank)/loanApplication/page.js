"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Tag,
  Badge,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Center,
  Input,
  Select,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Progress,
  Stack,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiFilter,
  FiSearch,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiArrowRight,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";
import BankHeader from "@/bankComponents/BankHeaders";
import BankSidenav from "@/bankComponents/BankSidenav";

const LoanApplicationPage = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [currentTab, setCurrentTab] = useState("details");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    underReview: 0,
  });
  const [bankPlans, setBankPlans] = useState([]);
  const [user, setUser] = useState(null);

  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !currentUser.email) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push("/login");
      } else {
        setUser(currentUser); // Set the user when authenticated
      }
    });

    return () => unsubscribe();
  }, [router, toast]);

  // Fetch applications
  const fetchApplications = async () => {
    if (!user) return;

    setLoadingApplications(true);
    try {
      // Fetch loan plans created by this bank
      const loanPlansRef = collection(db, "loanplans");
      const loanPlansQuery = query(
        loanPlansRef,
        where("createdBy", "==", user.uid)
      );
      const loanPlansSnapshot = await getDocs(loanPlansQuery);
      const bankPlanIds = loanPlansSnapshot.docs.map((doc) => doc.id);
      setBankPlans(bankPlanIds);

      if (bankPlanIds.length === 0) {
        setApplications([]);
        setFilteredApplications([]);
        setStats({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          underReview: 0,
        });
        return;
      }

      // Fetch applications without using composite index
      const applicationsRef = collection(db, "loanApplications");
      const q = query(
        applicationsRef,
        where("loanDetails.loanPlanId", "in", bankPlanIds)
      );

      const querySnapshot = await getDocs(q);
      let fetchedApplications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort applications client-side
      fetchedApplications.sort((a, b) => {
        const dateA = a.applicationStatus?.submittedAt?.toDate?.() || 0;
        const dateB = b.applicationStatus?.submittedAt?.toDate?.() || 0;
        return dateB - dateA;
      });

      setApplications(fetchedApplications);
      setFilteredApplications(fetchedApplications);

      // Calculate statistics
      const stats = {
        total: fetchedApplications.length,
        pending: fetchedApplications.filter(
          (app) => app.applicationStatus?.status === "pending"
        ).length,
        approved: fetchedApplications.filter(
          (app) => app.applicationStatus?.status === "approved"
        ).length,
        rejected: fetchedApplications.filter(
          (app) => app.applicationStatus?.status === "rejected"
        ).length,
        underReview: fetchedApplications.filter(
          (app) => app.applicationStatus?.status === "under_review"
        ).length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load loan applications",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setApplications([]);
      setFilteredApplications([]);
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        underReview: 0,
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]); // Only run when user changes

  // Filter applications when filter states change
  useEffect(() => {
    let result = [...applications];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(
        (app) => app.applicationStatus?.status === statusFilter
      );
    }

    // Filter by loan category
    if (categoryFilter !== "all") {
      result = result.filter(
        (app) => app.loanDetails?.loanCategory === categoryFilter
      );
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dateBoundary = new Date(today);

      switch (dateFilter) {
        case "today":
          // Keep today's applications
          break;
        case "week":
          dateBoundary.setDate(today.getDate() - 7);
          break;
        case "month":
          dateBoundary.setMonth(today.getMonth() - 1);
          break;
      }

      result = result.filter((app) => {
        const appDate = app.applicationStatus?.submittedAt?.toDate?.();
        return appDate && appDate >= dateBoundary;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          (app.applicationId &&
            app.applicationId.toLowerCase().includes(query)) ||
          (app.userName && app.userName.toLowerCase().includes(query)) ||
          (app.userEmail && app.userEmail.toLowerCase().includes(query)) ||
          (app.contactDetails?.phone &&
            app.contactDetails.phone.includes(query))
      );
    }

    setFilteredApplications(result);
  }, [applications, statusFilter, dateFilter, categoryFilter, searchQuery]);

  // Open application details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setReviewNote("");
    setCurrentTab("details");
    onOpen();
  };

  // Update application status
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApplication) return;

    setProcessingAction(true);
    try {
      const applicationRef = doc(
        db,
        "loanApplications",
        selectedApplication.id
      );
      const currentTime = new Date().toISOString();

      await updateDoc(applicationRef, {
        "applicationStatus.status": newStatus,
        "applicationStatus.stage":
          newStatus === "approved"
            ? "approved"
            : newStatus === "rejected"
            ? "rejected"
            : newStatus === "under_review"
            ? "under_review"
            : "pending",
        "applicationStatus.lastUpdated": serverTimestamp(),
        "applicationStatus.statusHistory": [
          ...(selectedApplication.applicationStatus?.statusHistory || []),
          {
            status: newStatus,
            stage:
              newStatus === "approved"
                ? "approved"
                : newStatus === "rejected"
                ? "rejected"
                : newStatus === "under_review"
                ? "under_review"
                : "pending",
            timestamp: currentTime,
            notes: reviewNote || `Application ${newStatus}`,
          },
        ],
      });

      // Also update the user's applications subcollection if we have the user ID
      if (selectedApplication.userId) {
        const userApplicationsQuery = query(
          collection(db, `users/${selectedApplication.userId}/applications`),
          where("mainDocRef", "==", selectedApplication.id)
        );
        const userAppSnapshot = await getDocs(userApplicationsQuery);

        if (!userAppSnapshot.empty) {
          const userAppDoc = userAppSnapshot.docs[0];
          await updateDoc(
            doc(
              db,
              `users/${selectedApplication.userId}/applications`,
              userAppDoc.id
            ),
            {
              status: newStatus,
              stage:
                newStatus === "approved"
                  ? "approved"
                  : newStatus === "rejected"
                  ? "rejected"
                  : newStatus === "under_review"
                  ? "under_review"
                  : "pending",
              updatedAt: serverTimestamp(),
            }
          );
        }
      }

      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update local state
      const updatedApplications = applications.map((app) =>
        app.id === selectedApplication.id
          ? {
              ...app,
              applicationStatus: {
                ...app.applicationStatus,
                status: newStatus,
                stage:
                  newStatus === "approved"
                    ? "approved"
                    : newStatus === "rejected"
                    ? "rejected"
                    : newStatus === "under_review"
                    ? "under_review"
                    : "pending",
                statusHistory: [
                  ...(app.applicationStatus?.statusHistory || []),
                  {
                    status: newStatus,
                    stage:
                      newStatus === "approved"
                        ? "approved"
                        : newStatus === "rejected"
                        ? "rejected"
                        : newStatus === "under_review"
                        ? "under_review"
                        : "pending",
                    timestamp: currentTime,
                    notes: reviewNote || `Application ${newStatus}`,
                  },
                ],
              },
            }
          : app
      );

      setApplications(updatedApplications);
      // Update the selected application in the modal
      setSelectedApplication({
        ...selectedApplication,
        applicationStatus: {
          ...selectedApplication.applicationStatus,
          status: newStatus,
          stage:
            newStatus === "approved"
              ? "approved"
              : newStatus === "rejected"
              ? "rejected"
              : newStatus === "under_review"
              ? "under_review"
              : "pending",
          statusHistory: [
            ...(selectedApplication.applicationStatus?.statusHistory || []),
            {
              status: newStatus,
              stage:
                newStatus === "approved"
                  ? "approved"
                  : newStatus === "rejected"
                  ? "rejected"
                  : newStatus === "under_review"
                  ? "under_review"
                  : "pending",
              timestamp: currentTime,
              notes: reviewNote || `Application ${newStatus}`,
            },
          ],
        },
      });

      // Update stats
      const updatedStats = { ...stats };
      if (newStatus === "approved") {
        updatedStats.approved += 1;
        if (selectedApplication.applicationStatus?.status === "pending")
          updatedStats.pending -= 1;
        if (selectedApplication.applicationStatus?.status === "under_review")
          updatedStats.underReview -= 1;
        if (selectedApplication.applicationStatus?.status === "rejected")
          updatedStats.rejected -= 1;
      } else if (newStatus === "rejected") {
        updatedStats.rejected += 1;
        if (selectedApplication.applicationStatus?.status === "pending")
          updatedStats.pending -= 1;
        if (selectedApplication.applicationStatus?.status === "under_review")
          updatedStats.underReview -= 1;
        if (selectedApplication.applicationStatus?.status === "approved")
          updatedStats.approved -= 1;
      } else if (newStatus === "under_review") {
        updatedStats.underReview += 1;
        if (selectedApplication.applicationStatus?.status === "pending")
          updatedStats.pending -= 1;
        if (selectedApplication.applicationStatus?.status === "approved")
          updatedStats.approved -= 1;
        if (selectedApplication.applicationStatus?.status === "rejected")
          updatedStats.rejected -= 1;
      }
      setStats(updatedStats);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "under_review":
        return "orange";
      default:
        return "blue";
    }
  };

  return (
    <Flex h="100vh">
      {/* Sidenav */}
      <Box w="20%" position="fixed" h="100vh" bg="gray.800">
        <BankSidenav />
      </Box>

      {/* Main Content */}
      <Box paddingTop="10%" width="80%" flex="1" bg="gray.50">
        {/* Header */}
        <Box position="fixed" top={0} right={0} left={"20%"} zIndex={2}>
          <BankHeader />
        </Box>

        {/* Page Content */}
        <Box p={6} ml={"20%"}>
          {/* Heading Section */}
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="xl">Loan Applications</Heading>
            <Button
              leftIcon={<FiRefreshCw />}
              onClick={fetchApplications}
              isLoading={loadingApplications}
              variant="outline"
            >
              Refresh
            </Button>
          </Flex>

          {/* Statistics Cards */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={4}
            mb={8}
          >
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="white"
                shadow="md"
                borderRadius="md"
                borderTop="4px solid"
                borderColor="blue.500"
              >
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">
                    Total Applications
                  </StatLabel>
                  <StatNumber fontSize="2xl">{stats.total}</StatNumber>
                </Stat>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="white"
                shadow="md"
                borderRadius="md"
                borderTop="4px solid"
                borderColor="blue.500"
              >
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">
                    Pending
                  </StatLabel>
                  <StatNumber fontSize="2xl" color="blue.500">
                    {stats.pending}
                  </StatNumber>
                </Stat>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="white"
                shadow="md"
                borderRadius="md"
                borderTop="4px solid"
                borderColor="orange.500"
              >
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">
                    Under Review
                  </StatLabel>
                  <StatNumber fontSize="2xl" color="orange.500">
                    {stats.underReview}
                  </StatNumber>
                </Stat>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="white"
                shadow="md"
                borderRadius="md"
                borderTop="4px solid"
                borderColor="green.500"
              >
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">
                    Approved
                  </StatLabel>
                  <StatNumber fontSize="2xl" color="green.500">
                    {stats.approved}
                  </StatNumber>
                </Stat>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                p={4}
                bg="white"
                shadow="md"
                borderRadius="md"
                borderTop="4px solid"
                borderColor="red.500"
              >
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">
                    Rejected
                  </StatLabel>
                  <StatNumber fontSize="2xl" color="red.500">
                    {stats.rejected}
                  </StatNumber>
                </Stat>
              </Box>
            </GridItem>
          </Grid>

          {/* Filters */}
          <Box bg="white" p={4} shadow="md" borderRadius="md" mb={6}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              align={{ md: "center" }}
              mb={2}
            >
              <HStack flex={{ md: 2 }}>
                <FiSearch size={20} />
                <Input
                  placeholder="Search by name, email, ID or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </HStack>

              <HStack flex={1}>
                <Text whiteSpace="nowrap" fontWeight="medium">
                  Status:
                </Text>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </HStack>

              <HStack flex={1}>
                <Text whiteSpace="nowrap" fontWeight="medium">
                  Period:
                </Text>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </Select>
              </HStack>

              <HStack flex={1}>
                <Text whiteSpace="nowrap" fontWeight="medium">
                  Type:
                </Text>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Loans</option>
                  <option value="HomeLoans">Home Loans</option>
                  <option value="PersonalLoans">Personal Loans</option>
                  <option value="CarLoans">Car Loans</option>
                  <option value="BusinessLoans">Business Loans</option>
                  <option value="EducationLoans">Education Loans</option>
                </Select>
              </HStack>
            </Flex>
            <Text fontSize="sm" color="gray.600" mt={2}>
              Showing {filteredApplications.length} of {applications.length}{" "}
              applications
            </Text>
          </Box>

          {/* Applications Table */}
          {loadingApplications ? (
            <Center p={10}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text mt={4} color="gray.500">
                Loading applications...
              </Text>
            </Center>
          ) : filteredApplications.length === 0 ? (
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius="md"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                No Applications Found
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                No loan applications match your current filters.
              </AlertDescription>
            </Alert>
          ) : (
            <Box bg="white" shadow="md" borderRadius="md" overflow="hidden">
              <TableContainer>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Applicant</Th>
                      <Th>Loan Details</Th>
                      <Th>Submit Date</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredApplications.map((application) => (
                      <Tr
                        key={application.id}
                        _hover={{ bg: "gray.50" }}
                        bg={
                          application.applicationStatus?.status === "approved"
                            ? "green.50"
                            : application.applicationStatus?.status ===
                              "rejected"
                            ? "red.50"
                            : application.applicationStatus?.status ===
                              "under_review"
                            ? "orange.50"
                            : undefined
                        }
                      >
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">
                              {application.userName || "Unknown"}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {application.userEmail}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              ID:{" "}
                              {application.applicationId ||
                                application.id.slice(0, 8)}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">
                              ₹
                              {application.loanDetails?.loanAmount?.toLocaleString() ||
                                "0"}
                            </Text>
                            <Text fontSize="sm">
                              {application.loanDetails?.loanPlanName ||
                                "Unknown Plan"}
                            </Text>
                            <Badge colorScheme="purple" fontSize="xs">
                              {application.loanDetails?.loanCategory ||
                                "Unknown"}
                            </Badge>
                          </VStack>
                        </Td>
                        <Td>
                          {formatDate(
                            application.applicationStatus?.submittedAt
                          )}
                        </Td>
                        <Td>
                          <Tag
                            colorScheme={getStatusColor(
                              application.applicationStatus?.status
                            )}
                            size="md"
                          >
                            {application.applicationStatus?.status?.toUpperCase() ||
                              "PENDING"}
                          </Tag>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleViewDetails(application)}
                          >
                            View Details
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>

        {/* Application Details Modal */}
        {selectedApplication && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="5xl"
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                bg={
                  selectedApplication.applicationStatus?.status === "approved"
                    ? "green.500"
                    : selectedApplication.applicationStatus?.status ===
                      "rejected"
                    ? "red.500"
                    : selectedApplication.applicationStatus?.status ===
                      "under_review"
                    ? "orange.500"
                    : "blue.500"
                }
                color="white"
                borderTopRadius="md"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    Loan Application #
                    {selectedApplication.applicationId ||
                      selectedApplication.id.slice(0, 8)}
                    <Text fontSize="sm" fontWeight="normal" mt={1}>
                      {selectedApplication.loanDetails?.loanPlanName} -{" "}
                      {selectedApplication.loanDetails?.loanCategory}
                    </Text>
                  </Box>
                  <Badge
                    fontSize="md"
                    colorScheme="white"
                    variant="solid"
                    py={1}
                    px={3}
                    bg="whiteAlpha.300"
                  >
                    {selectedApplication.applicationStatus?.status?.toUpperCase() ||
                      "PENDING"}
                  </Badge>
                </Flex>
              </ModalHeader>
              <ModalCloseButton color="white" />

              <Tabs
                variant="enclosed"
                colorScheme="blue"
                defaultIndex={0}
                onChange={(index) =>
                  setCurrentTab(
                    ["details", "employment", "documents", "history"][index]
                  )
                }
                p={4}
              >
                <TabList>
                  <Tab>
                    <FiUser style={{ marginRight: "8px" }} /> Applicant Details
                  </Tab>
                  <Tab>
                    <FiDollarSign style={{ marginRight: "8px" }} /> Financial
                    Info
                  </Tab>
                  <Tab>
                    <FiFileText style={{ marginRight: "8px" }} /> Documents &
                    KYC
                  </Tab>
                  <Tab>
                    <FiActivity style={{ marginRight: "8px" }} /> Application
                    History
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Applicant Details Panel */}
                  <TabPanel>
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={6}
                    >
                      <Box>
                        <Heading size="md" mb={4}>
                          Personal Information
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Name:
                            </Text>
                            <Text>{selectedApplication.userName}</Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Email:
                            </Text>
                            <Text>{selectedApplication.userEmail}</Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Phone:
                            </Text>
                            <Text>
                              {selectedApplication.contactDetails?.phone ||
                                "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full" alignItems="flex-start">
                            <Text fontWeight="bold" w="150px">
                              Address:
                            </Text>
                            <VStack align="start" spacing={0}>
                              <Text>
                                {selectedApplication.contactDetails?.address ||
                                  "Not provided"}
                              </Text>
                              <Text>
                                {selectedApplication.contactDetails?.city || ""}{" "}
                                {selectedApplication.contactDetails?.pincode ||
                                  ""}
                              </Text>
                            </VStack>
                          </HStack>
                        </VStack>

                        <Heading size="md" mt={8} mb={4}>
                          Loan Request
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Plan Name:
                            </Text>
                            <Text>
                              {selectedApplication.loanDetails?.loanPlanName}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Loan Category:
                            </Text>
                            <Badge colorScheme="purple">
                              {selectedApplication.loanDetails?.loanCategory}
                            </Badge>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Purpose:
                            </Text>
                            <Text>
                              {selectedApplication.loanDetails?.purpose ||
                                "Not specified"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Amount Requested:
                            </Text>
                            <Text fontWeight="bold" color="blue.600">
                              ₹
                              {selectedApplication.loanDetails?.loanAmount?.toLocaleString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>

                      <Box>
                        <Heading size="md" mb={4}>
                          Loan Terms
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Interest Rate:
                            </Text>
                            <Text>
                              {selectedApplication.loanDetails?.interestRate}%
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Tenure:
                            </Text>
                            <Text>
                              {selectedApplication.loanDetails?.tenure} months
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Monthly EMI:
                            </Text>
                            <Text fontWeight="bold" color="green.600">
                              ₹
                              {Math.round(
                                selectedApplication.loanDetails?.emi
                              )?.toLocaleString()}
                              /month
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Total Interest:
                            </Text>
                            <Text>
                              ₹
                              {Math.round(
                                selectedApplication.loanDetails?.totalInterest
                              )?.toLocaleString()}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Total Repayment:
                            </Text>
                            <Text>
                              ₹
                              {Math.round(
                                selectedApplication.loanDetails?.totalPayment
                              )?.toLocaleString()}
                            </Text>
                          </HStack>
                        </VStack>

                        <Box mt={8}>
                          <Heading size="md" mb={4}>
                            Application Timeline
                          </Heading>
                          <VStack align="stretch" spacing={0}>
                            <HStack
                              bg="blue.50"
                              p={3}
                              borderTopRadius="md"
                              borderLeft="4px solid"
                              borderColor="blue.500"
                            >
                              <Box
                                w="24px"
                                h="24px"
                                borderRadius="full"
                                bg="blue.500"
                                color="white"
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                1
                              </Box>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">
                                  Application Submitted
                                </Text>
                                <Text fontSize="sm">
                                  {formatDate(
                                    selectedApplication.applicationStatus
                                      ?.submittedAt
                                  )}
                                </Text>
                              </VStack>
                            </HStack>

                            <HStack
                              bg={
                                selectedApplication.applicationStatus
                                  ?.status !== "pending"
                                  ? "orange.50"
                                  : "gray.100"
                              }
                              p={3}
                              borderLeft="4px solid"
                              borderColor={
                                selectedApplication.applicationStatus
                                  ?.status !== "pending"
                                  ? "orange.500"
                                  : "gray.300"
                              }
                            >
                              <Box
                                w="24px"
                                h="24px"
                                borderRadius="full"
                                bg={
                                  selectedApplication.applicationStatus
                                    ?.status !== "pending"
                                    ? "orange.500"
                                    : "gray.300"
                                }
                                color="white"
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                2
                              </Box>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">Under Review</Text>
                                <Text fontSize="sm">
                                  {selectedApplication.applicationStatus
                                    ?.status !== "pending"
                                    ? "Application is being processed"
                                    : "Waiting for review"}
                                </Text>
                              </VStack>
                            </HStack>

                            <HStack
                              bg={
                                selectedApplication.applicationStatus
                                  ?.status === "approved" ||
                                selectedApplication.applicationStatus
                                  ?.status === "rejected"
                                  ? selectedApplication.applicationStatus
                                      ?.status === "approved"
                                    ? "green.50"
                                    : "red.50"
                                  : "gray.100"
                              }
                              p={3}
                              borderLeft="4px solid"
                              borderColor={
                                selectedApplication.applicationStatus
                                  ?.status === "approved"
                                  ? "green.500"
                                  : selectedApplication.applicationStatus
                                      ?.status === "rejected"
                                  ? "red.500"
                                  : "gray.300"
                              }
                            >
                              <Box
                                w="24px"
                                h="24px"
                                borderRadius="full"
                                bg={
                                  selectedApplication.applicationStatus
                                    ?.status === "approved"
                                    ? "green.500"
                                    : selectedApplication.applicationStatus
                                        ?.status === "rejected"
                                    ? "red.500"
                                    : "gray.300"
                                }
                                color="white"
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                3
                              </Box>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">Final Decision</Text>
                                <Text fontSize="sm">
                                  {selectedApplication.applicationStatus
                                    ?.status === "approved"
                                    ? "Application approved"
                                    : selectedApplication.applicationStatus
                                        ?.status === "rejected"
                                    ? "Application rejected"
                                    : "Pending decision"}
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack>
                        </Box>
                      </Box>
                    </Grid>
                  </TabPanel>

                  {/* Financial Info Panel */}
                  <TabPanel>
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={6}
                    >
                      <Box>
                        <Heading size="md" mb={4}>
                          Employment Details
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Employment Type:
                            </Text>
                            <Text>
                              {selectedApplication.employmentDetails?.type ||
                                "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Company Name:
                            </Text>
                            <Text>
                              {selectedApplication.employmentDetails
                                ?.companyName || "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Designation:
                            </Text>
                            <Text>
                              {selectedApplication.employmentDetails
                                ?.designation || "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Duration:
                            </Text>
                            <Text>
                              {selectedApplication.employmentDetails
                                ?.duration || "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Income-EMI Ratio:
                            </Text>
                            <Text>
                              {selectedApplication.employmentDetails
                                ?.monthlyIncome &&
                              selectedApplication.loanDetails?.emi
                                ? (
                                    (selectedApplication.loanDetails.emi /
                                      selectedApplication.employmentDetails
                                        .monthlyIncome) *
                                    100
                                  ).toFixed(2) + "%"
                                : "Not available"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>

                      <Box>
                        <Heading size="md" mb={4}>
                          Existing Financial Obligations
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Existing Loans:
                            </Text>
                            <Text>
                              {selectedApplication.financialDetails
                                ?.existingLoans || "No"}
                            </Text>
                          </HStack>
                          {selectedApplication.financialDetails
                            ?.existingLoans === "Yes" && (
                            <HStack w="full">
                              <Text fontWeight="bold" w="150px">
                                Existing EMI:
                              </Text>
                              <Text>
                                ₹
                                {selectedApplication.financialDetails?.existingEmi?.toLocaleString() ||
                                  "0"}
                                /month
                              </Text>
                            </HStack>
                          )}
                        </VStack>

                        <Heading size="md" mt={8} mb={4}>
                          Banking Details
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Bank Name:
                            </Text>
                            <Text>
                              {selectedApplication.financialDetails?.bankName ||
                                "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Account Number:
                            </Text>
                            <Text>
                              {selectedApplication.financialDetails
                                ?.bankAccountNumber
                                ? "XXXX" +
                                  selectedApplication.financialDetails.bankAccountNumber.slice(
                                    -4
                                  )
                                : "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              IFSC Code:
                            </Text>
                            <Text>
                              {selectedApplication.financialDetails?.ifscCode ||
                                "Not provided"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Grid>
                  </TabPanel>

                  {/* Documents & KYC Panel */}
                  <TabPanel>
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={6}
                    >
                      <Box>
                        <Heading size="md" mb={4}>
                          Identity Verification
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              PAN Card:
                            </Text>
                            <Text>
                              {selectedApplication.kycDetails?.panCard ||
                                "Not provided"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Aadhaar Card:
                            </Text>
                            <Text>
                              {selectedApplication.kycDetails?.aadhaarNumber
                                ? "XXXX-XXXX-" +
                                  selectedApplication.kycDetails.aadhaarNumber
                                : "Not provided"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>

                      <Box>
                        <Heading size="md" mb={4}>
                          Consent Details
                        </Heading>
                        <VStack
                          align="start"
                          spacing={3}
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Terms Accepted:
                            </Text>
                            <Text>
                              {selectedApplication.consentDetails?.termsAccepted
                                ? "Yes"
                                : "No"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Data Sharing:
                            </Text>
                            <Text>
                              {selectedApplication.consentDetails
                                ?.dataSharingAccepted
                                ? "Yes"
                                : "No"}
                            </Text>
                          </HStack>
                          <HStack w="full">
                            <Text fontWeight="bold" w="150px">
                              Accepted On:
                            </Text>
                            <Text>
                              {selectedApplication.consentDetails?.acceptedAt
                                ? new Date(
                                    selectedApplication.consentDetails.acceptedAt
                                  ).toLocaleString()
                                : "Not available"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Grid>
                  </TabPanel>

                  {/* Application History Panel */}
                  <TabPanel>
                    <Box>
                      <Heading size="md" mb={4}>
                        Status History
                      </Heading>
                      {selectedApplication.applicationStatus?.statusHistory
                        ?.length > 0 ? (
                        <VStack spacing={0} align="stretch">
                          {selectedApplication.applicationStatus.statusHistory.map(
                            (historyItem, index) => (
                              <Box
                                key={index}
                                p={4}
                                borderLeftWidth="2px"
                                borderLeftColor={
                                  historyItem.status === "approved"
                                    ? "green.500"
                                    : historyItem.status === "rejected"
                                    ? "red.500"
                                    : historyItem.status === "under_review"
                                    ? "orange.500"
                                    : "blue.500"
                                }
                                _notLast={{ borderLeftStyle: "solid" }}
                                _last={{ borderLeftStyle: "dashed" }}
                                position="relative"
                              >
                                <Box
                                  position="absolute"
                                  left="-10px"
                                  top="4"
                                  w="18px"
                                  h="18px"
                                  borderRadius="full"
                                  bg={
                                    historyItem.status === "approved"
                                      ? "green.500"
                                      : historyItem.status === "rejected"
                                      ? "red.500"
                                      : historyItem.status === "under_review"
                                      ? "orange.500"
                                      : "blue.500"
                                  }
                                />

                                <Box ml={4}>
                                  <Flex justify="space-between" align="center">
                                    <Text fontWeight="bold">
                                      Status: {historyItem.status.toUpperCase()}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                      {historyItem.timestamp
                                        ? new Date(
                                            historyItem.timestamp
                                          ).toLocaleString()
                                        : "Date not available"}
                                    </Text>
                                  </Flex>
                                  <Text mt={1} color="gray.700">
                                    {historyItem.notes ||
                                      `Application ${historyItem.status}`}
                                  </Text>
                                </Box>
                              </Box>
                            )
                          )}
                        </VStack>
                      ) : (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertTitle>No history records available</AlertTitle>
                        </Alert>
                      )}
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <ModalFooter bg="gray.50">
                <FormControl>
                  <Textarea
                    placeholder="Add notes about this application..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    resize="vertical"
                    mb={4}
                  />
                </FormControl>

                <HStack spacing={4} width="100%" justify="space-between">
                  <Button onClick={onClose}>Close</Button>
                  <HStack>
                    {selectedApplication.applicationStatus?.status ===
                      "pending" && (
                      <Button
                        colorScheme="orange"
                        leftIcon={<FiClock />}
                        isLoading={processingAction}
                        loadingText="Updating"
                        onClick={() => handleUpdateStatus("under_review")}
                      >
                        Mark Under Review
                      </Button>
                    )}

                    {selectedApplication.applicationStatus?.status !==
                      "rejected" && (
                      <Button
                        colorScheme="green"
                        leftIcon={<FiCheckCircle />}
                        isLoading={processingAction}
                        loadingText="Approving"
                        onClick={() => handleUpdateStatus("approved")}
                        isDisabled={
                          selectedApplication.applicationStatus?.status ===
                          "approved"
                        }
                      >
                        Approve
                      </Button>
                    )}

                    {selectedApplication.applicationStatus?.status !==
                      "approved" && (
                      <Button
                        colorScheme="red"
                        leftIcon={<FiXCircle />}
                        isLoading={processingAction}
                        loadingText="Rejecting"
                        onClick={() => handleUpdateStatus("rejected")}
                        isDisabled={
                          selectedApplication.applicationStatus?.status ===
                          "rejected"
                        }
                      >
                        Reject
                      </Button>
                    )}
                  </HStack>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Flex>
  );
};

export default LoanApplicationPage;
