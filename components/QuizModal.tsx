import React, { useState, useEffect } from 'react';
import type { QuizData } from '../types';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface QuizModalProps {
    quizData: QuizData;
    onClose: () => void;
    onComplete: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quizData, onClose, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = quizData[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quizData.length - 1;

    useEffect(() => {
        if (showResults) {
            onComplete();
        }
    }, [showResults, onComplete]);

    const handleNext = () => {
        const newAnswers = [...userAnswers, selectedAnswer];
        setUserAnswers(newAnswers);
        setSelectedAnswer(null);

        if (isLastQuestion) {
            setShowResults(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setUserAnswers([]);
        setShowResults(false);
    }
    
    const score = userAnswers.filter((answer, index) => answer === quizData[index].correctAnswerIndex).length;

    const renderQuizContent = () => {
        if (showResults) {
            return (
                <div>
                    <h2 className="text-2xl font-bold text-center text-slate-100 mb-4">Kết quả bài kiểm tra</h2>
                    <p className="text-center text-lg text-slate-300 mb-6">Bạn đã đạt {score} trên {quizData.length} điểm!</p>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {quizData.map((question, index) => {
                            const userAnswer = userAnswers[index];
                            const isCorrect = userAnswer === question.correctAnswerIndex;
                            return (
                                <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <p className="font-semibold text-slate-200 mb-2">{index + 1}. {question.question}</p>
                                    <div className="flex items-center">
                                        {isCorrect ? <CheckCircleIcon className="h-5 w-5 text-emerald-400 mr-2"/> : <XCircleIcon className="h-5 w-5 text-red-400 mr-2"/>}
                                        <p className={`${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                            Câu trả lời của bạn: {userAnswer !== null ? question.options[userAnswer] : 'Chưa trả lời'}
                                        </p>
                                    </div>
                                    {!isCorrect && (
                                        <p className="text-sky-400 mt-1">
                                            Đáp án đúng: {question.options[question.correctAnswerIndex]}
                                        </p>
                                    )}
                                    <p className="text-sm text-slate-400 mt-2">{question.explanation}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="mb-4">
                    <p className="text-sm text-slate-400">Câu hỏi {currentQuestionIndex + 1} trên {quizData.length}</p>
                    <h2 className="text-xl font-semibold text-slate-100 mt-1">{currentQuestion.question}</h2>
                </div>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            className={`w-full text-left p-3 rounded-md border-2 transition-colors duration-200
                                ${selectedAnswer === index
                                    ? 'bg-sky-500/30 border-sky-500 text-sky-300'
                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                                }
                            `}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h1 className="text-lg font-bold text-slate-200">Kiểm tra kiến thức</h1>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Đóng bài kiểm tra">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    {renderQuizContent()}
                </div>
                <div className="flex items-center justify-end p-4 border-t border-slate-800 space-x-4">
                    {showResults ? (
                        <>
                            <button onClick={handleRestart} className="px-4 py-2 font-semibold rounded-md bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                                Làm lại
                            </button>
                            <button onClick={onClose} className="px-4 py-2 font-semibold rounded-md bg-sky-600 text-white hover:bg-sky-500 transition-colors">
                                Đóng
                            </button>
                        </>

                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={selectedAnswer === null}
                            className="px-6 py-2 font-semibold rounded-md bg-sky-600 text-white hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLastQuestion ? 'Hoàn thành' : 'Tiếp theo'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
