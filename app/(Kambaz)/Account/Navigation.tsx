"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type AccountUser = {
    role?: string;
    // add other fields if you want (username, etc.)
};

export default function AccountNavigation() {
    const accountState = useSelector((state: RootState) => state.accountReducer);
    const currentUser = accountState.currentUser as AccountUser | null;

    const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
    const pathname = usePathname();

    return (
        <Nav variant="pills">
            {currentUser?.role === "ADMIN" && (
                <NavLink
                    as={Link}
                    href="/Account/Users"
                    active={pathname.endsWith("Users")}
                >
                    Users
                </NavLink>
            )}

            {links.map((link) => (
                <NavItem key={link}>
                    <NavLink
                        as={Link}
                        href={`/Account/${link}`}
                        active={pathname.toLowerCase().endsWith(link.toLowerCase())}
                    >
                        {link}
                    </NavLink>
                </NavItem>
            ))}
        </Nav>
    );
}