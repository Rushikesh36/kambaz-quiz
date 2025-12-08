"use client";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function TOC() {
    const pathname = usePathname();
    return (
        <Nav variant="pills">
            <NavItem>
                <NavLink href="/" as={Link}>
                    Kambaz </NavLink> </NavItem>
        </Nav>
    );
}

