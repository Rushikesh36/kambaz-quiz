"use client";
import Link from "next/link";
import { BsGripVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { RiFileEditLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { deleteAssignment as deleteFromStore, setAssignments } from "./reducer";
import {
    findAssignmentsForCourse,
    deleteAssignmentById,
} from "./client";

export default function Assignments() {
    const { cid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    // Select assignments slice (robust fallback)
    const state: any = useSelector((s: any) => s);
    const listFromStore: any[] =
        state.assignments?.assignments ??
        state.assignmentsReducer?.assignments ??
        state.assignment?.assignments ??
        state.assignmentsSlice?.assignments ??
        [];

    const assignments = listFromStore.filter(
        (a: any) => String(a.course) === String(cid)
    );

    // Pretty date display
    const fmtPretty = (iso?: string) => {
        if (!iso) return "—";
        const d = new Date(iso);
        const month = d.toLocaleString(undefined, { month: "long" });
        const day = d.getDate();
        const time = d
            .toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            .toLowerCase();
        return `${month} ${day} at ${time}`;
    };

    // Load assignments on mount / cid change
    const loadAssignments = async () => {
        if (!cid) return;
        const data = await findAssignmentsForCourse(String(cid));
        dispatch(setAssignments(data));
    };

    useEffect(() => {
        loadAssignments();
    }, [cid]);

    const onDelete = async (assn: any) => {
        const ok =
            typeof window !== "undefined" &&
            window.confirm(`Delete assignment "${assn.title ?? assn._id}"?`);
        if (!ok) return;

        await deleteAssignmentById(assn._id); // DELETE on server
        dispatch(deleteFromStore(assn._id));  // Update Redux
    };

    return (
        <div id="wd-assignments" className="p-3">
            {/* Header row */}
            <div className="d-flex align-items-center mb-3">
                <div className="input-group" style={{ maxWidth: 320 }}>
                    <span className="input-group-text bg-white border-end-0">
                        <CiSearch />
                    </span>
                    <input
                        id="wd-search-assignment"
                        className="form-control border-start-0"
                        placeholder="Search..."
                    />
                </div>

                <div className="ms-auto">
                    <button
                        id="wd-add-assignment-group"
                        className="btn btn-light border me-2"
                    >
                        +Group
                    </button>

                    <button
                        id="wd-add-assignment"
                        className="btn btn-danger"
                        type="button"
                        onClick={() =>
                            router.push(`/Courses/${cid}/Assignments/Editor`)
                        }
                    >
                        + Assignment
                    </button>
                </div>
            </div>

            {/* Assignments box */}
            <div className="border rounded" id="wd-assignments-box">
                <div className="d-flex align-items-center border-bottom px-3 py-2 fw-semibold">
                    <span className="me-2">
                        <BsGripVertical className="me-2 fs-3" />
                    </span>
                    <span className="me-2 fs-5">
                        <IoMdArrowDropdown />
                    </span>
                    <span className="me-auto">ASSIGNMENTS</span>
                    <span className="badge text-bg-light border me-2 rounded-pill">
                        40% of Total
                    </span>
                    <span className="me-2">+</span>
                    <span>
                        <PiDotsThreeVerticalBold />
                    </span>
                </div>

                {assignments.length === 0 && (
                    <div className="alert alert-warning m-3" role="alert">
                        No assignments found in store for this course. Check Provider
                        scope and slice key.
                    </div>
                )}

                <ul
                    id="wd-assignment-list"
                    className="list-group list-group-flush"
                >
                    {assignments.map((assn: any) => (
                        <li
                            key={assn._id}
                            className="list-group-item py-3"
                            style={{ borderLeft: "3px solid #2e7d32" }}
                        >
                            <div className="d-flex align-items-start">
                                <span className="me-3 text-muted">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <RiFileEditLine className="me-2 fs-3 text-success" />
                                </span>

                                {/* Assignment title + info */}
                                <div className="flex-fill">
                                    <div className="fw-semibold mb-1">
                                        <Link
                                            href={`/Courses/${cid}/Assignments/${assn._id}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            {assn.title ?? assn._id}
                                        </Link>
                                    </div>

                                    {/* Restored from old code */}
                                    <div className="small">
                                        <Link
                                            href="#"
                                            className="text-danger text-decoration-none me-2"
                                        >
                                            Multiple Modules
                                        </Link>
                                        <span className="text-muted">
                                            | <b>Not available until</b>{" "}
                                            {fmtPretty(assn.availableFrom)} |
                                        </span>
                                    </div>

                                    <div className="small text-muted">
                                        <b>Due</b> {fmtPretty(assn.due)} &nbsp; | &nbsp;
                                        {assn.points ?? 0} pts
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="ms-3 d-flex align-items-center gap-3">
                                    <button
                                        id={`wd-delete-${assn._id}`}
                                        type="button"
                                        className="btn btn-link text-danger p-0"
                                        onClick={() => onDelete(assn)}
                                        title="Delete assignment"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>

                                    <span className="text-success fs-5">
                                        <FaCheckCircle className="text-success me-1 fs-5" />
                                    </span>

                                    <span className="text-muted">
                                        <PiDotsThreeVerticalBold />
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}