import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Starfield from "/components/ambient-backgrounds/Starfield.tsx";

export default function Stars() {

    useGSAP(() => {
        gsap.set(['html', 'body'], {
            backgroundColor: 'black',
        });
    });

    return (
        <>
            <Starfield warpSpeedFactor={0.4} starCount={5000} starColor={[255, 255, 255]} />
            <nav className="relative z-10 text-center mt-8 flex items-center justify-center">
                <a href="/" className="text-white no-underline text-lg font-lexend">Spontaneous Earth</a>
            </nav>
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className=" 
                text-mist-100 
                text-6xl
                font-normal
                md:text-[10rem] 
                font-libre-baskerville 
                tracking-wide
                ">Stars</h1>
            </div>
        </>
    )
}