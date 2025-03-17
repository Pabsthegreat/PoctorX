import React, { useState, useEffect } from "react";
import "../styles/mcq.css";

const MCQQuestion = ({ questionData, currentAnswer, onAnswerUpdate }) => {
  const { id, questionText, options } = questionData;
  const [selectedOption, setSelectedOption] = useState(currentAnswer || "");

  useEffect(() => {
    setSelectedOption(currentAnswer || "");
  }, [currentAnswer]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    onAnswerUpdate(id, e.target.value);
  };

  return (
    <div className="mcq-question">
      <h3>{questionText}</h3>
      {options
        .filter(option => option.trim() !== "") // Remove empty options
        .map((option, i) => (
          <label key={i}>
            <input
              type="radio"
              name={`question-${id}`}
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
            />
            {option}
          </label>
        ))}
    </div>
  );
};

export default MCQQuestion;