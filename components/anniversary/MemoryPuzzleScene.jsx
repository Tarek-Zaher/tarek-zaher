import { useState, useRef, useEffect } from 'react';
import { videoGameFont } from '../../components/anniversary/DialogueScene';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

export default function MemoryPuzzleScene({ title, date, images, prompts, forgottenMemories, memories, onNext }) {
    const [inputs, setInputs] = useState(Array(prompts.length).fill(''));
    const [solved, setSolved] = useState(Array(prompts.length).fill(false));
    const [currentPrompt, setCurrentPrompt] = useState(0);
    const prompt = prompts[currentPrompt];
    const puzzleRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentPrompt]); // refocus when prompt changes

    const handleChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const handleSubmit = (e, index) => {
        e.preventDefault();
        const correct = prompts[index].answer.toLowerCase();
        const guess = inputs[index].trim().toLowerCase();

        if (guess === correct || guess === "skip") {
            const newSolved = [...solved];
            newSolved[index] = true;
            setSolved(newSolved);

            let ca = gsap.timeline();
            ca.to('.promptBox', {
                duration: 0.2,
                backgroundColor: '#537A5A',
            })
            .to('.promptBox', {
                    duration: 0.2,
                    backgroundColor: '#2F323A',
                })



            if (index === currentPrompt && index < prompts.length - 1) {
                setCurrentPrompt(index + 1); // unlock next prompt
            }
        } else {
            let ia = gsap.timeline();
            ia.to('.promptBox', {
                duration: 0.2,
                backgroundColor: '#FF6B6B',
            })
                .to('.promptBox', {
                    duration: 0.2,
                    backgroundColor: '#2F323A',
                })
        }
    };

    useGSAP(() => {
        if (solved[4]) {
            gsap.to('.titleText', {
                duration: 1.5,
                scrambleText: title,
            });
            gsap.to('.dateText', {
                duration: 1.5,
                scrambleText: date,
            });
        }

    }, { dependencies: [solved], scope: puzzleRef });

    const allSolved = solved.every(Boolean);

    return (
        <div className={`grid grid-cols-8 lg:grid-rows-1 bg-[#537A5A] h-[100vh] ${videoGameFont.className}`}>
            {/*Memories Section*/}
            <div className={`bg-[#343941] text-center py-4 text-sm tracking-widest`}>
                <p className={`text-white mb-4`}>Memories</p>
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
            {/*Puzzle Section*/}
            <div ref={puzzleRef} className={`col-span-6 grid grid-cols-22 grid-rows-6 gap-4`}>
                {/*Title & Date*/}
                <div class="col-span-22">
                    <h1 class="text-white text-center text-4xl pt-4 pb-2 titleText">∆ß#~R5t N3x`K!gZ</h1>
                    <h3 class="text-white text-center text-xl dateText">2≠⊗7⚙︎9 ℓ5/√∫ 20Ξ4</h3>
                </div>
                {/*Images*/}
                <div class="col-span-8 col-start-2 row-span-4">
                    <img className={`h-full w-full object-cover rounded-lg transition-all duration-1000 ${solved[0] ? '' : 'blur-lg'}`} src={images[0]}></img>
                </div>
                <div class="col-span-12 col-end-22 row-span-2 row-start-0">
                    <img className={`w-full h-full object-cover rounded-lg transition-all duration-1000 ${solved[1] ? '' : 'blur-lg'}`} src={images[1]}></img>
                </div>
                <div class="col-span-6 row-span-2">
                    <img className={`w-full h-full object-cover rounded-lg transition-all duration-1000 ${solved[2] ? '' : 'blur-lg'}`} src={images[2]}></img>
                </div>
                <div class="col-span-6 row-span-2">
                    <img className={`w-full h-full object-cover rounded-lg transition-all duration-1000 ${solved[3] ? '' : 'blur-lg'}`} src={images[3]}></img>
                </div>
                {/*Prompt Box*/}
                <div className={`row-span-2 col-span-20 col-start-2 promptBox border border-[#EEF4ED] rounded-t-lg border-b-0 ${solved.every(Boolean) ? 'bg-[#537A5A]' : 'bg-[#2F323A]'}`}>
                    <form key={currentPrompt} onSubmit={(e) => handleSubmit(e, currentPrompt)} className="mb-4 p-4">
                        <p className="mb-4 text-white text-xs text-center px-6">{prompt.question}</p>
                        <div className="flex gap-2 w-[70%] mx-auto">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputs[currentPrompt]}
                                onChange={(e) => handleChange(currentPrompt, e.target.value)}
                                className="flex-1 p-2 text-[#EEF4ED] text-center rounded border-b border-[#EEF4ED]"
                                placeholder="Your answer..."
                            />
                            {solved[4] ?
                                <button onClick={onNext} className={`bg-[#537A5A] px-4 py-3 text-white rounded cursor-pointer text-xs`}>
                                    Next
                                </button>
                                :
                                <button type="submit" className="cursor-pointer bg-[#8DA9C4] px-4 py-2 rounded">
                                    →
                                </button>
                            }
                        </div>
                    </form>
                </div>

            </div>

            {/*Hints Section*/}
            <div className={`bg-[#343941] text-center py-4 text-sm tracking-widest`}>
                <p className="text-white mb-4"></p>
            </div>
        </div>
    )
}
