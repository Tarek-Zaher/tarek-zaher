'use client';

import { libreBaskervilleBold, libreBaskervilleRegular } from '../../../components/layout';
import BookBento from "../../../components/aristotle-typer/BookBento";
import nicomacheanEthics from "./data/nicomachean-ethics.json";
import { useState, useEffect } from 'react';
import { getSectionStats } from '../../../lib/storage';

export default function AristotleTyper() {
    const [mounted, setMounted] = useState(false);
    const [bookStats, setBookStats] = useState<Record<string, { averageWpm: number; accuracy: number }>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const next: Record<string, { averageWpm: number; accuracy: number }> = {};
        nicomacheanEthics.Books.forEach((book) => {
            const stats = book.Sections.map((section) => getSectionStats(book.bookNumber, section.sectionNumber));
            const wpmValues = stats.map((stat) => stat?.wpm).filter((wpm): wpm is number => typeof wpm === 'number');
            const accuracyValues = stats.map((stat) => stat?.accuracy).filter((accuracy): accuracy is number => typeof accuracy === 'number');
            next[book.bookNumber] = {
                averageWpm: wpmValues.length > 0 ? Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length) : 0,
                accuracy: accuracyValues.length > 0 ? Math.round(accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length) : 0,
            };
        });
        setBookStats(next);
    }, [mounted]);

    return (
        <div className="lg:mx-64">
            <h1 className={`${libreBaskervilleBold.className} md:text-6xl text-3xl text-stone-800 text-center pt-12 px-8`}>Nicomachean Ethics</h1>
            <p className={`${libreBaskervilleRegular.className} text-center text-stone-800 py-4 px-8`}>by Aristotle</p>

            {nicomacheanEthics.Books.map((book) => {
                const stats = bookStats[book.bookNumber];
                const averageWpm = mounted && stats ? stats.averageWpm : 0;
                const accuracy = mounted && stats ? stats.accuracy : 0;

                return (
                    <BookBento key={book.bookNumber} bookNumber={book.bookNumber} description={book.description} averageWpm={averageWpm} accuracy={accuracy} />
                );
            })}
        </div>
    )
}