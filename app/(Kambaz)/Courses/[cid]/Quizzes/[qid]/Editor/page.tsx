"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../../client";
import { setCurrentQuiz, updateQuiz as updateInStore, setQuestions } from "../../reducer";

export default function QuizEditor() {
    const params = useParams() as { cid?: string; qid?: string };
    const cid = params.cid ? decodeURIComponent(String(params.cid)) : "";
    const qid = params.qid ? decodeURIComponent(String(params.qid)) : "";

    const router = useRouter();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [form, setForm] = useState<any>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    const quiz = state.quizzesReducer?.currentQuiz;

    useEffect(() => {
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid]);

    useEffect(() => {
        if (quiz) {
            setForm(quiz);
        }
    }, [quiz]);

    const loadQuiz = async () => {
        if (!qid) return;
        const data = await client.findQuizById(String(qid));
        dispatch(setCurrentQuiz(data));
        
        const questionsData = await client.findQuestionsForQuiz(String(qid));
        dispatch(setQuestions(questionsData));
    };

    const handleSave = async () => {
        const updated = await client.updateQuiz(String(qid), form);
        dispatch(updateInStore(updated));
        dispatch(setCurrentQuiz(updated));
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
    };

    const handleSaveAndPublish = async () => {
        const updated = await client.updateQuiz(String(qid), {
            ...form,
            published: true,
        });
        dispatch(updateInStore(updated));
        router.push(`/Courses/${cid}/Quizzes`);
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const set = (key: string, value: any) => {
        setForm({ ...form, [key]: value });
    };

    if (activeTab === "questions") {
        return <QuestionsTab cid={cid} qid={qid} />;
    }

    if (!quiz) return <div className="p-3">Loading...</div>;

    return (
        <div className="p-3">
            <div className="border-bottom mb-3">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                            onClick={() => setActiveTab("details")}
                        >
                            Details
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            onClick={() => setActiveTab("questions")}
                        >
                            Questions
                        </button>
                    </li>
                </ul>
            </div>

            <div style={{ maxWidth: 700 }}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.title || ""}
                        onChange={(e) => set("title", e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows={4}
                        value={form.description || ""}
                        onChange={(e) => set("description", e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Quiz Type</label>
                    <select
                        className="form-select"
                        value={form.quizType || "GRADED_QUIZ"}
                        onChange={(e) => set("quizType", e.target.value)}
                    >
                        <option value="GRADED_QUIZ">Graded Quiz</option>
                        <option value="PRACTICE_QUIZ">Practice Quiz</option>
                        <option value="GRADED_SURVEY">Graded Survey</option>
                        <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Points</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.points || 0}
                        readOnly
                        disabled
                    />
                    <small className="text-muted">Points are calculated from questions</small>
                </div>

                <div className="mb-3">
                    <label className="form-label">Assignment Group</label>
                    <select
                        className="form-select"
                        value={form.assignmentGroup || "QUIZZES"}
                        onChange={(e) => set("assignmentGroup", e.target.value)}
                    >
                        <option value="QUIZZES">Quizzes</option>
                        <option value="EXAMS">Exams</option>
                        <option value="ASSIGNMENTS">Assignments</option>
                        <option value="PROJECT">Project</option>
                    </select>
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="shuffleAnswers"
                        checked={form.shuffleAnswers || false}
                        onChange={(e) => set("shuffleAnswers", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="shuffleAnswers">
                        Shuffle Answers
                    </label>
                </div>

                <div className="mb-3">
                    <label className="form-label">Time Limit (minutes)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.timeLimit || 20}
                        onChange={(e) => set("timeLimit", Number(e.target.value))}
                    />
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="multipleAttempts"
                        checked={form.multipleAttempts || false}
                        onChange={(e) => set("multipleAttempts", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="multipleAttempts">
                        Allow Multiple Attempts
                    </label>
                </div>

                {form.multipleAttempts && (
                    <div className="mb-3 ms-4">
                        <label className="form-label">How Many Attempts</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.howManyAttempts || 1}
                            onChange={(e) => set("howManyAttempts", Number(e.target.value))}
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Show Correct Answers</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.showCorrectAnswers || "IMMEDIATELY"}
                        onChange={(e) => set("showCorrectAnswers", e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Access Code</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.accessCode || ""}
                        onChange={(e) => set("accessCode", e.target.value)}
                    />
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="oneQuestionAtATime"
                        checked={form.oneQuestionAtATime !== false}
                        onChange={(e) => set("oneQuestionAtATime", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="oneQuestionAtATime">
                        One Question at a Time
                    </label>
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="webcamRequired"
                        checked={form.webcamRequired || false}
                        onChange={(e) => set("webcamRequired", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="webcamRequired">
                        Webcam Required
                    </label>
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="lockQuestions"
                        checked={form.lockQuestionsAfterAnswering || false}
                        onChange={(e) => set("lockQuestionsAfterAnswering", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="lockQuestions">
                        Lock Questions After Answering
                    </label>
                </div>

                <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={form.dueDate || ""}
                        onChange={(e) => set("dueDate", e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Available From</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={form.availableDate || ""}
                        onChange={(e) => set("availableDate", e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Available Until</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={form.untilDate || ""}
                        onChange={(e) => set("untilDate", e.target.value)}
                    />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button className="btn btn-light border" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-light border" onClick={handleSave}>
                        Save
                    </button>
                    <button className="btn btn-danger" onClick={handleSaveAndPublish}>
                        Save & Publish
                    </button>
                </div>
            </div>
        </div>
    );
}

function QuestionsTab({ cid, qid }: { cid: string; qid: string }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [questionForm, setQuestionForm] = useState<any>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions = (state.quizzesReducer?.questions || []) as any[];

    const handleBackToDetails = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`);
    };

    const handleNewQuestion = () => {
        const newQ = {
            _id: "new-" + Date.now(),
            quiz: String(qid),
            title: "",
            type: "MULTIPLE_CHOICE",
            points: 1,
            question: "",
            choices: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
            isNew: true,
        };
        setQuestionForm(newQ);
        setEditingQuestion(newQ._id);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEdit = (question: any) => {
        setQuestionForm({ ...question });
        setEditingQuestion(question._id);
    };

    const handleCancel = () => {
        setEditingQuestion(null);
        setQuestionForm({});
    };

    const handleSave = async () => {
        const { _id, isNew, ...data } = questionForm;

        if (isNew) {
            await client.createQuestion(String(qid), data);
            const updated = await client.findQuestionsForQuiz(String(qid));
            dispatch(setQuestions(updated));
        } else {
            await client.updateQuestion(_id, data);
            const updated = await client.findQuestionsForQuiz(String(qid));
            dispatch(setQuestions(updated));
        }

        setEditingQuestion(null);
        setQuestionForm({});
    };

    const handleDelete = async (questionId: string) => {
        const ok = window.confirm("Delete this question?");
        if (!ok) return;
        await client.deleteQuestion(questionId);
        const updated = await client.findQuestionsForQuiz(String(qid));
        dispatch(setQuestions(updated));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const set = (key: string, value: any) => {
        setQuestionForm({ ...questionForm, [key]: value });
    };

    const addChoice = () => {
        const choices = questionForm.choices || [];
        set("choices", [...choices, { text: "", isCorrect: false }]);
    };

    const removeChoice = (index: number) => {
        const choices = [...questionForm.choices];
        choices.splice(index, 1);
        set("choices", choices);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateChoice = (index: number, field: string, value: any) => {
        const choices = [...questionForm.choices];
        choices[index] = { ...choices[index], [field]: value };
        set("choices", choices);
    };

    const setCorrectChoice = (index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choices = questionForm.choices.map((c: any, i: number) => ({
            ...c,
            isCorrect: i === index,
        }));
        set("choices", choices);
    };

    return (
        <div className="p-3">
            <div className="border-bottom mb-3">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            onClick={handleBackToDetails}
                        >
                            Details
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link active">Questions</button>
                    </li>
                </ul>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    Points: {questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0)}
                </h5>
                <button className="btn btn-danger" onClick={handleNewQuestion}>
                    + New Question
                </button>
            </div>

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {questions.map((question: any) => (
                <div key={question._id} className="border rounded p-3 mb-3">
                    {editingQuestion === question._id ? (
                        <QuestionForm
                            form={questionForm}
                            set={set}
                            addChoice={addChoice}
                            removeChoice={removeChoice}
                            updateChoice={updateChoice}
                            setCorrectChoice={setCorrectChoice}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    ) : (
                        <QuestionPreview
                            question={question}
                            onEdit={() => handleEdit(question)}
                            onDelete={() => handleDelete(question._id)}
                        />
                    )}
                </div>
            ))}

            {editingQuestion && editingQuestion.startsWith("new-") && (
                <div className="border rounded p-3 mb-3">
                    <QuestionForm
                        form={questionForm}
                        set={set}
                        addChoice={addChoice}
                        removeChoice={removeChoice}
                        updateChoice={updateChoice}
                        setCorrectChoice={setCorrectChoice}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuestionPreview({ question, onEdit, onDelete }: any) {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <strong>{question.title || "Untitled Question"}</strong>
                    <span className="ms-2 badge bg-secondary">{question.type}</span>
                    <span className="ms-2 text-muted">{question.points} pts</span>
                </div>
                <div>
                    <button className="btn btn-sm btn-light me-1" onClick={onEdit}>
                        Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={onDelete}>
                        Delete
                    </button>
                </div>
            </div>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: question.question }} />
            {question.type === "MULTIPLE_CHOICE" &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                question.choices?.map((choice: any, idx: number) => (
                    <div key={idx} className="ms-3">
                        {choice.isCorrect ? "✓" : "○"} {choice.text}
                    </div>
                ))}
            {question.type === "TRUE_FALSE" && (
                <div className="ms-3">Correct Answer: {question.correctAnswer ? "True" : "False"}</div>
            )}
            {question.type === "FILL_IN_BLANK" && (
                <div className="ms-3">
                    Possible Answers:{" "}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {question.choices?.filter((c: any) => c.isCorrect).map((c: any) => c.text).join(", ")}
                </div>
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuestionForm({ form, set, addChoice, removeChoice, updateChoice, setCorrectChoice, onSave, onCancel }: any) {
    return (
        <div>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={form.title || ""}
                    onChange={(e) => set("title", e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select
                    className="form-select"
                    value={form.type || "MULTIPLE_CHOICE"}
                    onChange={(e) => set("type", e.target.value)}
                >
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="FILL_IN_BLANK">Fill in the Blank</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Points</label>
                <input
                    type="number"
                    className="form-control"
                    value={form.points || 1}
                    onChange={(e) => set("points", Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Question</label>
                <textarea
                    className="form-control"
                    rows={3}
                    value={form.question || ""}
                    onChange={(e) => set("question", e.target.value)}
                />
            </div>

            {form.type === "MULTIPLE_CHOICE" && (
                <div className="mb-3">
                    <label className="form-label">Choices</label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {form.choices?.map((choice: any, idx: number) => (
                        <div key={idx} className="d-flex gap-2 mb-2">
                            <input
                                type="radio"
                                checked={choice.isCorrect}
                                onChange={() => setCorrectChoice(idx)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={choice.text}
                                onChange={(e) => updateChoice(idx, "text", e.target.value)}
                            />
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeChoice(idx)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button className="btn btn-sm btn-light" onClick={addChoice}>
                        + Add Choice
                    </button>
                </div>
            )}

            {form.type === "TRUE_FALSE" && (
                <div className="mb-3">
                    <label className="form-label">Correct Answer</label>
                    <div>
                        <div className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                checked={form.correctAnswer === true}
                                onChange={() => set("correctAnswer", true)}
                            />
                            <label className="form-check-label">True</label>
                        </div>
                        <div className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                checked={form.correctAnswer === false}
                                onChange={() => set("correctAnswer", false)}
                            />
                            <label className="form-check-label">False</label>
                        </div>
                    </div>
                </div>
            )}

            {form.type === "FILL_IN_BLANK" && (
                <div className="mb-3">
                    <label className="form-label">Possible Correct Answers</label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {form.choices?.map((choice: any, idx: number) => (
                        <div key={idx} className="d-flex gap-2 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                value={choice.text}
                                onChange={(e) => updateChoice(idx, "text", e.target.value)}
                            />
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeChoice(idx)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        className="btn btn-sm btn-light"
                        onClick={() => {
                            const choices = form.choices || [];
                            set("choices", [...choices, { text: "", isCorrect: true }]);
                        }}
                    >
                        + Add Answer
                    </button>
                </div>
            )}

            <div className="d-flex gap-2">
                <button className="btn btn-light border" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn btn-success" onClick={onSave}>
                    {form.isNew ? "Create Question" : "Update Question"}
                </button>
            </div>
        </div>
    );
}