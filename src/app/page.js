// src/app/page.js
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Course Connect!</h1>
        <p>Your one-stop hub for managing academic tasks and timetables.</p>
      </header>

      <section className={styles.profileSection}>
        <div className={styles.profileCard}>
          <h2>Your Profile</h2>
          <p>
            <strong>Name:</strong> Jane Doe
          </p>
          <p>
            <strong>University:</strong> Example University
          </p>
          <p>
            <strong>Enrolled Courses:</strong> COMP101, MATH202, HIST303
          </p>
        </div>
      </section>

      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/taskmanager">Task Manager</Link>
          </li>
          <li>
            <Link href="/timetable">Timetable</Link>
          </li>
          <li>
            <Link href="/notifications">Notifications</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
