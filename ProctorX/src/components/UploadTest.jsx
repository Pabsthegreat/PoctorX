import { useState } from "react";
import axios from "axios";
import "../styles/uploadtest.css";
import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";

const UploadTest = () => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [message, setMessage] = useState("");
  const [testid2, setTestid] = useState("");
  const handleTestid = (e) => {
    setTestid(e.target.value);
  }
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setMessage("❌ Invalid file format. Please upload a PDF.");
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("❌ File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile)); // Generate preview URL
    setMessage(""); // Clear previous messages
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("http://localhost:3000/upload?testid2="+testid2, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        body: JSON.stringify({testid2: testid2}),
      });
      
        const user = JSON.parse(localStorage.getItem("user"));
        const adminId = user?.email;
        if (!adminId) {
            setMessage("❌ No admin found. Please log in again.");
            return;
        }

        // ✅ Update Firestore under specific admin
        await updateTestList(adminId, testid2);
      setMessage("✅ Upload successful! You can now edit the test.");
      setFileURL(null); // Clear preview after upload
    } catch (error) {
      setMessage("❌ Upload failed. Please check your network.");
    }
  };
  const updateTestList = async (adminId, testid2) => {
    try {
        // ✅ Reference the "test_list" collection inside the specific admin's document
        const testListRef = doc(db, "admins", adminId, "test_list", testid2);
        const testRef = doc(db, "tests", testid2);
        await setDoc(testRef, { active: false });
        // ✅ Store test ID as a document (instead of an array)
        await setDoc(testListRef, { uploadedAt: new Date() });

        console.log(`✅ Test ID ${testid2} added for Admin ${adminId}`);
    } catch (error) {
        console.error("❌ Failed to update test ID list:", error);
    }
};


  return (
    <div className="upload-container">
      <h2>Upload a Test</h2>
      <input type="text" placeholder="Enter test ID" onChange={handleTestid}/>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      
      {/* Show preview only if a file is selected */}
      {fileURL && (
        <div className="pdf-preview">
          <iframe src={fileURL} width="100%" height="400px"></iframe>
        </div>
      )}

      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default UploadTest;
