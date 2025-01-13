// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Heading,
//   Text,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Button,
//   Input,
//   NumberInput,
//   NumberInputField,
//   Textarea,
//   VStack,
//   HStack,
//   useToast,
//   Spinner,
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   Tab,
//   Tabs,
//   TabList,
//   TabPanel,
//   TabPanels,
//   Badge,
//   Tooltip,
//   Container,
//   Divider,
// } from "@chakra-ui/react";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   deleteDoc,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { db, auth } from "@/firebase";
// import { onAuthStateChanged } from "firebase/auth";

// export default function PlanDisplay() {
//   const [investmentPlans, setInvestmentPlans] = useState([]);
//   const [loanPlans, setLoanPlans] = useState([]);
//   const [user, setUser] = useState(null);
//   const [editPlan, setEditPlan] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();

//   const initialFormData = {
//     planName: "",
//     interestRate: "",
//     maxAmount: "",
//     minAmount: "",
//     tenure: "",
//     description: "",
//     loanName: "",
//     investmentCategory: "",
//     investmentSubCategory: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [isEditingLoan, setIsEditingLoan] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       try {
//         if (currentUser) {
//           setUser(currentUser);
//           await Promise.all([
//             fetchInvestmentPlans(currentUser.uid),
//             fetchLoanPlans(currentUser.uid),
//           ]);
//         } else {
//           setUser(null);
//           setInvestmentPlans([]);
//           setLoanPlans([]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchInvestmentPlans = async (userId) => {
//     try {
//       const q = query(
//         collection(db, "investmentplans"),
//         where("createdBy", "==", userId)
//       );
//       const querySnapshot = await getDocs(q);
//       const plans = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
//       }));
//       setInvestmentPlans(plans);
//     } catch (error) {
//       throw new Error(`Error fetching investment plans: ${error.message}`);
//     }
//   };

//   const fetchLoanPlans = async (userId) => {
//     try {
//       const q = query(
//         collection(db, "loanplans"),
//         where("createdBy", "==", userId)
//       );
//       const querySnapshot = await getDocs(q);
//       const plans = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
//       }));
//       setLoanPlans(plans);
//     } catch (error) {
//       throw new Error(`Error fetching loan plans: ${error.message}`);
//     }
//   };

//   const handleDeletePlan = async (planId, type) => {
//     onOpen();
//     const handleConfirmDelete = async () => {
//       try {
//         const collectionName =
//           type === "loan" ? "loanplans" : "investmentplans";
//         await deleteDoc(doc(db, collectionName, planId));

//         if (type === "loan") {
//           setLoanPlans((prev) => prev.filter((plan) => plan.id !== planId));
//         } else {
//           setInvestmentPlans((prev) =>
//             prev.filter((plan) => plan.id !== planId)
//           );
//         }

