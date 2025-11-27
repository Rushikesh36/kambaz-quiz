"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

export default function Signup() {
    const [user, setUser] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();

    const signup = async () => {
        const currentUser = await client.signup(user);
        if (!currentUser) return;
        dispatch(setCurrentUser(currentUser));
        router.push("/Account/Profile");
    };

    return (
        <div id="wd-signup-screen" style={{ maxWidth: 400 }}>
            <h3 className="mb-4">Signup</h3>

            <FormControl
                value={user.username ?? ""}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="mb-2"
                placeholder="username"
                id="wd-username"
            />

            <FormControl
                value={user.password ?? ""}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="mb-2"
                placeholder="password"
                type="password"
                id="wd-password"
            />

            <Button
                onClick={signup}
                id="wd-signup-btn"
                className="w-100"
            >
                Sign up
            </Button>

            <div className="form-group mt-2">
                <Link
                    href="Signin"
                    id="wd-signin-link"
                    className="text-primary"
                >
                    Signin
                </Link>
            </div>
        </div>
    );
}