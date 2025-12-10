"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function TakeQuiz() {
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
    const [answers, setAnswers] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [attempt, setAttempt] = useState<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    const currentUser = state.accountReducer?.currentUser;
    const isFaculty = currentUser?.role?.toLowerCase() === "faculty";

    useEffect(() => {
        // Detect page reload and redirect to quizzes list (students only)
        const sessionKey = `quiz_active_${qid}`;
        
        if (!isFaculty && !showResults) {
            const wasLoaded = sessionStorage.getItem(sessionKey);
            
            if (wasLoaded) {
                sessionStorage.removeItem(sessionKey);
                router.push(`/Courses/${cid}/Quizzes`);
                return;
            }
            
            sessionStorage.setItem(sessionKey, 'true');
            
            return () => {
                sessionStorage.removeItem(sessionKey);
            };
        }
    }, [cid, qid, isFaculty, showResults, router]);

    useEffect(() => {
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid]);

    const loadQuiz = async () => {
        if (!qid) return;
        
        try {
            const quizData = await client.findQuizById(String(qid));
            
            if (!isFaculty && !quizData.published) {
                alert("This quiz is not yet published");
                router.push(`/Courses/${cid}/Quizzes`);
                return;
            }
            
            // Check if quiz is past due date (students only)
            if (!isFaculty && quizData.dueDate) {
                const now = new Date();
                const dueDate = new Date(quizData.dueDate);
                if (now > dueDate) {
                    alert("This quiz is past its due date and can no longer be accessed");
                    router.push(`/Courses/${cid}/Quizzes`);
                    return;
                }
            }
            
            setQuiz(quizData);

            let questionsData = await client.findQuestionsForQuiz(String(qid));
            
            // Shuffle answers for each question if enabled (for students only)
            if (!isFaculty && quizData.shuffleAnswers) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                questionsData = questionsData.map((q: any) => {
                    if (q.choices && q.choices.length > 0) {
                        return { ...q, choices: shuffleArray(q.choices) };
                    }
                    return q;
                });
            }
            
            setQuestions(questionsData);
            
            // Initialize empty answers
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const initialAnswers = questionsData.map((q: any) => ({
                question: q._id,
                answer: ""
            }));
            setAnswers(initialAnswers);

            // Start a new attempt for students only
            if (!isFaculty && currentUser?._id) {
                try {
                    const newAttempt = await client.startAttempt(String(qid), currentUser._id);
                    setAttempt(newAttempt);
                } catch (error) {
                    console.error("Failed to start attempt:", error);
                    alert("Failed to start quiz attempt. You may have exceeded the maximum attempts.");
                    router.push(`/Courses/${cid}/Quizzes/${qid}`);
                    return;
                }
            }
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error loading quiz: ${error.response?.data?.message || error.message || 'Unknown error'}`);
            router.push(`/Courses/${cid}/Quizzes`);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAnswerChange = (value: any) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = {
            question: questions[currentQuestionIndex]._id,
            answer: value,
        };
        setAnswers(newAnswers);

        // Auto-save for students
        if (attempt && !isFaculty) {
            client.saveAnswers(attempt._id, newAnswers);
        }
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

    const handleSubmit = async () => {
        const ok = window.confirm(isFaculty ? "Submit quiz preview?" : "Submit quiz?");
        if (!ok) return;

        try {
            if (isFaculty) {
                // Faculty preview - calculate score locally
                let calculatedScore = 0;

                questions.forEach((question, idx) => {
                    const answer = answers[idx];
                    let isCorrect = false;

                    if (question.type === "MULTIPLE_CHOICE") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const selected = question.choices.find((c: any) => c.text === answer.answer);
                        isCorrect = selected?.isCorrect || false;
                    } else if (question.type === "TRUE_FALSE") {
                        isCorrect = answer.answer === question.correctAnswer;
                    } else if (question.type === "FILL_IN_BLANK") {
                        const userAnswer = String(answer.answer || "").toLowerCase().trim();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        isCorrect = question.choices.some((choice: any) => 
                            choice.isCorrect && choice.text.toLowerCase().trim() === userAnswer
                        );
                    }

                    if (isCorrect) calculatedScore += question.points;
                });
                
                setScore(calculatedScore);
            } else {
                // Student - submit to backend
                if (!attempt || !attempt._id) {
                    alert("No active quiz attempt found. Please try again.");
                    router.push(`/Courses/${cid}/Quizzes/${qid}`);
                    return;
                }

                const result = await client.submitAttempt(attempt._id, answers);
                setScore(result.score);
            }

            setShowResults(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error submitting quiz: ${error.message || 'Unknown error'}`);
        }
    };

    if (!quiz || !questions.length) {
        return <div className="p-3">Loading quiz...</div>;
    }

    if (showResults) {
        return (
            <div className="p-3">
                <h3>{isFaculty ? "Preview Results" : "Quiz Submitted"}</h3>
                <div className="alert alert-success mt-3">
                    <h5>Your Score: {score} out of {quiz.points}</h5>
                    <p className="mb-0">
                        Percentage: {Math.round((score / quiz.points) * 100)}%
                    </p>
                </div>

                {isFaculty && (
                    <div className="alert alert-info">
                        <strong>Preview Mode:</strong> This is a preview only. Results are not saved.
                    </div>
                )}

                {!isFaculty && (
                    <div className="alert alert-success">
                        Your quiz has been submitted successfully! You can view your attempt history on the quiz details page.
                    </div>
                )}

                <div className="d-flex gap-2">
                    {isFaculty && (
                        <button className="btn btn-primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}>
                            Edit Quiz
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
                        {isFaculty ? "Back to Quiz" : "View Details"}
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    return (
        <div className="p-3">
            {isFaculty && (
                <div className="alert alert-warning">
                    <strong>Preview Mode:</strong> You are previewing this quiz. Your answers will not be saved.
                </div>
            )}

            <h4>{quiz.title}</h4>

            <div className="row mt-3">
                <div className="col-md-9">
                    <div className="border rounded p-3">
                        <h5>Question {currentQuestionIndex + 1} of {questions.length}</h5>
                        <div className="mb-3"><strong>{currentQuestion.points} pts</strong></div>
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
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={currentAnswer?.answer || ""} 
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Type your answer here"
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
                                <button className="btn btn-success" onClick={handleSubmit}>
                                    Submit Quiz
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleNext}>
                                    Next
                                </button>
                            )}
                        </div>
                    </div>

                    {!isFaculty && (
                        <div className="text-center mt-3">
                            <small className="text-muted">
                                Your answers are being saved automatically
                            </small>
                        </div>
                    )}
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
                                            : answers[idx]?.answer
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