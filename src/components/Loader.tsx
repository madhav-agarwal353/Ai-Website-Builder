import React, { useEffect, useState } from "react";

// Fully self-contained technical loader
// Uses INLINE CSS only (no Tailwind config, no external CSS)
// Tailwind used ONLY for centering text/layout

const STEPS = [
  "Parsing intent",
  "Laying out structure",
  "Assembling components",
  "Tightening interactions",
  "Final build pass",
];

export default function Loader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-center bg-transparent w-full h-full m-auto">
      <div className="flex flex-col items-center gap-8">
        {/* Core animation */}
        <div style={styles.core}>
          <div style={styles.ring} />

          <Orbit delay={0} />
          <Orbit delay={300} />
          <Orbit delay={600} />

          <div style={styles.center}>
            <div style={styles.bounce} />
          </div>
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-white text-sm tracking-wide font-medium">
            {STEPS[step]}
          </p>
          <p className="mt-1 text-white/40 text-xs tracking-widest">
            BUILD SYSTEM ACTIVE
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────── helpers ───────── */

function Orbit({ delay }: { delay: number }) {
  return (
    <div
      style={{
        ...styles.orbit,
        animationDelay: `${delay}ms`,
      }}
    >
      <span style={styles.orbitDot} />
    </div>
  );
}

/* ───────── inline styles ───────── */

const styles: Record<string, React.CSSProperties> = {
  core: {
    position: "relative",
    width: 80,
    height: 80,
  },
  ring: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.3)",
    animation: "spin 6s linear infinite",
  },
  orbit: {
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    animation: "orbit 2.4s linear infinite",
  },
  orbitDot: {
    width: 8,
    height: 8,
    background: "white",
    borderRadius: 999,
    marginTop: -4,
  },
  center: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bounce: {
    width: 14,
    height: 14,
    background: "white",
    borderRadius: "50%",
    animation: "bounce 1s ease-in-out infinite",
  },
};

/* Inject keyframes once */
if (typeof document !== "undefined" && !document.getElementById("loader-keyframes")) {
  const style = document.createElement("style");
  style.id = "loader-keyframes";
  style.innerHTML = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes orbit { to { transform: rotate(360deg); } }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `;
  document.head.appendChild(style);
}
