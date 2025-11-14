import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1,
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10",
        completed: false,
        score: 50,
    });

    const [moduleObj, setModuleObj] = useState({
        id: "M101",
        name: "Lab 5 Module",
        description: "Module for practicing working with objects",
        course: "CS5610 Web Development",
    });

    const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
    const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

    useEffect(() => {
        const loadAssignment = async () => {
            try {
                const response = await fetch(ASSIGNMENT_API_URL);
                const data = await response.json();
                setAssignment(data);
            } catch (e) {
                console.error("Failed to load assignment", e);
            }
        };
        if (ASSIGNMENT_API_URL) {
            loadAssignment();
        }
    }, [ASSIGNMENT_API_URL]);

    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>

        
            <h4>Modifying Properties</h4>
            <a
                id="wd-update-assignment-title"
                className="btn btn-primary float-end"
                href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(
                    assignment.title
                )}`}
            >
                Update Title
            </a>
            <FormControl
                className="w-75"
                id="wd-assignment-title"
                value={assignment.title}
                onChange={(e) =>
                    setAssignment({ ...assignment, title: e.target.value })
                }
            />
            <hr />

            {/* RETRIEVING ASSIGNMENT OBJECT */}
            <h4>Retrieving Objects</h4>
            <a
                id="wd-retrieve-assignments"
                className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/assignment`}
            >
                Get Assignment
            </a>
            <hr />

            {/* RETRIEVING ASSIGNMENT TITLE */}
            <h4>Retrieving Properties</h4>
            <a
                id="wd-retrieve-assignment-title"
                className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/assignment/title`}
            >
                Get Title
            </a>
            <hr />

            {/* NEW: MODULE ROUTES / UI */}

            <h4>Module Object</h4>
            {/* Get full module */}
            <a
                id="wd-get-module"
                className="btn btn-primary"
                href={`${MODULE_API_URL}`}
            >
                Get Module
            </a>{" "}
            {/* Get module name only */}
            <a
                id="wd-get-module-name"
                className="btn btn-secondary"
                href={`${MODULE_API_URL}/name`}
            >
                Get Module Name
            </a>
            <hr />

            {/* Edit module name */}
            <h4>Edit Module Name</h4>
            <FormControl
                className="w-75"
                id="wd-module-name"
                value={moduleObj.name}
                onChange={(e) =>
                    setModuleObj({ ...moduleObj, name: e.target.value })
                }
            />
            <a
                id="wd-update-module-name"
                className="btn btn-primary mt-2"
                href={`${MODULE_API_URL}/name/${encodeURIComponent(
                    moduleObj.name
                )}`}
            >
                Update Module Name
            </a>
            <hr />

            {/* Edit module description */}
            <h4>Edit Module Description</h4>
            <FormControl
                className="w-75"
                id="wd-module-description"
                value={moduleObj.description}
                onChange={(e) =>
                    setModuleObj({
                        ...moduleObj,
                        description: e.target.value,
                    })
                }
            />
            <a
                id="wd-update-module-description"
                className="btn btn-primary mt-2"
                href={`${MODULE_API_URL}/description/${encodeURIComponent(
                    moduleObj.description
                )}`}
            >
                Update Module Description
            </a>
            <hr />

            <h4>Edit Assignment Score</h4>
            <FormControl
                className="w-75"
                id="wd-assignment-score"
                type="number"
                value={assignment.score}
                onChange={(e) =>
                        setAssignment({
                            ...assignment,
                            score: Number(e.target.value),
                        })
                    }
            />
            <a
                id="wd-update-assignment-score"
                className="btn btn-warning mt-2"
                href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
            >
                Update Score
            </a>
            <hr />

            <h4>Edit Assignment Completed</h4>
            <label>
                <input
                    type="checkbox"
                    id="wd-assignment-completed"
                    checked={assignment.completed}
                    onChange={(e) =>
                        setAssignment({
                            ...assignment,
                            completed: e.target.checked,
                        })
                    }
                />{" "}
                Completed
            </label>
            <a
                id="wd-update-assignment-completed"
                className="btn btn-warning ms-2"
                href={`${ASSIGNMENT_API_URL}/completed/${
                    assignment.completed ? "true" : "false"
                }`}
            >
                Update Completed
            </a>
            <hr />
        </div>
    );
}
