import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addUser = async (email, password, role) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        await addDoc(collection(db, role === "admin" ? "admins" : "students"), {
            email,
            password: hashedPassword,
        });

        console.log(`User ${email} added as ${role}!`);
    } catch (error) {
        console.error("Error adding user:", error);
    }
};


