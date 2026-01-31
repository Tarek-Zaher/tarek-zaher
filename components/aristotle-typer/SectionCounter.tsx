'use client';

import { libreBaskervilleRegular } from '../layout';
import nicomacheanEthics from '../../pages/experiences/aristotle-typer/data/nicomachean-ethics.json';
import { isSectionCompleted } from '../../lib/storage';
import { useState, useEffect } from 'react';

export default function SectionCounter( {bookNumber, sendSection, selectedSection} ) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div>
            <h3 className={`${libreBaskervilleRegular.className} text-base text-sky-50 text-center mb-4`}>Sections</h3>
            <div className="grid lg:grid-cols-3 md:grid-cols-8 sm:grid-cols-4 grid-cols-3 gap-5 justify-center justify-items-center">
                {nicomacheanEthics.Books.find(( book ) => book.bookNumber === bookNumber).Sections.map(( section ) => {
                    const completed = mounted && isSectionCompleted(bookNumber, section.sectionNumber);
                    return (
                        <button 
                            onClick={() => sendSection(section.sectionNumber)} 
                            key={section.sectionNumber} 
                            className={`text-center rounded-full size-12 text-xl
                                ${section.sectionNumber === selectedSection ? 'bg-[var(--accent-bg-color)]' : completed ? 'bg-[var(--green-bg-color)]' : 'bg-[var(--blue-bg-color)]'}
                                hover:cursor-pointer hover:bg-[var(--accent-bg-color)] p-2 
                                ${section.sectionNumber === selectedSection ? 'shadow-[0_1px_0_0_var(--dark-bg-color)] translate-y-[3px]' : 
                                    completed ? 'shadow-[0_1px_0_0_var(--dark-bg-color)] translate-y-[3px]' : 
                                    'shadow-[1px_4px_0_0_var(--dark-bg-color)] active:shadow-[0_1px_0_0_var(--dark-bg-color)] active:translate-y-[3px] transition-all'}`}
                        >
                            {section.sectionNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}