//         toast({
//           title: "Plan Deleted",
//           description: `The ${type} plan has been successfully deleted.`,
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: `Failed to delete the ${type} plan: ${error.message}`,
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       } finally {
//         onClose();
//       }
//     };

//     return (
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Confirm Deletion</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             Are you sure you want to delete this plan? This action cannot be
//             undone.
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
//               Delete
//             </Button>
//             <Button variant="ghost" onClick={onClose}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     );
//   };

//   const handleEdit = (plan, type) => {
//     setIsEditingLoan(type === "loan");
//     setEditPlan(plan.id);
//     setFormData({
//       planName: type === "loan" ? plan.loanName : plan.planName,
//       interestRate: plan.interestRate,
//       maxAmount: plan.maxAmount,
//       minAmount: plan.minAmount,
//       tenure: plan.tenure,
//       description: plan.description,
//       investmentCategory: plan.investmentCategory || "",
//       investmentSubCategory: plan.investmentSubCategory || "",
//     });
//   };

//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const collectionName = isEditingLoan ? "loanplans" : "investmentplans";
//       await setDoc(doc(db, collectionName, editPlan), {
//         ...formData,

//         updatedAt: new Date(),
//       });

//       if (isEditingLoan) {
//         setLoanPlans((prev) =>
//           prev.map((plan) =>
//             plan.id === editPlan ? { ...plan, ...formData } : plan
//           )
//         );
//       } else {
//         setInvestmentPlans((prev) =>
//           prev.map((plan) =>
//             plan.id === editPlan ? { ...plan, ...formData } : plan
//           )
//         );
//       }

//       toast({
//         title: "Success",
//         description: "Plan updated successfully",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });

//       setEditPlan(null);
//       setFormData(initialFormData);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <Spinner size="xl" color="blue.500" />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert status="error">
//         <AlertIcon />
//         <AlertTitle>Error:</AlertTitle>
//         <AlertDescription>{error}</AlertDescription>
//       </Alert>
//     );
//   }

//   if (!user) {
//     return (
//       <Alert status="warning">
//         <AlertIcon />
//         <AlertTitle>Authentication Required</AlertTitle>
//         <AlertDescription>
//           Please log in to access the bank panel.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   const PlanTable = ({ plans, type }) => (
//     <Table variant="simple" colorScheme="whiteAlpha" size="sm">
//       <Thead>
//         <Tr>
//           <Th color="blue.100">
//             {type === "loan" ? "Loan Name" : "Plan Name"}
//           </Th>
//           <Th color="blue.100">Interest Rate (%)</Th>
//           <Th color="blue.100">Amount Range</Th>
//           <Th color="blue.100">Tenure</Th>
//           <Th color="blue.100">Actions</Th>
//         </Tr>
//       </Thead>
//       <Tbody>
//         {plans.map((plan) => (
//           <Tr key={plan.id}>
//             <Td>
//               <Tooltip label={plan.description} placement="top">
//                 <Text cursor="help">
//                   {type === "loan" ? plan.loanName : plan.planName}
//                 </Text>
//               </Tooltip>
//             </Td>
//             <Td>
//               <Badge colorScheme="green">{plan.interestRate}%</Badge>
//             </Td>
//             <Td>{`${Number(plan.minAmount).toLocaleString()} - ${Number(
//               plan.maxAmount
//             ).toLocaleString()}`}</Td>
//             <Td>{plan.tenure} months</Td>

//             <Td>
//               <HStack spacing={2}>
//                 <Button
//                   size="sm"
//                   colorScheme="blue"
//                   onClick={() => handleEdit(plan, type)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   size="sm"
//                   colorScheme="red"
//                   onClick={() => handleDeletePlan(plan.id, type)}
//                 >
//                   Delete
//                 </Button>
//               </HStack>
//             </Td>
//           </Tr>
//         ))}
//       </Tbody>
//     </Table>
//   );

//   return (
//     <Container maxW="container.xl" p={5}>
//       <Box
//         p={6}
//         borderRadius="lg"
//         bg="rgba(15, 21, 53, 0.95)"
//         color="white"
//         boxShadow="xl"
//       >
//         <Heading mb={4} color="blue.300" size="lg">
//           Bank Panel
//         </Heading>
//         <Text color="gray.300" mb={6}>
//           Welcome, {user.email}
//         </Text>
//         <Divider mb={6} />

//         <Tabs variant="enclosed" colorScheme="blue">
//           <TabList>
//             <Tab>Investment Plans ({investmentPlans.length})</Tab>
//             <Tab>Loan Plans ({loanPlans.length})</Tab>
//           </TabList>

//           <TabPanels>
//             <TabPanel>
//               {investmentPlans.length > 0 ? (
//                 <PlanTable plans={investmentPlans} type="investment" />
//               ) : (
//                 <Alert status="info">
//                   <AlertIcon />
//                   No investment plans available.
//                 </Alert>
//               )}
//             </TabPanel>
//             <TabPanel>
//               {loanPlans.length > 0 ? (
//                 <PlanTable plans={loanPlans} type="loan" />
//               ) : (
//                 <Alert status="info">
//                   <AlertIcon />
//                   No loan plans available.
//                 </Alert>
//               )}
//             </TabPanel>
//           </TabPanels>
//         </Tabs>

//         {editPlan && (
//           <Box mt={6} p={6} borderRadius="md" bg="rgba(255, 255, 255, 0.05)">
//             <Heading size="md" mb={4} color="blue.300">
//               Edit {isEditingLoan ? "Loan" : "Investment"} Plan
//             </Heading>
//             <form onSubmit={handleSubmitEdit}>
//               <VStack spacing={4} align="stretch">
//                 <Input
//                   variant="filled"
//                   name="planName"
//                   value={formData.planName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, planName: e.target.value })
//                   }
//                   placeholder={isEditingLoan ? "Loan Name" : "Plan Name"}
//                   isRequired
//                 />
//                 <NumberInput
//                   variant="filled"
//                   min={0}
//                   value={formData.interestRate}
//                   onChange={(valueString) =>
//                     setFormData({ ...formData, interestRate: valueString })
//                   }
//                   isRequired
//                 >
//                   <NumberInputField placeholder="Interest Rate (%)" />
//                 </NumberInput>
//                 <HStack>
//                   <NumberInput
//                     variant="filled"
//                     min={0}
//                     value={formData.minAmount}
//                     onChange={(valueString) =>
//                       setFormData({ ...formData, minAmount: valueString })
//                     }
//                     isRequired
//                   >
//                     <NumberInputField placeholder="Min Amount" />
//                   </NumberInput>
//                   <NumberInput
//                     variant="filled"
//                     min={0}
//                     value={formData.maxAmount}
//                     onChange={(valueString) =>
//                       setFormData({ ...formData, maxAmount: valueString })
//                     }
//                     isRequired
//                   >
//                     <NumberInputField placeholder="Max Amount" />
//                   </NumberInput>
//                 </HStack>
//                 <NumberInput
//                   variant="filled"
//                   min={1}
//                   value={formData.tenure}
//                   onChange={(valueString) =>
//                     setFormData({ ...formData, tenure: valueString })
//                   }
//                   isRequired
//                 >
//                   <NumberInputField placeholder="Tenure (months)" />
//                 </NumberInput>
//                 <Textarea
//                   variant="filled"
//                   name="description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   placeholder="Description"
//                   isRequired
//                 />
//                 <HStack spacing={4}>
//                   <Button
//                     type="submit"
//                     colorScheme="green"
//                     isLoading={isLoading}
//                     loadingText="Updating..."
//                     width="full"
//                   >
//                     Update Plan
//                   </Button>
//                   <Button
//                     onClick={() => {
//                       setEditPlan(null);
//                       setFormData(initialFormData);
//                     }}
//                     colorScheme="gray"
//                     width="full"
//                   >
//                     Cancel
//                   </Button>
//                 </HStack>
//               </VStack>
//             </form>
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  HStack,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  Tooltip,
  Container,
  Divider,
  Select,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PlanDisplay() {
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [editPlan, setEditPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [planToDelete, setPlanToDelete] = useState(null);
  const toast = useToast();

  const initialFormData = {
    planName: "",
    interestRate: "",
    maxAmount: "",
    minAmount: "",
    tenure: "",
    description: "",
    loanName: "",
    investmentCategory: "",
    investmentSubCategory: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isEditingLoan, setIsEditingLoan] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          await Promise.all([
            fetchInvestmentPlans(currentUser.uid),
            fetchLoanPlans(currentUser.uid),
          ]);
        } else {
          setUser(null);
          setInvestmentPlans([]);
          setLoanPlans([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchInvestmentPlans = async (userId) => {
    try {
      const q = query(
        collection(db, "investmentplans"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
      }));
      setInvestmentPlans(plans);
    } catch (error) {
      throw new Error(`Error fetching investment plans: ${error.message}`);
    }
  };

  const fetchLoanPlans = async (userId) => {
    try {
      const q = query(
        collection(db, "loanplans"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
      }));
      setLoanPlans(plans);
    } catch (error) {
      throw new Error(`Error fetching loan plans: ${error.message}`);
    }
  };

  const handleDeleteClick = (planId, type) => {
    setPlanToDelete({ id: planId, type });
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      const collectionName =
        planToDelete.type === "loan" ? "loanplans" : "investmentplans";
      await deleteDoc(doc(db, collectionName, planToDelete.id));

      if (planToDelete.type === "loan") {
        setLoanPlans((prev) =>
          prev.filter((plan) => plan.id !== planToDelete.id)
        );
      } else {
        setInvestmentPlans((prev) =>
          prev.filter((plan) => plan.id !== planToDelete.id)
        );
      }

      toast({
        title: "Plan Deleted",
        description: `The ${planToDelete.type} plan has been successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete the ${planToDelete.type} plan: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setPlanToDelete(null);
    }
  };

  const handleEdit = (plan, type) => {
    setIsEditingLoan(type === "loan");
    setEditPlan(plan.id);
    setFormData({
      planName: type === "loan" ? plan.loanName : plan.planName,
      interestRate: plan.interestRate,
      maxAmount: plan.maxAmount,
      minAmount: plan.minAmount,
      tenure: plan.tenure,
      description: plan.description,
      investmentCategory: plan.investmentCategory || "",
      investmentSubCategory: plan.investmentSubCategory || "",
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const collectionName = isEditingLoan ? "loanplans" : "investmentplans";
      await setDoc(doc(db, collectionName, editPlan), {
        ...formData,

        updatedAt: new Date(),
      });

      if (isEditingLoan) {
        setLoanPlans((prev) =>
          prev.map((plan) =>
            plan.id === editPlan ? { ...plan, ...formData } : plan
          )
        );
      } else {
        setInvestmentPlans((prev) =>
          prev.map((plan) =>
            plan.id === editPlan ? { ...plan, ...formData } : plan
          )
        );
      }

      toast({
        title: "Success",
        description: "Plan updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditPlan(null);
      setFormData(initialFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error:</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please log in to access the bank panel.
        </AlertDescription>
      </Alert>
    );
  }
  const PlanTable = ({ plans, type }) => (
    <Table variant="simple" colorScheme="whiteAlpha" size="sm">
      <Thead>
        <Tr>
          <Th color="blue.100">
            {type === "loan" ? "Loan Name" : "Plan Name"}
          </Th>
          <Th color="blue.100">Interest Rate (%)</Th>
          <Th color="blue.100">Amount Range</Th>
          <Th color="blue.100">Tenure</Th>
          {type === "investment" && (
            <>
              <Th color="blue.100">Category</Th>
              <Th color="blue.100">Sub Category</Th>
            </>
          )}
          <Th color="blue.100">Description</Th>
          <Th color="blue.100">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {plans.map((plan) => (
          <Tr key={plan.id}>
            <Td>
              <Text>{type === "loan" ? plan.loanName : plan.planName}</Text>
            </Td>
            <Td>
              <Badge colorScheme="green">{plan.interestRate}%</Badge>
            </Td>
            <Td>{`${Number(plan.minAmount).toLocaleString()} - ${Number(
              plan.maxAmount
            ).toLocaleString()}`}</Td>
            <Td>{plan.tenure} months</Td>
            {type === "investment" && (
              <>
                <Td>{plan.investmentCategory}</Td>
                <Td>{plan.investmentSubCategory}</Td>
              </>
            )}
            <Td>
              <Tooltip label={plan.description} placement="top">
                <Text noOfLines={2} cursor="help">
                  {plan.description}
                </Text>
              </Tooltip>
            </Td>
            <Td>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleEdit(plan, type)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteClick(plan.id, type)}
                >
                  Delete
                </Button>
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Container maxW="container.xl" p={5}>
      <Box
        p={6}
        borderRadius="lg"
        bg="rgba(15, 21, 53, 0.95)"
        color="white"
        boxShadow="xl"
      >
        <Heading mb={4} color="blue.300" size="lg">
          Bank Panel
        </Heading>
        <Text color="gray.300" mb={6}>
          Welcome, {user.email}
        </Text>
        <Divider mb={6} />

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Investment Plans ({investmentPlans.length})</Tab>
            <Tab>Loan Plans ({loanPlans.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {investmentPlans.length > 0 ? (
                <PlanTable plans={investmentPlans} type="investment" />
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  No investment plans available.
                </Alert>
              )}
            </TabPanel>
            <TabPanel>
              {loanPlans.length > 0 ? (
                <PlanTable plans={loanPlans} type="loan" />
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  No loan plans available.
                </Alert>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {editPlan && (
          <Box mt={6} p={6} borderRadius="md" bg="rgba(255, 255, 255, 0.05)">
            <Heading size="md" mb={4} color="blue.300">
              Edit {isEditingLoan ? "Loan" : "Investment"} Plan
            </Heading>
            <form onSubmit={handleSubmitEdit}>
              <VStack spacing={4} align="stretch">
                <Input
                  name="planName"
                  value={formData.planName}
                  onChange={(e) =>
                    setFormData({ ...formData, planName: e.target.value })
                  }
                  placeholder={isEditingLoan ? "Loan Name" : "Plan Name"}
                  isRequired
                />
                <NumberInput
                  min={0}
                  value={formData.interestRate}
                  onChange={(valueString) =>
                    setFormData({ ...formData, interestRate: valueString })
                  }
                  isRequired
                >
                  <NumberInputField placeholder="Interest Rate (%)" />
                </NumberInput>
                <HStack>
                  <NumberInput
                    min={0}
                    value={formData.minAmount}
                    onChange={(valueString) =>
                      setFormData({ ...formData, minAmount: valueString })
                    }
                    isRequired
                  >
                    <NumberInputField placeholder="Min Amount" />
                  </NumberInput>
                  <NumberInput
                    min={0}
                    value={formData.maxAmount}
                    onChange={(valueString) =>
                      setFormData({ ...formData, maxAmount: valueString })
                    }
                    isRequired
                  >
                    <NumberInputField placeholder="Max Amount" />
                  </NumberInput>
                </HStack>
                <NumberInput
                  min={1}
                  value={formData.tenure}
                  onChange={(valueString) =>
                    setFormData({ ...formData, tenure: valueString })
                  }
                  isRequired
                >
                  <NumberInputField placeholder="Tenure (months)" />
                </NumberInput>
                {!isEditingLoan && (
                  <>
                    <Select
                      placeholder="Select Category"
                      value={formData.investmentCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investmentCategory: e.target.value,
                        })
                      }
                      isRequired
                    >
                      <option value="Fixed Deposit">Fixed Deposit</option>
                      <option value="Mutual Funds">Mutual Funds</option>
                      <option value="Stocks">Stocks</option>
                      <option value="Bonds">Bonds</option>
                    </Select>
                    <Select
                      color={"black"}
                      placeholder="Select Sub Category"
                      value={formData.investmentSubCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          investmentSubCategory: e.target.value,
                        })
                      }
                      isRequired
                    >
                      <option value="Short Term">Short Term</option>
                      <option value="Long Term">Long Term</option>
                      <option value="High Risk">High Risk</option>
                      <option value="Low Risk">Low Risk</option>
                    </Select>
                  </>
                )}
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description"
                  isRequired
                />
                <HStack spacing={4}>
                  <Button
                    type="submit"
                    colorScheme="green"
                    isLoading={isLoading}
                    loadingText="Updating..."
                    width="full"
                  >
                    Update Plan
                  </Button>
                  <Button
                    onClick={() => {
                      setEditPlan(null);
                      setFormData(initialFormData);
                    }}
                    colorScheme="gray"
                    width="full"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this {planToDelete?.type} plan? This
            action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
