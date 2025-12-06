import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    
    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            dispatch(setCurrentUser(currentUser));
            setPending(false);
        } catch (err: any) {
            console.error("User not authenticated", err);
            router.push("/Account/Signin");
            // Keep pending true to prevent showing content during redirect
        }
    };
    
    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if (!pending) {
        return children;
    }
    
    // Show loading state while checking authentication
    return <div>Loading...</div>;
}