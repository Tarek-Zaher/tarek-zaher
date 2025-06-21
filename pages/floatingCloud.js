'use client'

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function GsapTest() {
    const container = useRef();

    useGSAP(() => {
        gsap.to(
            ".cloud",
            {
                scrollTrigger: {
                    trigger: '.title',
                    scrub: 1,
                    start: 'top top',
                    end: 'max',
                    pin: '.cloud',
                },
                duration: 5,
                x: '130vw',
            }
        );

        }, { scope: container })

    return (
        <div ref={container} className="w-full h-[300vh] bg-[#87CEEB] relative">
            <h1 className=".title text-center text-4xl font-bold pt-20">Scroll to see a floating cloud 😃☁️</h1>
            <div className="cloud left-[-30vw]">
                <img src="images/smilingcloud.svg" alt="White cartoon cloud with a smiling face" />
            </div>
        </div>
    );
}