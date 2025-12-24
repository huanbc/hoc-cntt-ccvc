import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Topic, Level, QuizData, Category } from '../types';
import { PaperAirplaneIcon, CheckCircleIcon } from './icons/Icons';
import { QuizModal } from './QuizModal';
import { isLessonComplete, ProgressData } from '../utils/progress';

interface MainContentProps {
  selectedCategory: Category;
  selectedTopic: Topic | null;
  selectedLevel: Level;
  onGenerateLesson: (lessonTitle?: string) => void;
  lessonData: { text: string; imageUrl: string | null } | null;
  onAskQuestion: (question: string) => void;
  qaHistory: { question: string; answer: string }[];
  quizData: QuizData | null;
  isLoadingLesson: boolean;
  isLoadingAnswer: boolean;
  error: string | null;
  onLessonComplete: () => void;
  progressData: ProgressData;
  selectedLessonTitle: string | null;
}

const WelcomeScreen: React.FC = () => (
    <div className="text-center h-full flex flex-col justify-center items-center p-8">
        <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Bắt đầu hành trình học tập của bạn</h2>
            <p className="text-lg text-slate-400 mb-8">
                Chọn một chủ đề từ thanh bên trái để tạo bài học đầu tiên của bạn. AI sẽ soạn thảo một khóa học phù hợp.
            </p>
        </div>
    </div>
);

const CurriculumView: React.FC<{
  category: Category;
  topic: Topic;
  onGenerateLesson: (lessonTitle: string) => void;
  progressData: ProgressData;
}> = ({ category, topic, onGenerateLesson, progressData }) => (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">{topic.name}</h2>
        <p className="text-lg text-slate-400 mb-8">Chọn một bài học để bắt đầu ôn luyện theo chuẩn kỹ năng CNTT.</p>
        <div className="space-y-4">
            {topic.lessons?.map((lessonTitle, index) => {
                const isCompleted = isLessonComplete(progressData, category.name, topic.name, lessonTitle);
                return (
                    <button
                        key={index}
                        onClick={() => onGenerateLesson(lessonTitle)}
                        className="w-full text-left flex items-center p-4 rounded-lg transition-colors duration-200 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-sky-500"
                    >
                        <span className="flex-1 text-slate-200 font-medium">{lessonTitle}</span>
                        {isCompleted && <CheckCircleIcon className="h-6 w-6 text-emerald-400" />}
                    </button>
                );
            })}
        </div>
    </div>
);


const LessonView: React.FC<MainContentProps> = (props) => {
    const { selectedTopic, selectedLevel, onGenerateLesson, lessonData, onAskQuestion, qaHistory, quizData, isLoadingLesson, isLoadingAnswer, error, onLessonComplete, selectedLessonTitle, selectedCategory } = props;
    const [question, setQuestion] = useState('');
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            onAskQuestion(question);
            setQuestion('');
        }
    };
    
    const isSpecialCategory = selectedCategory.name === 'Ôn thi Công chức, Viên chức';

    return (
        <div className="flex flex-col h-full lg:flex-row lg:space-x-8">
            {isQuizModalOpen && quizData && (
                <QuizModal 
                    quizData={quizData} 
                    onClose={() => setIsQuizModalOpen(false)}
                    onComplete={onLessonComplete}
                />
            )}
            {/* Lesson Area */}
            <div className="flex-grow lg:w-2/3 mb-8 lg:mb-0">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 sticky top-0 backdrop-blur-sm z-10">
                    <div className="flex justify-between items-center">
                        <div>
                             <h2 className="text-3xl font-bold text-slate-100">{selectedLessonTitle || selectedTopic?.name}</h2>
                            <p className="text-sky-400 font-medium mt-1">
                                {isSpecialCategory ? `Chủ đề: ${selectedTopic?.name}` : `Trình độ: ${selectedLevel}`}
                            </p>
                        </div>
                        {!isSpecialCategory && (
                            <button
                                onClick={() => onGenerateLesson()}
                                disabled={isLoadingLesson}
                                className="w-full sm:w-auto px-6 py-2 font-semibold rounded-md bg-sky-600 text-white hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
                            >
                                {isLoadingLesson ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang tạo...
                                    </>
                                ) : "Tạo bài học"}
                            </button>
                        )}
                    </div>
                </div>

                {lessonData?.imageUrl && (
                    <div className="mt-6 animate-fade-in">
                        <img 
                            src={lessonData.imageUrl} 
                            alt={`Hình minh họa cho ${selectedTopic?.name}`} 
                            className="rounded-lg w-full object-cover shadow-lg border border-slate-700"
                        />
                    </div>
                )}
                
                <div className="mt-6 prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-sky-300 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-code:text-sky-300">
                    {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-md">{error}</div>}
                    {isLoadingLesson && <p>Đang tạo bài học cá nhân hóa của bạn, vui lòng đợi...</p>}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lessonData?.text || ''}
                    </ReactMarkdown>

                    {quizData && !isLoadingLesson && lessonData && (
                        <div className="not-prose mt-8 text-center">
                            <button
                                onClick={() => setIsQuizModalOpen(true)}
                                className="px-8 py-3 font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                            >
                                Kiểm tra kiến thức
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Q&A Chat Area */}
            {lessonData && !isLoadingLesson && (
                <div className="lg:w-1/3 flex-shrink-0 flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 h-[80vh] lg:h-auto lg:sticky lg:top-24">
                    <div className="p-4 border-b border-slate-700">
                        <h3 className="font-semibold text-lg text-slate-100">Đặt câu hỏi</h3>
                        <p className="text-sm text-slate-400">Trợ lý AI của bạn sẵn sàng giúp đỡ.</p>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {qaHistory.map((item, index) => (
                            <div key={index}>
                                <div className="bg-slate-700 p-3 rounded-lg mb-2">
                                    <p className="text-slate-300">{item.question}</p>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg prose prose-invert max-w-none prose-p:text-slate-300 prose-pre:bg-slate-900">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoadingAnswer && <p className="text-slate-400">Đang suy nghĩ...</p>}
                    </div>
                    <div className="p-4 border-t border-slate-700">
                        <form onSubmit={handleQuestionSubmit} className="flex space-x-2">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-200"
                                disabled={isLoadingAnswer}
                            />
                            <button
                                type="submit"
                                disabled={isLoadingAnswer || !question.trim()}
                                className="bg-sky-600 text-white p-2 rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                                aria-label="Gửi câu hỏi"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export const MainContent: React.FC<MainContentProps> = (props) => {
    const { selectedCategory, selectedTopic, lessonData, onGenerateLesson, progressData, isLoadingLesson } = props;
    const isSpecialCategory = selectedCategory.name === 'Ôn thi Công chức, Viên chức';

    // Main view logic
    if (!selectedTopic) {
        return <WelcomeScreen />;
    }

    if (isSpecialCategory) {
        // If a lesson is being loaded or is already loaded, show the lesson view
        if (isLoadingLesson || lessonData) {
            return <LessonView {...props} />;
        }
        // Otherwise, show the curriculum for the selected topic
        return <CurriculumView category={selectedCategory} topic={selectedTopic} onGenerateLesson={onGenerateLesson} progressData={progressData} />;
    }
    
    // For regular categories, show lesson view if lesson is generated, otherwise it shows the generate button
    return <LessonView {...props} />;
};
