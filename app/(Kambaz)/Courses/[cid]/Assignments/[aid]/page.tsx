"use client";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../../../../Courses/[cid]/Assignments/reducer";
import * as db from "../../../../Database";

export default function AssignmentEditor() {
  const params = useParams() as { cid?: string; aid?: string };
  const cid = params.cid ? decodeURIComponent(String(params.cid)) : "";
  const aid = params.aid ? decodeURIComponent(String(params.aid)) : "";

  const router = useRouter();
  const dispatch = useDispatch();

  // Seed from DB if editing an existing assignment, else sensible defaults
  const assignments: any[] = (db as any).assignments ?? [];
  const existing = assignments.find(
    (a: any) => String(a._id) === String(aid) && String(a.course) === String(cid)
  );

  const [title, setTitle] = useState<string>(existing?.title ?? existing?._id ?? "A1");
  const [description, setDescription] = useState<string>(
    existing?.description ??
      `The assignment is available online\n\nSubmit a link to the landing page of your Web application running on Netlify.\n\nThe landing page should include the following:\n\n• Your full name and section\n• Links to each of the lab assignments\n• Link to the Kanbas application\n• Links to all relevant source code repositories\n\nThe Kanbas application should include a link to navigate back to the landing page.`
  );
  const [points, setPoints] = useState<number>(existing?.points ?? 100);
  const [due, setDue] = useState<string>(existing?.due ?? "2024-05-13T23:59");
  const [availableFrom, setAvailableFrom] = useState<string>(
    existing?.availableFrom ?? "2024-05-06T00:00"
  );
  const [availableUntil, setAvailableUntil] = useState<string>(
    existing?.availableUntil ?? ""
  );

  // Optional fields (kept for parity with JSON schema, but not required by prompt)
  const [group] = useState<string>(existing?.group ?? "ASSIGNMENTS");
  const [gradeAs] = useState<string>(existing?.gradeAs ?? "Percentage");
  const [submissionType] = useState<string>(existing?.submissionType ?? "ONLINE");
  const [allowTextEntry] = useState<boolean>(!!existing?.allowTextEntry);
  const [allowWebsiteUrl] = useState<boolean>(existing?.allowWebsiteUrl ?? true);
  const [allowMedia] = useState<boolean>(!!existing?.allowMedia);
  const [allowAnnotation] = useState<boolean>(!!existing?.allowAnnotation);
  const [allowFileUpload] = useState<boolean>(!!existing?.allowFileUpload);
  const [assignTo] = useState<string>(existing?.assignTo ?? "Everyone");

  const goBackToList = () => router.push(`/Courses/${cid}/Assignments`);

  const onSave = () => {
    const base = {
      title,
      description,
      points,
      due,
      availableFrom,
      availableUntil,
      submissionType,
      allowTextEntry,
      allowWebsiteUrl,
      allowMedia,
      allowAnnotation,
      allowFileUpload,
      group,
      gradeAs,
      assignTo,
      course: cid,
    } as any;

    if (aid && existing) {
      dispatch(updateAssignment({ ...base, _id: existing._id }));
    } else {
      dispatch(addAssignment(base));
    }

    goBackToList();
  };

  const onCancel = () => {
    // Do not create anything; just navigate back
    goBackToList();
  };

  return (
    <div id="wd-assignments-editor" className="p-3" style={{ maxWidth: 760 }}>
      <label htmlFor="wd-name" className="form-label fw-semibold">
        Assignment Name
      </label>
      <input
        id="wd-name"
        className="form-control"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mt-3">
        <textarea
          id="wd-description"
          className="form-control mb-3"
          rows={15}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mt-3">
        {/* Points */}
        <div className="row g-2 align-items-center mb-3">
          <label htmlFor="wd-points" className="col-sm-3 col-form-label text-end">
            Points
          </label>
          <div className="col-sm-9">
            <input
              id="wd-points"
              className="form-control"
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="row g-2 align-items-center mb-3">
          <label htmlFor="wd-group" className="col-sm-3 col-form-label text-end">
            Assignment Group
          </label>
          <div className="col-sm-9">
            <select id="wd-group" className="form-select" defaultValue={group}>
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </select>
          </div>
        </div>

        <div className="row g-2 align-items-center mb-3">
          <label htmlFor="wd-display-grade-as" className="col-sm-3 col-form-label text-end">
            Display Grade as
          </label>
          <div className="col-sm-9">
            <select id="wd-display-grade-as" className="form-select" defaultValue={gradeAs}>
              <option>Percentage</option>
              <option>Points</option>
              <option>Complete/Incomplete</option>
            </select>
          </div>
        </div>

        <div className="row g-2 mb-3">
          <label htmlFor="wd-submission-type" className="col-sm-3 col-form-label text-end">
            Submission Type
          </label>
          <div className="col-sm-9">
            <div className="border rounded p-3">
              <select id="wd-submission-type" className="form-select w-50 mb-3" defaultValue={submissionType}>
                <option value="ONLINE">Online</option>
                <option value="ON_PAPER">On Paper</option>
                <option value="NONE">No Submission</option>
              </select>
              <div className="fw-semibold mb-2">Online Entry Options</div>
              <div className="form-check">
                <input type="checkbox" id="wd-text-entry" className="form-check-input me-2" defaultChecked={!!allowTextEntry} />
                <label htmlFor="wd-text-entry" className="form-check-label">Text Entry</label>
              </div>
              <div className="form-check">
                <input type="checkbox" id="wd-website-url" className="form-check-input me-2" defaultChecked={!!allowWebsiteUrl} />
                <label htmlFor="wd-website-url" className="form-check-label">Website URL</label>
              </div>
              <div className="form-check">
                <input type="checkbox" id="wd-media-recordings" className="form-check-input me-2" defaultChecked={!!allowMedia} />
                <label htmlFor="wd-media-recordings" className="form-check-label">Media Recordings</label>
              </div>
              <div className="form-check">
                <input type="checkbox" id="wd-student-annotation" className="form-check-input me-2" defaultChecked={!!allowAnnotation} />
                <label htmlFor="wd-student-annotation" className="form-check-label">Student Annotation</label>
              </div>
              <div className="form-check">
                <input type="checkbox" id="wd-file-upload" className="form-check-input me-2" defaultChecked={!!allowFileUpload} />
                <label htmlFor="wd-file-upload" className="form-check-label">File Uploads</label>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-sm-3 d-flex align-items-start justify-content-end">
            <span className="col-form-label">Assign</span>
          </div>
          <div className="col-sm-9">
            <div className="border rounded p-3">
              <div className="mb-3">
                <label htmlFor="wd-assign-to" className="form-label fw-semibold">Assign to</label>
                <input id="wd-assign-to" className="form-control" defaultValue={assignTo} />
              </div>
              <div className="mb-3">
                <label htmlFor="wd-due-date" className="form-label fw-semibold">Due</label>
                <input
                  id="wd-due-date"
                  className="form-control"
                  type="datetime-local"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="wd-available-from" className="form-label fw-semibold">Available from</label>
                  <input
                    id="wd-available-from"
                    className="form-control"
                    type="datetime-local"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="wd-available-until" className="form-label fw-semibold">Until</label>
                  <input
                    id="wd-available-until"
                    className="form-control"
                    type="datetime-local"
                    value={availableUntil}
                    onChange={(e) => setAvailableUntil(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="light" className="border" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onSave}>Save</Button>
      </div>
    </div>
  );
}