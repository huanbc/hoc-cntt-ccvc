
import React from 'react';
import type { Topic, Category, Level } from '../types';
import { CheckCircleIcon } from './icons/Icons';
import { isLessonComplete, ProgressData } from '../utils/progress';


interface SidebarProps {
  category: Category;
  onTopicSelect: (topic: Topic) => void;
  selectedTopic: Topic | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  progressData: ProgressData;
  selectedLevel: Level;
}

export const Sidebar: React.FC<SidebarProps> = ({ category, onTopicSelect, selectedTopic, isOpen, setIsOpen, progressData, selectedLevel }) => {
    const sidebarClasses = `
      fixed z-30 inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 transform transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 md:flex md:flex-shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `;
    
    const isSpecialCategory = category.name === 'Ôn thi Công chức, Viên chức';

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
            <aside className={sidebarClasses}>
                <nav className="flex flex-col h-full overflow-y-auto">
                    <h2 className="text-xl font-bold text-slate-200 tracking-wider mb-4">{category.name}</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-slate-200 font-semibold mb-2">Chủ đề</h3>
                            <ul className="space-y-1">
                                {category.topics.map((topic) => {
                                    // For regular categories, completion is based on level.
                                    // For the special category, completion is per-lesson, so we don't show a checkmark on the topic level.
                                    const lessonId = selectedLevel;
                                    const isCompleted = !isSpecialCategory && isLessonComplete(progressData, category.name, topic.name, lessonId);
                                    
                                    return (
                                        <li key={topic.name}>
                                            <button
                                                onClick={() => onTopicSelect(topic)}
                                                className={`w-full text-left flex items-center p-2 rounded-md transition-colors duration-200 ${
                                                    selectedTopic?.name === topic.name
                                                        ? 'bg-sky-500/20 text-sky-300'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                }`}
                                            >
                                                <topic.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                                                <span className="flex-1">{topic.name}</span>
                                                {isCompleted && <CheckCircleIcon className="h-5 w-5 text-emerald-400" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};
