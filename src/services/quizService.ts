import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Query,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Quiz, QuizQuestion } from './courseService';

/**
 * Quiz Attempt interface for Firestore storage
 */
export interface QuizAttempt {
  id: string;
  quizId: number;
  lessonId: number;
  courseId: number;
  userId: string;
  score: number;
  percentageCorrect: number;
  passed: boolean;
  answers: Record<string, string>; // questionId -> user's answer
  totalQuestions: number;
  correctAnswers: number;
  timestamp: any; // Firestore Timestamp
  completedAt: any; // Firestore Timestamp
  timeSpent: number; // seconds
}

/**
 * Quiz submission input data
 */
export interface QuizSubmissionInput {
  quizId: number;
  lessonId: number;
  courseId: number;
  answers: Record<string, string>; // questionId -> answer
  timeSpent: number; // seconds in milliseconds, will be converted
}

/**
 * Calculate quiz score based on answers and correct answers
 */
export const calculateQuizScore = (
  quiz: Quiz,
  answers: Record<string, string>
): { score: number; percentageCorrect: number; correctAnswers: number } => {
  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;

  quiz.questions.forEach((question) => {
    const userAnswer = answers[question.id];
    
    if (!userAnswer) {
      return; // No answer provided
    }

    const isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
    if (isCorrect) {
      correctAnswers++;
    }
  });

  const percentageCorrect = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const score = percentageCorrect;

  return {
    score,
    percentageCorrect,
    correctAnswers,
  };
};

/**
 * Submit a quiz attempt and save to Firestore
 */
export const submitQuizAttempt = async (
  userId: string,
  quiz: Quiz,
  submission: QuizSubmissionInput
): Promise<QuizAttempt> => {
  if (!userId) {
    throw new Error('User ID is required to submit quiz');
  }

  const { score, percentageCorrect, correctAnswers } = calculateQuizScore(quiz, submission.answers);
  const passed = score >= quiz.passPercentage;

  // Convert milliseconds to seconds
  const timeSpentSeconds = Math.round(submission.timeSpent / 1000);

  const attemptData = {
    quizId: submission.quizId,
    lessonId: submission.lessonId,
    courseId: submission.courseId,
    userId,
    score,
    percentageCorrect,
    passed,
    answers: submission.answers,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    timestamp: serverTimestamp(),
    completedAt: serverTimestamp(),
    timeSpent: timeSpentSeconds,
  };

  try {
    const docRef = await addDoc(
      collection(db, 'users', userId, 'quizAttempts'),
      attemptData
    );

    return {
      id: docRef.id,
      ...attemptData,
    } as QuizAttempt;
  } catch (error) {
    console.error('Failed to submit quiz attempt:', error);
    throw new Error('Failed to save quiz attempt. Please try again.');
  }
};

/**
 * Get all quiz attempts for a specific lesson
 */
export const getQuizAttemptsByLesson = async (
  userId: string,
  lessonId: number
): Promise<QuizAttempt[]> => {
  if (!userId) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'users', userId, 'quizAttempts'),
      where('lessonId', '==', lessonId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as QuizAttempt));
  } catch (error) {
    // Silently fail for expected errors (abort, network)
    if (error instanceof Error && (error.name === 'AbortError' || String(error).includes('aborted'))) {
      return [];
    }
    console.warn('Failed to fetch quiz attempts for lesson:', error);
    return [];
  }
};

/**
 * Get the latest quiz attempt for a specific quiz
 */
