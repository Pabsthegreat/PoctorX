import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, onSnapshot, doc, getDoc } from "firebase/firestore";
import "../styles/ongoingtests.css"; // Ensure CSS is applied

const TestParticipants = ({ testId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentListRef = collection(db, "tests", testId, "student_list");

    const fetchStudentData = async (studentIds) => {
      const fetchedStudents = await Promise.all(
        studentIds.map(async (studentId) => {
          const studentRef = doc(db, "students", studentId);
          const studentSnap = await getDoc(studentRef);
          if (studentSnap.exists()) {
            const data = studentSnap.data();
            console.log(data);
            return {
              email: studentId,
              loginTime: data.login_time || "N/A",
              logoutTime: data.logout_time || "N/A",
              riskScore: data.risk_score,
            };
          } else {
            return { email: studentId, loginTime: "N/A", logoutTime: "N/A", riskScore: "N/A" };
          }
        })
      );
      setStudents(fetchedStudents);
    };

    const unsubscribe = onSnapshot(studentListRef, (snapshot) => {
      const studentIds = snapshot.docs.map((doc) => doc.id);
      fetchStudentData(studentIds);
    });

    return () => unsubscribe();
  }, [testId]);

  return (
    <div className="test-participants">
      <h4>Registered Students:</h4>
      <ul>
        {students.length > 0 ? (
          students.map((student) => (
            <li key={student.email}>
  {student.email} - Login:{" "}
  {student.loginTime !== "N/A"
    ? new Date(student.loginTime.seconds * 1000).toLocaleTimeString("en-US", { hour12: false })
    : "N/A"}
  , Logout:{" "}
  {student.logoutTime !== "N/A"
    ? new Date(student.logoutTime.seconds * 1000).toLocaleTimeString("en-US", { hour12: false })
    : "N/A"}
  , Risk Score: {student.riskScore}
</li>

          ))
        ) : (
          <p>No students registered.</p>
        )}
      </ul>
    </div>
  );
};

export default TestParticipants;
