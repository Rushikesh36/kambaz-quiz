"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../client";
import { setCurrentQuiz, updateQuiz } from "../reducer";

export default function QuizDetails() {
    const params = useParams() as { cid?: string; qid?: string };
    const cid = params.cid ? decodeURIComponent(String(params.cid)) : "";
    const qid = params.qid ? decodeURIComponent(String(params.qid)) : "";

    const router = useRouter();
    const dispatch = useDispatch();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    const quiz = state.quizzesReducer?.currentQuiz;
    const currentUser = state.accountReducer?.currentUser;

    const isFaculty = currentUser?.role?.toLowerCase() === "faculty";
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [attempts, setAttempts] = useState<any[]>([]);
    const [loadingAttempts, setLoadingAttempts] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [questions, setQuestions] = useState<any[]>([]);
    const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

    useEffect(() => {
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid]);

    useEffect(() => {
        // Load attempts for students only
        if (quiz && !isFaculty && currentUser?._id) {
            loadUserAttempts();
            loadQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quiz, currentUser, isFaculty]);

    const loadQuiz = async () => {
        if (!qid) return;
        const data = await client.findQuizById(String(qid));
        
        if (!isFaculty && !data.published) {
            alert("This quiz is not yet published");
            router.push(`/Courses/${cid}/Quizzes`);
            return;
        }
        
        dispatch(setCurrentQuiz(data));
    };

    const loadQuestions = async () => {
        if (!qid) return;
        try {
            const data = await client.findQuestionsForQuiz(String(qid));
            setQuestions(data);
        } catch (error) {
            console.error("Failed to load questions:", error);
        }
    };

    const loadUserAttempts = async () => {
        if (!qid || !currentUser?._id) return;
        setLoadingAttempts(true);
        try {
            const data = await client.getAttemptsForUser(String(qid), currentUser._id);
            // Filter out incomplete attempts
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const completedAttempts = data.filter((attempt: any) => attempt.isComplete);
            setAttempts(completedAttempts);
        } catch (error) {
            console.error("Failed to load attempts:", error);
        } finally {
            setLoadingAttempts(false);
        }
    };

    const handlePublishToggle = async () => {
        if (!quiz || !isFaculty) return;
        const updated = await client.publishQuiz(quiz._id, !quiz.published);
        dispatch(updateQuiz(updated));
        dispatch(setCurrentQuiz(updated));
    };

    const handleTakeQuiz = () => {
        // Check if quiz is past due date
        if (quiz.dueDate) {
            const now = new Date();
            const dueDate = new Date(quiz.dueDate);
            if (now > dueDate) {
                alert("This quiz is past its due date and can no longer be taken");
                return;
            }
        }
        
        // Check attempt limits
        const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
        if (attempts.length >= maxAttempts) {
            alert(`You have used all ${maxAttempts} attempt(s) for this quiz`);
            return;
        }
        
        router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`);
    };

    const toggleAttemptExpand = (attemptId: string) => {
        setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getQuestionResult = (answer: any, question: any) => {
        if (!answer || !question) return null;

        let isCorrect = false;
        let correctAnswerText = "";
        let userAnswerText = "";

        if (question.type === "MULTIPLE_CHOICE") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const correctChoice = question.choices?.find((c: any) => c.isCorrect);
            correctAnswerText = correctChoice?.text || "Unknown";
            userAnswerText = answer.answer || "(not answered)";
            isCorrect = answer.isCorrect || false;
        } else if (question.type === "TRUE_FALSE") {
            correctAnswerText = String(question.correctAnswer);
            userAnswerText = String(answer.answer);
            isCorrect = answer.isCorrect || false;
        } else if (question.type === "FILL_IN_BLANK") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const correctAnswers = question.choices?.filter((c: any) => c.isCorrect).map((c: any) => c.text) || [];
            correctAnswerText = correctAnswers.join(" or ");
            userAnswerText = answer.answer || "(not answered)";
            isCorrect = answer.isCorrect || false;
        }

        return {
            isCorrect,
            correctAnswerText,
            userAnswerText,
            pointsEarned: answer.pointsEarned || 0,
            pointsPossible: question.points || 0
        };
    };

    if (!quiz) {
        return <div className="p-3">Loading...</div>;
    }

    // Check if quiz is past due
    const isPastDue = quiz.dueDate ? new Date() > new Date(quiz.dueDate) : false;
    
    // Calculate remaining attempts
    const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
    const remainingAttempts = maxAttempts - attempts.length;

    return (
        <div className="p-3" style={{ maxWidth: 1000 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{quiz.title}</h2>
                <div className="d-flex gap-2">
                    {isFaculty ? (
                        <>
                            <button
                                className="btn btn-light border"
                                onClick={() =>
                                    router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)
                                }
                            >
                                Preview
                            </button>
                            <button
                                className="btn btn-light border"
                                onClick={() =>
                                    router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)
                                }
                            >
                                Edit
                            </button>
                            <button
                                className={`btn ${
                                    quiz.published ? "btn-warning" : "btn-success"
                                }`}
                                onClick={handlePublishToggle}
                            >
                                {quiz.published ? "Unpublish" : "Publish"}
                            </button>
                        </>
                    ) : quiz.published ? (
                        isPastDue ? (
                            <div className="alert alert-danger mb-0">
                                This quiz is past its due date
                            </div>
                        ) : remainingAttempts <= 0 ? (
                            <div className="alert alert-warning mb-0">
                                No attempts remaining
                            </div>
                        ) : (
                            <button className="btn btn-danger" onClick={handleTakeQuiz}>
                                Take the Quiz
                            </button>
                        )
                    ) : (
                        <div className="alert alert-warning">
                            This quiz is not yet published
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz Details */}
            <div className="border rounded p-3">
                <h5 className="mb-3">Quiz Details</h5>
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td className="fw-bold" style={{ width: '250px' }}>Quiz Type</td>
                            <td>{quiz.quizType?.replace(/_/g, " ")}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Points</td>
                            <td>{quiz.points}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Assignment Group</td>
                            <td>{quiz.assignmentGroup}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Shuffle Answers</td>
                            <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Time Limit</td>
                            <td>{quiz.timeLimit} Minutes</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Multiple Attempts</td>
                            <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
                        </tr>
                        {quiz.multipleAttempts && (
                            <tr>
                                <td className="fw-bold">How Many Attempts</td>
                                <td>{quiz.howManyAttempts}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="fw-bold">Show Correct Answers</td>
                            <td>{quiz.showCorrectAnswers}</td>
                        </tr>
                        {quiz.accessCode && (
                            <tr>
                                <td className="fw-bold">Access Code</td>
                                <td>{quiz.accessCode}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="fw-bold">One Question at a Time</td>
                            <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Webcam Required</td>
                            <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Lock Questions After Answering</td>
                            <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Due Date</td>
                            <td>
                                {quiz.dueDate
                                    ? new Date(quiz.dueDate).toLocaleString()
                                    : "—"}
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Available Date</td>
                            <td>
                                {quiz.availableDate
                                    ? new Date(quiz.availableDate).toLocaleString()
                                    : "—"}
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-bold">Until Date</td>
                            <td>
                                {quiz.untilDate
                                    ? new Date(quiz.untilDate).toLocaleString()
                                    : "—"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {quiz.description && (
                <div className="mt-3 border rounded p-3">
                    <h5>Instructions</h5>
                    <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
                </div>
            )}

            {/* Student Attempt History - MOVED TO BOTTOM */}
            {!isFaculty && quiz.published && (
                <div className="mt-4 border rounded p-3 bg-light">
                    <h4>Your Attempt History</h4>
                    {loadingAttempts ? (
                        <div className="alert alert-info">Loading your attempts...</div>
                    ) : attempts.length === 0 ? (
                        <div className="alert alert-info mb-0">
                            You haven't completed this quiz yet.
                            {remainingAttempts > 0 && (
                                <div className="mt-2">
                                    <strong>Available Attempts:</strong> {remainingAttempts}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="mb-3">
                                <span className="badge bg-primary me-2">
                                    Total Attempts: {attempts.length} / {maxAttempts}
                                </span>
                                {remainingAttempts > 0 && (
                                    <span className="badge bg-success">
                                        Remaining: {remainingAttempts}
                                    </span>
                                )}
                            </div>
                            
                            {/* Attempts List */}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {attempts.map((attempt: any) => {
                                const percentage = attempt.totalPoints > 0 
                                    ? Math.round((attempt.score / attempt.totalPoints) * 100)
                                    : 0;
                                
                                const isExpanded = expandedAttempt === attempt._id;

                                return (
                                    <div key={attempt._id} className="card mb-3">
                                        <div 
                                            className="card-header d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleAttemptExpand(attempt._id)}
                                        >
                                            <div>
                                                <strong>Attempt {attempt.attemptNumber}</strong>
                                                <span className="ms-3">
                                                    <strong className="text-primary">
                                                        {attempt.score} / {attempt.totalPoints}
                                                    </strong>
                                                </span>
                                                <span className={`badge ms-2 ${
                                                    percentage >= 90 ? 'bg-success' :
                                                    percentage >= 70 ? 'bg-info' :
                                                    percentage >= 50 ? 'bg-warning' :
                                                    'bg-danger'
                                                }`}>
                                                    {percentage}%
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <small className="text-muted">
                                                    {new Date(attempt.submittedAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit'
                                                    })}
                                                </small>
                                                <span className="badge bg-secondary">
                                                    {isExpanded ? '▼ Collapse' : '▶ View Details'}
                                                </span>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="card-body">
                                                <h6 className="mb-3">Question Results:</h6>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {attempt.answers?.map((answer: any, idx: number) => {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    const question = questions.find((q: any) => q._id === answer.question);
                                                    if (!question) return null;

                                                    const result = getQuestionResult(answer, question);
                                                    if (!result) return null;

                                                    return (
                                                        <div 
                                                            key={answer.question} 
                                                            className={`border rounded p-3 mb-3 ${
                                                                result.isCorrect ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                                                            }`}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <div>
                                                                    <strong>Question {idx + 1}</strong>
                                                                    {result.isCorrect ? (
                                                                        <span className="text-success ms-2">✓ Correct</span>
                                                                    ) : (
                                                                        <span className="text-danger ms-2">✗ Incorrect</span>
                                                                    )}
                                                                </div>
                                                                <span className="badge bg-secondary">
                                                                    {result.pointsEarned} / {result.pointsPossible} pts
                                                                </span>
                                                            </div>

                                                            <div 
                                                                className="mb-2" 
                                                                dangerouslySetInnerHTML={{ __html: question.question }} 
                                                            />

                                                            <div className="mt-2">
                                                                <div className="mb-1">
                                                                    <strong>Your Answer:</strong> 
                                                                    <span className={result.isCorrect ? 'text-success ms-2' : 'text-danger ms-2'}>
                                                                        {result.userAnswerText}
                                                                    </span>
                                                                </div>
                                                                
                                                                {!result.isCorrect && (
                                                                    <div>
                                                                        <strong>Correct Answer:</strong> 
                                                                        <span className="text-success ms-2">
                                                                            {result.correctAnswerText}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                <div className="mt-3 p-3 bg-white border rounded">
                                                    <strong>Summary:</strong> {attempt.score} / {attempt.totalPoints} points ({percentage}%)
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Show highest score */}
                            {attempts.length > 0 && (
                                <div className="mt-3 alert alert-success">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    <strong>Your Best Score:</strong> {Math.max(...attempts.map((a: any) => a.score))} / {quiz.points}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}