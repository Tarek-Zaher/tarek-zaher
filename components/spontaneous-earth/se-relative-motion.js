import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const DURATIONS = [5, 4]; // seconds per loop, one per dot (different speeds)

export default function RelativeMotion() {
  const scope = useRef();
  const pathRef = useRef();
  const moversRef = useRef([]);

  useGSAP(
    () => {
      moversRef.current.forEach((el, i) => {
        gsap.to(el, {
          duration: DURATIONS[i],
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            alignOrigin: [0.5, 0.5],
          },
        });
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="w-xs md:w-xl mx-auto">
      <svg className="mx-auto block" width="80%" height="100" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet">
        <path ref={pathRef} className="stroke-mist-800 stroke-3 md:stroke-2" fill="none" d="M10 50 H990" />
        <circle ref={(el) => (moversRef.current[0] = el)} cx="10" cy="50" className="fill-mist-800 [r:15px] md:[r:10px]" />
        <circle ref={(el) => (moversRef.current[1] = el)} cx="10" cy="50" className="fill-mist-800 [r:15px] md:[r:10px]" />
      </svg>
    </div>
  );
}
