import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GraduationCap, TrendingUp, Award, Users, AlertCircle, Loader } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCourses } from '../hooks/useCourses';

// WordPress REST API endpoint - will use fallback courses if unreachable
const WORDPRESS_API_URL = 'http://headless.local/wp-json/wp/v2/cours';

// Map difficulty levels to icons
const difficultyIconMap: Record<string, any> = {
  'beginner': GraduationCap,
  'intermediate': TrendingUp,
  'advanced': Award,
  'management': Users,
};

export default function CoursesPage() {
  const { courses, loading, error } = useCourses(WORDPRESS_API_URL);

  // Group courses by difficulty level
  const groupedCourses = {
    beginner: courses.filter(c => c.level.toLowerCase() === 'beginner'),
    intermediate: courses.filter(c => c.level.toLowerCase() === 'intermediate'),
    advanced: courses.filter(c => c.level.toLowerCase() === 'advanced'),
    management: courses.filter(c => c.level.toLowerCase() === 'management'),
  };

  const CourseCard = ({ course }: { course: any }) => {
    const Icon = difficultyIconMap[course.level.toLowerCase()] || GraduationCap;
    const courseLink = `/course/${course.id}`;

    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          {course.thumbnail && (
            <ImageWithFallback
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
          )}
          <Icon className="h-10 w-10 text-pink-600 mb-3" />
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{course.level}</Badge>
            <Badge variant="outline">{course.duration}</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800 transition-colors">
            <Link to={courseLink}>View Course Details</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const CoursesSection = ({
    title,
    description,
    courses,
    bgColor = 'bg-white',
  }: {
    title: string;
    description: string;
    courses: any[];
    bgColor?: string;
  }) => {
    if (courses.length === 0) {
      return null;
    }

    return (
      <section className={`py-20 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="text-center">
          <Loader className="h-12 w-12 text-pink-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <Card className="max-w-md w-full mx-4 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-900">Unable to Load Courses</CardTitle>
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
          <CardFooter>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-gray-900 mb-4 md:mb-6">Build Your Billing Skills—At Your Own Pace</h1>
              <p className="text-gray-600 mb-4 md:mb-6">
                Whether you're just starting out or looking to level up, my courses are designed to give you the practical knowledge and confidence you need to succeed in medical billing. No fluff, no filler—just real-world training you can apply immediately.
              </p>
              <p className="text-gray-600 mb-6 md:mb-8">
                Each course includes video lessons, downloadable resources, live Q&A sessions, and lifetime access. Learn at your own pace with expert support every step of the way.
              </p>
              <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto">
                <Link to="/contact">Ask About Courses</Link>
              </Button>
            </div>
            <div className="relative order-first lg:order-last">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwdHJhaW5pbmcfGVufDF8fHx8MTczMjczMTA2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team training session"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              Each course includes video lessons, downloadable resources, real-world scenarios, and access to live support. You're not just watching videos—you're building a career.
            </p>
            <p className="text-gray-600">
              <strong>Explore {courses.length} courses below, or reach out if you're not sure where to start. I'm happy to help you find the perfect fit.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Course Sections */}
      <CoursesSection
        title="For Beginners"
        description="Start here if you're new to medical billing or transitioning into the field."
        courses={groupedCourses.beginner}
        bgColor="bg-white"
      />

      <CoursesSection
        title="Intermediate"
        description="Master accounts receivable management, denials, and collections."
        courses={groupedCourses.intermediate}
        bgColor="bg-gray-50"
      />

      <CoursesSection
        title="Advanced"
        description="Go deeper into coding accuracy, payer rules, and compliance."
        courses={groupedCourses.advanced}
        bgColor="bg-white"
      />

      <CoursesSection
        title="For Managers & Practice Owners"
        description="Lead your billing team with confidence and strategic insight."
        courses={groupedCourses.management}
        bgColor="bg-gray-50"
      />

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6">Not Sure Which Course Is Right for You?</h2>
          <p className="text-blue-100 mb-8">
            Book a free 15-minute consultation and I'll help you choose the perfect course for your goals and experience level.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
