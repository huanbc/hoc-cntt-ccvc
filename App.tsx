import React, { useState, useCallback, useEffect } from 'react';
import type { Topic, Level, QuizData, Category } from './types';
import { generateLesson, answerQuestion, generateQuiz } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { CategorySelection } from './components/CategorySelection';
import { LevelSelection } from './components/LevelSelection';
import { ExamPractice } from './components/ExamPractice';
import { loadProgress, markLessonAsComplete, ProgressData } from './utils/progress';


const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'selecting_category' | 'selecting_level' | 'learning' | 'exam_practice'>('landing');
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string | null>(null);


  const [lessonData, setLessonData] = useState<{ text: string; imageUrl: string | null } | null>(null);
  const [qaHistory, setQaHistory] = useState<{ question: string; answer: string }[]>([]);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [progressData, setProgressData] = useState<ProgressData>({});

  useEffect(() => {
    setProgressData(loadProgress());
  }, []);

  const resetLearningState = () => {
    setSelectedTopic(null);
    setLessonData(null);
    setQaHistory([]);
    setQuizData(null);
    setError(null);
    setSelectedLessonTitle(null);
  };

  const handleStart = () => setAppState('selecting_category');
  
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    // If the category is the special exam prep, bypass level selection
    if (category.name === 'Ôn thi Công chức, Viên chức') {
      setSelectedLevel('Chuẩn kỹ năng');
      setAppState('learning');
    } else {
      setAppState('selecting_level');
    }
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setSelectedTopic(null); // Reset topic when level is chosen, forcing user to pick a topic
    setAppState('learning');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setLessonData(null);
    setQaHistory([]);
    setQuizData(null);
    setError(null);
    setSelectedLessonTitle(null);
    setIsSidebarOpen(false);
  };
  
  const handleGoHome = () => {
    resetLearningState();
    setSelectedCategory(null);
    setSelectedLevel(null);
    setAppState('landing');
  };
  
  const handleStartExamPractice = () => {
      setAppState('exam_practice');
  };
  
  const handleLessonComplete = useCallback(() => {
    if (!selectedCategory || !selectedTopic || !selectedLevel || !selectedLessonTitle) return;
    
    // Use lesson title for progress tracking in the special category
    const id = selectedCategory.name === 'Ôn thi Công chức, Viên chức' ? selectedLessonTitle : selectedLevel;
    markLessonAsComplete(selectedCategory.name, selectedTopic.name, id);
    setProgressData(loadProgress()); // a-load the progress to update UI
  }, [selectedCategory, selectedTopic, selectedLevel, selectedLessonTitle]);


  const handleGenerateLesson = useCallback(async (lessonTitle?: string) => {
    if (!selectedCategory || !selectedTopic || !selectedLevel) return;
    // For the special category, a lesson title must be provided.
    if (selectedCategory.name === 'Ôn thi Công chức, Viên chức' && !lessonTitle) {
      setError('Vui lòng chọn một bài học cụ thể.');
      return;
    }

    setIsLoadingLesson(true);
    setError(null);
    setLessonData(null);
    setQaHistory([]);
    setQuizData(null);
    setSelectedLessonTitle(lessonTitle || null);

    try {
      const data = await generateLesson(selectedCategory.name, selectedTopic.name, selectedLevel, lessonTitle);
      setLessonData(data);
      try {
        const quiz = await generateQuiz(lessonTitle || selectedTopic.name, selectedLevel, data.text);
        setQuizData(quiz);
      } catch (quizErr) {
        console.error("Failed to generate quiz, lesson will proceed without it.", quizErr);
      }
    } catch (err) {
      setError('Không thể tạo bài học. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsLoadingLesson(false);
    }
  }, [selectedCategory, selectedTopic, selectedLevel]);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (!question.trim() || !selectedTopic || !lessonData?.text) return;
    setIsLoadingAnswer(true);
    setError(null);
    try {
      const newAnswer = await answerQuestion(selectedTopic.name, question, lessonData.text);
      setQaHistory(prev => [...prev, { question, answer: newAnswer }]);
    } catch (err) {
      setError('Không thể nhận được câu trả lời. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsLoadingAnswer(false);
    }
  }, [selectedTopic, lessonData]);

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'selecting_category':
        return <CategorySelection onSelect={handleCategorySelect} onStartExamPractice={handleStartExamPractice} />;
      case 'selecting_level':
         return <LevelSelection onSelect={handleLevelSelect} categoryName={selectedCategory?.name || ''} />;
      case 'exam_practice':
          return <ExamPractice onGoHome={handleGoHome} />;
      case 'learning':
        if (!selectedCategory || !selectedLevel) {
            handleGoHome(); // Should not happen, but as a safeguard
            return null;
        }
        return (
          <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300">
            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} onGoHome={handleGoHome} showHomeButton={true}/>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                category={selectedCategory}
                onTopicSelect={handleTopicSelect} 
                selectedTopic={selectedTopic}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                progressData={progressData}
                selectedLevel={selectedLevel}
              />
              <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <MainContent
                  selectedCategory={selectedCategory}
                  selectedTopic={selectedTopic}
                  selectedLevel={selectedLevel}
                  onGenerateLesson={handleGenerateLesson}
                  lessonData={lessonData}
                  onAskQuestion={handleAskQuestion}
                  qaHistory={qaHistory}
                  quizData={quizData}
                  isLoadingLesson={isLoadingLesson}
                  isLoadingAnswer={isLoadingAnswer}
                  error={error}
                  onLessonComplete={handleLessonComplete}
                  progressData={progressData}
                  selectedLessonTitle={selectedLessonTitle}
                />
              </main>
            </div>
            <Footer />
          </div>
        );
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return <>{renderContent()}</>;
};

export default App;
