"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Play, Pause, RotateCw, Square } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./focusTimer.module.css";

export default function FocusTimerPage() {
  const [programmeData, setProgrammeData] = useState([]);
  const [module, setModule] = useState("");
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const timer = useRef(null);

  // Fetch available modules
  useEffect(() => {
    async function fetchProgrammes() {
      try {
        const res = await fetch("/api/programmeData");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProgrammeData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch programme data", err);
      }
    }
    fetchProgrammes();
  }, []);

  // Reset timer when duration changes
  useEffect(() => setTimeLeft(duration * 60), [duration]);

  // Timer countdown logic
  useEffect(() => {
    if (running && timeLeft > 0) {
      timer.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else {
      clearInterval(timer.current);
    }

    if (timeLeft === 0 && running) {
      handleEndSession("complete");
    }

    return () => clearInterval(timer.current);
    // eslint-disable-next-line
  }, [running, timeLeft]);

  const format = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const allCourses = programmeData.flatMap((p) =>
    Array.isArray(p.courses) ? p.courses : []
  );

  const handleStart = () => {
    if (duration < 1) {
      toast.error("Minimum duration is 1 minute");
      return;
    }
    setStartTime(Date.now());
    setRunning(true);
  };

  const handleStop = () => {
    const confirmStop = confirm("Stop the session early?");
    if (confirmStop) {
      handleEndSession("stopped");
    }
  };

  // POPUP animation logic
  const handleEndSession = async (type) => {
    setRunning(false);
    clearInterval(timer.current);

    const now = Date.now();
    const totalSeconds = Math.floor((now - startTime) / 1000);
    const actualDuration = Math.ceil(totalSeconds / 60);
    const intendedDuration = duration;
    const xpEarned = Math.max(1, Math.floor(totalSeconds / 300)); // 1 XP per 5 min

    try {
      // Log session
      await fetch("/api/focus-log/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module,
          type,
          startTime,
          endTime: now,
          intendedDuration,
          actualDuration,
          xpEarned,
        }),
      });

      // Award XP for the session
      const xpRes = await fetch("/api/xp/gain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: xpEarned }),
      });

      const xpData = await xpRes.json();
      if (xpData.success) {
        // Animate XP gained popup
        toast(
          <span>
            <b>🎯 Session Complete!</b>
            <br />
            <span style={{ fontSize: "1.15em", color: "#22c55e" }}>
              +{xpEarned} XP Earned
            </span>
          </span>,
          {
            icon: "🔥",
            duration: 4000,
            style: { background: "#fffde7", color: "#222", fontWeight: 600 },
          }
        );

        // Optionally show level up if your API returns this
        if (xpData.levelUp) {
          toast(
            <span>
              <b>🚀 Level Up!</b>
              <br />
              You reached level {xpData.newLevel}!
            </span>,
            { icon: "🥇", duration: 4000 }
          );
        }
      } else {
        toast.error("XP update failed.");
      }

      toast.success(
        type === "complete"
          ? "Focus session logged!"
          : "Session ended early and logged.",
        { duration: 3000 }
      );
    } catch (err) {
      toast.error("Error saving session");
      console.error(err);
    }

    setTimeLeft(duration * 60);
  };

  return (
    <main className={styles.container}>
      <h1>Focus Timer</h1>

      <div className={styles.timerCircle}>
        <h2>{format(timeLeft)}</h2>
      </div>

      <div>
        {running ? (
          <>
            <button className={styles.timerButton} onClick={() => setRunning(false)}>
              <Pause size={32} />
            </button>
            <button className={styles.timerButton} onClick={handleStop}>
              <Square size={28} />
            </button>
          </>
        ) : (
          <button className={styles.timerButton} onClick={handleStart}>
            <Play size={32} />
          </button>
        )}
        <button
          className={styles.timerButton}
          onClick={() => {
            setRunning(false);
            setTimeLeft(duration * 60);
          }}
        >
          <RotateCw size={24} />
        </button>
      </div>

      <div className={styles.moduleSelect}>
        <label>What are you studying?</label>
        <div className={styles.dropdown}>
          <select value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="">Select module</option>
            {allCourses.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={styles.historyLink}>
        <Link href="/focus-history" className={styles.historyAnchor}>
          View Focus History →
        </Link>
      </div>

      <div className={styles.presetButtons}>
        {[5, 25, 45, 60, 90].map((min) => (
          <button
            key={min}
            className={`${styles.presetBtn} ${duration === min ? styles.active : ""}`}
            onClick={() => {
              setDuration(min);
              setRunning(false);
              setTimeLeft(min * 60);
            }}
          >
            {min} min
          </button>
        ))}
      </div>

      <div className={styles.customInput}>
        <label htmlFor="customDuration">Or enter custom duration:</label>
        <input
          id="customDuration"
          type="number"
          min="1"
          placeholder="e.g. 12"
          value={duration}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 1) {
              setDuration(val);
              setRunning(false);
              setTimeLeft(val * 60);
            }
          }}
        />{" "}
        <span>minutes</span>
      </div>
    </main>
  );
}
