import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, query, where, doc, setDoc, Timestamp } from 'firebase/firestore';
import QuestionRenderer from "./QuestionRender";
import { db } from "../firebaseConfig";
import Sidebar from "./Sidebar";
import Timer from "./Timer";
import "../styles/assessment.css";
import Chatsupport from "./chatsupport";

const enterFullScreen = () => {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }
};

window.addEventListener(
  "click",
  () => {
    enterFullScreen();
  },
  { once: true }
);

const Assessment = () => {
  const [readyTest, setReadyTest] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [warningVisible, setWarningVisible] = useState(false);
  const [remainingWarnings, setRemainingWarnings] = useState(1);
  const [currentTime, setCurrentTime] = useState("");
  const [riskScore, setRiskScore] = useState(0); // Added from code 1
  const navigate = useNavigate();
  const testDuration = 7200; // 2 hours in seconds

  // check admin side
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("user"));
    const testid = user.testid;
    fetch("http://localhost:3000/api/ready-test?testid2="+testid)
      .then((res) => res.json())
      .then((data) => {
        setReadyTest(data);
        const initialAnswers = {};
        data.forEach((q) => {
          initialAnswers[q.id] = q.student_answer || "";
        });
        setAnswersMap(initialAnswers);
      })
      .catch((err) => console.error("Error fetching ready test:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  // Handle test submission - keeping code 2's implementation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

      const testRef = doc(db, "students", user.email);
      setDoc(testRef, {
          logout_time: Timestamp.now(),
          active: false, // ✅ Stores the current timestamp
        }, { merge: true });
  

    const finalTest = readyTest.map((q) => ({
        ...q,
        student_answer: answersMap[q.id] || "", // Ensure correct mapping
    }));

    console.log("📤 Submitting test:", finalTest);
    finalTest.unshift({mail: user.email});
    finalTest.unshift({testid: user.testid});

    console.log("📤 Submitting test 2:", finalTest);
    fetch("http://localhost:3000/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({answer:finalTest,}),
    })

      .then(() => {
        alert("Test submitted successfully!");
        navigate("/");
    })
    .catch((err) => {
        console.error("❌ Error submitting test:", err);
        alert("Failed to submit test. Please try again.");
    })
    .finally(() => setIsSubmitting(false));
};


  

  

  const handleTimeUp = () => {
    alert("Time is up! Auto-submitting test.");
    handleSubmit();
  };

  const showWarning = () => {
    if (remainingWarnings > 0) {
      setWarningVisible(true);
      setRemainingWarnings((prev) => prev - 1);
      if (remainingWarnings === 1) handleSubmit();
    }
  };


  // Added risk scoring from code 1
  useEffect(() => {
    let mouseMovements = 0;
    let keyPresses = 0;
    let lastMouseTime = Date.now();
    let lastKeyTime = Date.now();

    const trackMouse = () => {
      const now = Date.now();
      if (now - lastMouseTime < 100) {
        mouseMovements += 1;
      }
      lastMouseTime = now;
    };

    const trackKeyPress = () => {
      const now = Date.now();
      if (now - lastKeyTime < 50) {
        keyPresses += 1;
      }
      lastKeyTime = now;
    };

    const calculateRiskScore = () => {
      let score = 0;
      if (mouseMovements > 10) score += 10;
      if (keyPresses > 20) score += 15;
      setRiskScore(score);
      const user=JSON.parse(localStorage.getItem("user"));
      const testid = user.testid;
      const testRef = doc(db, "students", user.email);
      setDoc(testRef, {
          risk_score: score,
        }, { merge: true });

      if (score >= 30) {
        alert("Suspicious activity detected! You are being logged out.");
        navigate("/");
      }

      mouseMovements = 0;
      keyPresses = 0;
    };

    document.addEventListener("mousemove", trackMouse);
    document.addEventListener("keydown", trackKeyPress);
    const interval = setInterval(calculateRiskScore, 5000);

    return () => {
      document.removeEventListener("mousemove", trackMouse);
      document.removeEventListener("keydown", trackKeyPress);
      clearInterval(interval);
    };
  }, [navigate]);

  // Prevent cheating + force fullscreen (enhanced with code 1 features)
  useEffect(() => {
    let mouseMovements = 0;
    let keyPresses = 0;
    let lastMouseTime = Date.now();
    let lastKeyTime = Date.now();

    const trackMouse = () => {
      const now = Date.now();
      if (now - lastMouseTime < 100) {
        mouseMovements += 1;
      }
      lastMouseTime = now;
    };

    const trackKeyPress = () => {
      const now = Date.now();
      if (now - lastKeyTime < 50) {
        keyPresses += 1;
      }
      lastKeyTime = now;
    };

    const calculateRiskScore = () => {
      let score = 0;
      if (mouseMovements > 10) score += 10;
      if (keyPresses > 20) score += 15;
      setRiskScore(score);

      fetch("http://localhost:3000/api/update-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riskScore: score }),
      });

      if (score >= 30) {
        alert("Suspicious activity detected! You are being logged out.");
        navigate("/");
      }

      mouseMovements = 0;
      keyPresses = 0;
    };

    document.addEventListener("mousemove", trackMouse);
    document.addEventListener("keydown", trackKeyPress);
    const interval = setInterval(calculateRiskScore, 5000);

    return () => {
      document.removeEventListener("mousemove", trackMouse);
      document.removeEventListener("keydown", trackKeyPress);
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    const checkFullscreen = () => {
      if (!document.fullscreenElement) {
        showWarning();
        enterFullScreen();
      }
    };

    const preventActions = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        const blockedKeys = ["c", "v", "x", "a", "u", "i", "s", "p", "T", "F5"];
        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
          showWarning();
        }
      }
      if (event.key === "Escape" || event.altKey) {
        event.preventDefault();
        showWarning();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        showWarning();
      }
    };

    // Block right-click, shortcuts & visibility change
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", preventActions);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    //enterFullScreen();

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [remainingWarnings]);

  // Format timer - keeping this as a component within the Assessment component

  return (
    <div className="assessment-container">
      {warningVisible && (
        <div className="warning-modal">
          <h2>Warning!</h2>
          <p>
            Suspicious activity detected! {remainingWarnings} warnings left.
          </p>
          <button onClick={() => setWarningVisible(false)}>OK</button>
        </div>
      )}

      <div className="assessment-header">
        <Timer duration={testDuration} onTimeUp={handleTimeUp} />
        <p>Risk Score: {riskScore}</p> {/* Added from code 1 */}
      </div>

      <div className="assessment-body">
        <Sidebar
          questions={readyTest}
          answersMap={answersMap}
          currentIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
        {readyTest.length > 0 && (
          <QuestionRenderer
            question={readyTest[currentQuestionIndex]}
            currentAnswer={answersMap[readyTest[currentQuestionIndex].id] || ""}
            onAnswerUpdate={(id, answer) => {
              setAnswersMap((prev) => {
                const updatedAnswers = { ...prev, [id]: answer };
                console.log("Updated Answers Map:", updatedAnswers); // ✅ Console log the updated state
                return updatedAnswers;
              });
            }}
          />
        )}
      </div>

      <div className="assessment-footer">
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentQuestionIndex === 0}
        >
          Back
        </button>
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, readyTest.length - 1)
            )
          }
          disabled={currentQuestionIndex === readyTest.length - 1}
        >
          Next
        </button>
        <button onClick={handleSubmit}>Submit Test</button>
      </div>
      <br />
      <br />
      <Chatsupport isAdmin={isAdmin} />
    </div>
  );
};

export default Assessment;
