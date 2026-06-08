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
const INIT = Math.PI / 2.5; // start the dot at 45°

// gauge centers (must match the <circle> centers in the JSX below)
const ODO_X = SIZE - SIZE / 3; // speed odometer center x
const ODO_Y = 25;
const NEEDLE_LEN = 20; // needle reaches from pivot toward the rim
const CLK_X = SIZE - 25; // clock center x
const CLK_Y = 20;
const CLK_MAX_SPEED = 40; // hand speed multiplier when timePct === 100 (super fast)
const CLK_MIN_SPEED = 0.15; // floor so even timePct === 1 still creeps (only 0 fully stops)
const CLK_SPEED_EXP = 4; // >1 makes the curve dramatic: low/mid stay calm, top explodes

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
  const needleRef = useRef(); // odometer needle (rotates with spacePct)
  const minuteRef = useRef(); // clock minute hand
  const hourRef = useRef(); // clock hour hand
  const clockTweens = useRef([]); // the two infinite hand spins, so we can timeScale them
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
        { attr: { r: 22 }, opacity: 0, duration: 1.3, repeat: -1, repeatDelay: 1.5, ease: 'sine.out' }
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

      // clock hands spin forever; the timePct effect below scales their speed.
      // minute hand makes a full turn in 6s, hour hand 12x slower (72s).
      clockTweens.current = [
        gsap.to(minuteRef.current, {
          rotation: 360,
          svgOrigin: `${CLK_X} ${CLK_Y}`,
          duration: 6,
          ease: 'none',
          repeat: -1,
        }),
        gsap.to(hourRef.current, {
          rotation: 360,
          svgOrigin: `${CLK_X} ${CLK_Y}`,
          duration: 72,
          ease: 'none',
          repeat: -1,
        }),
      ];
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

  // odometer needle: spacePct 0 → points left, 100 → points right (sweeps the top)
  useGSAP(
    () => {
      gsap.to(needleRef.current, {
        rotation: (spacePct / 100) * 180,
        svgOrigin: `${ODO_X} ${ODO_Y}`,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    { scope, dependencies: [spacePct] }
  );

  // clock speed: scale both hand spins by timePct (0 → frozen, 100 → fastest)
  useGSAP(
    () => {
      const speed =
        timePct === 0
          ? 0 // a true standstill only at exactly 0
          : CLK_MIN_SPEED + (CLK_MAX_SPEED - CLK_MIN_SPEED) * (timePct / 100) ** CLK_SPEED_EXP;
      clockTweens.current.forEach((t) => t && t.timeScale(speed));
    },
    { scope, dependencies: [timePct] }
  );

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

        {/* odometer + clock */}
        <circle r="26" cx={SIZE - (SIZE / 3)} cy="25" className="stroke-mist-800 fill-none"></circle>
        <circle r="25" cx={SIZE - (SIZE / 3)} cy="25" className="stroke-mist-800 fill-none" stroke-dasharray="1 7" stroke-width="3" stroke-dashoffset="-1.2"></circle>
        <rect width="55" height="28" x={SIZE - (SIZE / 3) - 28} y="25" fill="#E8DDB5"></rect>
        <path ref={needleRef} className="needle-odometer stroke-mist-800" strokeWidth="1.2" fill="none" d={`M ${ODO_X} ${ODO_Y} L ${ODO_X - NEEDLE_LEN} ${ODO_Y}`} />
        <circle className="fill-mist-800" r="3" cx={SIZE - (SIZE / 3)} cy="25"></circle>
        <text x={SIZE - (SIZE / 3)} y="40" textAnchor="middle" className="font-cormorant text-xs">mph</text>

        <circle r="21" cx={SIZE - 25} cy="20" className="stroke-mist-800 fill-none"></circle>
        <circle r="20" cx={SIZE - 25} cy="20" className="stroke-mist-800 fill-none" stroke-dasharray="1 9.4" stroke-width="3" stroke-dashoffset="-1.2"></circle>
        <circle r="2" cx={SIZE - 25} cy="20" className="fill-mist-800"></circle>
        <path ref={minuteRef} className="clock-minute stroke-mist-800" strokeWidth="1.2" fill="none" d={`M ${CLK_X} ${CLK_Y} L ${CLK_X} ${CLK_Y - 14}`} />
        <path ref={hourRef} className="clock-hour stroke-mist-800" strokeWidth="1.6" fill="none" d={`M ${CLK_X} ${CLK_Y} L ${CLK_X} ${CLK_Y - 9}`} />


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

        {/* draggable group: big invisible hit area + visible dot, dragged together */}
        <g ref={dotRef} style={{ cursor: 'grab' }}>
          {/* transparent (not none!) so it still captures pointer/touch events */}
          <circle cx={cx0} cy={cy0} r="22" fill="transparent" />
          <circle cx={cx0} cy={cy0} r="8" className="fill-mist-800" />
        </g>
      </svg>
    </div>
  );
}
