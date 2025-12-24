import React from 'react';
import { BookOpenIcon, CpuChipIcon, CodeBracketIcon, PencilSquareIcon, DocumentTextIcon } from './icons/Icons';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 flex flex-col items-center justify-center p-4">
      <main className="text-center z-10">
        <div className="inline-block bg-sky-500/10 p-4 rounded-full mb-6">
          <BookOpenIcon className="h-16 w-16 text-sky-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-4">
          Chào mừng đến Trung tâm Học tập CNTT - Công chức viên chức
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-8">
          Nền tảng của bạn để làm chủ các kỹ năng công nghệ theo yêu cầu. Được hỗ trợ bởi Gemini, chúng tôi cung cấp các bài học được cá nhân hóa từ cơ bản đến chuyên gia.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-sky-600 text-white font-bold rounded-lg text-lg hover:bg-sky-500 transition-transform transform hover:scale-105 duration-300 shadow-lg shadow-sky-600/30"
        >
          Bắt đầu Học
        </button>
      </main>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-400">
        <div className="flex items-center space-x-3">
          <CpuChipIcon className="h-6 w-6 text-sky-400" />
          <span>Kiến thức Cốt lõi</span>
        </div>
        <div className="flex items-center space-x-3">
          <CodeBracketIcon className="h-6 w-6 text-sky-400" />
          <span>Phát triển Web</span>
        </div>
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-6 w-6 text-sky-400" />
          <span>Tin học Văn phòng</span>
        </div>
        <div className="flex items-center space-x-3">
          <PencilSquareIcon className="h-6 w-6 text-sky-400" />
          <span>Thiết kế & Sáng tạo</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-slate-800/40 [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]"></div>
    </div>
  );
};
