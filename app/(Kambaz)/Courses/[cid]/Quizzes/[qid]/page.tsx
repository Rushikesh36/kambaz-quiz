"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, ProgressBar, Table } from "react-bootstrap";
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
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="mb-1">{quiz.title}</h3>
          <div className="text-muted small">{quiz.quizType} • {quiz.points} pts</div>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-primary">Details</Button>
          <Button variant="outline-secondary">Quiz Bar</Button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Instructions</Card.Title>
              <Card.Text>{quiz.description}</Card.Text>

              <div className="d-flex align-items-center gap-3">
                <div>
                  <strong>Time Limit</strong>
                  <div className="text-muted">{quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No limit'}</div>
                </div>

                <div>
                  <strong>Attempts</strong>
                  <div className="text-muted">{quiz.maxAttempts ? `${attemptsUsed}/${quiz.maxAttempts}` : attemptsUsed}</div>
                </div>

                <div>
                  <strong>Due</strong>
                  <div className="text-muted">{quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : '—'}</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Attempt History</Card.Title>
              {quiz.attemptHistory && quiz.attemptHistory.length > 0 ? (
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Attempt</th>
                      <th>Score</th>
                      <th>Submitted</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quiz.attemptHistory.map((a) => (
                      <tr key={a.attemptNumber} className={a === latestAttempt ? 'table-primary' : ''}>
                        <td>{a.attemptNumber}</td>
                        <td>{a.score === null ? '—' : `${a.score}/${quiz.points}`}</td>
                        <td>{a.submitTime ? new Date(a.submitTime).toLocaleString() : 'In progress'}</td>
                        <td>{a.duration || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-muted">You have not attempted this quiz yet.</div>
              )}
            </Card.Body>
          </Card>

          <div className="d-flex gap-2">
            <Button id="wd-start-quiz-btn" onClick={startQuiz} disabled={!canStart()}>
              Start Quiz
            </Button>

            <Link href={`/Courses/${cid}/Quizzes`} className="btn btn-outline-secondary">
              Back to Quizzes
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Quick Overview</Card.Title>
              <div className="mb-3">
                <div className="small text-muted">Progress (latest attempt)</div>
                <ProgressBar now={latestAttempt && latestAttempt.score ? (latestAttempt.score / quiz.points) * 100 : 0} label={latestAttempt && latestAttempt.score ? `${Math.round(((latestAttempt.score || 0) / quiz.points) * 100)}%` : '0%'} />
              </div>

              <div>
                <div><strong>Available:</strong></div>
                <div className="text-muted small">{quiz.availableDate ? new Date(quiz.availableDate).toLocaleString() : '—'}</div>
                <div className="text-muted small">until {quiz.availableUntil ? new Date(quiz.availableUntil).toLocaleString() : '—'}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}