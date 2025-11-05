import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
    const dispatch = useDispatch();
    return (
        <ListGroupItem key={todo.id}>
            <Button onClick={() => dispatch(deleteTodo(todo.id))} id="wd-delete-todo-click">
                Delete
            </Button>
            <Button onClick={() => dispatch(setTodo(todo))} id="wd-set-todo-click">
                Edit
            </Button>
            {todo.title}
        </ListGroupItem>
    );
}