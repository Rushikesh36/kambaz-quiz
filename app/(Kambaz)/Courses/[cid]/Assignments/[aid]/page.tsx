import { Button } from "react-bootstrap";

export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor" className="p-3" style={{ maxWidth: 760 }}>
            {/* Assignment Name */}
            <label htmlFor="wd-name" className="form-label fw-semibold">Assignment Name</label>
            <input id="wd-name" className="form-control" defaultValue="A1" />

            {/* Description Card */}
            <div className="mt-3">
                <textarea
                    id="wd-description"
                    className="form-control mb-3"
                    rows={15}
                    defaultValue={`The assignment is available online\n\nSubmit a link to the landing page of your Web application running on Netlify.\n\nThe landing page should include the following:\n\n• Your full name and section\n• Links to each of the lab assignments\n• Link to the Kanbas application\n• Links to all relevant source code repositories\n\nThe Kanbas application should include a link to navigate back to the landing page.`}
                />
            </div>

            {/* Form Rows (label left, control right) */}
            <div className="mt-3">
                {/* Points */}
                <div className="row g-2 align-items-center mb-3">
                    <label htmlFor="wd-points" className="col-sm-3 col-form-label text-end">Points</label>
                    <div className="col-sm-9">
                        <input id="wd-points" className="form-control" defaultValue={100} />
                    </div>
                </div>

                {/* Assignment Group */}
                <div className="row g-2 align-items-center mb-3">
                    <label htmlFor="wd-group" className="col-sm-3 col-form-label text-end">Assignment Group</label>
                    <div className="col-sm-9">
                        <select id="wd-group" className="form-select" defaultValue="ASSIGNMENTS">
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECT">PROJECT</option>
                        </select>
                    </div>
                </div>

                {/* Display Grade as */}
                <div className="row g-2 align-items-center mb-3">
                    <label htmlFor="wd-display-grade-as" className="col-sm-3 col-form-label text-end">Display Grade as</label>
                    <div className="col-sm-9">
                        <select id="wd-display-grade-as" className="form-select" defaultValue="Percentage">
                            <option>Percentage</option>
                            <option>Points</option>
                            <option>Complete/Incomplete</option>
                        </select>
                    </div>
                </div>

                {/* Submission Type box */}
                <div className="row g-2 mb-3">
                    <label htmlFor="wd-submission-type" className="col-sm-3 col-form-label text-end">Submission Type</label>
                    <div className="col-sm-9">
                        <div className="border rounded p-3">
                            <select id="wd-submission-type" className="form-select w-50 mb-3" defaultValue="ONLINE">
                                <option value="ONLINE">Online</option>
                                <option value="ON_PAPER">On Paper</option>
                                <option value="NONE">No Submission</option>
                            </select>
                            <div className="fw-semibold mb-2">Online Entry Options</div>
                            <div className="form-check">
                                <input type="checkbox" id="wd-text-entry" className="form-check-input me-2" />
                                <label htmlFor="wd-text-entry" className="form-check-label">Text Entry</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="wd-website-url" className="form-check-input me-2" defaultChecked />
                                <label htmlFor="wd-website-url" className="form-check-label">Website URL</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="wd-media-recordings" className="form-check-input me-2" />
                                <label htmlFor="wd-media-recordings" className="form-check-label">Media Recordings</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="wd-student-annotation" className="form-check-input me-2" />
                                <label htmlFor="wd-student-annotation" className="form-check-label">Student Annotation</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" id="wd-file-upload" className="form-check-input me-2" />
                                <label htmlFor="wd-file-upload" className="form-check-label">File Uploads</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assign Section */}
                <div className="row g-2 mb-3">
                    <div className="col-sm-3 d-flex align-items-start justify-content-end">
                        <span className="col-form-label">Assign</span>
                    </div>
                    <div className="col-sm-9">
                        <div className="border rounded p-3">
                            <div className="mb-3">
                                <label htmlFor="wd-assign-to" className="form-label fw-semibold">Assign to</label>
                                <input id="wd-assign-to" className="form-control" defaultValue="Everyone" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="wd-due-date" className="form-label fw-semibold">Due</label>
                                <input id="wd-due-date" className="form-control" type="datetime-local" defaultValue="2024-05-13T23:59" />
                            </div>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="wd-available-from" className="form-label fw-semibold">Available from</label>
                                    <input id="wd-available-from" className="form-control" type="datetime-local" defaultValue="2024-05-06T00:00" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="wd-available-until" className="form-label fw-semibold">Until</label>
                                    <input id="wd-available-until" className="form-control" type="datetime-local" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer buttons */}
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="light" className="border">Cancel</Button>
                <Button variant="danger">Save</Button>
            </div>
        </div>
    );
}