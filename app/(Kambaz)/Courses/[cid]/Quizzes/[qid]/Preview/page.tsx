"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";

export default function PreviewQuiz() {
    const params = useParams() as { cid?: string; qid?: string };
    const cid = params.cid ? decodeURIComponent(String(params.cid)) : "";
    const qid = params.qid ? decodeURIComponent(String(params.qid)) : "";
    
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [quiz, setQuiz] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [previewAnswers, setPreviewAnswers] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [previewScore, setPreviewScore] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    const currentUser = state.accountReducer?.currentUser;
    const isFaculty = currentUser?.role?.toLowerCase() === "faculty";

    useEffect(() => {
        loadQuiz();
    }, [qid]);

    useEffect(() => {
        if (!quiz || !startTime) return;
        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
            const remaining = quiz.timeLimit * 60 - elapsed;
            if (remaining <= 0) {
                handleSubmitPreview();
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [quiz, startTime]);

    const loadQuiz = async () => {
        if (!qid) return;
        const quizData = await client.findQuizById(String(qid));
        setQuiz(quizData);

        const questionsData = await client.findQuestionsForQuiz(String(qid));
        setQuestions(questionsData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPreviewAnswers(questionsData.map((q: any) => ({ question: q._id, answer: "" })));
        setStartTime(new Date());
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAnswerChange = (value: any) => {
        const newAnswers = [...previewAnswers];
        newAnswers[currentQuestionIndex] = {
            question: questions[currentQuestionIndex]._id,
            answer: value,
        };
        setPreviewAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitPreview = () => {
        let score = 0;
        questions.forEach((question, idx) => {
            const answer = previewAnswers[idx];
            let isCorrect = false;

            if (question.type === "MULTIPLE_CHOICE") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const selected = question.choices.find((c: any) => c.text === answer.answer);
                isCorrect = selected?.isCorrect || false;
            } else if (question.type === "TRUE_FALSE") {
                isCorrect = answer.answer === question.correctAnswer;
            } else if (question.type === "FILL_IN_BLANK") {
                const answerLower = String(answer.answer).toLowerCase().trim();
                isCorrect = question.choices.some(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (c: any) => c.isCorrect && c.text.toLowerCase().trim() === answerLower
                );
            }

            if (isCorrect) score += question.points;
        });

        setPreviewScore(score);
        setShowResults(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!quiz || !questions.length) {
        return <div className="p-3">Loading quiz preview...</div>;
    }

    if (showResults) {
        return (
            <div className="p-3">
                <h3>Preview Results</h3>
                <div className="alert alert-info mt-3">
                    <h5>Score: {previewScore} out of {quiz.points}</h5>
                    <p>This is a preview. Results are not saved.</p>
                </div>

                <div className="mt-4">
                    {questions.map((question, idx) => {
                        const answer = previewAnswers[idx];
                        let isCorrect = false;

                        if (question.type === "MULTIPLE_CHOICE") {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const selected = question.choices.find((c: any) => c.text === answer.answer);
                            isCorrect = selected?.isCorrect || false;
                        } else if (question.type === "TRUE_FALSE") {
                            isCorrect = answer.answer === question.correctAnswer;
                        } else if (question.type === "FILL_IN_BLANK") {
                            const answerLower = String(answer.answer).toLowerCase().trim();
                            isCorrect = question.choices.some(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (c: any) => c.isCorrect && c.text.toLowerCase().trim() === answerLower
                            );
                        }

                        return (
                            <div key={question._id} className="border rounded p-3 mb-3">
                                <div className="d-flex justify-content-between">
                                    <h6>
                                        Question {idx + 1}{" "}
                                        {isCorrect ? (
                                            <span className="text-success">✓</span>
                                        ) : (
                                            <span className="text-danger">✗</span>
                                        )}
                                    </h6>
                                    <span>{question.points} pts</span>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                <div className="mt-2">
                                    <strong>Your Answer:</strong> {String(answer?.answer)}
                                </div>
                                {!isCorrect && (
                                    <div className="mt-2 text-muted">
                                        <strong>Correct Answer: </strong>
                                        {question.type === "MULTIPLE_CHOICE" &&
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            question.choices.find((c: any) => c.isCorrect)?.text}
                                        {question.type === "TRUE_FALSE" && String(question.correctAnswer)}
                                        {question.type === "FILL_IN_BLANK" &&
                                            question.choices
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                .filter((c: any) => c.isCorrect)
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                .map((c: any) => c.text)
                                                .join(", ")}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => router.push(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor`)}
                >
                    Edit Quiz
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = previewAnswers[currentQuestionIndex];

    return (
        <div className="p-3">
            <div className="alert alert-warning">
                <strong>Preview Mode:</strong> You are previewing this quiz. Your answers will not be saved.
            </div>

            <h4>{quiz.title}</h4>
            {startTime && (
                <div className="mb-3">
                    <strong>Time Remaining:</strong>{" "}
                    <span className={timeLeft < 300 ? "text-danger" : ""}>{formatTime(timeLeft)}</span>
                </div>
            )}

            <div className="row mt-3">
                <div className="col-md-9">
                    <div className="border rounded p-3">
                        <h5>Question {currentQuestionIndex + 1} of {questions.length}</h5>
                        <div className="mb-3">
                            <strong>{currentQuestion.points} pts</strong>
                        </div>
                        <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

                        {currentQuestion.type === "MULTIPLE_CHOICE" && (
                            <div>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {currentQuestion.choices?.map((choice: any, idx: number) => (
                                    <div key={idx} className="form-check mb-2">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            checked={currentAnswer?.answer === choice.text}
                                            onChange={() => handleAnswerChange(choice.text)}
                                        />
                                        <label className="form-check-label">{choice.text}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === "TRUE_FALSE" && (
                            <div>
                                <div className="form-check mb-2">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        checked={currentAnswer?.answer === true}
                                        onChange={() => handleAnswerChange(true)}
                                    />
                                    <label className="form-check-label">True</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        checked={currentAnswer?.answer === false}
                                        onChange={() => handleAnswerChange(false)}
                                    />
                                    <label className="form-check-label">False</label>
                                </div>
                            </div>
                        )}

                        {currentQuestion.type === "FILL_IN_BLANK" && (
                            <div>
                                <label className="form-label">Your Answer</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={currentAnswer?.answer || ""}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="btn btn-light border"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button className="btn btn-success" onClick={handleSubmitPreview}>
                                    Submit Preview
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleNext}>
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="border rounded p-3">
                        <h6>Questions</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {questions.map((q: any, idx: number) => (
                                <button
                                    key={q._id}
                                    className={`btn btn-sm ${
                                        idx === currentQuestionIndex
                                            ? "btn-primary"
                                            : previewAnswers[idx]?.answer
                                            ? "btn-success"
                                            : "btn-outline-secondary"
                                    }`}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}