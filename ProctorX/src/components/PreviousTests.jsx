import React from "react";
import "../styles/PreviousTests.css";
const PreviousTests = () => {
    const pastTests = [
      { id: 1, name: "History Exam", date: "Feb 20, 2025" },
      { id: 2, name: "Physics Test", date: "Jan 15, 2025" },
    ];
  
    return (
      <div className="tests-container">
      <h2 className="header">Previous Tests</h2>
      {pastTests.map((test) => (
        <div key={test.id} className="test-card">
        <h3>{test.name}</h3>
        <p>Date: {test.date}</p>
        </div>
      ))}
      </div>
    );
  };
  
  export default PreviousTests;
  