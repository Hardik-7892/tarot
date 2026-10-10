"use client";

import { useEffect, useState } from "react";
import styles from "./Starfield.module.css";

/** Ambient constellation canvas. Static fallback if reduced motion. */
export default function Starfield() {
  const [stars] = useState(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: (i * 37.7) % 100,
      top: (i * 53.3) % 100,
      size: 1 + ((i * 7) % 3),
      delay: (i % 12) * 0.7,
    }))
  );
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={styles.sky} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className={reduced ? styles.starStatic : styles.star}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className={styles.nebula} />
    </div>
  );
}
