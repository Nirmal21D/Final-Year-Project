import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2SwDl2pvesfyRpAjOR_dXks_v1OPJxEc",  
  authDomain: "fir-database-49447.firebaseapp.com",
  projectId: "fir-database-49447",
  storageBucket: "fir-database-49447.appspot.com",
  messagingSenderId: "853196422660",
  appId: "1:853196422660:web:10a36f54a8c9c286367f51",
  measurementId: "G-G3VRDVQ7Y3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Function to add user data
const addUser = async (email, firstName, lastName, username) => {
  try {
    const userData = {
      email,
      firstName,
      lastName,
      username,
    };

    const userRef = doc(collection(db, 'users'));
    await setDoc(userRef, userData);

    console.log('User added successfully!');
  } catch (error) {
    console.error('Error adding user: ', error);
  }
};

// Function to add bank data
const addBank = async (bankEmail, bankName, bankPassword, ifscCode) => {
  try {
    const bankData = {
      bankEmail,
      bankName,
      bankPassword, // Note: Do not store passwords in plain text in production
      ifscCode,
      createdAt: new Date(),
    };

    const bankRef = doc(collection(db, 'banks'));
    await setDoc(bankRef, bankData);

    console.log('Bank added successfully!');
  } catch (error) {
    console.error('Error adding bank: ', error);
  }
};

// Function to handle Google sign-in
const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Add user to Firestore if it doesn't exist
    await addUser(user.email, user.displayName, '', user.uid);
  } catch (error) {
    console.error('Error during Google sign-in: ', error);
  }
};

// Function to create a new user with email and password
const createNewUser = async (email, password, firstName, lastName, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore
    await addUser(email, firstName, lastName, username);
  } catch (error) {
    console.error('Error creating new user: ', error);
  }
};

// Export everything
export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  addUser,
  addBank,
  handleGoogleSignIn,
  createNewUser,
};
