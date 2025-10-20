"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function CourseNavigation(
  { params }: { params?: { cid?: string } } = {}
) {
  const pathname = usePathname();
  const routeParams = (typeof useParams === "function" ? useParams() : null) as
    | { cid?: string }
    | null;

  const cid = params?.cid ?? routeParams?.cid ?? "1234";

  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];

  const hrefFor = (label: (typeof links)[number]) => {
    const segment = label === "People" ? "People/Table" : label;
    return `/Courses/${encodeURIComponent(String(cid))}/${segment}`;
  };

  const isActive = (href: string) => {
    return pathname ? pathname.startsWith(href) : false;
  };

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label) => {
        const href = hrefFor(label);
        const id = `wd-course-${label.toLowerCase()}-link`;
        const active = isActive(href);
        const className = `list-group-item border-0 ${active ? "active" : "text-danger"}`;
        return (
          <Link key={label} href={href} id={id} className={className}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
