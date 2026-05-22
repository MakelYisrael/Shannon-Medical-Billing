interface WordPressCourse {
  id: number;
  title: {
    rendered: string;
  };
  acf: {
    description?: string;
    thumbnail?: string;
    difficulty?: string;
    lessons?: any[]; // Legacy: flat array of lessons
    modules?: number[]; // Relational: array of module IDs
    duration?: string;
  };
}

interface WordPressModule {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: {
    course?: number[];
    order_number?: number;
    lessons?: number[]; // Relationship field: array of lesson IDs
  };
}

interface WordPressLesson {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: {
    module?: number[];
    order_number?: number;
    duration?: string;
    video_url?: string;
    transcript?: string;
    resources?: any[];
    associated_quizzes?: number[]; // Relationship to Quiz posts
  };
}

interface WordPressQuiz {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: {
    associated_lesson?: number[];
    pass_percentage?: number;
    questions?: Array<{
      question_text: string;
      question_type: 'multiple_choice' | 'true_false' | 'essay';
      options?: Array<{
        option_text: string;
        option_key: string;
      }>;
      correct_answer: string;
      explanation?: string;
      question_order?: number;
    }>;
  };
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options?: Array<{
    key: string;
    text: string;
  }>;
  correctAnswer: string;
  explanation?: string;
  order: number;
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  passPercentage: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  url?: string;
  videoUrl?: string;
  transcript?: string;
  resources?: any[];
  quiz?: Quiz;
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  instructor: string;
  thumbnail?: string;
  gradient: string;
  buttonColor: string;
  modules: Module[];
}

// Map difficulty levels to Tailwind colors
const difficultyColorMap: Record<string, { gradient: string; buttonColor: string }> = {
  'beginner': { gradient: 'from-blue-50 to-indigo-50', buttonColor: 'bg-blue-600 hover:bg-blue-700' },
  'intermediate': { gradient: 'from-purple-50 to-violet-50', buttonColor: 'bg-purple-600 hover:bg-purple-700' },
  'advanced': { gradient: 'from-amber-50 to-orange-50', buttonColor: 'bg-amber-600 hover:bg-amber-700' },
};

const getColorTheme = (difficulty?: string) => {
  const normalized = difficulty?.toLowerCase() || 'beginner';
  return difficultyColorMap[normalized] || difficultyColorMap['beginner'];
};

/**
 * Fetch a single module from WordPress REST API
 */
const fetchWordPressModule = async (moduleId: number): Promise<WordPressModule | null> => {
  try {
    const url = `http://headless.local/wp-json/wp/v2/module/${moduleId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch module ${moduleId}:`, error);
    return null;
  }
};

/**
 * Fetch a single lesson from WordPress REST API
 */
const fetchWordPressLesson = async (lessonId: number): Promise<WordPressLesson | null> => {
  try {
    const url = `http://headless.local/wp-json/wp/v2/lesson/${lessonId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch lesson ${lessonId}:`, error);
    return null;
  }
};

/**
 * Fetch a single quiz from WordPress REST API
 */
const fetchWordPressQuiz = async (quizId: number): Promise<WordPressQuiz | null> => {
  try {
    const url = `http://headless.local/wp-json/wp/v2/quiz/${quizId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch quiz ${quizId}:`, error);
    return null;
  }
};

/**
 * Transform a WordPress quiz to our Quiz interface
 */
const transformWordPressQuiz = (wpQuiz: WordPressQuiz): Quiz => {
  const questions: QuizQuestion[] = (wpQuiz.acf?.questions || [])
    .sort((a, b) => (a.question_order || 0) - (b.question_order || 0))
    .map((q, index) => ({
      id: `q-${wpQuiz.id}-${index}`,
      text: q.question_text,
      type: q.question_type,
      options: q.options ? q.options.map(opt => ({
        key: opt.option_key,
        text: opt.option_text,
      })) : undefined,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      order: index + 1,
    }));

  return {
    id: wpQuiz.id,
    title: wpQuiz.title.rendered,
    questions,
    passPercentage: wpQuiz.acf?.pass_percentage || 70,
  };
};

/**
 * Transform a WordPress lesson to our Lesson interface
 */
