import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { QuizData } from '../types';
import { generateExamQuestions } from '../services/geminiService';
import { Header } from './Header';
import { Footer } from './Footer';
import { CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface ExamPracticeProps {
  onGoHome: () => void;
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const ExamPractice: React.FC<ExamPracticeProps> = ({ onGoHome }) => {
    const [view, setView] = useState<'selecting' | 'practicing' | 'results'>('selecting');
    const [examData, setExamData] = useState<QuizData | null>(null);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [customNumQuestions, setCustomNumQuestions] = useState('10');

    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const cleanupTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const handleSubmit = useCallback(() => {
        cleanupTimer();
        setView('results');
    }, []);

    useEffect(() => {
        if (view === 'practicing' && timeLeft !== null) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime !== null && prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        handleSubmit();
                        return 0;
                    }
                });
            }, 1000);
        }
        return cleanupTimer;
    }, [view, timeLeft, handleSubmit]);


    const handleStartExam = useCallback(async (numQuestions: number, timeLimitMinutes: number) => {
        if (numQuestions <= 0 || numQuestions > 200) {
            setError('Vui lòng chọn số câu hỏi từ 1 đến 200.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExamData(null);
        setUserAnswers([]);
        setView('practicing');
        
        try {
            const data = await generateExamQuestions(numQuestions);
            setUserAnswers(new Array(data.length).fill(null));
            setExamData(data);
            setTimeLeft(timeLimitMinutes * 60);
        } catch (err) {
            setError('Không thể tạo đề thi. Vui lòng thử lại sau.');
            setView('selecting');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = answerIndex;
        setUserAnswers(newAnswers);
    };

    const handleRestart = () => {
        cleanupTimer();
        setView('selecting');
        setExamData(null);
        setUserAnswers([]);
        setError(null);
        setTimeLeft(null);
    }
    
    const score = userAnswers.filter((answer, index) => examData && answer === examData[index].correctAnswerIndex).length;
    const totalQuestions = examData ? examData.length : 0;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    let feedbackMessage = '';
    let feedbackColor = 'text-sky-400';

    if (view === 'results') {
        if (percentage >= 90) {
            feedbackMessage = 'Xuất sắc! Bạn đã nắm rất vững kiến thức.';
            feedbackColor = 'text-emerald-400';
        } else if (percentage >= 70) {
            feedbackMessage = 'Kết quả tốt! Tiếp tục phát huy nhé.';
            feedbackColor = 'text-yellow-400';
        } else if (percentage >= 50) {
            feedbackMessage = 'Khá tốt! Hãy xem lại các câu sai để cải thiện nhé.';
            feedbackColor = 'text-orange-400';
        } else {
            feedbackMessage = 'Cần cố gắng hơn. Đừng nản lòng, hãy ôn tập và thử lại!';
            feedbackColor = 'text-red-400';
        }
    }
    
    const renderContent = () => {
        if (isLoading) {
             return (
                <div className="text-center max-w-4xl mx-auto mt-10">
                    <div className="flex justify-center items-center">
                         <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xl text-slate-300">Đang tạo đề thi, vui lòng đợi trong giây lát...</p>
                    </div>
                </div>
            )
        }

        switch (view) {
            case 'selecting':
                return (
                     <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Luyện thi Tin học Công chức, Viên chức</h1>
                        <p className="text-lg text-slate-400 mb-8">Chọn một cấu trúc đề thi để bắt đầu.</p>
                        
                        {error && <div className="mb-4 text-center bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md">{error}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <button onClick={() => handleStartExam(30, 30)} className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1">
                                <h3 className="text-2xl font-bold text-sky-400">30 Câu</h3>
                                <p className="text-slate-400">Thời gian: 30 phút</p>
                            </button>
                             <button onClick={() => handleStartExam(50, 45)} className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1">
                                <h3 className="text-2xl font-bold text-sky-400">50 Câu</h3>
                                <p className="text-slate-400">Thời gian: 45 phút</p>
                            </button>
                             <button onClick={() => handleStartExam(100, 80)} className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1">
                                <h3 className="text-2xl font-bold text-sky-400">100 Câu</h3>
                                <p className="text-slate-400">Thời gian: 80 phút</p>
                            </button>
                        </div>
                        
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-700" /></div>
                            <div className="relative flex justify-center"><span className="bg-slate-900 px-2 text-sm text-slate-500">HOẶC TÙY CHỌN</span></div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                             <input
                                type="number"
                                value={customNumQuestions}
                                onChange={(e) => setCustomNumQuestions(e.target.value)}
                                placeholder="Nhập số câu"
                                className="w-full sm:w-48 bg-slate-800 border border-slate-600 rounded-md p-3 text-center text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-200"
                                min="1"
                                max="200"
                            />
                            <button onClick={() => handleStartExam(parseInt(customNumQuestions, 10), parseInt(customNumQuestions, 10))} className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg text-lg hover:bg-emerald-500 transition-colors">
                                Bắt đầu
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Thời gian làm bài: 1 phút/câu</p>
                    </div>
                );
            case 'practicing':
            case 'results':
                if (!examData) return null;
                return (
                     <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sticky top-2 z-10 flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-slate-100">Đề thi Luyện tập</h2>
                            <div className="text-2xl font-mono font-bold text-sky-400 bg-slate-900 px-4 py-2 rounded-md">
                                {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
                            </div>
                        </div>

                         {view === 'results' && (
                             <div className="text-center mb-8 bg-slate-800 rounded-lg p-8 border border-slate-700">
                                <h3 className="text-3xl font-bold text-slate-100 mb-4">Bài thi hoàn tất!</h3>
                                <p className="text-5xl font-bold text-sky-400 my-4">
                                    {score} <span className="text-3xl text-slate-400">/ {totalQuestions}</span>
                                </p>
                                <p className={`text-xl font-semibold ${feedbackColor} mb-6`}>
                                    {percentage}% - {feedbackMessage}
                                </p>
                                <button onClick={handleRestart} className="px-6 py-2 font-semibold rounded-md bg-sky-600 text-white hover:bg-sky-500 transition-colors">
                                    Làm bài thi khác
                                </button>
                            </div>
                        )}

                        <div className="space-y-6">
                            {examData.map((question, qIndex) => (
                                <div key={qIndex} className={`bg-slate-800/50 border border-slate-700 rounded-lg p-6 transition-colors ${view === 'results' ? (userAnswers[qIndex] === question.correctAnswerIndex ? 'border-emerald-500/50' : 'border-red-500/50') : ''}`}>
                                    <p className="font-semibold text-slate-200 mb-4">{qIndex + 1}. {question.question}</p>
                                    <div className="space-y-3">
                                        {question.options.map((option, oIndex) => {
                                            const isSelected = userAnswers[qIndex] === oIndex;
                                            const isCorrect = question.correctAnswerIndex === oIndex;
                                            
                                            let resultIndicator = null;
                                            if (view === 'results') {
                                                if (isCorrect) {
                                                    resultIndicator = <CheckCircleIcon className="h-5 w-5 text-emerald-400 ml-auto" />;
                                                } else if (isSelected && !isCorrect) {
                                                    resultIndicator = <XCircleIcon className="h-5 w-5 text-red-400 ml-auto" />;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={oIndex}
                                                    onClick={() => view === 'practicing' && handleAnswerSelect(qIndex, oIndex)}
                                                    disabled={view === 'results'}
                                                    className={`w-full text-left p-3 rounded-md border-2 flex items-center transition-colors duration-200
                                                        ${isSelected && view !== 'results' ? 'bg-sky-500/30 border-sky-500 text-sky-300' : 'bg-slate-800 border-slate-700'}
                                                        ${view !== 'results' ? 'hover:bg-slate-700 cursor-pointer' : 'cursor-default'}
                                                        ${view === 'results' && isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : ''}
                                                        ${view === 'results' && isSelected && !isCorrect ? 'bg-red-500/20 border-red-500 text-red-300' : ''}
                                                    `}
                                                >
                                                    <span className="flex-1">{option}</span>
                                                    {resultIndicator}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {view === 'results' && <p className="text-sm text-slate-400 mt-4">{question.explanation}</p>}
                                </div>
                            ))}
                        </div>
                        
                        {view === 'practicing' && (
                            <div className="text-center mt-8">
                                <button onClick={handleSubmit} className="px-8 py-3 font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                                    Nộp bài & Xem kết quả
                                </button>
                            </div>
                        )}
                    </div>
                );
        }
    }


    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300">
            <Header onMenuClick={() => {}} onGoHome={onGoHome} showHomeButton={true}/>
            <main className="flex-1 container mx-auto p-4 md:p-8">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};
