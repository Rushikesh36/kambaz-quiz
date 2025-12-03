"use client";
import Modules from "../Modules/page";
import CourseStatus from "./Status";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function Home() {
    const currentUser = useSelector(
        (state: RootState) => state.accountReducer.currentUser
    ) as any;

    const isFaculty =
        currentUser?.role &&
        currentUser.role.toString().toLowerCase() === "faculty";

    return (
        <div id="wd-home">
            <div className="d-flex" id="wd-home">
                <div className="flex-fill me-3">
                    <Modules />
                </div>

                {isFaculty && (
                    <div className="d-none d-lg-block">
                        <CourseStatus />
                    </div>
                )}
            </div>
        </div>
    );
}