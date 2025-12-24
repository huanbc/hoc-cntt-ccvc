
import React from 'react';
import { BookOpenIcon, Bars3Icon, HomeIcon } from './icons/Icons';

interface HeaderProps {
    onMenuClick: () => void;
    onGoHome?: () => void;
    showHomeButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onGoHome, showHomeButton = false }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <BookOpenIcon className="h-8 w-8 text-sky-400" />
             <h1 className="ml-3 text-2xl font-bold text-slate-100 tracking-tight">
               Trung tâm Học tập CNTT
             </h1>
          </div>
          <div className="flex items-center">
            {showHomeButton && onGoHome && (
              <button
                onClick={onGoHome}
                className="hidden md:inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 mr-4"
                aria-label="Về trang chủ"
              >
                <HomeIcon className="h-6 w-6" />
              </button>
            )}
            <div className="md:hidden">
               <button
                  onClick={onMenuClick}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
