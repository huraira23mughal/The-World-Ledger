import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

const PUZZLE_WORDS = [
  { clue: '1. Fourth estate or broadsheet news medium (5)', answer: 'PRESS', row: 0, col: 0, dir: 'across' },
  { clue: '2. Chief supervisor of publications (6)', answer: 'EDITOR', row: 2, col: 0, dir: 'across' },
  { clue: '3. A news dispatch or broadsheet article (5)', answer: 'STORY', row: 4, col: 0, dir: 'across' },
];

export default function CrosswordsPage() {
  const [grid, setGrid] = useState<string[][]>([
    ['P', 'R', 'E', 'S', 'S', ''],
    ['', '', '', '', '', ''],
    ['E', 'D', 'I', 'T', 'O', 'R'],
    ['', '', '', '', '', ''],
    ['S', 'T', 'O', 'R', 'Y', ''],
    ['', '', '', '', '', ''],
  ]);

  const [userInputs, setUserInputs] = useState<string[][]>(
    Array(6).fill(null).map(() => Array(6).fill(''))
  );
  const [solved, setSolved] = useState(false);

  const handleCellChange = (r: number, c: number, val: string) => {
    const updated = userInputs.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val.toUpperCase().slice(-1) : cell))
    );
    setUserInputs(updated);
  };

  const checkSolution = () => {
    let allCorrect = true;
    for (const pw of PUZZLE_WORDS) {
      for (let i = 0; i < pw.answer.length; i++) {
        const r = pw.row;
        const c = pw.col + i;
        if (userInputs[r][c] !== pw.answer[i]) {
          allCorrect = false;
        }
      }
    }
    if (allCorrect) {
      setSolved(true);
    } else {
      alert('Keep going! Some letters are still incorrect or missing.');
    }
  };

  const resetPuzzle = () => {
    setUserInputs(Array(6).fill(null).map(() => Array(6).fill('')));
    setSolved(false);
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#052962] pb-4 mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#052962]">Crosswords & Word Games</h1>
        <p className="text-gray-500 text-sm mt-1">Daily broadsheet cryptics, quick crosswords, and word puzzles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {/* Interactive Grid */}
        <div className="bg-white border border-gray-300 p-6 rounded shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif font-bold text-lg text-[#052962]">Daily Quick Crossword #2,941</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-yellow-100 text-amber-900 rounded">
              Difficulty: Medium
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1 w-72 h-72 mx-auto bg-gray-900 p-1 border-2 border-gray-800">
            {userInputs.map((row, r) =>
              row.map((cell, c) => {
                const isClueCell = PUZZLE_WORDS.some(
                  pw => r === pw.row && c >= pw.col && c < pw.col + pw.answer.length
                );
                return (
                  <div key={`${r}-${c}`} className={`relative ${isClueCell ? 'bg-white' : 'bg-gray-800'}`}>
                    {isClueCell && (
                      <input
                        type="text"
                        maxLength={1}
                        value={cell}
                        onChange={e => handleCellChange(r, c, e.target.value)}
                        className="w-full h-full text-center text-lg font-bold uppercase focus:bg-yellow-50 focus:outline-none"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {solved && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-700 text-sm font-semibold">
              <CheckCircle2 size={18} /> Congratulations! You completed today's cryptic crossword!
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={checkSolution}
              className="bg-[#052962] text-white px-5 py-2 text-sm font-semibold rounded hover:bg-blue-900 transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Check Solution
            </button>
            <button
              onClick={resetPuzzle}
              className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold rounded hover:bg-gray-50 flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Clues */}
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 p-5 rounded">
            <h3 className="font-serif font-bold text-base text-[#052962] mb-3 uppercase tracking-wider text-xs">
              Across Clues
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {PUZZLE_WORDS.map(pw => (
                <li key={pw.clue} className="flex gap-2">
                  <span className="font-serif font-bold text-[#052962]">{pw.clue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 leading-relaxed">
            <strong>About The World Ledger Puzzles:</strong> Every day since our first print run, we have published original cryptic and quick crosswords created by world-class setters.
          </div>
        </div>
      </div>
    </main>
  );
}

