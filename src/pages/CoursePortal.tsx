import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { BookOpen, Search, Filter, Clock, BarChart3, Users, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface CourseCard {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: string;
  icon: React.ReactNode;
  gradient: string;
  buttonColor: string;
}

const allCourses: CourseCard[] = [
  {
    id: 'foundations',
    title: 'Medical Billing Foundations',
    description: 'Master the complete billing cycle from patient intake to payment posting.',
    level: 'Beginner',
    duration: '6-8 weeks',
    price: '$497',
    icon: <BookOpen className="h-6 w-6" />,
    gradient: 'from-blue-50 to-indigo-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'coding-basics',
    title: 'Medical Coding Essentials',
    description: 'Learn CPT, ICD-10, and HCPCS coding basics with real-world examples.',
    level: 'Beginner',
    duration: '4-6 weeks',
    price: '$397',
    icon: <BookOpen className="h-6 w-6" />,
    gradient: 'from-teal-50 to-cyan-50',
    buttonColor: 'bg-teal-600 hover:bg-teal-700',
  },
  {
    id: 'ar-management',
    title: 'AR Management Mastery',
    description: 'Reduce days in AR and boost collections with proven strategies.',
    level: 'Intermediate',
    duration: '5-7 weeks',
    price: '$547',
    icon: <BarChart3 className="h-6 w-6" />,
    gradient: 'from-purple-50 to-violet-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    id: 'advanced-coding',
    title: 'Advanced Coding & Compliance',
    description: 'Go deeper into CPT, ICD-10, modifiers, and payer-specific rules.',
    level: 'Advanced',
    duration: '8-10 weeks',
    price: '$697',
    icon: <Award className="h-6 w-6" />,
    gradient: 'from-rose-50 to-pink-50',
    buttonColor: 'bg-rose-600 hover:bg-rose-700',
  },
];

export default function CoursePortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [showEnrolledOnly, setShowEnrolledOnly] = useState<boolean>(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch('/api/enrollments');
        if (response.ok) {
          const data = await response.json();
          setEnrolledCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      }
    };

    fetchEnrollments();

    // If user is logged in, use their email; otherwise check localStorage
    if (user?.email) {
      setUserEmail(user.email);
      setEmailInput(user.email);
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setUserEmail(storedEmail);
        setEmailInput(storedEmail);
      }
    }
  }, [user?.email]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setUserEmail(emailInput.trim());
      localStorage.setItem('userEmail', emailInput.trim());
    }
  };

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Get enrolled courses for user, deduplicated by courseId
  const userEnrolledCourses = userEmail
    ? Object.values(
        enrolledCourses
          .filter((e) => e.email === userEmail)
          .reduce((acc: Record<string, any>, enrollment) => {
            const key = enrollment.courseId;
            // Keep the most recent enrollment for each course
            if (!acc[key] || new Date(enrollment.enrollmentDate).getTime() > new Date(acc[key].enrollmentDate).getTime()) {
              acc[key] = enrollment;
            }
            return acc;
          }, {})
      )
    : [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Course Portal</h1>
          </div>
          <p className="text-lg text-gray-600">
            Explore our comprehensive medical billing and coding courses
          </p>
        </div>

        {/* Email Lookup Section - Only show if not logged in */}
        {!user && !userEmail && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Enrolled Courses</h2>
              <p className="text-gray-700 mb-6">
                Enter your email address to view your enrolled courses and access course materials.
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View My Courses
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* No Enrolled Courses Message */}
        {userEmail && userEnrolledCourses.length === 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Enrolled Courses Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't enrolled in any courses yet. Browse our available courses below to get started!
              </p>
              {!user && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setUserEmail('');
                    setEmailInput('');
                    localStorage.removeItem('userEmail');
                  }}
                >
                  Try Another Email
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Enrolled Courses Section */}
        {userEmail && userEnrolledCourses.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Enrolled Courses</h2>
                  <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
                </div>
                {!user && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUserEmail('');
                      setEmailInput('');
                      localStorage.removeItem('userEmail');
                    }}
                  >
                    Change Email
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userEnrolledCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="border-l-4 border-l-blue-600">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{enrollment.courseName}</CardTitle>
                          <CardDescription>{enrollment.planType === 'monthly' ? 'Monthly Plan' : 'Full Access'}</CardDescription>
                        </div>
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </div>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            const courseIdMap: Record<string, string> = {
                              'medical-billing-foundations': 'foundations',
                              'medical-coding-essentials': 'coding-basics',
                              'ar-management-mastery': 'ar-management',
                              'advanced-coding-compliance': 'advanced-coding',
                            };
                            const shortCourseId = courseIdMap[enrollment.courseId] || 'foundations';
                            navigate(`/course/${shortCourseId}/hub`);
                          }}
                        >
                          Access Course Materials
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={selectedLevel || ''}
                onChange={(e) => setSelectedLevel(e.target.value || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses ({filteredCourses.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className={`bg-gradient-to-br ${course.gradient} border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-white rounded-lg">
                      {course.icon}
                    </div>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-gray-900">{course.title}</CardTitle>
                  <CardDescription className="text-gray-700">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <span className="font-bold text-lg text-gray-900">{course.price}</span>
                    </div>
                    <Button 
                      className={`w-full ${course.buttonColor} text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id}`);
                      }}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">No courses found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Portal Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Learn at Your Pace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete courses on your schedule with lifetime access to course materials.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Expert Instruction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn from Shannon Marie, a medical billing consultant with years of industry experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Practical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Master real-world billing and coding skills that you can apply immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
