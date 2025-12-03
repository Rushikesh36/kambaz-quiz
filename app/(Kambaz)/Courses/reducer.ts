import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    courses: courses,
};
const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addNewCourse: (state, { payload: course }) => {
            const newCourse = { ...course, _id: uuidv4() };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.courses = [...state.courses, newCourse] as any;
        },
        deleteCourse: (state, { payload: courseId }) => {
            state.courses = state.courses.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (course: any) => course._id !== courseId
            );
        },
        updateCourse: (state, { payload: course }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.courses = state.courses.map((c: any) =>
                c._id === course._id ? course : c
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;
        },
        setCourses: (state, { payload: courses }) => {
            state.courses = courses;
        },
    },
});
export const { addNewCourse, deleteCourse, updateCourse, setCourses } =
    coursesSlice.actions;
export default coursesSlice.reducer;

