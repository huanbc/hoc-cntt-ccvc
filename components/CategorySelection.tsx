import React from 'react';
import type { Category } from '../types';
import { LEARNING_TOPICS } from '../constants';
import { Header } from './Header';
import { Footer } from './Footer';
import { ClipboardDocumentCheckIcon } from './icons/Icons';

interface CategorySelectionProps {
  onSelect: (category: Category) => void;
  onStartExamPractice: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelect, onStartExamPractice }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300">
      <Header onMenuClick={() => {}} />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-4xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Bạn muốn học gì hôm nay?</h1>
          <p className="text-lg text-slate-400 mb-8">Chọn một lộ trình hoặc bắt đầu luyện thi.</p>
          
          <div className="mb-10">
             <button
                onClick={onStartExamPractice}
                className="w-full md:w-auto inline-flex items-center justify-center gap-x-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg text-lg hover:bg-emerald-500 transition-transform transform hover:scale-105 duration-300 shadow-lg shadow-emerald-600/30"
              >
                <ClipboardDocumentCheckIcon className="h-6 w-6" />
                <span>Luyện thi Công chức, Viên chức</span>
              </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-2 text-sm text-slate-500">HOẶC CHỌN LỘ TRÌNH HỌC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_TOPICS.map((category) => (
              <button
                key={category.name}
                onClick={() => onSelect(category)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-left hover:bg-slate-800 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-bold text-sky-400">{category.name}</h2>
                <ul className="mt-3 text-slate-400 text-sm list-disc list-inside">
                  {category.topics.slice(0, 3).map(topic => <li key={topic.name}>{topic.name}</li>)}
                   {category.topics.length > 3 && <li>và nhiều hơn nữa...</li>}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