const transformWordPressLesson = async (wpLesson: WordPressLesson, courseUrl: string): Promise<Lesson> => {
  // Handle PDF field - can be a string URL or an object with URL
  let pdfUrl: string | undefined;
  const pdfField = wpLesson.acf?.lesson_pdf_doc || wpLesson.acf?.pdf || wpLesson.acf?.resources;

  if (typeof pdfField === 'string') {
    pdfUrl = pdfField || undefined;
  } else if (pdfField && typeof pdfField === 'object') {
    pdfUrl = pdfField.url || pdfField.link || pdfField.file || undefined;
  }

  // Fetch associated quiz if any
  let quiz: Quiz | undefined;
  const quizIds = wpLesson.acf?.associated_quizzes;
  if (quizIds && quizIds.length > 0) {
    const wpQuiz = await fetchWordPressQuiz(quizIds[0]); // Get first quiz
    if (wpQuiz) {
      quiz = transformWordPressQuiz(wpQuiz);
    }
  }

  return {
    id: String(wpLesson.id),
    title: wpLesson.title.rendered,
    duration: wpLesson.acf?.duration || '15 min',
    completed: false,
    url: courseUrl,
    videoUrl: wpLesson.acf?.video_url || undefined,
    transcript: wpLesson.acf?.transcript || undefined,
    resources: pdfUrl ? [{ title: 'Lesson PDF', url: pdfUrl, type: 'PDF' }] : undefined,
    quiz,
  };
};

/**
 * Transform a WordPress module to our Module interface
 */
const transformWordPressModule = (wpModule: WordPressModule, courseUrl: string, lessons: Lesson[]): Module => {
  return {
    title: wpModule.title.rendered,
    description: wpModule.content.rendered || wpModule.title.rendered,
    lessons: lessons,
  };
};

// Helper to generate URL-friendly slug from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Map short course IDs to full WordPress slugs
const courseSlugMap: Record<string, string> = {
  'foundations': 'medical-billing-foundations',
  'coding-basics': 'medical-coding-essentials',
  'ar-management': 'ar-management-mastery',
  'advanced-coding': 'advanced-coding-compliance',
};

