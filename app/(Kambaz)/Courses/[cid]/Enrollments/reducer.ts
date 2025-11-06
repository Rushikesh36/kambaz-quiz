

import { createSlice } from "@reduxjs/toolkit";
import { enrollments as dbEnrollments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    enrollments: dbEnrollments,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollInCourse: (state, { payload }) => {
            const { user, course } = payload;
            const alreadyEnrolled = state.enrollments.some(
                (e: any) => e.user === user && e.course === course
            );
            if (!alreadyEnrolled) {
                const newEnrollment = {
                    _id: uuidv4(),
                    user,
                    course,
                };
                state.enrollments = [...state.enrollments, newEnrollment] as any;
            }
        },
        unenrollFromCourse: (state, { payload }) => {
            const { user, course } = payload;
            state.enrollments = state.enrollments.filter(
                (e: any) => !(e.user === user && e.course === course)
            );
        },
    },
});

export const { enrollInCourse, unenrollFromCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;