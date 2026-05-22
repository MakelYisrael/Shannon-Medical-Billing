import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GraduationCap, TrendingUp, Award, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function CoursesPage() {
  const beginnerCourses = [
    {
      id: 'foundations',
      title: 'Medical Billing Foundations',
      description: 'Master the complete billing cycle from patient intake to payment posting. Perfect for beginners and career changers.',
      level: 'Beginner',
      duration: '6-8 weeks',
      icon: GraduationCap,
    },
    {
      id: 'coding-basics',
      title: 'Medical Coding Essentials',
      description: 'Learn CPT, ICD-10, and HCPCS coding basics with real-world examples and practice scenarios.',
      level: 'Beginner',
      duration: '4-6 weeks',
      icon: GraduationCap,
    },
  ];

  const arCourses = [
    {
      id: 'ar-management',
      title: 'AR Management Mastery',
      description: 'Take control of accounts receivable with proven strategies to reduce days in AR and boost collections.',
      level: 'Intermediate',
      duration: '5-7 weeks',
      icon: TrendingUp,
    },
    {
      id: 'denial-management',
      title: 'Denial Prevention & Resolution',
      description: 'Learn to identify, prevent, and resolve claim denials efficiently. Reduce your denial rate and recover revenue.',
      level: 'Intermediate',
      duration: '4 weeks',
      icon: TrendingUp,
    },
  ];

  const advancedCourses = [
    {
      id: 'advanced-coding',
      title: 'Advanced Coding & Compliance',
      description: 'Deep dive into complex coding scenarios, modifiers, payer-specific rules, and compliance requirements.',
      level: 'Advanced',
      duration: '8-10 weeks',
      icon: Award,
    },
    {
      id: 'specialty-billing',
      title: 'Specialty-Specific Billing',
      description: 'Master billing for specific specialties including behavioral health, physical therapy, and surgical practices.',
      level: 'Advanced',
      duration: '6 weeks',
      icon: Award,
    },
  ];

  const managerCourses = [
    {
      id: 'team-leadership',
      title: 'Leading Billing Teams',
      description: 'Develop the skills to manage, train, and motivate your billing team for peak performance and efficiency.',
      level: 'Management',
      duration: '6 weeks',
      icon: Users,
    },
    {
      id: 'revenue-cycle',
      title: 'Revenue Cycle Optimization',
      description: 'Strategic approaches to improving your entire revenue cycle from scheduling to final payment.',
      level: 'Management',
      duration: '8 weeks',
      icon: Users,
    },
  ];

  const CourseCard = ({ course }: { course: any }) => {
    const Icon = course.icon;
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
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
          <Button asChild className="w-full">
            <Link to={`/course/${course.id}`}>View Course Details</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

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
              <strong>Explore courses by topic below, or reach out if you're not sure where to start. I'm happy to help you find the perfect fit.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* For Beginners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">For Beginners</h2>
            <p className="text-gray-600">Start here if you're new to medical billing or transitioning into the field.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beginnerCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* AR & Revenue Cycle */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">AR & Revenue Cycle</h2>
            <p className="text-gray-600">Master accounts receivable management, denials, and collections.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {arCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Coding & Compliance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">Advanced Coding & Compliance</h2>
            <p className="text-gray-600">Go deeper into coding accuracy, payer rules, and compliance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* For Managers & Practice Owners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">For Managers & Practice Owners</h2>
            <p className="text-gray-600">Lead your billing team with confidence and strategic insight.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {managerCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6">Not Sure Which Course Is Right for You?</h2>
          <p className="text-blue-100 mb-8">
            Book a free 15-minute consultation and I'll help you choose the perfect course for your goals and experience level.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}