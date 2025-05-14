"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Play, Pause, RotateCw } from 'lucide-react';
import styles from './focusTimer.module.css';

export default function FocusTimerPage() {
  const [module, setModule] = useState('');
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  // Reset time when duration changes
  useEffect(() => setTimeLeft(duration * 60), [duration]);

  // Timer countdown
  useEffect(() => {
    if (running && timeLeft > 0) {
      timer.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else {
      clearInterval(timer.current);
    }

    if (timeLeft === 0) {
      setRunning(false);
      alert('Focus session complete!');
    }

    return () => clearInterval(timer.current);
  }, [running, timeLeft]);

  const format = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <main className={styles.container}>
      <h1>Focus Timer</h1>

      <div className={styles.timerCircle}>
        <h2>{format(timeLeft)}</h2>
      </div>

      <div>
        <button className={styles.timerButton} onClick={() => setRunning(!running)}>
          {running ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button className={styles.timerButton} onClick={() => setTimeLeft(duration * 60)}>
          <RotateCw size={24} />
        </button>
      </div>

      <div className={styles.moduleSelect}>
        <label>What are you studying?</label>
        <div className={styles.dropdown}>
          <select value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="">Select module</option>
            {['Web Dev', 'Algorithms', 'Cybersecurity', 'AI'].map((mod) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={styles.presetButtons}>
        {[5, 25, 45, 60, 90].map((min) => (
          <button
            key={min}
            className={`${styles.presetBtn} ${duration === min ? styles.active : ''}`}
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
    </main>
  );
}
