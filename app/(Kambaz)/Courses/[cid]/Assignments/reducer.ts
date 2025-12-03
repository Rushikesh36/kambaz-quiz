import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    assignments: [] as any[],
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, { payload }) => {
            state.assignments = payload as any[];
        },

        addAssignment: (state, { payload: assignment }) => {
            const newAssignment: any = {
                _id: uuidv4(),
                title: assignment.title,
                description: assignment.description,
                points: assignment.points,
                due: assignment.due,
                availableFrom: assignment.availableFrom,
                availableUntil: assignment.availableUntil,
                submissionType: assignment.submissionType,
                allowTextEntry: assignment.allowTextEntry,
                allowWebsiteUrl: assignment.allowWebsiteUrl,
                allowMedia: assignment.allowMedia,
                allowAnnotation: assignment.allowAnnotation,
                allowFileUpload: assignment.allowFileUpload,
                group: assignment.group,
                gradeAs: assignment.gradeAs,
                assignTo: assignment.assignTo,
                course: assignment.course,
            };
            state.assignments = [...state.assignments, newAssignment] as any;
        },

        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter(
                (a: any) => a._id !== assignmentId
            );
        },

        updateAssignment: (state, { payload: assignment }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? assignment : a
            ) as any;
        },

        editAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignmentId ? { ...a, editing: true } : a
            ) as any;
        },
    },
});

export const {
    setAssignments,
    addAssignment,
    deleteAssignment,
    updateAssignment,
    editAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;