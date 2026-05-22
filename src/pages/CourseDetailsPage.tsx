import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Video, FileText, Users, Award } from 'lucide-react';
import { EnrollmentModal } from '../components/EnrollmentModal';
import { useState } from 'react';

const courseData: Record<string, any> = {
  'foundations': {
    title: 'Medical Billing Foundations',
    description: 'Master the complete billing cycle from patient intake to payment posting. Perfect for beginners who want to build a rock-solid foundation in medical billing.',
    level: 'Beginner',
    duration: '6-8 weeks',
    price: '$497',
    gradient: 'from-blue-50 to-indigo-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    learningObjectives: [
      'Understand insurance medical terminology',
      'Understanding how demographic info must be entered correctly and why',
      'Understanding the difference between Commercial Medicare, Medicare Advantage, and Medicaid',
      'Work aging reports and follow up on outstanding claims',
      'Are you a Network or not?',
      'Identify red flags and compliance issues before they become problems'
    ],
    perfectFor: 'New billers, career changers, office staff looking to upskill, and anyone who wants a solid foundation in medical billing.',
    modules: [
      {
        title: 'Module 1: Introduction to Medical Billing',
        description: 'Understanding the healthcare revenue cycle, key terminology, and industry overview'
      },
      {
        title: 'Module 2: Medical Coding Fundamentals',
        description: 'CPT, ICD-10, and HCPCS basics with real-world coding practice'
      },
      {
        title: 'Module 3: Insurance & Payer Requirements',
        description: 'Understanding commercial, Medicare, Medicaid, and worker\'s compensation'
      },
      {
        title: 'Module 4: Claims Submission & Follow-Up',
        description: 'Submitting clean claims and managing the follow-up process'
      },
      {
        title: 'Module 5: Denial Management',
        description: 'Identifying, resolving, and preventing common claim denials'
      },
      {
        title: 'Module 6: Payment Posting & Reconciliation',
        description: 'Accurately posting payments and managing patient balances'
      }
    ]
  },
  'coding-basics': {
    title: 'Medical Coding Essentials',
    description: 'Learn CPT, ICD-10, and HCPCS coding basics with real-world examples and practice scenarios. Build confidence in coding accuracy from day one.',
    level: 'Beginner',
    duration: '4-6 weeks',
    price: '$397',
    gradient: 'from-teal-50 to-cyan-50',
    buttonColor: 'bg-teal-600 hover:bg-teal-700',
    learningObjectives: [
      'Master CPT code structure and proper selection',
      'Navigate ICD-10 coding with confidence',
      'Apply HCPCS codes for supplies and services',
      'Use modifiers correctly to ensure proper reimbursement',
      'Code common E&M visits accurately',
      'Avoid common coding errors that lead to denials'
    ],
    perfectFor: 'Beginners starting their coding journey, medical assistants transitioning to billing, and anyone who needs to understand coding basics.',
    modules: [
      {
        title: 'Module 1: Introduction to Medical Coding',
        description: 'Overview of coding systems and why accurate coding matters'
      },
      {
        title: 'Module 2: CPT Coding Mastery',
        description: 'Understanding CPT codes, categories, and real-world application'
      },
      {
        title: 'Module 3: ICD-10 Diagnosis Coding',
        description: 'Finding the right diagnosis codes and understanding code specificity'
      },
      {
        title: 'Module 4: HCPCS Level II Codes',
        description: 'Supplies, DME, and other services coded with HCPCS'
      },
      {
        title: 'Module 5: Modifiers & Special Circumstances',
        description: 'When and how to use modifiers correctly'
      }
    ]
  },
  'ar-management': {
    title: 'AR Management Mastery',
    description: 'Take control of accounts receivable with proven strategies to reduce days in AR and boost collections. Turn outstanding claims into revenue.',
    level: 'Intermediate',
    duration: '5-7 weeks',
    price: '$547',
    gradient: 'from-purple-50 to-violet-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    learningObjectives: [
      'Analyze aging reports and prioritize follow-up effectively',
      'Implement proven collection strategies that get results',
      'Reduce days in AR by 30% or more',
      'Create efficient workflows for AR management',
      'Handle difficult payer situations with confidence',
      'Set up AR benchmarks and track performance metrics'
    ],
    perfectFor: 'Billers managing AR, practice managers looking to improve collections, and anyone responsible for reducing outstanding balances.',
    modules: [
      {
        title: 'Module 1: AR Fundamentals & Metrics',
        description: 'Understanding AR reports, key performance indicators, and benchmarks'
      },
      {
        title: 'Module 2: Aging Report Analysis',
        description: 'How to read, prioritize, and act on aging reports strategically'
      },
      {
        title: 'Module 3: Effective Follow-Up Strategies',
        description: 'Phone scripts, documentation, and proven tactics for collections'
      },
      {
        title: 'Module 4: Payer Communication',
        description: 'Working with insurance companies to resolve outstanding claims'
      },
      {
        title: 'Module 5: Patient Collections',
        description: 'Best practices for collecting patient balances professionally'
      },
      {
        title: 'Module 6: Creating AR Workflows',
        description: 'Building systems that prevent AR from aging in the first place'
      }
    ]
  },
  'denial-management': {
    title: 'Denial Prevention & Resolution',
    description: 'Learn to identify, prevent, and resolve claim denials efficiently. Reduce your denial rate and recover revenue that might otherwise be lost.',
    level: 'Intermediate',
    duration: '4 weeks',
    price: '$447',
    gradient: 'from-rose-50 to-pink-50',
    buttonColor: 'bg-rose-600 hover:bg-rose-700',
    learningObjectives: [
      'Identify the root causes of common denials',
      'Create a denial prevention strategy for your practice',
      'Write effective appeals that get claims paid',
      'Track denial trends and implement corrective actions',
      'Understand payer-specific denial reasons and solutions',
      'Reduce your overall denial rate by at least 20%'
    ],
    perfectFor: 'Billers dealing with high denial rates, anyone responsible for appeals, and practices looking to improve first-pass claim acceptance.',
    modules: [
      {
        title: 'Module 1: Understanding Denials',
        description: 'Types of denials, denial codes, and what they really mean'
      },
      {
        title: 'Module 2: Denial Analysis & Tracking',
        description: 'Setting up systems to track, categorize, and analyze denials'
      },
      {
        title: 'Module 3: Effective Appeals',
        description: 'Writing appeals that get results with proven templates and strategies'
      },
      {
        title: 'Module 4: Prevention Strategies',
        description: 'Front-end processes to prevent denials before they happen'
      }
    ]
  },
  'advanced-coding': {
    title: 'Advanced Coding & Compliance',
    description: 'Deep dive into complex coding scenarios, modifiers, payer-specific rules, and compliance requirements. Master the details that separate good coders from great ones.',
    level: 'Advanced',
    duration: '8-10 weeks',
    price: '$697',
    gradient: 'from-amber-50 to-orange-50',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    learningObjectives: [
      'Handle complex multi-procedure coding scenarios',
      'Master advanced modifier usage and sequencing',
      'Navigate payer-specific coding requirements',
      'Ensure coding compliance with federal regulations',
      'Code surgical procedures with precision',
      'Conduct internal coding audits to prevent compliance issues'
    ],
    perfectFor: 'Experienced coders looking to advance, compliance officers, and anyone responsible for coding audits or education.',
    modules: [
      {
        title: 'Module 1: Advanced CPT Coding',
        description: 'Complex procedures, surgical coding, and bundling rules'
      },
      {
        title: 'Module 2: Modifier Mastery',
        description: 'Advanced modifier combinations and sequencing strategies'
      },
      {
        title: 'Module 3: Payer-Specific Requirements',
        description: 'Medicare LCD/NCD, commercial payer policies, and special rules'
      },
      {
        title: 'Module 4: Compliance & Auditing',
        description: 'OIG guidelines, compliance programs, and internal audit processes'
      },
      {
        title: 'Module 5: Evaluation & Management',
        description: 'Advanced E&M coding including new and established patients'
      },
      {
        title: 'Module 6: Surgical Coding',
        description: 'Coding surgical procedures accurately with real case studies'
      }
    ]
  },
  'specialty-billing': {
    title: 'Specialty-Specific Billing',
    description: 'Master billing for specific specialties including behavioral health, physical therapy, and surgical practices. Learn the unique requirements and best practices for specialty billing.',
    level: 'Advanced',
    duration: '6 weeks',
    price: '$597',
    gradient: 'from-emerald-50 to-green-50',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    learningObjectives: [
      'Understand specialty-specific payer requirements',
      'Code behavioral health services accurately',
      'Master therapy and rehabilitation billing',
      'Navigate surgical billing complexities',
      'Handle specialty-specific modifiers and documentation',
      'Optimize reimbursement for specialty services'
    ],
    perfectFor: 'Billers working in specialty practices, coders transitioning to a new specialty, and anyone managing specialty billing departments.',
    modules: [
      {
        title: 'Module 1: Behavioral Health Billing',
        description: 'Therapy codes, psychiatric services, and substance abuse billing'
      },
      {
        title: 'Module 2: Physical Therapy & Rehabilitation',
        description: 'PT, OT, and speech therapy billing with Medicare requirements'
      },
      {
        title: 'Module 3: Surgical Specialties',
        description: 'Orthopedic, general surgery, and specialty surgical billing'
      },
      {
        title: 'Module 4: Other Specialties',
        description: 'Radiology, cardiology, and other specialty-specific billing'
      },
      {
        title: 'Module 5: Documentation Requirements',
        description: 'Specialty-specific documentation and medical necessity'
      }
    ]
  },
  'team-leadership': {
    title: 'Leading Billing Teams',
    description: 'Develop the skills to manage, train, and motivate your billing team for peak performance and efficiency. Become the leader your team needs.',
    level: 'Management',
    duration: '6 weeks',
    price: '$597',
    gradient: 'from-indigo-50 to-blue-50',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    learningObjectives: [
      'Hire and onboard billing staff effectively',
      'Create training programs that build team competency',
      'Set performance goals and measure team productivity',
      'Handle difficult conversations and performance issues',
      'Build a positive team culture focused on results',
      'Implement quality assurance processes'
    ],
    perfectFor: 'New billing managers, practice managers, and anyone leading or building a billing team.',
    modules: [
      {
        title: 'Module 1: Building Your Team',
        description: 'Hiring, interviewing, and onboarding billing professionals'
      },
      {
        title: 'Module 2: Training & Development',
        description: 'Creating effective training programs and ongoing education'
      },
      {
        title: 'Module 3: Performance Management',
        description: 'Setting KPIs, conducting reviews, and managing performance'
      },
      {
        title: 'Module 4: Team Communication',
        description: 'Effective meetings, feedback, and building team cohesion'
      },
      {
        title: 'Module 5: Quality Assurance',
        description: 'Implementing QA processes and accuracy standards'
      },
      {
        title: 'Module 6: Problem Solving',
        description: 'Handling conflicts, mistakes, and team challenges'
      }
    ]
  },
  'revenue-cycle': {
    title: 'Revenue Cycle Optimization',
    description: 'Strategic approaches to improving your entire revenue cycle from scheduling to final payment. Take a big-picture approach to revenue management.',
    level: 'Management',
    duration: '8 weeks',
    price: '$697',
    gradient: 'from-pink-50 to-rose-50',
    buttonColor: 'bg-pink-600 hover:bg-pink-700',
    learningObjectives: [
      'Analyze your complete revenue cycle for improvement opportunities',
      'Optimize front-end processes including scheduling and registration',
      'Improve charge capture and coding accuracy',
      'Streamline claims submission and reduce errors',
      'Implement effective denial management systems',
      'Measure and improve key revenue cycle metrics'
    ],
    perfectFor: 'Practice managers, revenue cycle directors, and anyone responsible for overall practice financial performance.',
    modules: [
      {
        title: 'Module 1: Revenue Cycle Overview',
        description: 'Understanding the complete revenue cycle and key performance indicators'
      },
      {
        title: 'Module 2: Front-End Optimization',
        description: 'Scheduling, registration, insurance verification, and pre-authorization'
      },
      {
        title: 'Module 3: Charge Capture',
        description: 'Ensuring all services are captured and coded correctly'
      },
      {
        title: 'Module 4: Claims Management',
        description: 'Clean claims, submission processes, and reducing rejection rates'
      },
      {
        title: 'Module 5: Payment Posting & Reconciliation',
        description: 'Accurate posting, variance analysis, and reconciliation processes'
      },
      {
        title: 'Module 6: AR & Collections',
        description: 'Managing outstanding balances and improving collections'
      },
      {
        title: 'Module 7: Analytics & Reporting',
        description: 'Using data to drive decisions and continuous improvement'
      }
    ]
  }
};

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const course = courseData[courseId || 'foundations'] || courseData['foundations'];
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);

  const courseIdMap: Record<string, string> = {
    'foundations': 'medical-billing-foundations',
    'coding-basics': 'medical-coding-essentials',
    'ar-management': 'ar-management-mastery',
    'advanced-coding': 'advanced-coding-compliance',
  };

  const stripeId = courseIdMap[courseId || 'foundations'] || 'medical-billing-foundations';
  const fullPrice = course.price === '$497' ? 29700 : course.price === '$397' ? 29700 : 39700;
  const monthlyPrice = Math.floor(fullPrice / 3);

  return (
    <div>
      {/* Hero */}
      <section className={`bg-gradient-to-br ${course.gradient} py-12 md:py-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 mb-4 flex-wrap">
            <Badge>{course.level}</Badge>
            <Badge variant="outline">{course.duration}</Badge>
          </div>
          <h1 className="text-gray-900 mb-4 md:mb-6">{course.title}</h1>
          <p className="text-gray-600 mb-6 md:mb-8">
            {course.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              size="lg"
              className={`w-full sm:w-auto ${course.buttonColor}`}
              onClick={() => setEnrollmentModalOpen(true)}
            >
              Enroll Now - {course.price}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/contact">Ask a Question</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8">What You'll Learn</h2>
          <p className="text-gray-600 mb-8">
            By the end of this course, you'll be able to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.learningObjectives.map((objective: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600">{objective}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-gray-900 mb-2"><strong>This course is perfect for:</strong></p>
            <p className="text-gray-600">
              {course.perfectFor}
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Everything You Need to Succeed</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Video className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle>Video Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Step-by-step video training you can watch anytime, anywhere. Each lesson is focused, practical, and designed to fit into your schedule. No fluff—just the information you need to do your job well.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle>Downloadable PDFs & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Checklists, templates, coding guides, and reference sheets you can print, save, and use in your daily work. These aren't generic handouts—they're tools I've personally used and refined over the years.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle>Live Zoom Q&A Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join me for live group sessions where you can ask questions, work through real scenarios, and connect with other students. Can't make it live? All sessions are recorded and available in your course portal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle>Certificate of Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn a certificate you can add to your resume or LinkedIn profile when you complete the course. Show employers you're committed to professional development.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col gap-4 p-8 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Free Updates & New Content</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Private Student Community</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>14-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum Preview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8">Course Curriculum</h2>
          
          <div className="space-y-4">
            {course.modules.map((module: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${course.buttonColor} text-white py-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8">
            Join hundreds of successful billers who have taken this course. 14-day money-back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => setEnrollmentModalOpen(true)}
            >
              Enroll Now - {course.price}
            </Button>
            <Button size="lg" variant="outline" className="border-white border-2 text-white bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors" asChild>
              <Link to="/contact">Have Questions? Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>

      <EnrollmentModal
        open={enrollmentModalOpen}
        onOpenChange={setEnrollmentModalOpen}
        courseId={stripeId}
        courseName={course.title}
        coursePrice={course.price}
        fullPrice={fullPrice}
        monthlyPrice={monthlyPrice}
      />
    </div>
  );
}
