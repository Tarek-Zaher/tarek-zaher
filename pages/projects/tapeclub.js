import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { useRef, useState } from 'react';

const STICKER_ROTATIONS = [-12, 18, -30, -4, 61, -12, -6];

const SLIDES = [
    { src: '/images/tapeclub/HeroDescription.png', alt: 'Tape Club is a network in Austin. Members record pieces of their lives onto cassette tapes.' },
    { src: '/images/tapeclub/descriptiontext2.png', alt: 'Description 2' },
    { src: '/images/tapeclub/descriptiontext3.png', alt: 'Description 3' },
    { src: '/images/tapeclub/descriptiontext4.png', alt: 'Description 4' },
];

export default function TapeClub() {
    const slideRefs = useRef([]);
    const containerRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useGSAP(() => {
        gsap.set(['html', 'body'], { backgroundColor: '#231D16' });
        slideRefs.current.forEach((el, i) => {
            if (i !== 0) gsap.set(el, { yPercent: -150, autoAlpha: 0 });
        });
        const stickers = gsap.utils.toArray('.tc-sticker');
        stickers.forEach((el, i) => {
            const base = STICKER_ROTATIONS[i];
            gsap.set(el, { rotation: base });
            gsap.to(el, {
                rotation: base + 15,
                duration: 0.08,
                ease: 'none',
                yoyo: true,
                repeat: -1,
                repeatDelay: 0.3,
            });
        });
    });

    const goNext = () => {
        const next = (currentSlide + 1) % SLIDES.length;
        const nextEl = slideRefs.current[next];
        gsap.set(nextEl, { yPercent: -150, autoAlpha: 1 });
        gsap.to(containerRef.current, { height: nextEl.offsetHeight, duration: 0.5, ease: 'power2.inOut' });
        gsap.to(slideRefs.current[currentSlide], { yPercent: 150, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' });
        gsap.to(nextEl, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.inOut', delay: 0.1 });
        setCurrentSlide(next);
    };

    return (
        <div>
            {/* Main Div */}
            <div className="flex flex-col bg-[url(/images/tapeclub/BackgroundTexture.png)] min-h-screen">

                 {/* Hero top sticker section */}
                 <div className="flex flex-row justify-between mt-8 mx-8">
                    <div className="w-16 md:w-32">
                        <img src="/images/tapeclub/TapeClubTextLogo.png" alt="Tape Club Logo" className="" />
                    </div>

                    <div className="flex flex-row gap-4 md:gap-12">
                        <img src="/images/tapeclub/TCPinkYellowSticker.png" alt="Tape Club Logo" className="tc-sticker h-[35px] hidden md:block" />
                        <img src="/images/tapeclub/TCBlueYellowSticker.png" alt="Tape Club Logo" className="tc-sticker h-[20px] md:h-[35px]" />
                        <img src="/images/tapeclub/TCYellowOrangeSticker.png" alt="Tape Club Logo" className="tc-sticker h-[20px] md:h-[35px]" />
                        <img src="/images/tapeclub/TCOrangeYellowSticker.png" alt="Tape Club Logo" className="tc-sticker h-[20px] md:h-[35px]" />
                        <img src="/images/tapeclub/TCYellowBlueSticker.png" alt="Tape Club Logo" className="tc-sticker h-[35px] hidden md:block" />
                        <img src="/images/tapeclub/TCGreenYellowSticker.png" alt="Tape Club Logo" className="tc-sticker h-[35px] hidden md:block" />
                        <img src="/images/tapeclub/TCYellowPinkSticker.png" alt="Tape Club Logo" className="tc-sticker h-[35px] hidden md:block" />
                    </div>

                    <div className="w-12 md:w-24 mt-[-10px]">
                        <img src="/images/tapeclub/TCRoundSticker.png" alt="Tape Club Logo" />
                    </div>
                 </div>

                 {/* Middle Cassette + description + invite only text section */}
                 <div className="flex flex-row justify-between items-end mt-4 md:mt-0">
                    <div className="hidden md:block justify-items-start md:ml-4 md:mb-4">
                        <img src="/images/tapeclub/SaleSticker.png" alt="Tape Club Logo" className="scale-75 -rotate-5" />
                    </div>
                    <div className="w-xs mx-auto md:w-xl">
                        <img src="/images/tapeclub/HeroText.png" alt="A Piece of Someone's Life." className="mb-6 md:mb-4" />
                        <img src="/images/tapeclub/CassetteTape.png" alt="Picture of a cassette tape" className="mb-6 md:mb-2" />
                        {/* Mobile: static stack of all slides */}
                        <div className="md:hidden flex flex-col">
                            {SLIDES.map((slide) => (
                                <img key={slide.src} src={slide.src} alt={slide.alt} className="mb-4" />
                            ))}
                        </div>

                        {/* Desktop: animated slider */}
                        <div ref={containerRef} className="hidden md:block relative overflow-hidden">
                            {SLIDES.map((slide, i) => (
                                <img
                                    key={slide.src}
                                    ref={el => slideRefs.current[i] = el}
                                    src={slide.src}
                                    alt={slide.alt}
                                    className={`scale-75${i !== 0 ? ' absolute top-0 left-0 w-full' : ''}`}
                                />
                            ))}
                        </div>
                        <img
                            src="/images/tapeclub/DownArrow.png"
                            alt="Down Arrow"
                            onClick={goNext}
                            className="hidden md:block mx-auto md:scale-75 mb-4 cursor-pointer"
                        />
                        <img src="/images/tapeclub/SaleSticker.png" alt="Tape Club Logo" className="md:hidden mx-auto scale-75 -rotate-5 mb-4" />
                        <p className="text-white font-bold text-center text-[10px] md:text-xs mb-4 [text-shadow:0px_-6px_4px_rgba(28,57,146,0.25),0px_6px_4px_rgba(199,77,77,0.25),0px_0px_100px_rgba(255,255,255,0.5)] md:blur-[0.5px]">This is invite only. Inquiries and press, email <a href="mailto:hello@tapeclubatx.com">hello@tapeclubatx.com</a></p>
                    </div>
                    <div className="hidden md:block w-32 mb-4 md:mb-8 mr-4 md:mr-8">
                        <img src="/images/tapeclub/TapeClubTextLogo.png" alt="Tape Club Logo" className="" />
                    </div>
                 </div>
            </div>


        </div>
    )
}
