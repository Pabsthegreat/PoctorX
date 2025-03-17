import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig"; // Ensure Firebase is initialized
import bcrypt from "bcryptjs";

const RegisterStudent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testid, setTestid] = useState("");
  const navigate = useNavigate();
  const db = getFirestore(app);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !testid) {
      alert("Please enter email, password, and test ID.");
      return;
    }

    try {
      const studentRef = doc(db, "students", email); // Use email as document ID
      const docSnap = await getDoc(studentRef);

      if (docSnap.exists()) {
        alert("This email is already registered. Please use a different email.");
        return;
      }

      // Encrypt password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // ✅ Save student with custom ID (email)
      setDoc(studentRef, {
        email,
        password: hashedPassword, // Store encrypted password
        testid: testid,
        active: false,
        risk_score: 0,
        login_time: null,
        logout_time: null,
      });

      // ✅ Add student to the "student_list" inside the test
      const studentListRef = doc(db, "tests", testid, "student_list", email);
      await setDoc(studentListRef, {
        email,
        registeredAt: new Date(),
      });

      alert("Student registered successfully!");
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert("Error registering student. Please try again.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", width: "500px" }}>
        <div className="register">Student Registration</div>

        {/* Email Input */}
        <div className="email">
          <label style={{ marginRight: "10px" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
            placeholder="Student Email"
          />
        </div>

        {/* Password Input */}
        <div className="password">
          <label style={{ marginRight: "10px" }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
            placeholder="Password"
          />
        </div>

        {/* Test ID Input */}
        <div className="testid">
          <label style={{ marginRight: "10px" }}>Test ID:</label>
          <input
            type="text"
            value={testid}
            onChange={(e) => setTestid(e.target.value)}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
            placeholder="Test ID"
          />
        </div>

        {/* Register Button */}
        <button type="submit" style={{ padding: "8px", cursor: "pointer" }}>Register Student</button>
      </form>
    </div>
  );
};

export default RegisterStudent;
