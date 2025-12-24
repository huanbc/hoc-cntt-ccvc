
export interface ProgressData {
  [lessonKey: string]: boolean;
}

const PROGRESS_KEY = 'itLearningCenterProgress';

/**
 * Creates a unique key for a lesson based on its properties.
 * @param lessonId Can be the level for regular topics, or the lesson title for special topics.
 */
const createLessonKey = (categoryName: string, topicName: string, lessonId: string): string => {
  return `${categoryName}-${topicName}-${lessonId}`;
};

/**
 * Loads the user's progress from localStorage.
 * @returns {ProgressData} The user's progress object, or an empty object if none exists.
 */
export const loadProgress = (): ProgressData => {
  try {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    return savedProgress ? JSON.parse(savedProgress) : {};
  } catch (error) {
    console.error("Failed to load progress from localStorage:", error);
    return {};
  }
};

/**
 * Saves the user's progress to localStorage.
 * @param {ProgressData} progressData The progress object to save.
 */
const saveProgress = (progressData: ProgressData): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
};

/**
 * Marks a specific lesson as complete and saves the updated progress.
 * @param lessonId Can be the level for regular topics, or the lesson title for special topics.
 */
export const markLessonAsComplete = (categoryName: string, topicName: string, lessonId: string): void => {
  const currentProgress = loadProgress();
  const lessonKey = createLessonKey(categoryName, topicName, lessonId);
  currentProgress[lessonKey] = true;
  saveProgress(currentProgress);
};

/**
 * Checks if a specific lesson is complete.
 * @param lessonId Can be the level for regular topics, or the lesson title for special topics.
 */
export const isLessonComplete = (progressData: ProgressData, categoryName: string, topicName: string, lessonId: string): boolean => {
    const lessonKey = createLessonKey(categoryName, topicName, lessonId);
    return !!progressData[lessonKey];
}
