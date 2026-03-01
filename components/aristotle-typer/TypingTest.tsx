'use client';

import { House, Keyboard, Target } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { libreBaskervilleRegular, libreBaskervilleBold } from '../../components/layout';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TypingTestProps {
    referenceText: string;
    onComplete: (wpm: number, accuracy: number) => void;
  }

export default function TypingTest({ referenceText, onComplete }: TypingTestProps) {
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentErrors, setCurrentErrors] = useState(0);
    const [currentWpm, setCurrentWpm] = useState(0);
    const [currentAccuracy, setCurrentAccuracy] = useState(100);
    const [wpmHistory, setWpmHistory] = useState<{wpm: number}[]>([]);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const displayRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const userInputRef = useRef("");
    const referenceTextLengthRef = useRef(referenceText.length);
    const [isCompleted, setIsCompleted] = useState(false);

    // Keep ref in sync with prop
    useEffect(() => {
        referenceTextLengthRef.current = referenceText.length;
    }, [referenceText]);

    useEffect(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
    }, []);

    useEffect(() => {
        if (cursorRef.current && displayRef.current) {
          const cursorElement = cursorRef.current;
          const container = displayRef.current;
          
          const cursorTop = cursorElement.offsetTop;
          const cursorHeight = cursorElement.offsetHeight;
          const containerScrollTop = container.scrollTop;
          const containerHeight = container.clientHeight;
          
          if (cursorTop + cursorHeight > containerScrollTop + containerHeight) {
            container.scrollTop = cursorTop - containerHeight + (cursorHeight * 3) + 20;
          }
          
          if (cursorTop < containerScrollTop) {
            container.scrollTop = cursorTop - 20; 
          }
        }
    }, [userInput]);

    useEffect(() => {
        if (userInput.length === 1 && startTime === null) {
        setStartTime(Date.now());
        }
    }, [userInput, startTime]);

    // Calculate live WPM on interval only
    useEffect(() => {
        if (!startTime) {
            setCurrentWpm(0);
            return;
        }

        const calculateWpm = () => {
            // Stop updating when typing is complete
            if (userInputRef.current.length >= referenceTextLengthRef.current) {
                setIsCompleted(true);
                return;
            }
            const timeElapsed = (Date.now() - startTime) / 1000 / 60;
            if (timeElapsed > 0 && userInputRef.current.length > 0) {
                const wordsTyped = userInputRef.current.length / 5;
                setCurrentWpm(Math.round(wordsTyped / timeElapsed));
            }
        };

        // Calculate immediately when typing starts
        calculateWpm();

        // Then update on interval
        const interval = setInterval(calculateWpm, 500);

        return () => clearInterval(interval);
    }, [startTime]);

    // Track WPM history for chart
    useEffect(() => {
        if (currentWpm > 0) {
            setWpmHistory(prev => {
                const newHistory = [...prev, { wpm: currentWpm }];
                // Keep only last 20 data points
                return newHistory.slice(-20);
            });
        }
    }, [currentWpm]);

    // Calculate live accuracy and current errors
    useEffect(() => {
        if (userInput.length === 0) {
            setCurrentErrors(0);
            setCurrentAccuracy(100);
            return;
        }
        // Count current mismatches
        let errors = 0;
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] !== referenceText[i]) {
                errors++;
            }
        }
        setCurrentErrors(errors);
        const accuracy = Math.max(0, Math.round(((userInput.length - errors) / userInput.length) * 100));
        setCurrentAccuracy(accuracy);
    }, [userInput, referenceText]);

    useEffect(() => {
        if (userInput.length === referenceText.length && startTime) {
        onComplete(currentWpm, currentAccuracy);
        }
    }, [userInput, referenceText, startTime, onComplete, currentWpm, currentAccuracy]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= referenceText.length) {
          userInputRef.current = value;
          setUserInput(value);
        }
      };

      return (
        <div>
            <div className="mb-4">
                <div className="grid grid-cols-3 items-center">
                    <div className="flex items-center gap-2 justify-self-start">
                        <Keyboard className={`w-8 h-8 ${isCompleted ? 'text-stone-900' : 'text-stone-700'}`} />
                        {!isCompleted && (
                        <div className="w-16 h-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={wpmHistory}>
                                    <Line
                                        type="monotone"
                                        dataKey="wpm"
                                        stroke={currentWpm > 50 ? currentWpm > 75 ? "#22c55e" : "#ffb86a" : "#ef4444"}
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>)}
                        {isCompleted && <p className={`${libreBaskervilleBold.className} text-base text-center text-stone-900`}>{currentWpm} wpm</p>}
                    </div>

                    <a href="/experiences/aristotle-typer/dashboard" className="justify-self-center">
                        <House className={`w-8 h-8 ${isCompleted ? 'text-stone-900' : 'text-stone-700'}`} />
                    </a>

                    <div className="flex items-center gap-2 justify-self-end">
                        {!isCompleted && <p className={`${libreBaskervilleBold.className} text-base text-red-400`}>{currentErrors}</p>}
                        {isCompleted && <p className={`${libreBaskervilleBold.className} text-base text-center text-stone-900`}>{currentAccuracy}% accuracy</p>}
                        <Target className={`w-8 h-8 ${isCompleted ? 'text-stone-900' : 'text-stone-700'}`} />
                    </div>
                </div>
            </div>

        <div 
          className="relative w-full"
          onClick={() => inputRef.current?.focus()}
        >

          <div ref={displayRef} className="text-xl leading-relaxed font-mono whitespace-pre-wrap py-6 rounded-lg cursor-text max-h-40 overflow-y-auto scrollbar-hide">
            {referenceText.split('').map((char, index) => {
              const isTyped = index < userInput.length;
              const isCorrect = isTyped && userInput[index] === char;
              const isIncorrect = isTyped && userInput[index] !== char;
              const isCursor = index === userInput.length;
              
              return (
                <span
                  key={index}
                  ref={isCursor ? cursorRef : null}
                  className={`
                    ${!isTyped ? 'opacity-50' : ''}
                    ${isCorrect ? 'opacity-100' : ''}
                    ${isIncorrect ? 'text-red-500' : ''}
                    ${isCursor ? 'border-l-4 border-blue-700 animate-pulse' : ''}
                  `}
                >
                  {char}
                </span>
              );
            })}
          </div>
    
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInput}
            className="sr-only"
            autoFocus
          />
        </div>
        </div>
      );
}