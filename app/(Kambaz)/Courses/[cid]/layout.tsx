"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import * as db from "../../Database";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useParams } from "next/navigation";

export default function CoursesLayout(
    { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) {
    const { cid } = useParams();
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const course = courses.find((course: any) => course._id === cid);

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1" />
                <Breadcrumb course={course} />
            </h2>
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <CourseNavigation />
                </div>
                <div className="flex-fill">
                    {children}
                </div>
            </div>
        </div>
    );
}

