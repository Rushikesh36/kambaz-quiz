"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithArrays() {
    const API = `${HTTP_SERVER}/lab5/todos`;
    const [todo, setTodo] = useState({
        id: "1",
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-09-09",
        completed: false,
    });

    return (
        <div id="wd-working-with-arrays">
            <h3>Working with Arrays</h3>
            <h4>Retrieving Arrays</h4>
            <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
                Get Todos </a><hr />
            <h4>Retrieving an Item from an Array by ID</h4>
            <a id="wd-retrieve-todo-by-id" className="btn btn-primary float-end" href={`${API}/${todo.id}`}>
                Get Todo by ID
            </a>
            <FormControl id="wd-todo-id" defaultValue={todo.id} className="w-50"
                onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
            <hr />
            <h3>Filtering Array Items</h3>
            <a id="wd-retrieve-completed-todos" className="btn btn-primary"
                href={`${API}?completed=true`}>
                Get Completed Todos
            </a><hr />
            <h3>Creating new Items in an Array</h3>
            <a id="wd-retrieve-completed-todos" className="btn btn-primary"
                href={`${API}/create`}>
                Create Todo
            </a><hr />

            <h3>Removing from an Array</h3>
            <a id="wd-remove-todo" className="btn btn-primary float-end" href={`${API}/${todo.id}/delete`}>
                Remove Todo with ID = {todo.id} </a>
            <FormControl defaultValue={todo.id} className="w-50" onChange={(e) => setTodo({ ...todo, id: e.target.value })} /><hr />

            <h3>Updating an Item in an Array</h3>

            {/* Update Title */}
            <h4>Update Title</h4>
            <div className="d-flex gap-2 mb-3 align-items-center">
                <FormControl
                    id="wd-update-title-id"
                    value={todo.id}
                    className="w-25"
                    onChange={(e) => setTodo({ ...todo, id: e.target.value })}
                />
                <FormControl
                    id="wd-update-title-text"
                    value={todo.title}
                    className="flex-grow-1"
                    onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                />
                <a
                    id="wd-update-todo-title"
                    href={`${API}/${todo.id}/title/${todo.title}`}
                    className="btn btn-primary"
                >
                    Update Title
                </a>
            </div>

            {/* Update Description */}
            <h4>Update Description</h4>
            <div className="d-flex gap-2 mb-3 align-items-center">
                <FormControl
                    id="wd-todo-description"
                    value={todo.description}
                    className="flex-grow-1"
                    onChange={(e) => setTodo({ ...todo, description: e.target.value })}
                />
                <a
                    id="wd-update-todo-description"
                    href={`${API}/${todo.id}/description/${todo.description}`}
                    className="btn btn-primary"
                >
                    Update Description
                </a>
            </div>

            {/* Update Completed */}
            <h4>Completed</h4>
            <div className="d-flex gap-2 mb-3 align-items-center">
                <div className="form-check">
                    <input
                        id="wd-todo-completed"
                        type="checkbox"
                        className="form-check-input"
                        checked={todo.completed}
                        onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
                    />
                    <label className="form-check-label ms-1" htmlFor="wd-todo-completed">
                        Completed
                    </label>
                </div>
                <a
                    id="wd-update-todo-completed"
                    href={`${API}/${todo.id}/completed/${todo.completed}`}
                    className="btn btn-primary"
                >
                    Update Completed
                </a>
            </div>

            <hr />
        </div>
    );
}
