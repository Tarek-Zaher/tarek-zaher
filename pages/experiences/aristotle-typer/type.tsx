import { libreBaskervilleRegular } from '../../../components/layout';
import TypingTest from '../../../components/aristotle-typer/TypingTest';
import { useSearchParams } from 'next/navigation';
import nicomacheanEthics from './data/nicomachean-ethics.json';
import { useState } from 'react';
import { House } from 'lucide-react';
import { saveProgress } from './data/storage';


export default function Type() {
    const searchParams = useSearchParams();
    const bookNumber = searchParams.get('bookNumber');
    const selectedSection = parseInt(searchParams.get('selectedSection'));
    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = (wpm: number, accuracy: number) => {
        setIsCompleted(true);
        saveProgress(bookNumber, selectedSection, {
            wpm,
            accuracy,
            date: new Date().toISOString(),
            completed: true
          });
    }

    return (
        <div className={`px-8 py-4 text-lg leading-[2] tracking-wide lg:px-64`} onClick={() => document.querySelector('textarea')?.focus()}>
            <div className="text-center">
                <a href="/experiences/aristotle-typer/dashboard">
                    <House className="w-8 h-8 inline-block text-stone-700" />
                </a>
            </div>
            <TypingTest referenceText={nicomacheanEthics.Books.find(( book ) => book.bookNumber === bookNumber)?.Sections?.find(( section ) => section.sectionNumber === selectedSection)?.text ?? ''} onComplete={handleComplete} />
            {isCompleted && <div className="text-center">
                <p className={`${libreBaskervilleRegular.className} text-2xl text-stone-700 text-center pt-4 pb-2`}>Completed! Go back to the dashboard.</p>
            </div>}
        </div>
    );
}