import React from "react";
import MCQQuestion from "./MCQQuestion";
import SubjectiveQuestion from "./SubjectiveQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import "../styles/question.css";

const QuestionRenderer = ({ question, currentAnswer, onAnswerUpdate }) => {
  if (!question) return null;

  const renderQuestion = () => {
    switch (question.type) {
      case "MCQ":
        return <MCQQuestion questionData={question} value={currentAnswer} onAnswerUpdate={onAnswerUpdate} />;
      case "Subjective":
        return <SubjectiveQuestion questionData={question} value={currentAnswer} onAnswerUpdate={onAnswerUpdate} />;
      case "True/False":
        return <TrueFalseQuestion questionData={question} value={currentAnswer} onAnswerUpdate={onAnswerUpdate} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="question-renderer">
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer;