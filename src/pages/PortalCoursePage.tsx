import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2, Clock, Play, RotateCcw, Eye, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface WordPressCourse {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  acf?: {
    description?: string;
    difficulty?: string;
    thumbnail?: {
      url?: string;
    } | string;
    duration?: string;
    instructor?: string;
    modules?: any[];
  };
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

interface CourseState {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  thumbnail?: string;
  duration?: string;
  instructor?: string;
  modules: Module[];
  gradient: string;
  buttonColor: string;
}

interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  currentModule: number;
  currentLesson: number;
}

const WORDPRESS_API_URL = 'http://headless.local/wp-json/wp/v2/cours';

// Map difficulty to colors
const difficultyColorMap: Record<string, { gradient: string; buttonColor: string }> = {
  'beginner': { gradient: 'from-blue-50 to-indigo-50', buttonColor: 'bg-blue-600 hover:bg-blue-700' },
  'intermediate': { gradient: 'from-purple-50 to-violet-50', buttonColor: 'bg-purple-600 hover:bg-purple-700' },
  'advanced': { gradient: 'from-amber-50 to-orange-50', buttonColor: 'bg-amber-600 hover:bg-amber-700' },
};

const getColorTheme = (difficulty?: string) => {
  const normalized = difficulty?.toLowerCase() || 'beginner';
  return difficultyColorMap[normalized] || difficultyColorMap['beginner'];
};

// Helper to get thumbnail URL
const getThumbnailUrl = (thumbnail?: any): string | undefined => {
  if (!thumbnail) return undefined;
  if (typeof thumbnail === 'string') return thumbnail;
  if (typeof thumbnail === 'object' && thumbnail.url) return thumbnail.url;
  return undefined;
};

export default function PortalCoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseState | null>(null);
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

  // Fetch course from WordPress API
  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) {
        setError('No course slug provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = `${WORDPRESS_API_URL}?slug=${slug}`;
        console.log(`[PortalCoursePage] Fetching from: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch course`);
        }

        const courses: WordPressCourse[] = await response.json();
        console.log(`[PortalCoursePage] API Response:`, courses);

        if (!courses || courses.length === 0) {
          throw new Error(`No course found with slug: ${slug}`);
        }

        const wpCourse = courses[0];
        const colorTheme = getColorTheme(wpCourse.acf?.difficulty);
        const thumbnailUrl = getThumbnailUrl(wpCourse.acf?.thumbnail);

        // Transform WordPress course to CourseState
        const transformedCourse: CourseState = {
          id: wpCourse.id,
          title: wpCourse.title.rendered,
          description: wpCourse.acf?.description || '',
          difficulty: wpCourse.acf?.difficulty || 'Beginner',
          thumbnail: thumbnailUrl,
          duration: wpCourse.acf?.duration || '4-6 weeks',
          instructor: wpCourse.acf?.instructor || 'Course Instructor',
          gradient: colorTheme.gradient,
          buttonColor: colorTheme.buttonColor,
          modules: wpCourse.acf?.modules
            ? Array.isArray(wpCourse.acf.modules)
              ? wpCourse.acf.modules.map((module: any, mIndex: number) => ({
                  title: module.title || `Module ${mIndex + 1}`,
                  description: module.description || '',
                  lessons: Array.isArray(module.lessons)
                    ? module.lessons.map((lesson: any, lIndex: number) => ({
                        id: `lesson-${mIndex}-${lIndex}`,
                        title: lesson.title || lesson.name || `Lesson ${lIndex + 1}`,
                        duration: lesson.duration || '15 min',
                        completed: false,
                      }))
                    : [],
                }))
              : []
            : [
                {
                  title: `Module 1: ${wpCourse.title.rendered}`,
                  description: 'Course content and lessons',
                  lessons: [
                    { id: '1', title: 'Getting Started', duration: '15 min', completed: false },
                  ],
                },
              ],
        };

        setCourse(transformedCourse);

        // Calculate total lessons
        const totalLessons = transformedCourse.modules.reduce(
          (acc, mod) => acc + mod.lessons.length,
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
        console.error(`[PortalCoursePage] Error:`, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

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
          <CardContent className="text-red-800 space-y-4">
            <p>{error}</p>
            <p className="text-sm">
              Make sure your WordPress REST API is running at:
              <br />
              <code className="bg-red-100 px-2 py-1 rounded text-xs mt-2 block">
                {WORDPRESS_API_URL}?slug={slug}
              </code>
            </p>
            <Button
              onClick={() => navigate('/courses')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
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

  const handleStartLesson = (moduleIndex: number, lessonIndex: number) => {
    if (!course) return;

    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    const isNewLesson = !lesson.completed;

    setProgress(prev => {
      const newCompletedLessons = isNewLesson ? prev.completedLessons + 1 : prev.completedLessons;
      return {
        ...prev,
        currentModule: moduleIndex,
        currentLesson: lessonIndex,
        completedLessons: newCompletedLessons,
      };
    });

    // Mark lesson as completed in the course state
    if (isNewLesson) {
      const updatedModules = course.modules.map((mod, mIdx) =>
        mIdx === moduleIndex
          ? {
              ...mod,
              lessons: mod.lessons.map((les, lIdx) =>
                lIdx === lessonIndex ? { ...les, completed: true } : les
              ),
            }
          : mod
      );
      setCourse({ ...course, modules: updatedModules });
    }

    setActiveLesson({ moduleIndex, lessonIndex });
  };

  const handleCloseLesson = () => {
    setActiveLesson(null);
  };

  // Helper to check if a lesson is completed
  const isLessonCompleted = (moduleIndex: number, lessonIndex: number): boolean => {
    if (!course) return false;
    // Calculate the flat lesson index across all modules
    let flatLessonIndex = 0;
    for (let i = 0; i < moduleIndex; i++) {
      flatLessonIndex += course.modules[i].lessons.length;
    }
    flatLessonIndex += lessonIndex;
    return flatLessonIndex < progress.completedLessons;
  };

  const progressPercentage = progress.totalLessons > 0
    ? (progress.completedLessons / progress.totalLessons) * 100
    : 0;
  const currentModule = course.modules[progress.currentModule];
  const currentLesson = currentModule?.lessons[progress.currentLesson];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/courses')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className={`bg-gradient-to-br ${course.gradient} rounded-xl p-8 mb-8`}>
          <div className="flex items-start justify-between mb-6 gap-8">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {course.title}
              </h1>
              <p className="text-gray-700 text-lg mb-6">{course.description}</p>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-blue-600">
                  <p className="text-gray-600 text-sm font-medium mb-1">Level</p>
                  <p className="text-xl font-bold text-gray-900">{course.difficulty}</p>
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

            {/* Right: Thumbnail */}
            {course.thumbnail && (
              <div className="hidden lg:block flex-shrink-0">
                <ImageWithFallback
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-64 h-64 rounded-lg object-cover shadow-lg"
                  fallback={
                    <div className="w-64 h-64 rounded-lg bg-gray-300 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  }
                />
              </div>
            )}
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
            {progress.completedLessons === 0 && progress.totalLessons === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</p>
                <p className="text-gray-600 mb-6">
                  Select a module below and click "Start" to begin your learning journey.
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
                      onClick={() => setActiveLesson({ moduleIndex: progress.currentModule, lessonIndex: progress.currentLesson })}
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
                          <span className="text-lg font-semibold text-gray-900">
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

      {/* Lesson Modal */}
      {activeLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {course.modules[activeLesson.moduleIndex].lessons[activeLesson.lessonIndex].title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {course.modules[activeLesson.moduleIndex].title}
                </p>
              </div>
              <button
                onClick={handleCloseLesson}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Lesson content would be loaded here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {course.modules[activeLesson.moduleIndex].lessons[activeLesson.lessonIndex].title}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Lesson content loads here from your content management system
              </p>
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
