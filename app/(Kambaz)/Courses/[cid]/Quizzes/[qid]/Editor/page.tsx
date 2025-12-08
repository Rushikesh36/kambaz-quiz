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
    const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [questionForm, setQuestionForm] = useState<any>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = useSelector((s: any) => s);
    const quiz = state.quizzesReducer?.currentQuiz;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions = (state.quizzesReducer?.questions || []) as any[];
    const currentUser = state.accountReducer?.currentUser;
    
    const isFaculty = currentUser?.role?.toLowerCase() === "faculty";

    useEffect(() => {
        if (!isFaculty) {
            router.push(`/Courses/${cid}/Quizzes`);
            return;
        }
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid, isFaculty]);

    useEffect(() => {
        if (quiz) {
            setForm(quiz);
        }
    }, [quiz]);

    const loadQuiz = async () => {
        if (!qid) return;
        try {
            const data = await client.findQuizById(String(qid));
            dispatch(setCurrentQuiz(data));
            
            const questionsData = await client.findQuestionsForQuiz(String(qid));
            dispatch(setQuestions(questionsData));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error loading quiz: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    const handleSave = async () => {
        if (!form.dueDate || !form.availableDate || !form.untilDate) {
            alert("Please fill in all date fields (Due Date, Available From, and Available Until)");
            return;
        }
        try {
            const updated = await client.updateQuiz(String(qid), form);
            dispatch(updateInStore(updated));
            dispatch(setCurrentQuiz(updated));
            router.push(`/Courses/${cid}/Quizzes/${qid}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error saving quiz: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    const handleSaveAndPublish = async () => {
        if (!form.dueDate || !form.availableDate || !form.untilDate) {
            alert("Please fill in all date fields (Due Date, Available From, and Available Until)");
            return;
        }
        try {
            const updated = await client.updateQuiz(String(qid), {
                ...form,
                published: true,
            });
            dispatch(updateInStore(updated));
            router.push(`/Courses/${cid}/Quizzes`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error saving and publishing quiz: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const set = (key: string, value: any) => {
        setForm({ ...form, [key]: value });
    };

    const handleNewQuestion = () => {
        setQuestionForm({
            _id: "new-" + Date.now(),
            quiz: String(qid),
            title: "",
            type: "MULTIPLE_CHOICE",
            points: 1,
            question: "",
            choices: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false },
            ],
            isNew: true,
        });
        setEditingQuestion("new-" + Date.now());
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEditQuestion = (question: any) => {
        setQuestionForm({ ...question });
        setEditingQuestion(question._id);
    };

    const handleCancelQuestionEdit = () => {
        setEditingQuestion(null);
        setQuestionForm({});
    };

    const handleSaveQuestionEdit = async () => {
        try {
            const { _id, isNew, ...data } = questionForm;

            if (isNew) {
                await client.createQuestion(String(qid), data);
            } else {
                await client.updateQuestion(_id, data);
            }
            
            const updated = await client.findQuestionsForQuiz(String(qid));
            dispatch(setQuestions(updated));
            setEditingQuestion(null);
            setQuestionForm({});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error saving question: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        const ok = window.confirm("Delete this question?");
        if (!ok) return;
        try {
            await client.deleteQuestion(questionId);
            const updated = await client.findQuestionsForQuiz(String(qid));
            dispatch(setQuestions(updated));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(`Error deleting question: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setQuestionField = (key: string, value: any) => {
        setQuestionForm({ ...questionForm, [key]: value });
    };

    const addChoiceToQuestion = () => {
        const choices = questionForm.choices || [];
        // For fill-in-blank, all answers are correct; for multiple choice, new answers are incorrect by default
        const isCorrect = questionForm.type === "FILL_IN_BLANK" ? true : false;
        setQuestionField("choices", [...choices, { text: "", isCorrect }]);
    };

    const removeChoiceFromQuestion = (index: number) => {
        const choices = [...(questionForm.choices || [])];
        choices.splice(index, 1);
        setQuestionField("choices", choices);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateChoiceInQuestion = (index: number, field: string, value: any) => {
        const choices = [...(questionForm.choices || [])];
        choices[index] = { ...choices[index], [field]: value };
        // For fill-in-blank, always keep isCorrect as true
        if (questionForm.type === "FILL_IN_BLANK" && field === "text") {
            choices[index].isCorrect = true;
        }
        setQuestionField("choices", choices);
    };

    const setCorrectChoiceInQuestion = (index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choices = (questionForm.choices || []).map((c: any, i: number) => ({
            ...c,
            isCorrect: i === index,
        }));
        setQuestionField("choices", choices);
    };

    if (!quiz) return <div className="p-3">Loading...</div>;
    
    if (!isFaculty) {
        return <div className="p-3">Access denied. Faculty only.</div>;
    }

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
                            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
                            onClick={() => setActiveTab("questions")}
                        >
                            Questions
                        </button>
                    </li>
                </ul>
            </div>

            {activeTab === "details" ? (
                <div style={{ maxWidth: 700 }}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows={4} value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Quiz Type</label>
                        <select className="form-select" value={form.quizType || "GRADED_QUIZ"} onChange={(e) => set("quizType", e.target.value)}>
                            <option value="GRADED_QUIZ">Graded Quiz</option>
                            <option value="PRACTICE_QUIZ">Practice Quiz</option>
                            <option value="GRADED_SURVEY">Graded Survey</option>
                            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Points</label>
                        <input type="number" className="form-control" value={form.points || 0} readOnly disabled />
                        <small className="text-muted">Points are calculated from questions</small>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Assignment Group</label>
                        <select className="form-select" value={form.assignmentGroup || "QUIZZES"} onChange={(e) => set("assignmentGroup", e.target.value)}>
                            <option value="QUIZZES">Quizzes</option>
                            <option value="EXAMS">Exams</option>
                            <option value="ASSIGNMENTS">Assignments</option>
                            <option value="PROJECT">Project</option>
                        </select>
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="shuffleAnswers" checked={form.shuffleAnswers || false} onChange={(e) => set("shuffleAnswers", e.target.checked)} />
                        <label className="form-check-label" htmlFor="shuffleAnswers">Shuffle Answers</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="shuffleQuestions" checked={form.shuffleQuestions || false} onChange={(e) => set("shuffleQuestions", e.target.checked)} />
                        <label className="form-check-label" htmlFor="shuffleQuestions">Shuffle Questions</label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Time Limit (minutes)</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={form.timeLimit ?? ""} 
                            onChange={(e) => set("timeLimit", e.target.value === "" ? null : Number(e.target.value))} 
                        />
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="multipleAttempts" checked={form.multipleAttempts || false} onChange={(e) => set("multipleAttempts", e.target.checked)} />
                        <label className="form-check-label" htmlFor="multipleAttempts">Allow Multiple Attempts</label>
                    </div>

                    {form.multipleAttempts && (
                        <div className="mb-3 ms-4">
                            <label className="form-label">How Many Attempts</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={form.howManyAttempts ?? ""} 
                                onChange={(e) => set("howManyAttempts", e.target.value === "" ? null : Number(e.target.value))} 
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Show Correct Answers</label>
                        <input type="text" className="form-control" value={form.showCorrectAnswers || "IMMEDIATELY"} onChange={(e) => set("showCorrectAnswers", e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Access Code</label>
                        <input type="text" className="form-control" value={form.accessCode || ""} onChange={(e) => set("accessCode", e.target.value)} />
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="oneQuestionAtATime" checked={form.oneQuestionAtATime !== false} onChange={(e) => set("oneQuestionAtATime", e.target.checked)} />
                        <label className="form-check-label" htmlFor="oneQuestionAtATime">One Question at a Time</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="webcamRequired" checked={form.webcamRequired || false} onChange={(e) => set("webcamRequired", e.target.checked)} />
                        <label className="form-check-label" htmlFor="webcamRequired">Webcam Required</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="lockQuestions" checked={form.lockQuestionsAfterAnswering || false} onChange={(e) => set("lockQuestionsAfterAnswering", e.target.checked)} />
                        <label className="form-check-label" htmlFor="lockQuestions">Lock Questions After Answering</label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Due Date <span className="text-danger">*</span></label>
                        <input type="datetime-local" className="form-control" value={form.dueDate || ""} onChange={(e) => set("dueDate", e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Available From <span className="text-danger">*</span></label>
                        <input type="datetime-local" className="form-control" value={form.availableDate || ""} onChange={(e) => set("availableDate", e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Available Until <span className="text-danger">*</span></label>
                        <input type="datetime-local" className="form-control" value={form.untilDate || ""} onChange={(e) => set("untilDate", e.target.value)} required />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button className="btn btn-light border" onClick={handleCancel}>Cancel</button>
                        <button className="btn btn-light border" onClick={handleSave}>Save</button>
                        <button className="btn btn-danger" onClick={handleSaveAndPublish}>Save & Publish</button>
                    </div>
                </div>
            ) : (
                <QuestionsTab
                    questions={questions}
                    editingQuestion={editingQuestion}
                    questionForm={questionForm}
                    setQuestionForm={setQuestionForm}
                    onNewQuestion={handleNewQuestion}
                    onEditQuestion={handleEditQuestion}
                    onCancelQuestion={handleCancelQuestionEdit}
                    onSaveQuestion={handleSaveQuestionEdit}
                    onDeleteQuestion={handleDeleteQuestion}
                    setQuestionField={setQuestionField}
                    addChoice={addChoiceToQuestion}
                    removeChoice={removeChoiceFromQuestion}
                    updateChoice={updateChoiceInQuestion}
                    setCorrectChoice={setCorrectChoiceInQuestion}
                />
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuestionsTab({ questions, editingQuestion, questionForm, setQuestionForm, onNewQuestion, onEditQuestion, onCancelQuestion, onSaveQuestion, onDeleteQuestion, setQuestionField, addChoice, removeChoice, updateChoice, setCorrectChoice }: any) {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <h5>Points: {questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0)}</h5>
                <button className="btn btn-danger" onClick={onNewQuestion}>+ New Question</button>
            </div>

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {questions.map((question: any) => (
                <div key={question._id} className="border rounded p-3 mb-3">
                    {editingQuestion === question._id ? (
                        <QuestionForm form={questionForm} setForm={setQuestionForm} set={setQuestionField} addChoice={addChoice} removeChoice={removeChoice} updateChoice={updateChoice} setCorrectChoice={setCorrectChoice} onSave={onSaveQuestion} onCancel={onCancelQuestion} />
                    ) : (
                        <QuestionPreview question={question} onEdit={() => onEditQuestion(question)} onDelete={() => onDeleteQuestion(question._id)} />
                    )}
                </div>
            ))}

            {editingQuestion && editingQuestion.startsWith("new-") && (
                <div className="border rounded p-3 mb-3">
                    <QuestionForm form={questionForm} setForm={setQuestionForm} set={setQuestionField} addChoice={addChoice} removeChoice={removeChoice} updateChoice={updateChoice} setCorrectChoice={setCorrectChoice} onSave={onSaveQuestion} onCancel={onCancelQuestion} />
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
                    <button className="btn btn-sm btn-light me-1" onClick={onEdit}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={onDelete}>Delete</button>
                </div>
            </div>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: question.question }} />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {question.type === "MULTIPLE_CHOICE" && question.choices?.map((choice: any, idx: number) => (
                <div key={idx} className="ms-3">{choice.isCorrect ? "✓" : "○"} {choice.text}</div>
            ))}
            {question.type === "TRUE_FALSE" && (
                <div className="ms-3">Correct Answer: {question.correctAnswer ? "True" : "False"}</div>
            )}
            {question.type === "FILL_IN_BLANK" && (
                <div className="ms-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    Possible Answers: {question.choices?.filter((c: any) => c.isCorrect).map((c: any) => c.text).join(", ")}
                </div>
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuestionForm({ form, setForm, set, addChoice, removeChoice, updateChoice, setCorrectChoice, onSave, onCancel }: any) {
    const handleTypeChange = (newType: string) => {
        const updates = { ...form, type: newType };
        
        if (newType === "TRUE_FALSE") {
            updates.correctAnswer = true;
            updates.choices = null;
        } else if (newType === "FILL_IN_BLANK") {
            updates.choices = [{ text: "", isCorrect: true }];
            updates.correctAnswer = null;
        } else {
            updates.choices = [{ text: "", isCorrect: true }, { text: "", isCorrect: false }];
            updates.correctAnswer = null;
        }
        
        // Use setForm to update all fields at once
        setForm(updates);
    };

    return (
        <div>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
            </div>

            <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select className="form-select" value={form.type || "MULTIPLE_CHOICE"} onChange={(e) => handleTypeChange(e.target.value)}>
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
                    value={form.points ?? ""} 
                    onChange={(e) => set("points", e.target.value === "" ? null : Number(e.target.value))} 
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Question</label>
                <textarea className="form-control" rows={3} value={form.question || ""} onChange={(e) => set("question", e.target.value)} />
            </div>

            {form.type === "MULTIPLE_CHOICE" && (
                <div className="mb-3">
                    <label className="form-label">Choices</label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(form.choices || []).map((choice: any, idx: number) => (
                        <div key={idx} className="d-flex gap-2 mb-2">
                            <input type="radio" checked={choice.isCorrect} onChange={() => setCorrectChoice(idx)} />
                            <input type="text" className="form-control" value={choice.text} onChange={(e) => updateChoice(idx, "text", e.target.value)} />
                            {(form.choices || []).length > 2 && (
                                <button type="button" className="btn btn-sm btn-danger" onClick={(e) => {
                                    e.preventDefault();
                                    removeChoice(idx);
                                }}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-light" onClick={(e) => {
                        e.preventDefault();
                        addChoice();
                    }}>+ Add Choice</button>
                </div>
            )}

            {form.type === "TRUE_FALSE" && (
                <div className="mb-3">
                    <label className="form-label">Correct Answer</label>
                    <div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" checked={form.correctAnswer === true} onChange={() => set("correctAnswer", true)} />
                            <label className="form-check-label">True</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" checked={form.correctAnswer === false} onChange={() => set("correctAnswer", false)} />
                            <label className="form-check-label">False</label>
                        </div>
                    </div>
                </div>
            )}

            {form.type === "FILL_IN_BLANK" && (
                <div className="mb-3">
                    <div className="alert alert-info">
                        <strong>Instructions:</strong> In the Question field above, type your question with underscores (______) to show where the blank goes.
                        <br />
                        Example: &quot;The capital of France is ______&quot;
                    </div>
                    <label className="form-label">Correct Answer(s)</label>
                    <small className="form-text text-muted d-block mb-2">
                        Enter the correct answer(s) that students should type. Answers are case-insensitive.
                    </small>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(form.choices || []).map((choice: any, idx: number) => (
                        <div key={idx} className="d-flex gap-2 mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder={idx === 0 ? "Enter the correct answer (e.g., Paris)" : "Enter alternative answer (optional, e.g., paris)"} 
                                value={choice.text} 
                                onChange={(e) => updateChoice(idx, "text", e.target.value)} 
                            />
                            {(form.choices || []).length > 1 && (
                                <button type="button" className="btn btn-sm btn-danger" onClick={(e) => {
                                    e.preventDefault();
                                    removeChoice(idx);
                                }}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-light" onClick={(e) => {
                        e.preventDefault();
                        addChoice();
                    }}>+ Add Alternative Answer</button>
                </div>
            )}

            <div className="d-flex gap-2">
                <button type="button" className="btn btn-light border" onClick={onCancel}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={onSave}>{form.isNew ? "Create Question" : "Update Question"}</button>
            </div>
        </div>
    );
}