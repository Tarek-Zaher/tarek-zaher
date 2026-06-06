import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

export default function Gravity() {
    const container = useRef();

    useGSAP(() => {
        gsap.to("#mover", {
            duration: 5,
            repeat: 12,
            yoyo: true,
            ease: "none",
            motionPath:{
                path: "#path",
                align: "#path",
                alignOrigin: [0.5, 0.5],
            }
        })
    }, {scope: container })
    return (
        <div ref={container}>
            <div>

                <h5 className="italic tracking-wide text-mist-700 text-center
                content-center w-xs md:w-xl mx-auto mt-32 mb-28">
                    Despite what you may have been taught, high-mass objects like the Earth don't
                    actually pull things towards them. Gravity isn't a force in the traditional sense. Instead, it's
                    the result of the warping of spacetime by matter in the universe.
                </h5>

                <h1 className=" 
                    text-mist-800 
                    text-5xl text-center
                    font-normal
                    md:text-7xl
                    font-cormorant
                    tracking-wide
                    w-xs md:w-xl flex-1
                    content-center mx-auto mb-32
                    ">
                        How does gravity make things fall?
                    </h1>
                
               <div className="w-xs md:w-xl mx-auto">
                    <p className="
                        text-mist-800 font-lato text-base
                    ">
                        <span class="uppercase text-lg font-normal">Spacetime </span>
                        One of the discoveries Einstein is famous for is the realization
                        that time is a physical dimension we move through just like space. 
                    </p>
                    <svg className="mx-auto block" width="80%" height="100" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet">
                        <path id="path" className="stroke-mist-800 stroke-2" fill="none" d="M10 50 H990"></path>
                        <circle id="mover" r="10" cx="10" cy="50" className="fill-mist-800"></circle>
                    </svg>
                </div>
            </div>
        </div>
    )
}