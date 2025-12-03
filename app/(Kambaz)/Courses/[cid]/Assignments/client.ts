import axios from "axios";

axios.defaults.withCredentials = true;
const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export interface Assignment {
    _id?: string;
    course?: string;
    title: string;
    description: string;
    due?: string;
    availableFrom?: string;
    points?: number;
}

export const findAssignmentsForCourse = async (cid: string) => {
    const res = await axios.get(`${SERVER}/api/courses/${cid}/assignments`);
    return res.data;
};

export const createAssignment = async (cid: string, assignment: Assignment) => {
    const res = await axios.post(`${SERVER}/api/courses/${cid}/assignments`, assignment);
    return res.data;
};

export const updateAssignment = async (assignment: Assignment) => {
    const res = await axios.put(`${SERVER}/api/assignments/${assignment._id}`, assignment);
    return res.data;
};

export const deleteAssignmentById = async (aid: string) => {
    const res = await axios.delete(`${SERVER}/api/assignments/${aid}`);
    return res.data;
};