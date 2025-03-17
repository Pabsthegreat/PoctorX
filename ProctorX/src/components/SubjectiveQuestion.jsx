import React, { useState, useEffect, useRef } from "react";
import "../styles/assessment.css";
import { Navigate } from "react-router";


const SubjectiveQuestion = ({ questionData, currentAnswer, onAnswerUpdate, readyTest }) => {
    const { id, questionText } = questionData;
    const [text, setText] = useState(currentAnswer || "");
    const [remainingWarnings, setRemainingWarnings] = useState(2);
    const [warningVisible, setWarningVisible] = useState(false);
    const textAreaRef = useRef(null);

    const handleSubmit = () => {
        // const finalTest = readyTest.map((q) => ({
        //     ...q,
        //     student_answer: answersMap[q.id] || "",
        // }));

        // fetch("http://localhost:3000/api/submit-test", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(finalTest),
        // })
        //     .then((res) => res.json())
        //     .then(() => {
        //         alert("Test submitted successfully!");
        //         Navigate("/")  // Redirect to home page
        //     })
        //     .catch((err) => console.error("Error submitting test:", err));
        window.location.href = '/';
    };

    const showWarning = () => {
        setRemainingWarnings((prev) => {
            if (prev <= 0) return 0; // Prevent negative warnings
            const newWarnings = prev - 1;

            if (newWarnings === 0) {
                setTimeout(() => {
                    alert("Final warning detected. Submitting your test automatically.");
                    handleSubmit();
                }, 1000);
            }

            return newWarnings;
        });

        setWarningVisible(true);  // Show warning modal
    };

    useEffect(() => {
        setText(currentAnswer || "");
    }, [currentAnswer]);

    const handleChange = (e) => {
        setText(e.target.value);
        onAnswerUpdate(id, e.target.value);
    };

    useEffect(() => {
        let warningIssued = false; // Prevent multiple warnings on one key press

        const handleKeydown = (event) => {
            if (textAreaRef.current && event.target !== textAreaRef.current && !warningIssued) {
                warningIssued = true;
                showWarning();
                setTimeout(() => (warningIssued = false), 1000); // Delay to prevent multiple triggers
            }
        };

        const handleFocus = (event) => {
            if (event.target === textAreaRef.current) {
                setWarningVisible(false); // Hide warning when back in textarea
            }
        };

        document.addEventListener("keydown", handleKeydown);
        document.addEventListener("focusin", handleFocus);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
            document.removeEventListener("focusin", handleFocus);
        };
    }, []);  // Removed `remainingWarnings` dependency to prevent redundant re-renders

    return (
        <div className="subjective-question">
            <h3>{questionText}</h3>
            <textarea
                ref={textAreaRef}
                value={text}
                onChange={handleChange}
                placeholder="Type your answer here..."
                rows="10"
                cols="50"
            />

            {/* Warning Modal */}
            {warningVisible && (
                <div className="warning-modal">
                    <h2>⚠️ Warning!</h2>
                    <p>
                        Suspicious activity detected! {remainingWarnings} warning
                        {remainingWarnings === 1 ? "" : "s"} left.
                    </p>
                    <button onClick={() => setWarningVisible(false)}>OK</button>
                </div>
            )}
        </div>
    );
};

export default SubjectiveQuestion;
