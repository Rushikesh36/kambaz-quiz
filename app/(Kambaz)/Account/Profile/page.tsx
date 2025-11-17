"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import * as client from "../client";
import { Button, FormControl } from "react-bootstrap";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentUser } = useSelector(
        (state: RootState) => state.accountReducer
    );

    const loadProfile = async () => {
        try {
            // Always ask server who is logged in (session)
            const serverUser = await client.profile();
            dispatch(setCurrentUser(serverUser));
            setProfile(serverUser);
        } catch (e) {
            // Not logged in
            router.push("/Account/Signin");
        }
    };

    const updateProfile = async () => {
        const updatedProfile = await client.updateUser(profile);
        dispatch(setCurrentUser(updatedProfile));
        setProfile(updatedProfile);
    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        router.push("/Account/Signin");
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <div className="wd-profile-screen">
            <h3>Profile</h3>
            {profile && profile._id && (
                <div>
                    <FormControl
                        id="wd-username"
                        className="mb-2"
                        value={profile.username ?? ""}
                        onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                        }
                    />
                    <FormControl
                        id="wd-password"
                        className="mb-2"
                        type="password"
                        value={profile.password ?? ""}
                        onChange={(e) =>
                            setProfile({ ...profile, password: e.target.value })
                        }
                    />
                    <FormControl
                        id="wd-firstname"
                        className="mb-2"
                        value={profile.firstName ?? ""}
                        onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                        }
                    />
                    <FormControl
                        id="wd-lastname"
                        className="mb-2"
                        value={profile.lastName ?? ""}
                        onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                        }
                    />
                    <FormControl
                        id="wd-dob"
                        className="mb-2"
                        type="date"
                        value={profile.dob ?? ""}
                        onChange={(e) =>
                            setProfile({ ...profile, dob: e.target.value })
                        }
                    />
                    <FormControl
                        id="wd-email"
                        className="mb-2"
                        value={profile.email ?? ""}
                        onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                        }
                    />
                    <select
                        className="form-control mb-2"
                        id="wd-role"
                        value={profile.role ?? "USER"}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                    </select>

                    <button
                        onClick={updateProfile}
                        className="btn btn-primary w-100 mb-2"
                    >
                        Update
                    </button>

                    <Button
                        onClick={signout}
                        className="w-100 mb-2"
                        id="wd-signout-btn"
                    >
                        Sign out
                    </Button>
                </div>
            )}
        </div>
    );
}