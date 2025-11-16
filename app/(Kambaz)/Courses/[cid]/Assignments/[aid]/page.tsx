"use client";

import { Button } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  findAssignmentsForCourse,
  createAssignment,
  updateAssignment as updateOnServer,
  deleteAssignmentById,
} from "../client";
import {
  setAssignments,
  deleteAssignment as deleteFromStore,
} from "../reducer";

export default function AssignmentEditor() {
  const params = useParams() as { cid?: string; aid?: string };
  const cid = params.cid ? decodeURIComponent(String(params.cid)) : "";
  const aid = params.aid ? decodeURIComponent(String(params.aid)) : "";
  const isCreate = !aid || String(aid).toLowerCase() === "editor";

  const router = useRouter();
  const dispatch = useDispatch();

  // Be resilient to different store keys
  const state: any = useSelector((s: any) => s);
  const assignments: any[] = (
    state.assignments?.assignments ??
    state.assignmentsReducer?.assignments ??
    state.assignment?.assignments ??
    state.assignmentsSlice?.assignments ??
    []
  ) as any[];

  const existing = !isCreate
    ? assignments.find(
      (a: any) =>
        String(a._id) === String(aid) &&
        String(a.course) === String(cid)
    )
    : undefined;

  // Single form object for all fields
  const emptyForm = {
    title: "",
    description: "",
    points: 0,
    due: "",
    availableFrom: "",
    availableUntil: "",
    submissionType: "ONLINE",
    allowTextEntry: false,
    allowWebsiteUrl: true,
    allowMedia: false,
    allowAnnotation: false,
    allowFileUpload: true,
    group: "ASSIGNMENTS",
    gradeAs: "Percentage",
    assignTo: "Everyone",
    course: cid,
  } as any;

  const [form, setForm] = useState<any>(emptyForm);
  const set = (key: string, value: any) =>
    setForm((f: any) => ({ ...f, [key]: value }));

  // Keep course id in sync (route param can change)
  useEffect(() => {
    setForm((f: any) => ({ ...f, course: cid }));
  }, [cid]);

  // When editing, hydrate from store or server
  useEffect(() => {
    const hydrate = async () => {
      if (isCreate) {
        setForm({ ...emptyForm, course: cid });
        return;
      }

      // If we already have it in Redux, use that
      if (existing) {
        const { _id, ...rest } = existing;
        setForm({ ...emptyForm, ...rest, course: cid });
        return;
      }

      // Otherwise load from server (handles refresh on editor URL)
      if (!cid) return;
      const data = await findAssignmentsForCourse(String(cid));
      dispatch(setAssignments(data));
      const fromServer = data.find(
        (a: any) => String(a._id) === String(aid)
      );
      if (fromServer) {
        const { _id, ...rest } = fromServer;
        setForm({ ...emptyForm, ...rest, course: cid });
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate, existing?._id, cid]);

  const goBackToList = () => router.push(`/Courses/${cid}/Assignments`);

  const onSave = async () => {
    const base = { ...form, course: cid } as any;

    if (isCreate) {
      // CREATE on server
      const created = await createAssignment(String(cid), base);
      // Update Redux with new list (append)
      dispatch(setAssignments([...assignments, created]));
    } else {
      // UPDATE on server
      const updated = await updateOnServer({ ...base, _id: aid });
      // Replace in Redux
      const updatedList = assignments.map((a: any) =>
        String(a._id) === String(updated._id) ? updated : a
      );
      dispatch(setAssignments(updatedList));
    }

    goBackToList();
  };

  const onCancel = () => goBackToList();

  const onDelete = async () => {
    if (isCreate) {
      // nothing on server yet, just cancel
      return onCancel();
    }
    const ok = window.confirm(`Delete assignment "${form.title}"?`);
    if (!ok) return;

    await deleteAssignmentById(String(aid));
    dispatch(deleteFromStore(String(aid)));

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
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
      />

      <div className="mt-3">
        <textarea
          id="wd-description"
          className="form-control mb-3"
          rows={15}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="mt-3">
        <div className="row g-2 align-items-center mb-3">
          <label
            htmlFor="wd-points"
            className="col-sm-3 col-form-label text-end"
          >
            Points
          </label>
          <div className="col-sm-9">
            <input
              id="wd-points"
              className="form-control"
              type="number"
              value={form.points}
              onChange={(e) =>
                set("points", Number(e.target.value) || 0)
              }
            />
          </div>
        </div>

        <div className="row g-2 align-items-center mb-3">
          <label
            htmlFor="wd-group"
            className="col-sm-3 col-form-label text-end"
          >
            Assignment Group
          </label>
          <div className="col-sm-9">
            <select
              id="wd-group"
              className="form-select"
              value={form.group}
              onChange={(e) => set("group", e.target.value)}
            >
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </select>
          </div>
        </div>

        <div className="row g-2 align-items-center mb-3">
          <label
            htmlFor="wd-display-grade-as"
            className="col-sm-3 col-form-label text-end"
          >
            Display Grade as
          </label>
          <div className="col-sm-9">
            <select
              id="wd-display-grade-as"
              className="form-select"
              value={form.gradeAs}
              onChange={(e) => set("gradeAs", e.target.value)}
            >
              <option>Percentage</option>
              <option>Points</option>
              <option>Complete/Incomplete</option>
            </select>
          </div>
        </div>

        <div className="row g-2 mb-3">
          <label
            htmlFor="wd-submission-type"
            className="col-sm-3 col-form-label text-end"
          >
            Submission Type
          </label>
          <div className="col-sm-9">
            <div className="border rounded p-3">
              <select
                id="wd-submission-type"
                className="form-select w-50 mb-3"
                value={form.submissionType}
                onChange={(e) =>
                  set("submissionType", e.target.value)
                }
              >
                <option value="ONLINE">Online</option>
                <option value="ON_PAPER">On Paper</option>
                <option value="NONE">No Submission</option>
              </select>
              <div className="fw-semibold mb-2">Online Entry Options</div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="wd-text-entry"
                  className="form-check-input me-2"
                  checked={form.allowTextEntry}
                  onChange={(e) =>
                    set("allowTextEntry", e.target.checked)
                  }
                />
                <label
                  htmlFor="wd-text-entry"
                  className="form-check-label"
                >
                  Text Entry
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="wd-website-url"
                  className="form-check-input me-2"
                  checked={form.allowWebsiteUrl}
                  onChange={(e) =>
                    set("allowWebsiteUrl", e.target.checked)
                  }
                />
                <label
                  htmlFor="wd-website-url"
                  className="form-check-label"
                >
                  Website URL
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="wd-media-recordings"
                  className="form-check-input me-2"
                  checked={form.allowMedia}
                  onChange={(e) =>
                    set("allowMedia", e.target.checked)
                  }
                />
                <label
                  htmlFor="wd-media-recordings"
                  className="form-check-label"
                >
                  Media Recordings
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="wd-student-annotation"
                  className="form-check-input me-2"
                  checked={form.allowAnnotation}
                  onChange={(e) =>
                    set("allowAnnotation", e.target.checked)
                  }
                />
                <label
                  htmlFor="wd-student-annotation"
                  className="form-check-label"
                >
                  Student Annotation
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="wd-file-upload"
                  className="form-check-input me-2"
                  checked={form.allowFileUpload}
                  onChange={(e) =>
                    set("allowFileUpload", e.target.checked)
                  }
                />
                <label
                  htmlFor="wd-file-upload"
                  className="form-check-label"
                >
                  File Uploads
                </label>
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
                <label
                  htmlFor="wd-assign-to"
                  className="form-label fw-semibold"
                >
                  Assign to
                </label>
                <input
                  id="wd-assign-to"
                  className="form-control"
                  value={form.assignTo}
                  onChange={(e) => set("assignTo", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="wd-due-date"
                  className="form-label fw-semibold"
                >
                  Due
                </label>
                <input
                  id="wd-due-date"
                  className="form-control"
                  type="datetime-local"
                  value={form.due}
                  onChange={(e) => set("due", e.target.value)}
                />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="wd-available-from"
                    className="form-label fw-semibold"
                  >
                    Available from
                  </label>
                  <input
                    id="wd-available-from"
                    className="form-control"
                    type="datetime-local"
                    value={form.availableFrom}
                    onChange={(e) =>
                      set("availableFrom", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="wd-available-until"
                    className="form-label fw-semibold"
                  >
                    Until
                  </label>
                  <input
                    id="wd-available-until"
                    className="form-control"
                    type="datetime-local"
                    value={form.availableUntil}
                    onChange={(e) =>
                      set("availableUntil", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          id="wd-cancel-assignment"
          variant="light"
          className="border"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {!isCreate && (
          <Button
            id="wd-delete-assignment"
            variant="danger"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <Button
          id="wd-save-assignment"
          variant="danger"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}