import React, { useState, useEffect } from "react";

const TrueFalseQuestion = ({ questionData, currentAnswer, onAnswerUpdate }) => {
  const { id, questionText } = questionData;
  const [selectedOption, setSelectedOption] = useState(currentAnswer || "");

  useEffect(() => {
    setSelectedOption(currentAnswer || "");
  }, [currentAnswer]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    onAnswerUpdate(id, e.target.value);
  };

  return (
    <div className="true-false-question">
      <h3>{questionText}</h3>
      <label>
        <input
          type="radio"
          name={`question-${id}`}
          value="True"
          checked={selectedOption === "True"}
          onChange={handleChange}
        />
        True
      </label>
      <label>
        <input
          type="radio"
          name={`question-${id}`}
          value="False"
          checked={selectedOption === "False"}
          onChange={handleChange}
        />
        False
      </label>
    </div>
  );
};

export default TrueFalseQuestion;