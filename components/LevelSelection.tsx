import React from 'react';
import type { Level } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';

interface LevelSelectionProps {
    onSelect: (level: Level) => void;
    categoryName: string;
}

const levels: Level[] = ['Cơ bản', 'Nâng cao', 'Chuyên gia'];

export const LevelSelection: React.FC<LevelSelectionProps> = ({ onSelect, categoryName }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300">
            <Header onMenuClick={() => {}} />
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="text-center max-w-2xl w-full">
                    <p className="text-sky-400 font-semibold">{categoryName}</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2 mb-4">Trình độ của bạn là gì?</h1>
                    <p className="text-lg text-slate-400 mb-12">Điều này giúp chúng tôi cá nhân hóa nội dung bài học cho bạn.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        {levels.map((level) => (
                            <button
                                key={level}
                                onClick={() => onSelect(level)}
                                className="w-full sm:w-48 bg-slate-800/50 border-2 border-slate-700 rounded-lg py-10 px-6 text-center hover:bg-slate-800 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <h2 className="text-2xl font-bold text-slate-100">{level}</h2>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
