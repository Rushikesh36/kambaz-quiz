"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import * as client from "./client";
import { setQuizzes, deleteQuiz as deleteFromStore, updateQuiz } from "./reducer";

export default function Quizzes() {
    const params = useParams() as { cid?: string };
    const cid = params.cid ? decodeURIComponent(String(params.cid)) : "";
    
    const router = useRouter();
    const dispatch = useDispatch();
    const [contextMenuQuiz, setContextMenuQuiz] = useState<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quizzes = (state.quizzesReducer?.quizzes || []) as any[];
    const currentUser = state.accountReducer?.currentUser;

    const isFaculty = currentUser?.role?.toLowerCase() === "faculty";

    useEffect(() => {
        loadQuizzes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cid]);

    const loadQuizzes = async () => {
        if (!cid) return;
        const data = await client.findQuizzesForCourse(String(cid));
        dispatch(setQuizzes(data));
    };

    const handleAddQuiz = async () => {
        if (!isFaculty) return;
        const newQuiz = {
            title: "Unnamed Quiz",
            description: "",
            course: String(cid),
            quizType: "GRADED_QUIZ" as const,
            points: 0,
            assignmentGroup: "QUIZZES" as const,
            shuffleAnswers: true,
            timeLimit: 20,
            multipleAttempts: false,
            howManyAttempts: 1,
            showCorrectAnswers: "IMMEDIATELY",
            accessCode: "",
            oneQuestionAtATime: true,
            webcamRequired: false,
            lockQuestionsAfterAnswering: false,
            dueDate: "",
            availableDate: "",
            untilDate: "",
            published: false,
        };
        const created = await client.createQuiz(String(cid), newQuiz);
        dispatch(setQuizzes([...quizzes, created]));
        router.push(`/Courses/${cid}/Quizzes/${created._id}`);
    };

    const handleDelete = async (quizId: string) => {
        if (!isFaculty) return;
        const ok = window.confirm("Are you sure you want to delete this quiz?");
        if (!ok) return;
        await client.deleteQuiz(quizId);
        dispatch(deleteFromStore(quizId));
        setContextMenuQuiz(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePublishToggle = async (quiz: any) => {
        if (!isFaculty) return;
        const updated = await client.publishQuiz(quiz._id, !quiz.published);
        dispatch(updateQuiz(updated));
        setContextMenuQuiz(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getAvailabilityStatus = (quiz: any) => {
        const now = new Date();
        const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
        const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

        if (!availableDate) return "Available";
        if (now < availableDate) {
            return `Not available until ${availableDate.toLocaleDateString()}`;
        }
        if (untilDate && now > untilDate) {
            return "Closed";
        }
        return "Available";
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedQuizzes = [...quizzes].sort((a: any, b: any) => {
        // Get availability status for each quiz
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getStatus = (quiz: any) => {
            const now = new Date();
            const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
            const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

            if (!availableDate) return "Available";
            if (now < availableDate) return "Not available";
            if (untilDate && now > untilDate) return "Closed";
            return "Available";
        };

        const statusA = getStatus(a);
        const statusB = getStatus(b);

        // Define status priority: Available > Not available > Closed
        const statusPriority: { [key: string]: number } = {
            "Available": 1,
            "Not available": 2,
            "Closed": 3
        };

        // First, sort by status
        if (statusPriority[statusA] !== statusPriority[statusB]) {
            return statusPriority[statusA] - statusPriority[statusB];
        }

        // Within same status, sort by due date (newest first)
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return dateB - dateA; // Descending order (newest due date first)
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseQuizzes = sortedQuizzes.filter((q: any) => {
        const matchesCourse = String(q.course) === String(cid);
        if (!matchesCourse) return false;
        
        if (!isFaculty && !q.published) return false;
        
        return true;
    });

    return (
        <div className="p-3">
            {isFaculty && (
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-danger" onClick={handleAddQuiz}>
                        + Quiz
                    </button>
                </div>
            )}

            {courseQuizzes.length === 0 ? (
                <div className="alert alert-info">
                    {isFaculty
                        ? "No quizzes yet. Click '+ Quiz' to create one."
                        : "No quizzes available for this course."}
                </div>
            ) : (
                <ul className="list-group">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {courseQuizzes.map((quiz: any) => (
                        <li key={quiz._id} className="list-group-item">
                            <div className="d-flex align-items-start">
                                <span className="me-2">
                                    <BsGripVertical className="fs-4" />
                                </span>

                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2">
                                        {quiz.published ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaBan className="text-danger" />
                                        )}
                                        <span
                                            className="fw-bold text-primary"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)
                                            }
                                        >
                                            {quiz.title}
                                        </span>
                                    </div>

                                    <div className="small text-muted mt-1">
                                        <div>{getAvailabilityStatus(quiz)}</div>
                                        <div>
                                            <strong>Due:</strong> {formatDate(quiz.dueDate)} |{" "}
                                            <strong>Points:</strong> {quiz.points} |{" "}
                                            <strong>Questions:</strong> {quiz.questionCount || 0}
                                        </div>
                                    </div>
                                </div>

                                {isFaculty && (
                                    <div className="position-relative">
                                        <button
                                            className="btn btn-link p-0"
                                            onClick={() =>
                                                setContextMenuQuiz(
                                                    contextMenuQuiz === quiz._id ? null : quiz._id
                                                )
                                            }
                                        >
                                            <BsThreeDotsVertical />
                                        </button>

                                        {contextMenuQuiz === quiz._id && (
                                            <div
                                                className="position-absolute end-0 mt-1 bg-white border rounded shadow-sm"
                                                style={{ zIndex: 1000, minWidth: "150px" }}
                                            >
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Editor`);
                                                        setContextMenuQuiz(null);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handlePublishToggle(quiz)}
                                                >
                                                    {quiz.published ? "Unpublish" : "Publish"}
                                                </button>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={() => handleDelete(quiz._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}