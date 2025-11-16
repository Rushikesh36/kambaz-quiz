"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    FormControl,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateCourse, setCourses } from "../Courses/reducer";
import * as client from "../Courses/client";
import { RootState } from "../store";
import {
    setEnrollments,
    enrollInCourse,
    unenrollFromCourse,
} from "../Courses/[cid]/Enrollments/reducer";
import {
    findEnrollmentsForUser,
    enrollInCourseApi,
    unenrollFromCourseApi,
} from "../Courses/[cid]/Enrollments/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [course, setCourse] = useState<any>({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
    });

    const onAddNewCourse = async () => {
        const newCourse = await client.createCourse(course);
        dispatch(setCourses([...courses, newCourse]));
    };

    const onDeleteCourse = async (courseId: string) => {
        await client.deleteCourse(courseId);
        dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
    };

    const onUpdateCourse = async () => {
        await client.updateCourse(course);
        dispatch(
            setCourses(
                courses.map((c) => {
                    if (c._id === course._id) {
                        return course;
                    } else {
                        return c;
                    }
                })
            )
        );
    };

    const [showAllCourses, setShowAllCourses] = useState(false);
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const currentUser = useSelector(
        (state: RootState) => state.accountReducer.currentUser
    ) as any;
    const { enrollments } = useSelector(
        (state: RootState) => state.enrollmentsReducer
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const fetchCourses = async () => {
        try {
            const courses = await client.findMyCourses();
            dispatch(setCourses(courses));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEnrollments = async (userId: string) => {
        try {
            const data = await findEnrollmentsForUser(userId);
            dispatch(setEnrollments(data));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            router.push("Account/Signin");
            return;
        }
        fetchCourses();
        fetchEnrollments(currentUser._id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?._id]);

    if (!currentUser) {
        return null;
    }

    const userEnrollments = enrollments.filter(
        (e: any) => e.user === currentUser._id
    );

    const isEnrolledIn = (courseId: string) =>
        userEnrollments.some((en: any) => en.course === courseId);

    const visibleCourses = showAllCourses
        ? courses
        : courses.filter((course) => isEnrolledIn(course._id));

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h5>
                New Course
                <button
                    className="btn btn-primary float-end ms-2"
                    id="wd-toggle-enrollments"
                    onClick={() => setShowAllCourses((v) => !v)}
                >
                    Enrollments
                </button>
                <button
                    className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={onAddNewCourse}
                >
                    Add
                </button>
                <button
                    className="btn btn-warning float-end me-2"
                    onClick={onUpdateCourse}
                    id="wd-update-course-click"
                >
                    Update
                </button>
            </h5>
            <hr />
            <br />
            <FormControl
                value={course.name}
                className="mb-2"
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
            />
            <FormControl
                as="textarea"
                value={course.description}
                rows={3}
                onChange={(e) =>
                    setCourse({ ...course, description: e.target.value })
                }
            />

            <h2 id="wd-dashboard-published">
                {showAllCourses ? "All Courses" : "Published Courses"} (
                {showAllCourses ? courses.length : visibleCourses.length})
            </h2>
            <hr />

            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {visibleCourses.map((course) => {
                        const enrolled = isEnrolledIn(course._id);

                        return (
                            <Col
                                key={course._id}
                                className="wd-dashboard-course"
                                style={{ width: "300px" }}
                            >
                                <Card>
                                    {enrolled ? (
                                        <Link
                                            href={`/Courses/${course._id}/Home`}
                                            className="wd-dashboard-course-link text-decoration-none text-dark"
                                        >
                                            <Card.Img
                                                src={course.image}
                                                variant="top"
                                                width="100%"
                                                height={160}
                                            />
                                            <CardBody className="card-body">
                                                <CardTitle className="wd-dashboard-course-title fw-bold text-wrap text-primary overflow-hidden">
                                                    {course.name}
                                                </CardTitle>
                                                <CardText
                                                    className="wd-dashboard-course-description overflow-hidden"
                                                    style={{ height: "100px" }}
                                                >
                                                    {course.description}
                                                </CardText>

                                                <div className="mb-2">
                                                    <button
                                                        className="btn btn-danger btn-sm me-2"
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            await unenrollFromCourseApi(
                                                                currentUser._id,
                                                                course._id
                                                            );
                                                            dispatch(
                                                                unenrollFromCourse({
                                                                    user: currentUser._id,
                                                                    course: course._id,
                                                                })
                                                            );
                                                        }}
                                                        id={`wd-unenroll-${course._id}`}
                                                    >
                                                        Unenroll
                                                    </button>
                                                </div>

                                                <Button variant="primary">Go</Button>
                                                <button
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        onDeleteCourse(course._id);
                                                    }}
                                                    className="btn btn-danger float-end"
                                                    id="wd-delete-course-click"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    id="wd-edit-course-click"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setCourse(course);
                                                    }}
                                                    className="btn btn-warning me-2 float-end"
                                                >
                                                    Edit
                                                </button>
                                            </CardBody>
                                        </Link>
                                    ) : (
                                        <div className="text-muted">
                                            <Card.Img
                                                src={course.image}
                                                variant="top"
                                                width="100%"
                                                height={160}
                                            />
                                            <CardBody className="card-body">
                                                <CardTitle className="wd-dashboard-course-title fw-bold text-wrap text-secondary overflow-hidden">
                                                    {course.name}
                                                </CardTitle>
                                                <CardText
                                                    className="wd-dashboard-course-description overflow-hidden"
                                                    style={{ height: "100px" }}
                                                >
                                                    {course.description}
                                                </CardText>

                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        await enrollInCourseApi(
                                                            currentUser._id,
                                                            course._id
                                                        );
                                                        dispatch(
                                                            enrollInCourse({
                                                                user: currentUser._id,
                                                                course: course._id,
                                                            })
                                                        );
                                                    }}
                                                    id={`wd-enroll-${course._id}`}
                                                >
                                                    Enroll
                                                </button>
                                            </CardBody>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
}