// app/(Kambaz)/Courses/[cid]/Enrollments/client.ts
import axios from "axios";

axios.defaults.withCredentials = true;
const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export interface Enrollment {
    _id?: string;
    user: string;
    course: string;
}

export const findEnrollmentsForUser = async (userId: string) => {
    const res = await axios.get(`${SERVER}/api/users/${userId}/enrollments`);
    return res.data;
};

export const enrollInCourseApi = async (userId: string, courseId: string) => {
    const res = await axios.post(
        `${SERVER}/api/users/${userId}/courses/${courseId}/enrollments`
    );
    return res.data;
};

export const unenrollFromCourseApi = async (
    userId: string,
    courseId: string
) => {
    const res = await axios.delete(
        `${SERVER}/api/users/${userId}/courses/${courseId}/enrollments`
    );
    return res.data;
};