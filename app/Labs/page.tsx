/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
export default function Labs() {
    return (
        <div id="wd-labs">
            <div id="self-info">
                <h2>Name: Rushikesh Rajendra Wani</h2>
                <h3>Section: 04</h3>
                <h3>Course Code: CS 5610</h3>
                <h3>
                    <a href="https://github.com/Rushikesh36/kambaz-next-js-app"> 
                        Github Link
                    </a>
                </h3>
            </div>
            <h1>Labs</h1>
            <ul>
                <li>
                    <Link href="/Labs/Lab1" id="wd-lab1-link">
                        Lab 1: HTML Examples </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab2" id="wd-lab2-link">
                        Lab 2: CSS Basics </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab3" id="wd-lab3-link">
                        Lab 3: JavaScript Fundamentals </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab4" id="wd-lab4-link">
                        Lab 4:  </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab5" id="wd-lab4-link">
                        Lab 5: Node.js  </Link>
                </li>
            </ul>
        </div>
    );
}
