import { libreBaskervilleBold, libreBaskervilleRegular } from '../../../components/layout';
import TypingTest from '../../../components/aristotle-typer/TypingTest';
import { useSearchParams } from 'next/navigation';
import nicomacheanEthics from './data/nicomachean-ethics.json';
import { useState } from 'react';
import { House, Keyboard, Target } from 'lucide-react';
import { saveProgress } from '../../../lib/storage';


export default function Type() {
    const searchParams = useSearchParams();
    const bookNumber = searchParams.get('bookNumber');
    const selectedSection = parseInt(searchParams.get('selectedSection'));
    const [isCompleted, setIsCompleted] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const handleComplete = (wpm: number, accuracy: number) => {
        setIsCompleted(true);
        setWpm(wpm);
        setAccuracy(accuracy);
        saveProgress(bookNumber, selectedSection, {
            wpm,
            accuracy,
            date: new Date().toISOString(),
            completed: true
          });
    }

    return (
        <div className={`px-8 py-4 text-lg leading-[2] tracking-wide lg:px-64`} onClick={() => document.querySelector('textarea')?.focus()}>
            <TypingTest referenceText={nicomacheanEthics.Books.find(( book ) => book.bookNumber === bookNumber)?.Sections?.find(( section ) => section.sectionNumber === selectedSection)?.text ?? ''} onComplete={handleComplete} />
        </div>
    );
}