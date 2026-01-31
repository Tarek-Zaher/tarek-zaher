import { libreBaskervilleBold } from '../../../components/layout';
import { libreBaskervilleRegular } from '../../../components/layout';
import BookBento from "../../../components/aristotle-typer/BookBento";
import nicomacheanEthics from "./data/nicomachean-ethics.json";

export default function AristotleTyper() {
    return (
        <div className="lg:mx-64">
            <h1 className={`${libreBaskervilleRegular.className} md:text-6xl text-3xl text-center pt-12 px-8`}>Nicomachean Ethics</h1>
            <p className={`${libreBaskervilleRegular.className} text-center py-4 px-8`}>by Aristotle</p>

            {nicomacheanEthics.Books.map(( book ) => (
                <BookBento bookNumber={book.bookNumber} description={book.description} AverageWPM={book.AverageWPM} Accuracy={book.Accuracy} />
            ))}
        </div>
    )
}