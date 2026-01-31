import { libreBaskervilleRegular } from '../layout';
import nicomacheanEthics from '../../pages/experiences/aristotle-typer/data/nicomachean-ethics.json';

export default function SectionCounter( {bookNumber} ) {
    return (
        <div>
            <h3 className={`${libreBaskervilleRegular.className} text-base text-sky-50 text-center mb-4`}>Sections</h3>
            <div className="grid lg:grid-cols-3 md:grid-cols-8 sm:grid-cols-4 grid-cols-3 gap-5 justify-center justify-items-center">
                {nicomacheanEthics.Books.find(( book ) => book.bookNumber === bookNumber).Sections.map(( section ) => (
                    <div key={section.sectionNumber} className={`text-center rounded-full ${section.completed ? 'bg-[var(--green-bg-color)]' : 'bg-[var(--blue-bg-color)]'} p-2 size-12 text-lg`}>{section.sectionNumber}</div>
                ))}
            </div>
        </div>
    );
}