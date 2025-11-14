"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaPlus, FaCaretDown, FaRocket } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Button, InputGroup, FormControl, Dropdown } from "react-bootstrap";

// Quiz interface
interface Quiz {
  _id: string;
  title: string;
  course: string;
  availableDate: string;
  availableUntil: string;
  dueDate: string;
  points: number;
  questions: number;
  timeLimit?: number;
  attempts?: number;
  published: boolean;
  quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers: boolean;
  multipleAttempts: boolean;
  showCorrectAnswers: boolean;
  accessCode?: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
}

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Initialize quizzes data
  useEffect(() => {
    const initialQuizzes: Quiz[] = [
      {
        _id: "Q1",
        title: "Q1",
        course: cid as string,
        availableDate: "2024-09-29T15:59:00",
        availableUntil: "2024-09-29T15:59:00",
        dueDate: "2024-09-29T15:59:00",
        points: 29,
        questions: 11,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "Q2",
        title: "Q2",
        course: cid as string,
        availableDate: "2024-10-06T15:59:00",
        availableUntil: "2024-10-06T15:59:00",
        dueDate: "2024-10-06T15:59:00",
        points: 23,
        questions: 6,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "Q3",
        title: "Q3",
        course: cid as string,
        availableDate: "2024-10-13T15:59:00",
        availableUntil: "2024-10-13T15:59:00",
        dueDate: "2024-10-13T15:59:00",
        points: 32,
        questions: 7,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "Q4",
        title: "Q4",
        course: cid as string,
        availableDate: "2024-10-27T15:59:00",
        availableUntil: "2024-10-27T15:59:00",
        dueDate: "2024-10-27T15:59:00",
        points: 17,
        questions: 3,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "Q5",
        title: "Q5",
        course: cid as string,
        availableDate: "2024-10-27T15:59:00",
        availableUntil: "2024-10-27T15:59:00",
        dueDate: "2024-10-27T15:59:00",
        points: 31,
        questions: 8,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "X1",
        title: "X1",
        course: cid as string,
        availableDate: "2024-10-27T15:59:00",
        availableUntil: "2024-10-27T15:59:00",
        dueDate: "2024-10-27T15:59:00",
        points: 100,
        questions: 15,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Exams",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "Q6",
        title: "Q6",
        course: cid as string,
        availableDate: "2024-11-10T16:59:00",
        availableUntil: "2024-11-10T16:59:00",
        dueDate: "2024-11-10T16:59:00",
        points: 18,
        questions: 3,
        published: false,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      },
      {
        _id: "Q7",
        title: "Q7",
        course: cid as string,
        availableDate: "2024-11-17T16:59:00",
        availableUntil: "2024-11-17T16:59:00",
        dueDate: "2024-11-17T16:59:00",
        points: 20,
        questions: 1,
        timeLimit: 20,
        published: true,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        multipleAttempts: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
      }
    ];

    // Sort by available date
    const sortedQuizzes = initialQuizzes.sort((a, b) => 
      new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime()
    );
    
    setQuizzes(sortedQuizzes);
  }, [cid]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
  };

  const handleAddQuiz = () => {
    const newQuizId = `Q${quizzes.length + 1}`;
    const newQuiz: Quiz = {
      _id: newQuizId,
      title: `New Quiz`,
      course: cid as string,
      availableDate: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      points: 0,
      questions: 0,
      published: false,
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      shuffleAnswers: true,
      multipleAttempts: false,
      showCorrectAnswers: true,
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false
    };
    
    setQuizzes([...quizzes, newQuiz]);
    router.push(`/Courses/${cid}/Quizzes/${newQuizId}`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(q => q._id !== quizId));
  };

  const handleTogglePublish = (quizId: string) => {
    setQuizzes(quizzes.map(q => 
      q._id === quizId ? { ...q, published: !q.published } : q
    ));
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="wd-quizzes" className="p-4">
      {/* Page Title */}
      <h2 className="mb-4">Quizzes</h2>
      
      {/* Search Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Search for Quiz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Button 
          variant="danger" 
          onClick={handleAddQuiz}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          Quiz
        </Button>
      </div>

      {/* Quiz List or Empty State */}
      {quizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No quizzes available.</p>
          <p className="text-muted">Click the Quiz button to create a new quiz.</p>
        </div>
      ) : (
        <div>
          {/* Assignment Group Headers */}
          <div className="mb-3">
            <button className="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center">
              <FaCaretDown className="me-2" />
              <h5 className="mb-0">Assignment Quizzes</h5>
            </button>
          </div>

          {/* Quiz Items */}
          <ul className="list-group">
            {filteredQuizzes.map((quiz) => (
              <li key={quiz._id} className="list-group-item d-flex align-items-start">
                <div className="me-3">
                  <FaRocket className="text-success" size={20} />
                </div>
                
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Link 
                        href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                        className="text-decoration-none text-dark fw-bold"
                      >
                        {quiz.title}
                      </Link>
                      
                      <div className="small text-muted mt-1">
                        <span className={quiz.published ? "text-success" : ""}>
                          {quiz.published ? "Available" : "Closed"}
                        </span>
                        {quiz.availableDate && quiz.availableDate !== quiz.dueDate && (
                          <span> until {formatDate(quiz.availableUntil)} at {formatTime(quiz.availableUntil)}</span>
                        )}
                        <span className="mx-2">|</span>
                        <span>
                          <strong>Due</strong> {formatDate(quiz.dueDate)} at {formatTime(quiz.dueDate)}
                        </span>
                        {quiz.timeLimit && (
                          <>
                            <span className="mx-2">|</span>
                            <span>{quiz.timeLimit} mins</span>
                          </>
                        )}
                        <span className="mx-2">|</span>
                        <span>{quiz.points} pts</span>
                        <span className="mx-2">|</span>
                        <span>{quiz.questions} Question{quiz.questions !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      {quiz.published && (
                        <IoMdCheckmarkCircleOutline className="text-success me-2" size={20} />
                      )}
                      
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="link" 
                          className="text-dark p-0 border-0"
                          id={`dropdown-${quiz._id}`}
                        >
                          <BsThreeDotsVertical />
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu>
                          <Dropdown.Item 
                            onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDeleteQuiz(quiz._id)}>
                            Delete
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleTogglePublish(quiz._id)}>
                            {quiz.published ? 'Unpublish' : 'Publish'}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}