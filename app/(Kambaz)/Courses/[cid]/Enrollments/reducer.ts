// app/(Kambaz)/Courses/[cid]/Enrollments/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Enrollment {
    _id?: string;
    user: string;
    course: string;
}

interface EnrollmentsState {
    enrollments: Enrollment[];
}

const initialState: EnrollmentsState = {
    enrollments: [],
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        setEnrollments: (state, { payload }: PayloadAction<Enrollment[]>) => {
            state.enrollments = payload;
        },

        enrollInCourse: (state, { payload }: PayloadAction<{ user: string; course: string }>) => {
            const exists = state.enrollments.some(
                (e) => e.user === payload.user && e.course === payload.course
            );
            if (!exists) {
                state.enrollments.push({ user: payload.user, course: payload.course });
            }
        },

        unenrollFromCourse: (state, { payload }: PayloadAction<{ user: string; course: string }>) => {
            state.enrollments = state.enrollments.filter(
                (e) => !(e.user === payload.user && e.course === payload.course)
            );
        },
    },
});

export const {
    setEnrollments,
    enrollInCourse,
    unenrollFromCourse,
} = enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;