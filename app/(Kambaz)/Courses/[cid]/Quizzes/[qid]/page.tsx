"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, ProgressBar, Table, Alert } from "react-bootstrap";
import Link from "next/link";

interface Attempt {
  attemptNumber: number;
  score: number | null;
  submitTime?: string;
  duration?: string;
}

interface QuizDetail {
  _id: string;
  title: string;
  description?: string;
  quizType: string;
  points: number;
  timeLimit?: number;
  multipleAttempts: boolean;
  maxAttempts?: number;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
  attemptHistory?: Attempt[];
}

export default function QuizDetailPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();

  const quiz: QuizDetail = useMemo(
    () => ({
      _id: qid,
      title: `Quiz ${qid}`,
      description:
        "This quiz tests your understanding of the core concepts. Read instructions carefully and manage your time.",
      quizType: "Graded Quiz",
      points: 20,
      timeLimit: 30,
      multipleAttempts: true,
      maxAttempts: 3,
      availableDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      availableUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      attemptHistory: [
        { attemptNumber: 1, score: 12, submitTime: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), duration: "00:18:12" },
        { attemptNumber: 2, score: 16, submitTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), duration: "00:22:05" }
      ]
    }),
    [qid]
  );

  const attemptsUsed = quiz.attemptHistory ? quiz.attemptHistory.length : 0;
  const latestAttempt = quiz.attemptHistory && quiz.attemptHistory.length > 0
    ? quiz.attemptHistory[quiz.attemptHistory.length - 1]
    : null;

  const canStart = () => {
    const now = Date.now();
    const startOk = quiz.availableDate ? now >= new Date(quiz.availableDate).getTime() : true;
    const untilOk = quiz.availableUntil ? now <= new Date(quiz.availableUntil).getTime() : true;
    const attemptsOk = quiz.maxAttempts ? attemptsUsed < (quiz.maxAttempts || 0) : true;
    return startOk && untilOk && attemptsOk;
  };

  const startQuiz = () => router.push(`/Courses/${cid}/Quizzes/${qid}/take`);

  return (
    <div id="wd-quiz-detail" className="p-4">
      {/* Breadcrumb + Title */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Courses</Link></li>
          <li className="breadcrumb-item"><Link href={`/Courses/${cid}`}>{cid}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{quiz.title}</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">{quiz.title}</h1>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">Details</Button>
          <Button variant="outline-secondary" size="sm">Quiz Bar</Button>
        </div>
      </div>

      {/* Meta Row */}
      <div className="mb-4 border-bottom pb-3 d-flex flex-wrap align-items-center gap-3">
        <div className="me-3"><strong>Due</strong> {quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : '—'}</div>
        <div className="me-3"><strong>Points</strong> {quiz.points}</div>
        <div className="me-3"><strong>Questions</strong> {quiz.attemptHistory?.length ? quiz.attemptHistory.length : '—'}</div>
        <div className="me-3"><strong>Time Limit</strong> {quiz.timeLimit ? `${quiz.timeLimit} Minutes` : 'No limit'}</div>
        <div className="small text-muted ms-auto">
          {quiz.availableDate && quiz.availableUntil && (
            <span>Available {new Date(quiz.availableDate).toLocaleDateString()} - {new Date(quiz.availableUntil).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <h4 className="mb-3">Instructions</h4>
          <div className="mb-4">
            <p className="lead">{quiz.description}</p>
            <h6>Asynchronous Courses</h6>
            <ul>
              <li>Exams will be accessible for a one-week period.</li>
              <li>Exams must be submitted within one week of their release.</li>
              <li>Correct answers will be provided one day after the submission deadline.</li>
              <li>Correct answers will only be available for one week after the deadline.</li>
            </ul>

            <h6>Half Semester Terms</h6>
            <p className="text-muted">Given the accelerated pace of half-semester courses strict adherence to the exam schedule is essential. Exams must be submitted by the designated due date; late submissions will not be accepted unless you have a valid reason.</p>

            {quiz.availableUntil && Date.now() > new Date(quiz.availableUntil).getTime() && (
              <p className="text-muted">This quiz was locked {new Date(quiz.availableUntil).toLocaleString()}.</p>
            )}
          </div>

          <h5 className="mb-3">Attempt History</h5>

          {quiz.attemptHistory && quiz.attemptHistory.length > 0 ? (
            <Table hover className="mb-3">
              <thead>
                <tr>
                  <th style={{width:120}}>LATEST</th>
                  <th>Attempt</th>
                  <th>Time</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {quiz.attemptHistory.map((a) => (
                  <tr key={a.attemptNumber} className={a === latestAttempt ? 'table-light' : ''}>
                    <td className="text-danger fw-bold">{a === latestAttempt ? 'Latest' : ''}</td>
                    <td><Link href="#" className={a === latestAttempt ? 'text-danger' : ''}>Attempt {a.attemptNumber}</Link></td>
                    <td>{a.duration || '—'}</td>
                    <td>{a.score === null ? '—' : `${a.score} out of ${quiz.points}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-muted mb-3">You have not attempted this quiz yet.</div>
          )}

          {quiz.availableUntil && Date.now() > new Date(quiz.availableUntil).getTime() && (
            <Alert variant="danger">Correct answers are no longer available.</Alert>
          )}
        </div>

        <div className="col-xl-4 col-lg-5">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="mb-3">Submission Details:</Card.Title>
              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">Time:</div>
                <div>{latestAttempt?.duration ?? '—'}</div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">Current Score:</div>
                <div>{latestAttempt?.score != null ? `${latestAttempt?.score} out of ${quiz.points}` : '—'}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="text-muted">Kept Score:</div>
                <div>{latestAttempt?.score != null ? `${latestAttempt?.score} out of ${quiz.points}` : '—'}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}