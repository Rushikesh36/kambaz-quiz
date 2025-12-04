import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    quizzes: [] as any[],
    questions: [] as any[],
    currentQuiz: null as any,
    currentAttempt: null as any,
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, { payload }) => {
            state.quizzes = payload;
        },
        addQuiz: (state, { payload }) => {
            state.quizzes = [...state.quizzes, payload];
        },
        updateQuiz: (state, { payload }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === payload._id ? payload : q
            );
            if (state.currentQuiz?._id === payload._id) {
                state.currentQuiz = payload;
            }
        },
        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
        },
        setCurrentQuiz: (state, { payload }) => {
            state.currentQuiz = payload;
        },
        setQuestions: (state, { payload }) => {
            state.questions = payload;
        },
        addQuestion: (state, { payload }) => {
            state.questions = [...state.questions, payload];
        },
        updateQuestion: (state, { payload }) => {
            state.questions = state.questions.map((q: any) =>
                q._id === payload._id ? payload : q
            );
        },
        deleteQuestion: (state, { payload: questionId }) => {
            state.questions = state.questions.filter((q: any) => q._id !== questionId);
        },
        setCurrentAttempt: (state, { payload }) => {
            state.currentAttempt = payload;
        },
    },
});

export const {
    setQuizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    setCurrentQuiz,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setCurrentAttempt,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;