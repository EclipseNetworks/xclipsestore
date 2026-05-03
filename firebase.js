import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, 
    query, where, orderBy, onSnapshot, updateDoc, addDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7L45jyhdqOoGFw0dXbUrxwtzRiGDKO8M",
    authDomain: "xclipse-store.firebaseapp.com",
    projectId: "xclipse-store",
    storageBucket: "xclipse-store.firebasestorage.app",
    messagingSenderId: "1070875716092",
    appId: "1:1070875716092:web:906720f7589bd1b596aa79"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const handleUserSync = async (user) => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, { 
            username: user.displayName || user.email.split('@')[0], 
            email: user.email, 
            role: "customer", 
            joinedAt: serverTimestamp() 
        });
    }
};

// FULL EXPORT LIST FOR ADMIN AND USER PORTALS
export { 
    db, auth, onAuthStateChanged, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signInWithPopup, GoogleAuthProvider, OAuthProvider,
    collection, query, where, orderBy, onSnapshot, 
    updateDoc, addDoc, deleteDoc, doc, getDoc, setDoc, serverTimestamp
};