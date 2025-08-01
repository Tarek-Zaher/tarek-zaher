import Head from 'next/head';
import { Bangers } from 'next/font/google';
import { Patrick_Hand } from 'next/font/google';
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Starfield from "/components/Starfield.tsx";


const bangers = Bangers({
    subsets: ['latin'],
    weight: '400',
});

const patrickHand = Patrick_Hand({
    subsets: ['latin'],
    weight: '400',
});

export default function TheIrons() {

    const marqueeRef = useRef(null);
    const peterClearBoyRef = useRef(null);
    const gilbertGreenRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;

        // Duplicate the content to create the seamless loop
        const totalWidth = marquee.scrollWidth;
        marquee.innerHTML += marquee.innerHTML;

        gsap.to(marquee, {
            x: 0,
            duration: 20,
            ease: "linear",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => (parseFloat(x) % totalWidth))
            }
        });

        gsap.set(marquee, { x: -totalWidth });

        gsap.set(peterClearBoyRef.current, { scale: 0 });

        let tl = gsap.timeline();

        tl.to(peterClearBoyRef.current, {
            duration: 8,
            rotate: 360,
            scale: 1,
            ease: "linear",
        })

    }, []);


    return (
        <div>
            <Head>
                <title>The Hero's Journey</title>
            </Head>
            <main>
                <section className="w-full h-auto">
                    <Starfield
                        starCount={3000}
                        starColor={[255, 255, 255]}
                        speedFactor={0.05}
                        backgroundColor="black"
                    />

                    <div className="overflow-hidden w-full h-24 relative">
                        <div
                            ref={marqueeRef}
                            className="absolute top-0 left-0 flex gap-2 items-center h-full"
                        >
                            {Array.from({ length: 10 }).map((_, i) => (
                                <img
                                    key={i}
                                    src="/images/the-irons/irons-logo.png"
                                    alt="The Irons Logo"
                                    className="h-22 w-auto object-contain"
                                />
                            ))}
                        </div>
                    </div>

                    <img ref={peterClearBoyRef} className="w-[65%] mx-auto mt-8" src="/images/the-irons/peter-clear-boy.svg" alt="Peter Clear Boy" />

                    <div>
                        <h1 className={`${bangers.className} text-6xl text-center text-[#EFA111] pt-4`} style={{ textShadow: '6px 0 0 #A7201D', WebkitTextStroke: '1px black' }}>The Hero's Journey</h1>
                        <h6 className={`${patrickHand.className} text-center text-gray-50`}>A fan project by Tarek Zaher</h6>
                    </div>

                    <div className="w-[80%] h-auto overflow-hidden mt-8 mx-auto">
                        <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <circle r="50" cx="50" cy="50" fill="#DE2A32" />
                        </svg>
                    </div>
                </section>
            </main>
        </div>
    );
}