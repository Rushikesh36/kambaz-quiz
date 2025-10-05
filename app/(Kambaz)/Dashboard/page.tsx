import Link from "next/link";
import Image from "next/image";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button } from "react-bootstrap";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">CS1234 React JS</CardTitle>
                                    <CardText>Full Stack software developer</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/5678/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">CS5678 Python for Data Science</CardTitle>
                                    <CardText>Introduction to machine learning with Python</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/9012/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">UI9012 UX/UI Fundamentals</CardTitle>
                                    <CardText>User experience design and prototyping</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/3456/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">WEB3456 Modern Web Development</CardTitle>
                                    <CardText>Advanced JavaScript and framework integration</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/7890/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">AI7890 Artificial Intelligence Basics</CardTitle>
                                    <CardText>Foundations of AI and intelligent systems</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1122/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">SEC1122 Cybersecurity Essentials</CardTitle>
                                    <CardText>Network security and ethical hacking</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/3344/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">DB3344 Database Management Systems</CardTitle>
                                    <CardText>SQL and NoSQL database administration</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/5566/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg as={Image} src="/images/course.jpg" width={200} height={150} alt="" />
                                <CardBody>
                                    <CardTitle as="h5">GAM5566 Game Development with Unity</CardTitle>
                                    <CardText>Introduction to C# and 3D game design</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

