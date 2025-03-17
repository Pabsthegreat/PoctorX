import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import TestParticipants from "./TestParticipants";

const AdminTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.email;
    if (!adminId) {
      console.error("❌ No admin found. Please log in.");
      return;
    }

    const testListRef = collection(db, "admins", adminId, "test_list");
    
    const unsubscribe = onSnapshot(testListRef, async (snapshot) => {
      const fetchedTests = await Promise.all(
        snapshot.docs.map(async (doc) => {
          return {
            id: doc.id,
            name: doc.id, // Modify if needed
          };
        })
      );
      setTests(fetchedTests);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="admin-tests-container">
      <h2>Admin's Tests</h2>
      {tests.length > 0 ? (
        tests.map((test) => (
          <div key={test.id} className="test-card">
            <h3>{test.name}</h3>
            <TestParticipants testId={test.id} />
          </div>
        ))
      ) : (
        <p>No tests available.</p>
      )}
    </div>
  );
};

export default AdminTests;
