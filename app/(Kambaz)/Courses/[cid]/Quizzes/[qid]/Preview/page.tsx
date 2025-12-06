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
    const [answers, setAnswers] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [attempt, setAttempt] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userAttempts, setUserAttempts] = useState<any[]>([]);
    const [canTakeQuiz, setCanTakeQuiz] = useState(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    const currentUser = state.accountReducer?.currentUser;
    const isFaculty = currentUser?.role?.toLowerCase() === "faculty";

    useEffect(() => {
        loadQuizAndCheckAttempts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid]);

    useEffect(() => {
        if (!quiz || !startTime || isFaculty) return;
        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
            const remaining = quiz.timeLimit * 60 - elapsed;
            if (remaining <= 0) {
                // Time expired - show alert and auto-submit after 2 seconds
                alert("Time's up! Your quiz will be submitted automatically.");
                setTimeout(() => {
                    handleSubmit(true); // true = skip confirmation
                }, 2000);
                clearInterval(timer);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quiz, startTime]);

    const loadQuizAndCheckAttempts = async () => {
        if (!qid) return;
        
        try {
            const quizData = await client.findQuizById(String(qid));
            
            if (!isFaculty && !quizData.published) {
                alert("This quiz is not yet published");
                router.push(`/Courses/${cid}/Quizzes`);
                return;
            }
            
            setQuiz(quizData);

            const questionsData = await client.findQuestionsForQuiz(String(qid));
            setQuestions(questionsData);
            
            // Pre-fill answers for faculty preview
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const initialAnswers = questionsData.map((q: any) => {
                if (isFaculty) {
                    // Pre-fill correct answers for faculty
                    if (q.type === "MULTIPLE_CHOICE") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const correctChoice = q.choices?.find((c: any) => c.isCorrect);
                        return { question: q._id, answer: correctChoice?.text || "" };
                    } else if (q.type === "TRUE_FALSE") {
                        return { question: q._id, answer: q.correctAnswer };
                    } else if (q.type === "FILL_IN_BLANK") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const correctAnswer = q.choices?.find((c: any) => c.isCorrect);
                        return { question: q._id, answer: correctAnswer?.text || "" };
                    }
                }
                return { question: q._id, answer: "" };
            });
            setAnswers(initialAnswers);

            if (!isFaculty && currentUser?._id) {
                const attempts = await client.getAttemptsForUser(String(qid), currentUser._id);
                setUserAttempts(attempts);

                const attemptCount = attempts.length;
                const maxAttempts = quizData.multipleAttempts ? quizData.howManyAttempts : 1;

                if (attemptCount >= maxAttempts) {
                    setCanTakeQuiz(false);
                    if (attempts.length > 0) {
                        const lastAttempt = attempts[attempts.length - 1];
                        showAttemptResults(lastAttempt);
                    }
                    return;
                }

                const newAttempt = await client.startAttempt(String(qid), currentUser._id);
                setAttempt(newAttempt);
            }
            
            setStartTime(new Date());
        } catch (error: any) {
            alert(`Error loading quiz: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showAttemptResults = (attemptData: any) => {
        setAnswers(attemptData.answers || []);
        setScore(attemptData.score || 0);
        setShowResults(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAnswerChange = (value: any) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = {
            question: questions[currentQuestionIndex]._id,
            answer: value,
        };
        setAnswers(newAnswers);

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

    const handleSubmit = async (skipConfirmation = false) => {
        if (!skipConfirmation) {
            const ok = window.confirm("Submit quiz?");
            if (!ok) return;
        }

        try {
            let calculatedScore = 0;

            if (isFaculty) {
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
                        const answerLower = String(answer.answer).toLowerCase().trim();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        isCorrect = question.choices.some(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (c: any) => c.isCorrect && c.text.toLowerCase().trim() === answerLower
                        );
                    }

                    if (isCorrect) calculatedScore += question.points;
                });
                setScore(calculatedScore);
            } else {
                const result = await client.submitAttempt(attempt._id, answers);
                setAttempt(result);
                setScore(result.score);
            }

            setShowResults(true);
        } catch (error: any) {
            alert(`Error submitting quiz: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!quiz || !questions.length) {
        return <div className="p-3">Loading quiz...</div>;
    }

    if (!canTakeQuiz && !isFaculty) {
        return (
            <div className="p-3">
                <h3>Maximum Attempts Reached</h3>
                <div className="alert alert-warning">
                    You have used all {quiz.multipleAttempts ? quiz.howManyAttempts : 1} attempt(s) for this quiz.
                </div>

                <div className="mt-3">
                    <h5>Attempt History</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Attempt</th>
                                <th>Score</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {userAttempts.map((att: any, idx: number) => (
                                <tr key={att._id}>
                                    <td>Attempt {idx + 1}</td>
                                    <td>{att.score} / {att.totalPoints}</td>
                                    <td>{att.submittedAt ? new Date(att.submittedAt).toLocaleString() : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showResults && (
                    <div className="mt-4">
                        <h5>Last Attempt Results</h5>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {questions.map((question: any, idx: number) => {
                            const answer = answers[idx];
                            let isCorrect = false;

                            if (question.type === "MULTIPLE_CHOICE") {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const selected = question.choices.find((c: any) => c.text === answer?.answer);
                                isCorrect = selected?.isCorrect || false;
                            } else if (question.type === "TRUE_FALSE") {
                                isCorrect = answer?.answer === question.correctAnswer;
                            } else if (question.type === "FILL_IN_BLANK") {
                                const answerLower = String(answer?.answer || "").toLowerCase().trim();
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                            {isCorrect ? <span className="text-success">✓</span> : <span className="text-danger">✗</span>}
                                        </h6>
                                        <span>{question.points} pts</span>
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                    <div className="mt-2"><strong>Your Answer:</strong> {String(answer?.answer || "No answer")}</div>
                                    {!isCorrect && (
                                        <div className="mt-2 text-muted">
                                            <strong>Correct Answer: </strong>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {question.type === "MULTIPLE_CHOICE" && question.choices.find((c: any) => c.isCorrect)?.text}
                                            {question.type === "TRUE_FALSE" && String(question.correctAnswer)}
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {question.type === "FILL_IN_BLANK" && question.choices.filter((c: any) => c.isCorrect).map((c: any) => c.text).join(", ")}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <button className="btn btn-primary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                    Back to Quizzes
                </button>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="p-3">
                <h3>{isFaculty ? "Preview Results" : "Quiz Results"}</h3>
                <div className="alert alert-info mt-3">
                    <h5>Score: {score} out of {quiz.points}</h5>
                    {isFaculty && <p>This is a preview. Results are not saved.</p>}
                    {!isFaculty && userAttempts.length > 0 && (
                        <p>Attempt {userAttempts.length + 1} of {quiz.multipleAttempts ? quiz.howManyAttempts : 1}</p>
                    )}
                </div>

                <div className="mt-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {questions.map((question: any, idx: number) => {
                        const answer = answers[idx];
                        let isCorrect = false;

                        if (question.type === "MULTIPLE_CHOICE") {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const selected = question.choices.find((c: any) => c.text === answer.answer);
                            isCorrect = selected?.isCorrect || false;
                        } else if (question.type === "TRUE_FALSE") {
                            isCorrect = answer.answer === question.correctAnswer;
                        } else if (question.type === "FILL_IN_BLANK") {
                            const answerLower = String(answer.answer).toLowerCase().trim();
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                        {isCorrect ? <span className="text-success">✓</span> : <span className="text-danger">✗</span>}
                                    </h6>
                                    <span>{question.points} pts</span>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                <div className="mt-2"><strong>Your Answer:</strong> {String(answer?.answer)}</div>
                                {!isCorrect && (
                                    <div className="mt-2 text-muted">
                                        <strong>Correct Answer: </strong>
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {question.type === "MULTIPLE_CHOICE" && question.choices.find((c: any) => c.isCorrect)?.text}
                                        {question.type === "TRUE_FALSE" && String(question.correctAnswer)}
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {question.type === "FILL_IN_BLANK" && question.choices.filter((c: any) => c.isCorrect).map((c: any) => c.text).join(", ")}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="d-flex gap-2">
                    {isFaculty && (
                        <button className="btn btn-primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}>
                            Edit Quiz
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                        Back to Quizzes
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

            {!isFaculty && userAttempts.length > 0 && (
                <div className="alert alert-info">
                    Attempt {userAttempts.length + 1} of {quiz.multipleAttempts ? quiz.howManyAttempts : 1}
                </div>
            )}

            <h4>{quiz.title}</h4>
            {startTime && !isFaculty && (
                <div className="mb-3">
                    <strong>Time Remaining:</strong>{" "}
                    <span className={timeLeft < 300 ? "text-danger" : ""}>{formatTime(timeLeft)}</span>
                </div>
            )}

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
                                        <input type="radio" className="form-check-input" checked={currentAnswer?.answer === choice.text} onChange={() => handleAnswerChange(choice.text)} />
                                        <label className="form-check-label">{choice.text}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === "TRUE_FALSE" && (
                            <div>
                                <div className="form-check mb-2">
                                    <input type="radio" className="form-check-input" checked={currentAnswer?.answer === true} onChange={() => handleAnswerChange(true)} />
                                    <label className="form-check-label">True</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input type="radio" className="form-check-input" checked={currentAnswer?.answer === false} onChange={() => handleAnswerChange(false)} />
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
                                    value={typeof currentAnswer?.answer === 'string' ? currentAnswer.answer : String(currentAnswer?.answer || "")} 
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Type your answer here"
                                />
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <button className="btn btn-light border" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                                Previous
                            </button>
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button className="btn btn-success" onClick={() => handleSubmit(false)}>
                                    Submit {isFaculty ? "Preview" : "Quiz"}
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleNext}>Next</button>
                            )}
                        </div>
                    </div>

                    {!isFaculty && (
                        <div className="text-center mt-3">
                            <small className="text-muted">
                                Quiz saved at {new Date().toLocaleTimeString()}
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