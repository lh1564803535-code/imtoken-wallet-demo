"use client";

import { useState } from "react";

export function MnemonicVerifyPage({ onComplete, mnemonic }: { onComplete: () => void; mnemonic: string }) {
  const words = mnemonic.split(" ").filter(w => w.length > 0);
  const wordCount = words.length;
  const verifyCount = Math.min(4, wordCount);
  const [verifyPositions] = useState(() => {
    const positions: number[] = [];
    while (positions.length < verifyCount) {
      const pos = Math.floor(Math.random() * wordCount);
      if (!positions.includes(pos)) positions.push(pos);
    }
    return positions.sort((a, b) => a - b);
  });
  const [currentVerify, setCurrentVerify] = useState(0);
  const [options, setOptions] = useState<string[]>(() => generateOpts(0));
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState(false);

  function generateOpts(step: number): string[] {
    const correctWord = words[verifyPositions[step]];
    const otherWords = words.filter((_, i) => i !== verifyPositions[step]);
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 5);
    return [...shuffled, correctWord].sort(() => Math.random() - 0.5);
  }

  const handleSelect = (word: string) => {
    const correctWord = words[verifyPositions[currentVerify]];
    if (word !== correctWord) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      return;
    }
    const newSelected = [...selected, word];
    setSelected(newSelected);
    if (currentVerify + 1 >= verifyPositions.length) {
      setTimeout(onComplete, 500);
    } else {
      const nextStep = currentVerify + 1;
      setCurrentVerify(nextStep);
      setOptions(generateOpts(nextStep));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center border-b border-gray-100">
        <div className="w-9" />
        <h1 className="flex-1 text-center text-lg font-semibold">Verify Recovery Phrase</h1>
        <div className="w-9" />
      </div>
      <div className="flex-1 px-5 py-6 flex flex-col">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {verifyPositions.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i < currentVerify ? 'bg-green-500' : i === currentVerify ? 'bg-blue-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 mb-2">Select word #{verifyPositions[currentVerify] + 1}</p>
          <p className="text-2xl font-bold text-gray-900">What is word #{verifyPositions[currentVerify] + 1}?</p>
        </div>

        {/* Selected words */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {selected.map((word, i) => (
            <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
              #{verifyPositions[i] + 1}: {word}
            </span>
          ))}
          {currentVerify < verifyPositions.length && (
            <span className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-full text-sm font-medium border border-blue-200 animate-pulse">
              #{verifyPositions[currentVerify] + 1}: ?
            </span>
          )}
        </div>

        {/* Options grid */}
        <div className={`grid grid-cols-3 gap-2.5 transition-all ${error ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
          {options.map((word) => (
            <button
              key={word}
              onClick={() => handleSelect(word)}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center font-medium text-gray-900 hover:bg-gray-100 active:bg-gray-200 active:scale-[0.97] transition-all"
            >
              {word}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-center text-red-500 text-sm mt-4 animate-fade-in-up">Wrong word. Try again.</p>
        )}
      </div>
    </div>
  );
}
