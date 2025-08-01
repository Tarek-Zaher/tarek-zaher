import { Press_Start_2P } from 'next/font/google';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, SplitText);

export const videoGameFont = Press_Start_2P({
    subsets: ['latin'],
    weight: '400',
})


export default function DialogueScene({ background, character, message, onBack, onNext, forgottenMemories, memories }) {

    const messageRef = useRef();
    const memRef = useRef();

    useGSAP(() => {
        if (!messageRef.current) return;

        let split = SplitText.create(messageRef.current, { type: 'words,chars' });

        gsap.from(split.chars, {
            duration: 0.5,
            autoAlpha: 0,
            ease: 'power4.out',
            stagger: 0.04,
        });

        return () => split.revert();
    }, [message]);

    useGSAP(() => {
        gsap.from('.cdImage', {
            duration: 0.5,
            autoAlpha: 0,
            x: -50,
            stagger: 0.5,
        })
    }, { dependencies: [memories], scope: memRef });

    return (
        <div className={`w-full h-screen bg-black flex text-white ${videoGameFont.className}`}>
            <div ref={memRef} className="w-[200px] bg-[#343941] text-center py-4 text-sm tracking-widest">
                <p className="text-white mb-4">Memories</p>
                {[...Array(memories)].map((_, i) => (
                    <div key={i} className="my-4">
                        <img className="mx-auto cdImage" src="/images/anniversary/cd.svg" />
                    </div>
                ))}
                {[...Array(forgottenMemories)].map((_, i) => (
                    <div key={i} className="my-4">
                        <img className="mx-auto" src="/images/anniversary/cdOutline.svg" />
                    </div>
                ))}
            </div>

            <div
                className={`flex-1 relative bg-cover bg-center`}
                style={{ backgroundImage: `url(${background})` }}
            >


                <div className={`absolute bottom-0 w-full px-6 pb-8 ${videoGameFont.className}`}>
                    <div className="relative left-13 bottom-0">
                        <img src={character.image} alt={character.name} className="w-32 rounded-lg" />
                        <div
                            className={`absolute -bottom-8 left-3 z-99 bg-[#8DA9C4] px-4 py-3 text-black font-mono text-sm shadow-lg/40 ${videoGameFont.className}`}
                        >
                            {character.name}
                        </div>
                    </div>

                    <div className="bg-[#EEF4ED] p-12 shadow font-mono text-black relative">
                        <p ref={messageRef} className={`text-center text-lg ${videoGameFont.className}`}>
                            {message}
                        </p>
                        <button onClick={onBack} className={`absolute -bottom-4 left-3 bg-[#898D97] px-4 py-3 text-black rounded-full cursor-pointer text-xs ${videoGameFont.className}`}>
                            ...
                        </button>
                        <button onClick={onNext} className={`absolute -bottom-4 -right-3 bg-[#FF6B6B] px-4 py-3 text-black rounded cursor-pointer text-xs ${videoGameFont.className}`}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-[200px] bg-[#343941] text-center py-4 text-sm tracking-widest">
                <p className="text-white"></p>
            </div>
        </div>
    );
}