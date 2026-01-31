'use client';

import { useState, useEffect, useRef } from 'react';

interface TypingTestProps {
    referenceText: string;
    onComplete: (wpm: number, accuracy: number) => void;
  }

export default function TypingTest({ referenceText, onComplete }: TypingTestProps) {
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);


    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= referenceText.length) {
          setUserInput(value);
        }
      };

    return (
        <div className="typing-test-container">
            <div className="text-display">
            {referenceText.split('').map((char, index) => {
                let className = 'char-default'; // gray/low opacity
                
                if (index < userInput.length) {
                // User has typed this character
                if (userInput[index] === char) {
                    className = 'char-correct'; // full opacity
                } else {
                    className = 'char-incorrect'; // red
                }
                }
                
                if (index === userInput.length) {
                className += ' char-cursor';
                }
                
                return (
                <span key={index} className={className}>
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
    )
}