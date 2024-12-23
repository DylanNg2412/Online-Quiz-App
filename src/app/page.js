"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Mock Quiz Data
const quizzes = [
  {
    id: 1,
    title: "General Knowledge",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
      },
      {
        question: "Which state is not in Malaysia?",
        options: ["Perlis", "Kelantan", "Sarawak", "Singapore"],
        answer: "Singapore",
      },
      {
        question: "What year did Malaysia become independent?",
        options: ["1945", "1957", "1963", "1970"],
        answer: "1957",
      },
    ],
  },
  {
    id: 2,
    title: "Science",
    questions: [
      {
        question: "What is H2O?",
        options: ["Helium", "Hydrogen", "Water", "Oxygen"],
        answer: "Water",
      },
      {
        question: "At what temperature does water start to boil?",
        options: ["50°C", "100°C", "150°C", "200°C"],
        answer: "100°C",
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Jupiter",
      },
      {
        question: "What is known as the 'powerhouse of the cell'?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
        answer: "Mitochondria",
      },
    ],
  },
];

export default function OnlineQuizApp() {
  const [currentView, setCurrentView] = useState("quizSelection");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  // Load saved progress from local storage on initial render
  useEffect(() => {
    const savedView = localStorage.getItem("currentView");
    const savedQuiz = localStorage.getItem("selectedQuiz");
    const savedIndex = localStorage.getItem("currentQuestionIndex");
    const savedScore = localStorage.getItem("score");
    const savedAnswers = localStorage.getItem("userAnswers");

    if (savedView) setCurrentView(savedView);
    if (savedQuiz) setSelectedQuiz(JSON.parse(savedQuiz));
    if (savedIndex) setCurrentQuestionIndex(Number(savedIndex));
    if (savedScore) setScore(Number(savedScore));
    if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
  }, []);

  // Save progress to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem("currentView", currentView);
    localStorage.setItem("selectedQuiz", JSON.stringify(selectedQuiz));
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    localStorage.setItem("score", score);
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  }, [currentView, selectedQuiz, currentQuestionIndex, score, userAnswers]);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView("quizInterface");
    setScore(0);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  const handleAnswerSubmit = (selectedOption) => {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    setUserAnswers([
      ...userAnswers,
      { ...currentQuestion, selectedOption, isCorrect },
    ]);

    if (isCorrect) setScore(score + 1);

    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentView("scoreSummary");
    }
  };

  const handleRestart = () => {
    setCurrentView("quizSelection");
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Online Quiz App</h1>

      {currentView === "quizSelection" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Select a Quiz</h2>
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="w-full max-w-md hover:shadow-lg transition"
            >
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="primary"
                  onClick={() => handleSelectQuiz(quiz)}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentView === "quizInterface" && selectedQuiz && (
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>
              {`Question ${currentQuestionIndex + 1} of ${
                selectedQuiz.questions.length
              }`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              {selectedQuiz.questions[currentQuestionIndex].question}
            </p>
            <div className="space-y-2">
              {selectedQuiz.questions[currentQuestionIndex].options.map(
                (option) => (
                  <Button
                    key={option}
                    className="w-full"
                    variant="secondary"
                    onClick={() => handleAnswerSubmit(option)}
                  >
                    {option}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* sdjkabdjkazbdja */}

      {currentView === "scoreSummary" && (
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>Score Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              You scored <span className="font-bold">{score}</span> out of{" "}
              {selectedQuiz.questions.length}
            </p>
            <h3 className="text-xl font-semibold mb-2">Review</h3>
            {userAnswers.map((answer, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{answer.question}</p>
                <Badge
                  variant={answer.isCorrect ? "success" : "destructive"}
                  className="mt-1"
                >
                  {answer.isCorrect ? "Correct" : "Incorrect"}
                </Badge>
                <p>
                  <strong>Your Answer:</strong> {answer.selectedOption}
                </p>
                {!answer.isCorrect && (
                  <p>
                    <strong>Correct Answer:</strong> {answer.answer}
                  </p>
                )}
              </div>
            ))}
            <Button
              className="w-full mt-4"
              variant="primary"
              onClick={handleRestart}
            >
              Back to Quiz Selection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