export const getLatestQuizAttempt = async (
  userId: string,
  quizId: number
): Promise<QuizAttempt | null> => {
  if (!userId) {
    return null;
  }

  try {
    const q = query(
      collection(db, 'users', userId, 'quizAttempts'),
      where('quizId', '==', quizId),
      orderBy('completedAt', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as QuizAttempt;
  } catch (error) {
    // Silently fail for expected errors (abort, network)
    if (error instanceof Error && (error.name === 'AbortError' || String(error).includes('aborted'))) {
      return null;
    }
    console.warn('Failed to fetch latest quiz attempt:', error);
    return null;
  }
};

/**
 * Check if user has passed a specific quiz
 */
export const hasPassedQuiz = async (userId: string, quizId: number): Promise<boolean> => {
  if (!userId) {
    return false;
  }

  try {
    const q = query(
      collection(db, 'users', userId, 'quizAttempts'),
      where('quizId', '==', quizId),
      where('passed', '==', true),
      limit(1)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    // Silently fail for expected errors (abort, network)
    if (error instanceof Error && (error.name === 'AbortError' || String(error).includes('aborted'))) {
      return false;
    }
    console.warn('Failed to check quiz pass status:', error);
    return false;
  }
};

/**
 * Get quiz statistics for a lesson
 */
export interface QuizStats {
  attempts: number;
  bestScore: number;
  latestScore: number;
  passed: boolean;
  lastAttemptDate: Date | null;
}

export const getQuizStats = async (userId: string, lessonId: number): Promise<QuizStats> => {
  if (!userId) {
    return {
      attempts: 0,
      bestScore: 0,
      latestScore: 0,
      passed: false,
      lastAttemptDate: null,
    };
  }

  try {
    const attempts = await getQuizAttemptsByLesson(userId, lessonId);

    if (attempts.length === 0) {
      return {
        attempts: 0,
        bestScore: 0,
        latestScore: 0,
        passed: false,
        lastAttemptDate: null,
      };
    }

    const bestScore = Math.max(...attempts.map((a) => a.score));
    const latestScore = attempts[0].score;
    const passed = attempts.some((a) => a.passed);
    const lastAttemptDate = attempts[0].completedAt?.toDate?.() || new Date();

    return {
      attempts: attempts.length,
      bestScore,
      latestScore,
      passed,
      lastAttemptDate,
    };
  } catch (error) {
    // Silently fail for expected errors (abort, network)
    if (error instanceof Error && (error.name === 'AbortError' || String(error).includes('aborted'))) {
      return {
        attempts: 0,
        bestScore: 0,
        latestScore: 0,
        passed: false,
        lastAttemptDate: null,
      };
    }
    console.warn('Failed to get quiz stats:', error);
    return {
      attempts: 0,
      bestScore: 0,
      latestScore: 0,
      passed: false,
      lastAttemptDate: null,
    };
  }
};

/**
 * Get all quiz attempts for a specific course (across all lessons)
 */
export const getQuizAttemptsByCourse = async (
  userId: string,
  courseId: number
): Promise<QuizAttempt[]> => {
  if (!userId) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'users', userId, 'quizAttempts'),
      where('courseId', '==', courseId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as QuizAttempt));
  } catch (error) {
    // Silently fail for expected errors (abort, network)
    if (error instanceof Error && (error.name === 'AbortError' || String(error).includes('aborted'))) {
      return [];
    }
    console.warn('Failed to fetch quiz attempts for course:', error);
    return [];
  }
};

/**
 * Get course-wide quiz statistics
 */
export interface CourseQuizStats {
  totalLessonsWithQuiz: number;
  completedQuizzes: number;
  passedQuizzes: number;
  averageScore: number;
  completionPercentage: number;
}

export const getCourseQuizStats = async (
  userId: string,
  courseId: number,
  totalLessonsInCourse: number
): Promise<CourseQuizStats> => {
  if (!userId) {
    return {
      totalLessonsWithQuiz: 0,
      completedQuizzes: 0,
      passedQuizzes: 0,
      averageScore: 0,
      completionPercentage: 0,
    };
  }

  try {
    const attempts = await getQuizAttemptsByCourse(userId, courseId);

    if (attempts.length === 0) {
      return {
        totalLessonsWithQuiz: 0,
        completedQuizzes: 0,
        passedQuizzes: 0,
        averageScore: 0,
        completionPercentage: 0,
      };
    }

    const uniqueLessons = new Set(attempts.map((a) => a.lessonId));
    const passedAttempts = attempts.filter((a) => a.passed);
    const averageScore = Math.round(
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
    );

    return {
      totalLessonsWithQuiz: totalLessonsInCourse,
      completedQuizzes: uniqueLessons.size,
      passedQuizzes: new Set(passedAttempts.map((a) => a.lessonId)).size,
      averageScore,
      completionPercentage: Math.round((uniqueLessons.size / totalLessonsInCourse) * 100),
    };
  } catch (error) {
    // Silently fail for expected errors (abort, network)
    if (error instanceof Error && (error.name === 'AbortError' || String(error).includes('aborted'))) {
      return {
        totalLessonsWithQuiz: 0,
        completedQuizzes: 0,
        passedQuizzes: 0,
        averageScore: 0,
        completionPercentage: 0,
      };
    }
    console.warn('Failed to get course quiz stats:', error);
    return {
      totalLessonsWithQuiz: 0,
      completedQuizzes: 0,
      passedQuizzes: 0,
      averageScore: 0,
      completionPercentage: 0,
    };
  }
};
