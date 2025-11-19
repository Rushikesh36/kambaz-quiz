import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import * as client from "../../../Account/client";
import { FormControl } from "react-bootstrap";

export default function PeopleDetails({
    uid,
    onClose,
}: {
    uid: string | null;
    onClose: () => void;
}) {
    const [user, setUser] = useState<any>({});
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);

    const deleteUser = async (uid: string) => {
        await client.deleteUser(uid);
        onClose();
    };

    const fetchUser = async () => {
        if (!uid) return;
        const u = await client.findUserById(uid);
        setUser(u);
    };

    useEffect(() => {
        if (uid) {
            fetchUser();
            setEditing(false);
        }
    }, [uid]);

    const startEditing = () => {
        // initialize name from current user
        const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
        setName(fullName);
        setEditing(true);
    };

    const saveUser = async () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setEditing(false);
            return;
        }

        const parts = trimmed.split(" ");
        const firstName = parts.shift() ?? "";
        const lastName = parts.join(" "); // supports multi-word last names, and never undefined

        const updatedUser = { ...user, firstName, lastName };
        await client.updateUser(updatedUser);
        setUser(updatedUser);
        setEditing(false);
        onClose();
    };

    if (!uid) return null;

    return (
        <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
            <button
                onClick={onClose}
                className="btn position-fixed end-0 top-0 wd-close-details"
            >
                <IoCloseSharp className="fs-1" />
            </button>

            <div className="text-center mt-2">
                <FaUserCircle className="text-secondary me-2 fs-1" />
            </div>
            <hr />

            <div className="text-danger fs-4">
                {!editing && (
                    <FaPencil
                        onClick={startEditing}
                        className="float-end fs-5 mt-2 wd-edit"
                    />
                )}
                {editing && (
                    <FaCheck
                        onClick={saveUser}
                        className="float-end fs-5 mt-2 me-2 wd-save"
                    />
                )}

                {!editing && (
                    <div className="wd-name" onClick={startEditing}>
                        {user.firstName} {user.lastName}
                    </div>
                )}

                {editing && (
                    <FormControl
                        className="w-50 wd-edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                saveUser();
                            }
                        }}
                    />
                )}
            </div>

            <b>Roles:</b> <span className="wd-roles">{user.role}</span> <br />
            <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span> <br />
            <b>Section:</b> <span className="wd-section">{user.section}</span> <br />
            <b>Total Activity:</b>{" "}
            <span className="wd-total-activity">{user.totalActivity}</span>
            <hr />
            <button
                onClick={() => deleteUser(uid)}
                className="btn btn-danger float-end wd-delete"
            >
                Delete
            </button>
            <button
                onClick={onClose}
                className="btn btn-secondary float-end me-2 wd-cancel"
            >
                Cancel
            </button>
        </div>
    );
}