import axios from "axios";

axios.defaults.withCredentials = true;
const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export interface Quiz {
    _id?: string;
    title: string;
    description: string;
    course: string;
    quizType: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
    points: number;
    assignmentGroup: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
    shuffleAnswers: boolean;
    timeLimit: number;
    multipleAttempts: boolean;
    howManyAttempts: number;
    showCorrectAnswers: string;
    accessCode: string;
    oneQuestionAtATime: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
    dueDate: string;
    availableDate: string;
    untilDate: string;
    published: boolean;
}

export interface Question {
    _id?: string;
    quiz: string;
    title: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
    points: number;
    question: string;
    choices?: { text: string; isCorrect: boolean }[];
    correctAnswer?: boolean;
    order?: number;
}

export interface QuizAttempt {
    _id?: string;
    quiz: string;
    user: string;
    attemptNumber: number;
    totalPoints: number;
    score?: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answers: any[];
    isComplete: boolean;
    startedAt?: string;
    submittedAt?: string;
}

// Quiz CRUD
export const findQuizzesForCourse = async (courseId: string) => {
    const res = await axios.get(`${SERVER}/api/courses/${courseId}/quizzes`);
    return res.data;
};

export const findQuizById = async (quizId: string) => {
    const res = await axios.get(`${SERVER}/api/quizzes/${quizId}`);
    return res.data;
};

export const createQuiz = async (courseId: string, quiz: Partial<Quiz>) => {
    const res = await axios.post(`${SERVER}/api/courses/${courseId}/quizzes`, quiz);
    return res.data;
};

export const updateQuiz = async (quizId: string, quiz: Partial<Quiz>) => {
    const res = await axios.put(`${SERVER}/api/quizzes/${quizId}`, quiz);
    return res.data;
};

export const deleteQuiz = async (quizId: string) => {
    const res = await axios.delete(`${SERVER}/api/quizzes/${quizId}`);
    return res.data;
};

export const publishQuiz = async (quizId: string, published: boolean) => {
    const res = await axios.put(`${SERVER}/api/quizzes/${quizId}/publish`, { published });
    return res.data;
};

// Question CRUD
export const findQuestionsForQuiz = async (quizId: string) => {
    const res = await axios.get(`${SERVER}/api/quizzes/${quizId}/questions`);
    return res.data;
};

export const createQuestion = async (quizId: string, question: Partial<Question>) => {
    const res = await axios.post(`${SERVER}/api/quizzes/${quizId}/questions`, question);
    return res.data;
};

export const updateQuestion = async (questionId: string, question: Partial<Question>) => {
    const res = await axios.put(`${SERVER}/api/questions/${questionId}`, question);
    return res.data;
};

export const deleteQuestion = async (questionId: string) => {
    const res = await axios.delete(`${SERVER}/api/questions/${questionId}`);
    return res.data;
};

// Quiz Attempts
export const getAttemptsForUser = async (quizId: string, userId: string) => {
    const res = await axios.get(`${SERVER}/api/quizzes/${quizId}/attempts/user/${userId}`);
    return res.data;
};

export const startAttempt = async (quizId: string, userId: string) => {
    const res = await axios.post(`${SERVER}/api/quizzes/${quizId}/attempts`, { userId });
    return res.data;
};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveAnswers = async (attemptId: string, answers: any[]) => {
    const res = await axios.put(`${SERVER}/api/attempts/${attemptId}/answers`, { answers });
    return res.data;
};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitAttempt = async (attemptId: string, answers: any[]) => {
    const res = await axios.post(`${SERVER}/api/attempts/${attemptId}/submit`, { answers });
    return res.data;
};

export const getAttemptById = async (attemptId: string) => {
    const res = await axios.get(`${SERVER}/api/attempts/${attemptId}`);
    return res.data;
};