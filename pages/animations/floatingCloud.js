'use client'

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../../components/layout';


gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function GsapTest() {
    const container = useRef();

    useGSAP(() => {
        gsap.fromTo(
            ".cloud",
            {x: '-100vw' },
            {
                scrollTrigger: {
                    trigger: '.title',
                    scrub: 1,
                    start: 'top top',
                    end: 'max',
                    pin: '.cloud',
                    anticipatePin: 1,
                },
                duration: 5,
                x: '100vw',
            }
        );

        }, { scope: container })

    return (
        <Layout>
            <div ref={container} className="w-full h-[300vh] bg-[#87CEEB] relative overflow-x-hidden">
                <h1 className="title text-center text-4xl font-bold pt-20 px-8">Scroll to see a floating cloud 😃☁️</h1>
                <div className="cloud">
                    <img src="../images/smilingcloud.svg" alt="White cartoon cloud with a smiling face" />
                </div>
            </div>
        </Layout>
    );
}