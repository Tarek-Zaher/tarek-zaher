import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(useGSAP, Draggable);

// --- geometry (SVG user units, 1:1 with the viewBox) ---
const SIZE = 300;
const OX = 44; // origin x (corner where both axes meet)
const OY = 256; // origin y
const R = 240; // axis length === circle radius (the "speed of light")
const INIT = Math.PI / 4; // start the dot at 45°

// Build the quarter circle as a polyline so it matches the dot's math exactly
// (avoids SVG arc-flag guesswork and any drift vs. the dragged point).
function arcPath() {
  const steps = 64;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2);
    const x = OX + R * Math.cos(t);
    const y = OY - R * Math.sin(t);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
}

const ARC = arcPath();

export default function SpacetimeDial() {
  const scope = useRef();
  const dotRef = useRef();
  const ringRef = useRef();
  const hintRef = useRef(); // the pulsing-ring tween, so we can kill it on first grab
  const [angle, setAngle] = useState(INIT);
  const [moved, setMoved] = useState(false);

  // dot's untransformed position (Draggable translates from here)
  const cx0 = OX + R * Math.cos(INIT);
  const cy0 = OY - R * Math.sin(INIT);

  useGSAP(
    () => {
      // "you can move me!" hint: ring pulses outward until the first grab
      hintRef.current = gsap.fromTo(
        ringRef.current,
        { attr: { r: 9 }, opacity: 0.6 },
        { attr: { r: 22 }, opacity: 0, duration: 1.3, repeat: -1, repeatDelay: 3, ease: 'sine.out' }
      );

      Draggable.create(dotRef.current, {
        type: 'x,y',
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress: () => {
          setMoved(true); // hides the ring via JSX (fresh state, no stale closure)
          hintRef.current?.kill(); // stop the pulse directly via the ref
        },
        // Constrain every move onto the quarter circle and report the angle.
        liveSnap: {
          points: (p) => {
            const ax = cx0 + p.x; // proposed absolute dot center
            const ay = cy0 + p.y;
            let a = Math.atan2(OY - ay, ax - OX); // angle from origin, up = +
            a = Math.max(0, Math.min(Math.PI / 2, a)); // clamp to first quadrant
            // snap the last few degrees so the pure-space / pure-time
            // extremes (0% / 100%) are easy to land on exactly
            const EDGE = 0.06; // ~3.4°
            if (a < EDGE) a = 0;
            else if (a > Math.PI / 2 - EDGE) a = Math.PI / 2;
            setAngle(a);
            return { x: OX + R * Math.cos(a) - cx0, y: OY - R * Math.sin(a) - cy0 };
          },
        },
      });
    },
    { scope }
  );

  // derived values (re-rendered from the single source of truth: angle)
  const dotX = OX + R * Math.cos(angle);
  const dotY = OY - R * Math.sin(angle);
  // Show each speed SQUARED (as a share of c²). Because sin²+cos²=1 these
  // always total 100%. Derive time as the remainder so rounding never drifts.
  const spacePct = Math.round(Math.sin(angle) ** 2 * 100);
  const timePct = 100 - spacePct;

  return (
    <div ref={scope} className="w-xs md:w-xl mx-auto mt-8 flex flex-col items-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="max-w-full touch-none select-none overflow-visible"
      >

        {/* axes */}
        <line x1={OX} y1={OY} x2={OX + R} y2={OY} className="stroke-mist-800" strokeWidth="1.5" />
        <line x1={OX} y1={OY} x2={OX} y2={OY - R} className="stroke-mist-800" strokeWidth="1.5" />

        {/* quarter-circle "always c" track */}
        <path d={ARC} fill="none" className="stroke-mist-800" strokeWidth="1" strokeDasharray="4 6" />

        {/* guide lines from the dot down to each axis */}
        <line x1={OX} y1={dotY} x2={dotX} y2={dotY} className="stroke-mist-800" strokeWidth="1" strokeDasharray="3 4" />
        <line x1={dotX} y1={OY} x2={dotX} y2={dotY} className="stroke-mist-800" strokeWidth="1" strokeDasharray="3 4" />

        {/* axis labels */}
        <text x={OX + R / 2} y={OY + 30} textAnchor="middle" className="fill-mist-700 font-cormorant" fontSize="14">
          → motion through time: {timePct}
        </text>
        <text
          x={OX - 30}
          y={OY - R / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${OX - 30} ${OY - R / 2})`}
          className="fill-mist-700 font-cormorant"
          fontSize="14"
        >
          → motion through space: {spacePct}
        </text>

        {/* "drag me" hint ring — pulses until the first interaction */}
        {!moved && (
          <circle
            ref={ringRef}
            cx={cx0}
            cy={cy0}
            r="9"
            fill="none"
            className="stroke-mist-800"
            strokeWidth="2"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* draggable dot — last so it sits on top */}
        <circle ref={dotRef} cx={cx0} cy={cy0} r="8" className="fill-mist-800" style={{ cursor: 'grab' }} />
      </svg>
    </div>
  );
}
