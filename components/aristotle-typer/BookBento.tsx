'use client';

import { libreBaskervilleBold } from '../../components/layout';
import { libreBaskervilleRegular } from '../../components/layout';
import SectionCounter from './SectionCounter';
import { Keyboard, Target, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function BookBento( {bookNumber, description, averageWpm, accuracy} ) {
    const [selectedSection, setSectionNumber] = useState(0);
    const handleSectionChange = (value: number) => {
        setSectionNumber(value);
    };

    return (
        <div className="shadow-xl rounded-lg mb-16 p-4 bg-[var(--blue-bg-color)] border border-stone-600 mx-4">  
            <div key={bookNumber} className="lg:grid lg:grid-cols-4 lg:grid-rows-4 gap-4 rounded-lg p-4">

                <div className="lg:col-span-3 lg:row-span-3 bg-[var(--dark-bg-color)] border border-stone-600 rounded-xl px-8 py-8 flex flex-wrap">
                    <h2 className={`${libreBaskervilleBold.className} lg:text-5xl text-2xl text-sky-50`}>Book {bookNumber}</h2>
                    <p className={`${libreBaskervilleRegular.className} lg:text-lg text-sm text-sky-50 pt-16 self-end`}>{description}</p>
                </div>

                <div className="lg:col-span-1 lg:row-span-4 bg-gray-500 border border-stone-600 rounded-xl p-4 mt-4 lg:mt-0">
                    <SectionCounter bookNumber={bookNumber} sendSection={handleSectionChange} selectedSection={selectedSection} />
                </div>

                <div className={`lg:col-span-1 lg:row-span-1 bg-gray-500 ${libreBaskervilleRegular.className} text-sky-50 text-center text-lg rounded-full content-center p-4 mt-4`}>
                    <p><Keyboard className="w-8 h-8 inline-block mr-2" />avg wpm: {averageWpm}</p>
                </div>

                <div className={`lg:col-span-1 lg:row-span-1 bg-gray-500 ${libreBaskervilleRegular.className} text-sky-50 text-center text-lg rounded-full content-center p-4 mt-4`}>
                    <p><Target className="w-8 h-8 inline-block mr-2" />accuracy: {accuracy}%</p>
                </div>

                <div className={`lg:col-span-1 lg:row-span-1 ${selectedSection > 0 ? 'bg-[var(--accent-bg-color)]' : 'bg-gray-400'} ${libreBaskervilleBold.className} text-sky-50 text-center text-lg rounded-full content-center p-4 mt-4`}>
                    <a className={`${selectedSection > 0 ? 'hover:cursor-pointer' : 'hover:cursor-not-allowed'} no-underline`} href={`/experiences/aristotle-typer/type?bookNumber=${bookNumber}&selectedSection=${selectedSection}`}>Start Typing <ExternalLink className="w-8 h-8 inline-block ml-2" /></a>
                </div>
            </div>
        </div>
  );
}