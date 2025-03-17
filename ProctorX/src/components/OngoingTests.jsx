import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/ongoingtests.css"; // Ensure CSS is applied

const OngoingTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.email;
    if (!adminId) {
      console.error("❌ No admin found. Please log in.");
      return;
    }

    // Listen to changes in the test list in real-time
    const testListRef = collection(db, "admins", adminId, "test_list");
    const unsubscribeTests = onSnapshot(testListRef, (testSnapshot) => {
      const testData = testSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.id,
        status: doc.data().active ? "Ongoing" : "Active",
      }));

      // Update tests state and set up listeners for students
      setTests(testData);
    });

    return () => unsubscribeTests(); // Cleanup listener when component unmounts
  }, []);

  return (
    <div className="tests-container">
      {tests.length > 0 ? (
        tests.map((test) => (
          <TestParticipants key={test.id} testId={test.id} testName={test.name} status={test.status} />
        ))
      ) : (
        <p>No ongoing tests available.</p>
      )}
    </div>
  );
};

// Sub-component to track real-time student updates per test
const TestParticipants = ({ testId, testName, status }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentListRef = collection(db, "tests", testId, "student_list");
    const studentRef=collection(db,"students");
    //listen to changes in students collection
    const unsubscribeStudents = onSnapshot(studentListRef, (studentSnapshot) => {
      const studentData = studentSnapshot.docs.map((studentDoc) => ({
        email: studentDoc.id,
        riskScore: studentDoc.data().risk_score,
        active: studentDoc.data().active ? "Active" : "Inactive",
      }));

      setStudents(studentData);
    });

    return () => unsubscribeStudents(); // Cleanup listener when component unmounts
  }, [testId]);

  return (
    <div className="test-card">
      <h3>{testName}</h3>
      <p className={`status ${status.toLowerCase()}`}>Status: {status}</p>
      <h4>Registered Students:</h4>
      <ul>
        {students.length > 0 ? (
          students.map((student) => (
            <li key={student.email}>
              <strong>{student.email}</strong> 
              {/* - Risk Score: {student.riskScore} - Status: {student.active} */}
            </li>
          ))
        ) : (
          <p>No students registered.</p>
        )}
      </ul>
    </div>
  );
};

export default OngoingTests;
