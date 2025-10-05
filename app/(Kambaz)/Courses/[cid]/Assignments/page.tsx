import Link from "next/link";
import { BsGripVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { RiFileEditLine } from "react-icons/ri";
export default function Assignments() {
    return (
        <div id="wd-assignments" className="p-3">
            <div className="d-flex align-items-center mb-3">
                <div className="input-group" style={{ maxWidth: 320 }}>
                    <span className="input-group-text bg-white border-end-0"><CiSearch /></span>
                    <input id="wd-search-assignment" className="form-control border-start-0" placeholder="Search..." />
                </div>
                <div className="ms-auto">
                    <button id="wd-add-assignment-group" className="btn btn-light border me-2">+Group</button>
                    <button id="wd-add-assignment" className="btn btn-danger">+ Assignment</button>
                </div>
            </div>

            <div className="border rounded" id="wd-assignments-box">
                <div className="d-flex align-items-center border-bottom px-3 py-2 fw-semibold">
                    <span className="me-2"><BsGripVertical className="me-2 fs-3" /></span>
                    <span className="me-2 fs-5"><IoMdArrowDropdown /></span>
                    <span className="me-auto">ASSIGNMENTS</span>
                    <span className="badge text-bg-light border me-2 rounded-pill">40% of Total</span>
                    <span className="me-2">+</span>
                    <span className=""><PiDotsThreeVerticalBold /></span>
                </div>

                <ul id="wd-assignment-list" className="list-group list-group-flush">
                    <li className="list-group-item py-3" style={{ borderLeft: "3px solid #2e7d32" }}>
                        <div className="d-flex align-items-start">
                            <span className="me-3 text-muted">
                                <BsGripVertical className="me-2 fs-3" />
                                <RiFileEditLine className="me-2 fs-3 text-success" />
                            </span>
                            <div className="flex-fill">
                                <div className="fw-semibold mb-1">
                                    <Link href="/Courses/1234/Assignments/123" className="text-decoration-none text-dark">A1</Link>
                                </div>
                                <div className="small">
                                    <Link href="#" className="text-danger text-decoration-none me-2">Multiple Modules</Link>
                                    <span className="text-muted">| <b>Not available until</b> May 6 at 12:00am |</span>
                                </div>
                                <div className="small text-muted">
                                    <b>Due</b> May 13 at 11:59pm&nbsp; | &nbsp;100 pts
                                </div>
                            </div>
                            <div className="ms-3 d-flex align-items-center gap-3">
                                <span className="text-success fs-5"><FaCheckCircle style={{ top: "2px" }} className="text-success me-1 fs-5" />
                                </span>
                                <span className="text-muted"><PiDotsThreeVerticalBold /></span>
                            </div>
                        </div>
                    </li>

                    <li className="list-group-item py-3" style={{ borderLeft: "3px solid #2e7d32" }}>
                        <div className="d-flex align-items-start">
                            <span className="me-3 text-muted">
                                <BsGripVertical className="me-2 fs-3" />
                                <RiFileEditLine className="me-2 fs-3 text-success" />
                            </span>
                            <div className="flex-fill">
                                <div className="fw-semibold mb-1">
                                    <Link href="/Courses/1234/Assignments/124" className="text-decoration-none text-dark">A2</Link>
                                </div>
                                <div className="small">
                                    <Link href="#" className="text-danger text-decoration-none me-2">Multiple Modules</Link>
                                    <span className="text-muted">| <b>Not available until</b> May 13 at 12:00am |</span>
                                </div>
                                <div className="small text-muted">
                                    <b>Due</b> May 20 at 11:59pm&nbsp; | &nbsp;100 pts
                                </div>
                            </div>
                            <div className="ms-3 d-flex align-items-center gap-3">
                                <span className="text-success fs-5"><FaCheckCircle style={{ top: "2px" }} className="text-success me-1 fs-5" />
                                </span>
                                <span className="text-muted"><PiDotsThreeVerticalBold /></span>
                            </div>
                        </div>
                    </li>

                    <li className="list-group-item py-3" style={{ borderLeft: "3px solid #2e7d32" }}>
                        <div className="d-flex align-items-start">
                            <span className="me-3 text-muted"><BsGripVertical className="me-2 fs-3" />
                                <RiFileEditLine className="me-2 fs-3 text-success" /></span>
                            <div className="flex-fill">
                                <div className="fw-semibold mb-1">
                                    <Link href="/Courses/1234/Assignments/125" className="text-decoration-none text-dark">A3</Link>
                                </div>
                                <div className="small">
                                    <Link href="#" className="text-danger text-decoration-none me-2">Multiple Modules</Link>
                                    <span className="text-muted">| <b>Not available until</b> May 20 at 12:00am |</span>
                                </div>
                                <div className="small text-muted">
                                    <b>Due</b> May 27 at 11:59pm&nbsp; | &nbsp;100 pts
                                </div>
                            </div>
                            <div className="ms-3 d-flex align-items-center gap-3">
                                <span className="text-success fs-5"><FaCheckCircle style={{ top: "2px" }} className="text-success me-1 fs-5" />
                                </span>
                                <span className="text-muted"><PiDotsThreeVerticalBold /></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}