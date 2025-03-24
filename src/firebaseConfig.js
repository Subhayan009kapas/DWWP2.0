

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtB7SHnpIWOU0NSt_jiRe_OS9g6gp_LzE",
  authDomain: "dwp-5th-sem-project.firebaseapp.com",
  projectId: "dwp-5th-sem-project",
  storageBucket: "dwp-5th-sem-project.firebasestorage.app",
  messagingSenderId: "446965936454",
  appId: "1:446965936454:web:cc584d92bf7c1b39d37547",
  measurementId: "G-5Z2GXCVQTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app); // Initialize auth
const db = getFirestore(app);
const firestore = getFirestore(app);

export { firestore  , auth, db };
