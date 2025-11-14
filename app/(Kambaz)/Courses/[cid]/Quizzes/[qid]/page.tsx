"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Nav, Tab, Row, Col } from "react-bootstrap";

interface Quiz {
  _id: string;
  title: string;
  course: string;
  quizType: string;
  assignmentGroup: string;
  points: number;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptsAllowed?: number;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  availableDate: string;
  availableUntil: string;
  dueDate: string;
  instructions: string;
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  
  const [quiz, setQuiz] = useState<Quiz>({
    _id: qid as string,
    title: `${qid}`,
    course: cid as string,
    quizType: "Graded Quiz",
    assignmentGroup: "Quizzes",
    points: 0,
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    showCorrectAnswers: true,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    availableDate: new Date().toISOString().slice(0, 16),
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    instructions: "This is a timed quiz. You have 20 minutes to complete it."
  });

  const handleSave = () => {
    // Save quiz logic would go here
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleSaveAndPublish = () => {
    // Save and publish logic
    router.push(`/Courses/${cid}/Quizzes`);
  };

  return (
    <div className="p-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link 
              href={`/Courses/${cid}/Quizzes`} 
              className="text-decoration-none text-danger"
            >
              Quizzes
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {quiz.title}
          </li>
        </ol>
      </nav>

      {/* Header with navigation buttons */}
      <div className="d-flex justify-content-end mb-3 gap-2">
        <span className="text-muted">Points: {quiz.points}</span>
        <span className="text-muted">⚫ Not Published</span>
        <Button variant="outline-secondary" size="sm">
          ⋯ More
        </Button>
      </div>

      {/* Tab Navigation */}
      <Tab.Container activeKey={activeTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link 
              eventKey="details" 
              onClick={() => setActiveTab("details")}
              active={activeTab === "details"}
            >
              Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="questions" 
              onClick={() => setActiveTab("questions")}
              active={activeTab === "questions"}
            >
              Questions
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Details Tab */}
          <Tab.Pane eventKey="details" className={activeTab === "details" ? "show active" : ""}>
            <Form>
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                />
              </Form.Group>

              {/* Instructions */}
              <Form.Group className="mb-3">
                <Form.Label>Quiz Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={quiz.instructions}
                  onChange={(e) => setQuiz({ ...quiz, instructions: e.target.value })}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  {/* Quiz Type */}
                  <Form.Group className="mb-3">
                    <Form.Label>Quiz Type</Form.Label>
                    <Form.Select
                      value={quiz.quizType}
                      onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
                    >
                      <option value="Graded Quiz">Graded Quiz</option>
                      <option value="Practice Quiz">Practice Quiz</option>
                      <option value="Graded Survey">Graded Survey</option>
                      <option value="Ungraded Survey">Ungraded Survey</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Points */}
                  <Form.Group className="mb-3">
                    <Form.Label>Points</Form.Label>
                    <Form.Control
                      type="number"
                      value={quiz.points}
                      onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value) || 0 })}
                    />
                  </Form.Group>

                  {/* Assignment Group */}
                  <Form.Group className="mb-3">
                    <Form.Label>Assignment Group</Form.Label>
                    <Form.Select
                      value={quiz.assignmentGroup}
                      onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                    >
                      <option value="Quizzes">Quizzes</option>
                      <option value="Exams">Exams</option>
                      <option value="Assignments">Assignments</option>
                      <option value="Project">Project</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Time Limit */}
                  <Form.Group className="mb-3">
                    <Form.Label>Time Limit (Minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      value={quiz.timeLimit}
                      onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })}
                    />
                  </Form.Group>

                  {/* Access Code */}
                  <Form.Group className="mb-3">
                    <Form.Label>Access Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={quiz.accessCode}
                      placeholder="Leave blank for no access code"
                      onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Options Section */}
              <h5 className="mt-4 mb-3">Options</h5>
              
              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Shuffle Answers"
                  checked={quiz.shuffleAnswers}
                  onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Allow Multiple Attempts"
                  checked={quiz.multipleAttempts}
                  onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                />
              </Form.Group>

              {quiz.multipleAttempts && (
                <Form.Group className="mb-2 ms-4">
                  <Form.Label>Number of Attempts Allowed</Form.Label>
                  <Form.Control
                    type="number"
                    style={{ width: "100px" }}
                    value={quiz.attemptsAllowed || 1}
                    onChange={(e) => setQuiz({ ...quiz, attemptsAllowed: parseInt(e.target.value) || 1 })}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Show Correct Answers"
                  checked={quiz.showCorrectAnswers}
                  onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="One Question at a Time"
                  checked={quiz.oneQuestionAtATime}
                  onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Webcam Required"
                  checked={quiz.webcamRequired}
                  onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Lock Questions After Answering"
                  checked={quiz.lockQuestionsAfterAnswering}
                  onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                />
              </Form.Group>

              {/* Assign Section */}
              <h5 className="mt-4 mb-3">Assign</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Assign to</Form.Label>
                <Form.Control type="text" value="Everyone" readOnly />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={quiz.dueDate}
                      onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Available from</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={quiz.availableDate}
                      onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Until</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={quiz.availableUntil}
                      onChange={(e) => setQuiz({ ...quiz, availableUntil: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4 pb-5">
                <Button variant="outline-secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleSaveAndPublish}>
                  Save & Publish
                </Button>
                <Button variant="danger" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </Form>
          </Tab.Pane>

          {/* Questions Tab */}
          <Tab.Pane eventKey="questions" className={activeTab === "questions" ? "show active" : ""}>
            <div className="text-center py-5">
              <h5>Questions</h5>
              <p className="text-muted">No questions added yet.</p>
              <Button variant="danger">
                + New Question
              </Button>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}