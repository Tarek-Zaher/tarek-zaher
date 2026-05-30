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
            <nav className="text-center mt-6">
                <a href="/" 
                className="text-white no-underline"></a>

            </nav>
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className=" 
                text-mist-100 
                text-6xl
                md:text-[10rem] 
                font-libre-baskerville 
                tracking-wide
                ">Space</h1>
                <h5 
                className="
                italic 
                text-mist-100
                text-xl
                mx-auto
                mt-16
                max-w-2xl
                "
                ></h5>
            </div>
        </>
    )
}