// Fallback courses - used when WordPress API is unavailable
const fallbackCourses: Record<string, CourseData> = {
  'medical-billing-foundations': {
    id: 1,
    title: 'Medical Billing Foundations',
    description: 'Master the complete billing cycle from patient intake to payment posting.',
    level: 'Beginner',
    duration: '6-8 weeks',
    instructor: 'Shannon Marie',
    gradient: 'from-blue-50 to-indigo-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    modules: [
      {
        title: 'Module 1: Introduction to Medical Billing',
        description: 'Understanding the healthcare revenue cycle, key terminology, and industry overview',
        lessons: [
            { id: 'l1-1', title: 'Welcome to Medical Billing', duration: '12 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=p4eYjBVZIc8', transcript: 'Welcome to Medical Billing Foundations! My name is Shannon Marie, and I\'m excited to guide you through this comprehensive course on medical billing. Over the next 6-8 weeks, we\'ll explore everything from the basics of the revenue cycle to advanced coding and compliance strategies. Whether you\'re new to billing or looking to advance your career, this course is designed for you. In this lesson, we\'ll cover the fundamentals of medical billing, including key terminology, industry overview, and your role in the revenue cycle. Let\'s get started!' },
          { id: 'l1-2', title: 'The Revenue Cycle Overview', duration: '18 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-3', title: 'Key Terminology You Need to Know', duration: '15 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-4', title: 'Industry Landscape', duration: '20 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-5', title: 'Your Role in the Revenue Cycle', duration: '14 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ]
      },
      {
        title: 'Module 2: Medical Coding Fundamentals',
        description: 'CPT, ICD-10, and HCPCS basics with real-world coding practice',
        lessons: [
          { id: 'l2-1', title: 'Introduction to Medical Codes', duration: '16 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l2-2', title: 'CPT Codes Explained', duration: '22 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l2-3', title: 'Understanding ICD-10', duration: '19 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l2-4', title: 'HCPCS Level II Codes', duration: '17 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l2-5', title: 'Coding Practice Scenarios', duration: '25 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ]
      },
      {
        title: 'Module 3: Insurance & Payer Requirements',
        description: 'Understanding commercial, Medicare, Medicaid, and worker\'s compensation',
        lessons: [
          { id: 'l3-1', title: 'Types of Insurance Plans', duration: '18 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l3-2', title: 'Commercial Insurance Basics', duration: '16 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l3-3', title: 'Medicare Requirements', duration: '20 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l3-4', title: 'Medicaid & Workers Comp', duration: '15 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l3-5', title: 'Pre-Authorization & Verification', duration: '19 min', completed: false, url: 'http://headless.local/course/medical-billing-foundations/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ]
      },
    ]
  },
  'medical-coding-essentials': {
    id: 2,
    title: 'Medical Coding Essentials',
    description: 'Learn CPT, ICD-10, and HCPCS coding basics with real-world examples.',
    level: 'Beginner',
    duration: '4-6 weeks',
    instructor: 'Shannon Marie',
    gradient: 'from-teal-50 to-cyan-50',
    buttonColor: 'bg-teal-600 hover:bg-teal-700',
    modules: [
      {
        title: 'Module 1: Introduction to Medical Coding',
        description: 'Overview of coding systems and why accurate coding matters',
        lessons: [
          { id: 'l1-1', title: 'Welcome to Medical Coding', duration: '10 min', completed: false, url: 'http://headless.local/course/medical-coding-essentials/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-2', title: 'Why Coding Matters', duration: '12 min', completed: false, url: 'http://headless.local/course/medical-coding-essentials/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-3', title: 'Coding Standards & Ethics', duration: '14 min', completed: false, url: 'http://headless.local/course/medical-coding-essentials/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ]
      },
    ]
  },
  'ar-management-mastery': {
    id: 3,
    title: 'AR Management Mastery',
    description: 'Reduce days in AR and boost collections with proven strategies.',
    level: 'Intermediate',
    duration: '5-7 weeks',
    instructor: 'Shannon Marie',
    gradient: 'from-purple-50 to-violet-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    modules: [
      {
        title: 'Module 1: AR Fundamentals & Metrics',
        description: 'Understanding AR reports, key performance indicators, and benchmarks',
        lessons: [
          { id: 'l1-1', title: 'What is AR?', duration: '10 min', completed: false, url: 'http://headless.local/course/ar-management-mastery/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-2', title: 'Key Performance Indicators', duration: '15 min', completed: false, url: 'http://headless.local/course/ar-management-mastery/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-3', title: 'Reading AR Reports', duration: '18 min', completed: false, url: 'http://headless.local/course/ar-management-mastery/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ]
      },
    ]
  },
  'advanced-coding-compliance': {
    id: 4,
    title: 'Advanced Coding & Compliance',
    description: 'Deep dive into complex coding scenarios and compliance requirements.',
    level: 'Advanced',
    duration: '8-10 weeks',
    instructor: 'Shannon Marie',
    gradient: 'from-amber-50 to-orange-50',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    modules: [
      {
        title: 'Module 1: Advanced CPT Coding',
        description: 'Complex procedures, surgical coding, and bundling rules',
        lessons: [
          { id: 'l1-1', title: 'Complex Procedures', duration: '20 min', completed: false, url: 'http://headless.local/course/advanced-coding-compliance/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-2', title: 'Surgical Coding Specifics', duration: '22 min', completed: false, url: 'http://headless.local/course/advanced-coding-compliance/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'l1-3', title: 'Bundling Rules', duration: '18 min', completed: false, url: 'http://headless.local/course/advanced-coding-compliance/', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ]
      },
    ]
  },
};

/**
 * Transform WordPress course data to our CourseData format
 * Handles both legacy (nested repeaters) and new (relational) structures
 */
const transformWordPressCourse = async (wpCourse: WordPressCourse, apiBaseUrl?: string): Promise<CourseData> => {
  const colorTheme = getColorTheme(wpCourse.acf?.difficulty);
  const courseSlug = generateSlug(wpCourse.title.rendered);
  const courseUrl = `http://headless.local/course/${courseSlug}/`;

  let modules: Module[] = [];

  // NEW STRUCTURE: Check if course has relational modules field
  if (wpCourse.acf?.modules && Array.isArray(wpCourse.acf.modules) && wpCourse.acf.modules.length > 0) {
    console.log(`[transformWordPressCourse] Using relational structure for course: ${wpCourse.title.rendered}`);

    // Fetch all modules
    const modulePromises = wpCourse.acf.modules.map(moduleId => fetchWordPressModule(moduleId));
    const wpModules = await Promise.all(modulePromises);

    // Transform modules and their lessons
    modules = await Promise.all(
      wpModules
        .filter((m): m is WordPressModule => m !== null)
        .sort((a, b) => (a.acf?.order_number || 0) - (b.acf?.order_number || 0))
        .map(async (wpModule) => {
          // Fetch lessons for this module
          const lessonIds = wpModule.acf?.lessons || [];
          const lessonPromises = lessonIds.map(lessonId => fetchWordPressLesson(lessonId));
          const wpLessons = await Promise.all(lessonPromises);

          const transformedLessonPromises = wpLessons
            .filter((l): l is WordPressLesson => l !== null)
            .sort((a, b) => (a.acf?.order_number || 0) - (b.acf?.order_number || 0))
            .map(wpLesson => transformWordPressLesson(wpLesson, courseUrl));
          const lessons = await Promise.all(transformedLessonPromises);

          return transformWordPressModule(wpModule, courseUrl, lessons);
        })
    );
  }

  // LEGACY STRUCTURE: Use nested repeater lessons
  if (modules.length === 0) {
    console.log(`[transformWordPressCourse] Using legacy nested structure for course: ${wpCourse.title.rendered}`);

    const courseVideoUrl = wpCourse.acf?.video as string | undefined;
    const courseTranscript = wpCourse.acf?.transcript as string | undefined;

    // Transform lessons from ACF or create empty lesson structure
    const lessons: Lesson[] = wpCourse.acf?.lessons
      ? Array.isArray(wpCourse.acf.lessons)
        ? wpCourse.acf.lessons.map((lesson: any, index: number) => {
            // Handle both lesson objects and lesson IDs
            const isLessonObject = typeof lesson === 'object' && lesson !== null;

            return {
              id: isLessonObject ? (lesson.id || `lesson-${index}`) : `lesson-${index}`,
              title: isLessonObject ? (lesson.title || lesson.name || `Lesson ${index + 1}`) : `Lesson ${index + 1}`,
              duration: isLessonObject ? (lesson.duration || '15 min') : '15 min',
              completed: false,
              url: isLessonObject ? (lesson.url || courseUrl) : courseUrl,
              // Use course-level video for Lesson 1, then fall back to individual lesson videos
              videoUrl: index === 0 && courseVideoUrl
                ? courseVideoUrl
                : (isLessonObject ? (lesson.videoUrl || lesson.video_url || lesson.video) : undefined),
              // Use course-level transcript for Lesson 1, then fall back to individual lesson transcripts
              transcript: index === 0 && courseTranscript
                ? courseTranscript
                : (isLessonObject ? (lesson.transcript || lesson.transcript_text) : undefined),
              // Include PDF resources if available
              resources: isLessonObject && (lesson.lesson_pdf_doc || lesson.pdf_url || lesson.resources)
                ? [{
                    title: 'Lesson PDF',
                    url: lesson.lesson_pdf_doc || lesson.pdf_url || lesson.resources,
                    type: 'PDF'
                  }]
                : undefined,
            };
          })
        : []
      : [];

    // Create a single module from the course data
    modules = [
      {
        title: `Module 1: ${wpCourse.title.rendered}`,
        description: wpCourse.acf?.description || 'Course content',
        lessons: lessons.length > 0 ? lessons : [
          {
            id: '1',
            title: 'Getting Started',
            duration: '15 min',
            completed: false,
            url: courseUrl,
            videoUrl: courseVideoUrl,
          },
        ],
      },
    ];
  }

  return {
    id: wpCourse.id,
    title: wpCourse.title.rendered,
    description: wpCourse.acf?.description || '',
    level: wpCourse.acf?.difficulty || 'Beginner',
    duration: wpCourse.acf?.duration || '4-6 weeks',
    instructor: 'Shannon Marie',
    thumbnail: wpCourse.acf?.thumbnail,
    gradient: colorTheme.gradient,
    buttonColor: colorTheme.buttonColor,
    modules,
  };
};

export const fetchCoursesFromWordPress = async (apiUrl: string): Promise<CourseData[]> => {
  try {
    console.log(`[fetchCoursesFromWordPress] Attempting to fetch from: ${apiUrl}`);
    const response = await fetch(apiUrl);

    console.log(`[fetchCoursesFromWordPress] Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const courses: WordPressCourse[] = await response.json();
    console.log(`[fetchCoursesFromWordPress] Raw response:`, courses);
    console.log(`[fetchCoursesFromWordPress] Successfully parsed ${courses.length} courses`);

    // If API returned no courses, use fallback
    if (!courses || courses.length === 0) {
      console.log(`[fetchCoursesFromWordPress] API returned empty, using fallback courses`);
      return Object.values(fallbackCourses);
    }

    // Extract API base URL from full URL
    // e.g., "http://headless.local/wp-json/wp/v2/cours" → "http://headless.local/wp-json/wp/v2"
    const apiBaseUrl = apiUrl.replace(/\/cours\/?$/, '');

    // Transform all courses (may fetch related modules/lessons for relational structure)
    const transformed = await Promise.all(courses.map(course => transformWordPressCourse(course, apiBaseUrl)));
    console.log(`[fetchCoursesFromWordPress] Transformed to ${transformed.length} courses`);
    return transformed;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[fetchCoursesFromWordPress] WordPress API error: ${errorMsg}`);
    console.warn(`[fetchCoursesFromWordPress] Using ${Object.keys(fallbackCourses).length} fallback courses instead`);
    // Return fallback courses as array when WordPress API fails
    return Object.values(fallbackCourses);
  }
};

export const fetchCourseById = async (apiBaseUrl: string, courseId: string | number): Promise<CourseData | null> => {
  try {
    // Convert short course ID to full WordPress slug if needed
    const wordPressSlug = courseSlugMap[String(courseId)] || String(courseId);

    // Use slug query parameter for WordPress REST API
    // Note: apiBaseUrl is the full course endpoint (e.g., http://headless.local/wp-json/wp/v2/cours)
    // so we just append the query parameter, don't add /cours again
    const url = `${apiBaseUrl}?slug=${wordPressSlug}`;
    console.log(`[fetchCourseById] Course ID: ${courseId} → WordPress Slug: ${wordPressSlug}`);
    console.log(`[fetchCourseById] Fetching from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      // If WordPress API fails, try fallback courses
      console.warn(`WordPress API returned ${response.status}, attempting fallback for course: ${courseId}`);
      const fallbackCourse = fallbackCourses[wordPressSlug] || fallbackCourses[String(courseId)];
      if (fallbackCourse) {
        console.log(`Using fallback course: ${wordPressSlug}`);
        return fallbackCourse;
      }
      return null;
    }

    const courses: WordPressCourse[] = await response.json();
    console.log(`[fetchCourseById] Response:`, courses);

    if (!courses || courses.length === 0) {
      console.warn(`No course found with slug: ${courseId}`);
      const fallbackCourse = fallbackCourses[String(courseId)];
      if (fallbackCourse) {
        console.log(`Using fallback course: ${courseId}`);
        return fallbackCourse;
      }
      return null;
    }

    const course = await transformWordPressCourse(courses[0], apiBaseUrl);
    console.log(`[fetchCourseById] Transformed course:`, course);
    return course;
  } catch (error) {
    // Network error - try fallback
    console.warn(`Failed to fetch from WordPress API for course ${courseId}, using fallback:`, error);
    const wordPressSlug = courseSlugMap[String(courseId)] || String(courseId);
    const fallbackCourse = fallbackCourses[wordPressSlug] || fallbackCourses[String(courseId)];
    if (fallbackCourse) {
      console.log(`Using fallback course: ${wordPressSlug}`);
      return fallbackCourse;
    }
    return null;
  }
};
