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
    const displayRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

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
          
          // If cursor is below the visible area, scroll down
          if (cursorTop + cursorHeight > containerScrollTop + containerHeight) {
            container.scrollTop = cursorTop - containerHeight + cursorHeight + 20; // +20 for padding
          }
          
          // If cursor is above the visible area, scroll up
          if (cursorTop < containerScrollTop) {
            container.scrollTop = cursorTop - 20; // -20 for padding
          }
        }
    }, [userInput]);

    useEffect(() => {
        if (userInput.length === 1 && startTime === null) {
        setStartTime(Date.now());
        }
    }, [userInput, startTime]);

    useEffect(() => {
        if (userInput.length === referenceText.length && startTime) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        const words = referenceText.split(' ').length;
        const wpm = Math.round(words / timeElapsed);
        

        let errors = 0;
        for (let i = 0; i < referenceText.length; i++) {
            if (userInput[i] !== referenceText[i]) errors++;
        }
        const accuracy = Math.round(((referenceText.length - errors) / referenceText.length) * 100);
        
        onComplete(wpm, accuracy);
        }
    }, [userInput, referenceText, startTime, onComplete]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= referenceText.length) {
          setUserInput(value);
        }
      };

      return (
        <div 
          className="relative w-full"
          onClick={() => inputRef.current?.focus()}
        >

          <div ref={displayRef} className="text-xl leading-relaxed font-mono whitespace-pre-wrap py-6 rounded-lg cursor-text max-h-40 overflow-y-auto">
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
      );
}