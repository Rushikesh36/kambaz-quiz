"use client";

import { useEffect } from "react";
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

    useEffect(() => {
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid]);

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

    const handlePublishToggle = async () => {
        if (!quiz || !isFaculty) return;
        const updated = await client.publishQuiz(quiz._id, !quiz.published);
        dispatch(updateQuiz(updated));
        dispatch(setCurrentQuiz(updated));
    };

    const handleTakeQuiz = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`);
    };

    if (!quiz) {
        return <div className="p-3">Loading...</div>;
    }

    return (
        <div className="p-3" style={{ maxWidth: 800 }}>
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
                        <button className="btn btn-danger" onClick={handleTakeQuiz}>
                            Take the Quiz
                        </button>
                    ) : (
                        <div className="alert alert-warning">
                            This quiz is not yet published
                        </div>
                    )}
                </div>
            </div>

            <div className="border rounded p-3">
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td className="fw-bold">Quiz Type</td>
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
                <div className="mt-3">
                    <h5>Instructions</h5>
                    <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
                </div>
            )}
        </div>
    );
}
