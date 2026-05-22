import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2, Clock, Play, RotateCcw, Eye, AlertCircle, Loader } from 'lucide-react';
import { fetchCourseById } from '../services/courseService';
import { VideoPlayer } from '../components/VideoPlayer';
import { TranscriptPanel } from '../components/TranscriptPanel';
import { QuizPanel } from '../components/QuizPanel';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { CourseData, Lesson, Module } from '../services/courseService';

interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  currentModule: number;
  currentLesson: number;
}

// WordPress REST API endpoint for fetching courses
const WORDPRESS_API_URL = 'http://headless.local/wp-json/wp/v2/cours';

export default function CourseHub() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [progress, setProgress] = useState<CourseProgress>({
    totalLessons: 0,
    completedLessons: 0,
    currentModule: 0,
    currentLesson: 0,
  });
  const [activeLesson, setActiveLesson] = useState<{ moduleIndex: number; lessonIndex: number } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Fetch course data
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!courseId) {
          throw new Error('Course ID is missing');
        }

        const courseData = await fetchCourseById(WORDPRESS_API_URL, courseId);
        
        if (!courseData) {
          throw new Error(`Course not found: ${courseId}`);
        }

        setCourse(courseData);

        // Initialize progress
        const totalLessons = courseData.modules.reduce(
          (acc: number, mod: Module) => acc + mod.lessons.length,
          0
        );
        
        setProgress({
          totalLessons,
          completedLessons: 0,
          currentModule: 0,
          currentLesson: 0,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load course';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  // Load progress from Firestore for logged-in users
  useEffect(() => {
    const loadProgressFromFirestore = async () => {
      if (!user || !course) return;

      setLoadingProgress(true);
      try {
        const courseProgress = await userService.getCourseProgress(user.uid, String(course.id));

        if (courseProgress) {
          setProgress({
            totalLessons: courseProgress.totalLessons,
            completedLessons: courseProgress.lessonsCompleted,
            currentModule: 0,
            currentLesson: 0,
          });
        }
      } catch (err) {
        console.warn('Failed to load progress from Firestore:', err);
        // Continue with initial progress - don't block UI
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgressFromFirestore();
  }, [user, course]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full mx-4 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-900">Unable to Load Course</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-red-800">
            <p className="mb-4">{error}</p>
            <p className="text-sm mb-4">
              Make sure your WordPress REST API is running at:
              <br />
              <code className="bg-red-100 px-2 py-1 rounded text-xs mt-2 block">{WORDPRESS_API_URL}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleStartLesson = async (moduleIndex: number, lessonIndex: number) => {
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    const isNewLesson = !lesson.completed;

    // Update local state
    setProgress(prev => {
      const newCompletedLessons = isNewLesson ? prev.completedLessons + 1 : prev.completedLessons;
      return {
        ...prev,
        currentModule: moduleIndex,
        currentLesson: lessonIndex,
        completedLessons: newCompletedLessons,
      };
    });

    // Save to Firestore if user is logged in
    if (user && course) {
      try {
        const newCompletedCount = isNewLesson ? progress.completedLessons + 1 : progress.completedLessons;
        await userService.updateLessonCompletion(
          user.uid,
          String(course.id),
          newCompletedCount,
          progress.totalLessons
        );
      } catch (err) {
        console.warn('Failed to save lesson completion to Firestore:', err);
        // Continue anyway - local state is already updated
      }
    }

    // Open the lesson in the video modal
    setActiveLesson({ moduleIndex, lessonIndex });
  };

  const handleCloseLesson = () => {
    setActiveLesson(null);
    setShowQuiz(false);
  };

  const handleContinue = () => {
    if (activeLesson) {
      // Already viewing a lesson, just close the modal
      handleCloseLesson();
      return;
    }

    const currentModule = course.modules[progress.currentModule];
    const currentLesson = currentModule.lessons[progress.currentLesson];

    // Open the current lesson in the embedded viewer
    setActiveLesson({ moduleIndex: progress.currentModule, lessonIndex: progress.currentLesson });
  };

  const handleReviewModule = (moduleIndex: number) => {
    const module = course.modules[moduleIndex];
    alert(`Reviewing: ${module.title}\n\nShowing module summary and key takeaways...`);
  };

  const progressPercentage = progress.totalLessons > 0
    ? (progress.completedLessons / progress.totalLessons) * 100
    : 0;

  // Helper to check if a lesson is completed
  const isLessonCompleted = (moduleIndex: number, lessonIndex: number): boolean => {
    // Calculate the flat lesson index across all modules
    let flatLessonIndex = 0;
    for (let i = 0; i < moduleIndex; i++) {
      flatLessonIndex += course.modules[i].lessons.length;
    }
    flatLessonIndex += lessonIndex;
    return flatLessonIndex < progress.completedLessons;
  };

  const currentModule = course.modules[progress.currentModule];
  const currentLesson = currentModule.lessons[progress.currentLesson];

  // Get the currently viewed lesson details
  const getActiveLessonDetails = () => {
    if (!activeLesson) return null;
    const lesson = course.modules[activeLesson.moduleIndex].lessons[activeLesson.lessonIndex];
    return {
      id: lesson.id,
      title: lesson.title,
      module: course.modules[activeLesson.moduleIndex].title,
      courseUrl: lesson.url || 'http://headless.local/course/getting-started/',
      videoUrl: lesson.videoUrl,
      transcript: lesson.transcript,
      resources: (lesson as any).resources,
      quiz: (lesson as any).quiz,
    };
  };

  const activeLessonDetails = getActiveLessonDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(user ? '/portal' : '/courses')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-1"
        >
          ← Back to Courses
        </button>

        {/* Course Header */}
        <div className={`bg-gradient-to-br ${course.gradient} rounded-xl p-8 mb-8`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {course.title}
              </h1>
              <p className="text-gray-700 text-lg mb-6">{course.description}</p>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-blue-600">
                  <p className="text-gray-600 text-sm font-medium mb-1">Level</p>
                  <p className="text-xl font-bold text-gray-900">{course.level}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-blue-600">
                  <p className="text-gray-600 text-sm font-medium mb-1">Duration</p>
                  <p className="text-xl font-bold text-gray-900">{course.duration}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-blue-600">
                  <p className="text-gray-600 text-sm font-medium mb-1">Instructor</p>
                  <p className="text-xl font-bold text-gray-900">{course.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.completedLessons === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</p>
                <p className="text-gray-600 mb-6">
                  Select a module below and click "Start Next" to begin your learning journey.
                </p>
                <Button
                  className={`${course.buttonColor} text-white`}
                  onClick={() => {
                    setExpandedModules([0]);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Scroll to Modules
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Course Completion</span>
                    <span className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    {progress.completedLessons} of {progress.totalLessons} lessons completed
                  </p>
                </div>

                {currentLesson && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Currently watching:</p>
                    <p className="font-semibold text-gray-900 mb-3">{currentLesson.title}</p>
                    <Button
                      onClick={handleContinue}
                      className={`w-full ${course.buttonColor} text-white`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue Watching
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Modules</h2>
          
          {course.modules.map((module: Module, moduleIndex: number) => {
            const moduleLessons = module.lessons;
            const moduleCompletedLessons = moduleLessons.filter((_, lessonIndex) => isLessonCompleted(moduleIndex, lessonIndex)).length;
            const moduleProgress = moduleLessons.length > 0 ? (moduleCompletedLessons / moduleLessons.length) * 100 : 0;
            const isExpanded = expandedModules.includes(moduleIndex);

            return (
              <Card key={moduleIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                <button
                  onClick={() => toggleModule(moduleIndex)}
                  className="w-full text-left"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-semibold text-gray-900`}>
                            {module.title}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {module.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {/* Module Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {moduleCompletedLessons}/{moduleLessons.length} lessons
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {Math.round(moduleProgress)}%
                        </span>
                      </div>
                      <Progress value={moduleProgress} className="h-2" />
                    </div>
                  </CardHeader>
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <CardContent className="pt-0 space-y-2">
                    {moduleLessons.map((lesson: Lesson, lessonIndex: number) => {
                      const completed = isLessonCompleted(moduleIndex, lessonIndex);
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`font-medium ${completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className={`ml-4 ${completed ? 'bg-gray-300 hover:bg-gray-400' : course.buttonColor} text-white`}
                            onClick={() => handleStartLesson(moduleIndex, lessonIndex)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {completed ? 'Rewatch' : 'Start'}
                          </Button>
                        </div>
                      );
                    })}

                    {/* Module Actions */}
                    <div className="pt-4 border-t border-gray-200 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReviewModule(moduleIndex)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review Module
                      </Button>
                      <Button
                        className={`flex-1 ${course.buttonColor} text-white`}
                        onClick={() => {
                          const firstIncomplete = moduleLessons.findIndex((_, idx) => !isLessonCompleted(moduleIndex, idx));
                          if (firstIncomplete !== -1) {
                            handleStartLesson(moduleIndex, firstIncomplete);
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Next
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Course Info Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Learn at Your Pace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Complete lessons whenever it works best for you. Your progress is saved automatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Lifetime Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Once you enroll, you have permanent access to all course materials and future updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                Revisit Anytime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Review lessons, modules, and take notes. Perfect for refreshing your knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Learning Modal */}
      {activeLesson && activeLessonDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{activeLessonDetails.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{activeLessonDetails.module}</p>
              </div>
              <button
                onClick={handleCloseLesson}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Video Player and Transcript */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="w-full">
                {/* Video Section */}
                <div className="bg-black flex items-center justify-center" style={{ minHeight: '400px' }}>
                  {activeLessonDetails.videoUrl ? (
                    <VideoPlayer
                      videoUrl={activeLessonDetails.videoUrl}
                      title={activeLessonDetails.title}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-white p-8" style={{ minHeight: '400px' }}>
                      <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
                      <p className="text-xl font-semibold mb-2">Video not available</p>
                      <p className="text-gray-300 text-center mb-6">This lesson doesn't have a video URL configured yet.</p>
                      {activeLessonDetails.courseUrl && (
                        <>
                          <p className="text-sm text-gray-400 mb-4">Fallback to course content:</p>
                          <a
                            href={activeLessonDetails.courseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Open course materials
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Transcript Section */}
                {activeLessonDetails.transcript && (
                  <div className="p-6">
                    <TranscriptPanel
                      transcript={activeLessonDetails.transcript}
                      title="Lesson Transcript"
                    />
                  </div>
                )}

                {/* Resources Section */}
                {activeLessonDetails.resources && Array.isArray(activeLessonDetails.resources) && activeLessonDetails.resources.length > 0 && (
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeLessonDetails.resources.map((resource: any, index: number) => {
                        const resourceTitle = resource.title || resource.name || `Resource ${index + 1}`;
                        const resourceUrl = resource.url || resource.link || resource.file;
                        const resourceType = resource.type || 'document';

                        if (!resourceUrl) return null;

                        return (
                          <a
                            key={index}
                            href={resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{resourceTitle}</p>
                              <p className="text-sm text-gray-600 capitalize">{resourceType}</p>
                            </div>
                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quiz Section */}
                {activeLessonDetails.quiz && !showQuiz && (
                  <div className="p-6 border-t border-gray-200 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{activeLessonDetails.quiz.title}</h3>
                        <p className="text-sm text-gray-600">
                          {activeLessonDetails.quiz.questions.length} questions • Pass score: {activeLessonDetails.quiz.passPercentage}%
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowQuiz(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap ml-4"
                      >
                        Take Quiz
                      </Button>
                    </div>
                  </div>
                )}

                {/* Quiz Panel */}
                {activeLessonDetails.quiz && showQuiz && (
                  <div className="p-0">
                    <QuizPanel
                      quiz={activeLessonDetails.quiz}
                      lessonId={Number(activeLessonDetails.id)}
                      courseId={course?.id || 0}
                      userId={user?.uid}
                      onComplete={() => {
                        // Quiz submitted - could trigger lesson completion or other actions
                        console.log('Quiz completed');
                      }}
                      onClose={() => setShowQuiz(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {activeLessonDetails.videoUrl && (
                  <p>Video player active</p>
                )}
              </div>
              <Button
                onClick={handleCloseLesson}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Close Lesson
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
