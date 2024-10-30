import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Input, NumberInput, NumberInputField, Textarea, Select, VStack, HStack, useToast } from '@chakra-ui/react';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase'; // Ensure db and auth are imported
import { onAuthStateChanged } from 'firebase/auth';

export default function InvestPlanDisplay() {
    const [investmentPlans, setInvestmentPlans] = useState([]);
    const [loanPlans, setLoanPlans] = useState([]); // New state for loan plans
    const [user, setUser] = useState(null); // Updated user state to null
    const [editPlan, setEditPlan] = useState(null); // State to manage the plan being edited
    const [formData, setFormData] = useState({
        planName: '',
        interestRate: '',
        maxAmount: '',
        minAmount: '',
        tenure: '',
        description: '',
    });
    const [isEditingLoan, setIsEditingLoan] = useState(false); // State to manage loan editing
    const toast = useToast();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          await fetchInvestmentPlans(currentUser.uid); // Fetch plans for the authenticated user
          await fetchLoanPlans(currentUser.uid); // Fetch loan plans for the authenticated user
        } else {
          setUser(null);
          setInvestmentPlans([]); // Clear plans if no user is authenticated
          setLoanPlans([]); // Clear loan plans if no user is authenticated
        }
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }, []); // Empty dependency array to run once on mount

    const fetchInvestmentPlans = async (userId) => {
      try {
        const q = query(collection(db, 'investmentplans'), where('createdBy', '==', userId)); // Query for plans created by the user
        const querySnapshot = await getDocs(q);
        const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvestmentPlans(plans);
      } catch (error) {
        console.error("Error fetching investment plans: ", error);
      }
    };

    const fetchLoanPlans = async (userId) => { // New function to fetch loan plans
      try {
        const q = query(collection(db, 'loanplans'), where('createdBy', '==', userId)); // Query for loan plans created by the user
        const querySnapshot = await getDocs(q);
        const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLoanPlans(plans);
      } catch (error) {
        console.error("Error fetching loan plans: ", error);
      }
    };

    const handleDeleteInvestmentPlan = async (planId) => {
      try {
        await deleteDoc(doc(db, 'investmentplans', planId)); // Delete the plan from the database
        setInvestmentPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId)); // Update local state
        toast({
          title: "Plan Deleted",
          description: "The investment plan has been successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting investment plan: ", error);
        toast({
          title: "Error",
          description: "Failed to delete the investment plan. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const handleDeleteLoanPlan = async (planId) => {
      try {
        await deleteDoc(doc(db, 'loanplans', planId)); // Delete the loan plan from the database
        setLoanPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId)); // Update local state
        toast({
          title: "Loan Plan Deleted",
          description: "The loan plan has been successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting loan plan: ", error);
        toast({
          title: "Error",
          description: "Failed to delete the loan plan. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const handleEditInvestmentPlan = (plan) => {
      setEditPlan(plan.id);
      setFormData({
        planName: plan.planName,
        interestRate: plan.interestRate,
        maxAmount: plan.maxAmount,
        minAmount: plan.minAmount,
        tenure: plan.tenure,
        description: plan.description,
      });
    };

    const handleEditLoanPlan = (plan) => {
      setIsEditingLoan(true);
      setEditPlan(plan.id);
      setFormData({
        planName: plan.loanName,
        interestRate: plan.interestRate,
        maxAmount: plan.maxAmount,
        minAmount: plan.minAmount,
        tenure: plan.tenure,
        description: plan.description,
      });
    };

    const handleSubmitEdit = async (e) => {
      e.preventDefault();
      try {
        if (isEditingLoan) {
          await setDoc(doc(db, 'loanplans', editPlan), {
            ...formData,
            createdBy: user.uid,
          });
          setLoanPlans(prevPlans => prevPlans.map(plan => (plan.id === editPlan ? { ...plan, loanName: formData.planName, ...formData } : plan)));
        } else {
          await setDoc(doc(db, 'investmentplans', editPlan), {
            ...formData,
            createdBy: user.uid,
          });
          setInvestmentPlans(prevPlans => prevPlans.map(plan => (plan.id === editPlan ? { ...plan, ...formData } : plan)));
        }
        setEditPlan(null);
        setIsEditingLoan(false);
        setFormData({
          planName: '',
          interestRate: '',
          maxAmount: '',
          minAmount: '',
          tenure: '',
          description: '',
        });
        toast({
          title: "Plan Updated",
          description: "The plan has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating plan: ", error);
        toast({
          title: "Error",
          description: "Failed to update the plan. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    return (
      <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white">
        <Heading mb={4}>Bank Panel</Heading>
        {user ? <Text>Welcome, {user.email}</Text> : <Text>Please log in to see your investment plans.</Text>}
        
        {/* Display fetched investment plans in a table */}
        <Box mt={4}>
          <Heading size="md" mb={2}>Investment Plans</Heading>
          {investmentPlans.length > 0 ? (
            <Table variant="striped" colorScheme="teal" mt={4}>
              <Thead>
                <Tr>
                  <Th>Plan Name</Th>
                  <Th>Interest Rate (%)</Th>
                  <Th>Max Amount</Th>
                  <Th>Min Amount</Th>
                  <Th>Tenure (months)</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {investmentPlans.map(plan => (
                  <Tr key={plan.id}>
                    <Td>{plan.planName}</Td>
                    <Td>{plan.interestRate}</Td>
                    <Td>{plan.maxAmount}</Td>
                    <Td>{plan.minAmount}</Td>
                    <Td>{plan.tenure}</Td>
                    <Td>{plan.description}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button colorScheme="blue" onClick={() => handleEditInvestmentPlan(plan)}>Edit</Button>
                        <Button colorScheme="red" onClick={() => handleDeleteInvestmentPlan(plan.id)}>Delete</Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No investment plans available.</Text>
          )}
        </Box>

        {/* New section for displaying loan plans */}
        <Box mt={4}>
          <Heading size="md" mb={2}>Loan Plans</Heading>
          {loanPlans.length > 0 ? (
            <Table variant="striped" colorScheme="teal" mt={4}>
              <Thead>
                <Tr>
                  <Th>Loan Name</Th>
                  <Th>Interest Rate (%)</Th>
                  <Th>Max Amount</Th>
                  <Th>Min Amount</Th>
                  <Th>Tenure (months)</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loanPlans.map(plan => (
                  <Tr key={plan.id}>
                    <Td>{plan.loanName}</Td>
                    <Td>{plan.interestRate}</Td>
                    <Td>{plan.maxAmount}</Td>
                    <Td>{plan.minAmount}</Td>
                    <Td>{plan.tenure}</Td>
                    <Td>{plan.description}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button colorScheme="blue" onClick={() => handleEditLoanPlan(plan)}>Edit</Button>
                        <Button colorScheme="red" onClick={() => handleDeleteLoanPlan(plan.id)}>Delete</Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No loan plans available.</Text>
          )}
        </Box>

        {editPlan && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="gray.50">
            <Heading size="md" mb={4}>{isEditingLoan ? "Edit Loan Plan" : "Edit Investment Plan"}</Heading>
            <form onSubmit={handleSubmitEdit}>
              <VStack spacing={4} align="stretch">
                <Input name="planName" value={formData.planName} onChange={(e) => setFormData({ ...formData, planName: e.target.value })} placeholder={isEditingLoan ? "Loan Name" : "Plan Name"} />
                <NumberInput min={0} value={formData.interestRate} onChange={(valueString) => setFormData({ ...formData, interestRate: valueString })}>
                  <NumberInputField placeholder="Interest Rate (%)" />
                </NumberInput>
                <NumberInput min={0} value={formData.maxAmount} onChange={(valueString) => setFormData({ ...formData, maxAmount: valueString })}>
                  <NumberInputField placeholder="Max Amount" />
                </NumberInput>
                <NumberInput min={0} value={formData.minAmount} onChange={(valueString) => setFormData({ ...formData, minAmount: valueString })}>
                  <NumberInputField placeholder="Min Amount" />
                </NumberInput>
                <NumberInput min={1} value={formData.tenure} onChange={(valueString) => setFormData({ ...formData, tenure: valueString })}>
                  <NumberInputField placeholder="Tenure (months)" />
                </NumberInput>
                <Textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
                <Button type="submit" colorScheme="green">Update Plan</Button>
              </VStack>
            </form>
          </Box>
        )}
      </Box>
    );
}
