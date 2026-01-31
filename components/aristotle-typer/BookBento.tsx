import { libreBaskervilleBold } from '../../components/layout';
import { libreBaskervilleRegular } from '../../components/layout';
import SectionCounter from './SectionCounter';
import { Keyboard, Target, ExternalLink } from 'lucide-react';

export default function BookBento( {bookNumber, description, AverageWPM, Accuracy} ) {
    return (
        <div key={bookNumber} className="lg:grid lg:grid-cols-4 lg:grid-rows-5 gap-4 rounded-lg p-4 mb-8 shadow-xl">

            <div className="lg:col-span-3 lg:row-span-3 bg-[var(--dark-bg-color)] rounded-xl px-8 py-8 flex flex-wrap">
                <h2 className={`${libreBaskervilleBold.className} lg:text-5xl text-2xl text-sky-50`}>Book {bookNumber}</h2>
                <p className={`${libreBaskervilleRegular.className} lg:text-lg text-sm text-sky-50 pt-16 self-end`}>{description}</p>
            </div>

            <div className="lg:col-span-1 lg:row-span-4 bg-[var(--dark-bg-color)] rounded-xl p-4 mt-4 lg:mt-0">
                <SectionCounter bookNumber={bookNumber} />
            </div>

            <div className={`lg:col-span-1 lg:row-span-1 bg-[var(--dark-bg-color)] ${libreBaskervilleBold.className} text-sky-50 text-center text-lg rounded-full content-center p-4 mt-4`}>
                <p><Keyboard className="w-8 h-8 inline-block mr-2" />avg wpm: {AverageWPM}</p>
            </div>

            <div className={`lg:col-span-1 lg:row-span-1 bg-[var(--dark-bg-color)] ${libreBaskervilleBold.className} text-sky-50 text-center text-lg rounded-full content-center p-4 mt-4`}>
                <p><Target className="w-8 h-8 inline-block mr-2" />accuracy: {Accuracy}%</p>
            </div>

            <div className={`lg:col-span-1 lg:row-span-1 bg-[var(--accent-bg-color)] ${libreBaskervilleBold.className} text-sky-50 text-center text-lg rounded-full content-center p-4 mt-4`}>
                <p>Start Typing <ExternalLink className="w-8 h-8 inline-block ml-2" /></p>
            </div>
        </div>
  );
}