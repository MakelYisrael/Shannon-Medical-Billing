import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Quiz, QuizQuestion } from '../services/courseService';
import { submitQuizAttempt, getLatestQuizAttempt, calculateQuizScore, QuizAttempt } from '../services/quizService';

interface QuizPanelProps {
  quiz: Quiz;
  lessonId: number;
  courseId: number;
  userId: string | undefined;
  onComplete?: (attempt: QuizAttempt) => void;
  onClose?: () => void;
}

type QuizState = 'not-started' | 'in-progress' | 'completed';

export const QuizPanel: React.FC<QuizPanelProps> = ({
  quiz,
  lessonId,
  courseId,
  userId,
  onComplete,
  onClose,
}) => {
  const [state, setState] = useState<QuizState>('not-started');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [submittedScore, setSubmittedScore] = useState<{ score: number; percentageCorrect: number; correctAnswers: number } | null>(null);

  // Fetch last attempt on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchLastAttempt = async () => {
      if (!userId) return;
      try {
        const attempt = await getLatestQuizAttempt(userId, quiz.id);
        if (isMounted) {
          setLastAttempt(attempt);
        }
      } catch (err) {
        // Silently ignore abort errors during cleanup
        if (err instanceof Error && err.name !== 'AbortError') {
          console.warn('Failed to fetch last attempt:', err);
        }
      }
    };

    fetchLastAttempt();

    return () => {
      isMounted = false;
    };
  }, [userId, quiz.id]);

  // Timer effect
  useEffect(() => {
    if (state !== 'in-progress') return;

    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1000); // increment by 1 second
    }, 1000);

    return () => clearInterval(timer);
  }, [state]);

  const handleStartQuiz = () => {
    setState('in-progress');
    setAnswers({});
    setTimeSpent(0);
    setError(null);
    setSubmittedScore(null);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError('You must be logged in to submit a quiz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await submitQuizAttempt(userId, quiz, {
        quizId: quiz.id,
        lessonId,
        courseId,
        answers,
        timeSpent,
      });

      const score = calculateQuizScore(quiz, answers);
      setSubmittedScore(score);
      setState('completed');
      onComplete?.(attempt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    handleStartQuiz();
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === quiz.questions.length;

  // Not started state
  if (state === 'not-started') {
    return (
      <Card className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Questions:</span> {quiz.questions.length}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Pass Score:</span> {quiz.passPercentage}%
          </p>
          {lastAttempt && (
            <div className={`text-sm p-3 rounded-lg ${
              lastAttempt.passed 
                ? 'bg-green-50 text-green-800' 
                : 'bg-yellow-50 text-yellow-800'
            }`}>
              <span className="font-medium">Last Attempt:</span> {lastAttempt.score}% 
              {lastAttempt.passed ? ' ✓ Passed' : ' (Not passed)'}
            </div>
          )}
        </div>

        <Button
          onClick={handleStartQuiz}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Start Quiz
        </Button>
      </Card>
    );
  }

  // In progress state
  if (state === 'in-progress') {
    return (
      <Card className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {formatTime(timeSpent)}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 mb-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900">{question.text}</h4>
                  <p className="text-xs text-gray-500 mt-1">Type: {question.type}</p>
                </div>
              </div>

              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2 ml-11">
                  {question.options.map((option) => (
                    <label key={option.key} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.key}
                        checked={answers[question.id] === option.key}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">{option.key}.</span> {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'true_false' && (
                <div className="space-y-2 ml-11">
                  {['true', 'false'].map((value) => (
                    <label key={value} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name={question.id}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">{value}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'essay' && (
                <div className="ml-11">
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {loading ? 'Submitting...' : `Submit Quiz (${answeredCount}/${quiz.questions.length})`}
          </Button>
        </div>
      </Card>
    );
  }

  // Completed state
  if (state === 'completed' && submittedScore) {
    const passed = submittedScore.score >= quiz.passPercentage;

    return (
      <Card className={`p-6 border-t ${passed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          {passed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-yellow-600" />
          )}
          <h3 className={`text-lg font-semibold ${passed ? 'text-green-900' : 'text-yellow-900'}`}>
            Quiz Complete!
          </h3>
        </div>

        <div className={`space-y-4 mb-6 p-4 rounded-lg ${passed ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <div className="text-center">
            <p className={`text-4xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
              {submittedScore.score}%
            </p>
            <p className={`text-sm ${passed ? 'text-green-700' : 'text-yellow-700'}`}>
              {submittedScore.correctAnswers} of {quiz.questions.length} questions correct
            </p>
          </div>

          {passed ? (
            <p className="text-center text-sm font-medium text-green-700">
              ✓ You passed! (Required: {quiz.passPercentage}%)
            </p>
          ) : (
            <p className="text-center text-sm font-medium text-yellow-700">
              Score needed: {quiz.passPercentage}%
            </p>
          )}
        </div>

        {/* Show review of answers */}
        <div className="bg-white rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 mb-3">Answer Review</h4>
          <div className="space-y-2">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase();

              return (
                <div
                  key={question.id}
                  className={`text-sm p-2 rounded flex items-start gap-2 ${
                    isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span className="font-semibold">{index + 1}.</span>
                  <div className="flex-grow">
                    <p className="font-medium">{question.text}</p>
                    <p className="text-xs mt-1">
                      Your answer: {userAnswer || 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs mt-1">
                        Correct answer: {question.correctAnswer}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-xs mt-2 italic">{question.explanation}</p>
                    )}
                  </div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
            variant="outline"
          >
            Close
          </Button>
          {!passed && (
            <Button
              onClick={handleRetake}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retake Quiz
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return null;
};

export default QuizPanel;
