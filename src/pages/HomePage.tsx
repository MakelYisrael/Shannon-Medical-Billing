import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { GraduationCap, Users, TrendingUp, Heart, BookOpen, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-gray-900 mb-4 md:mb-6">
                Master Medical Billing with Confidence—Train, Consult, and Succeed with Shannon Marie
              </h1>
              <p className="text-gray-600 mb-6 md:mb-8">
                From coding confusion to career clarity. Whether you're a new biller finding your footing, an office manager drowning in AR, or a provider seeking billing guidance—you're in the right place. Let's turn billing chaos into cash flow.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                  <Link to="/courses">Explore My Courses</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-teal-600 text-teal-600 hover:bg-teal-50 w-full sm:w-auto">
                  <Link to="/booking">Book a Consultation</Link>
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758876202610-bae5608f5051?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYW1lcmljYW4lMjB3b21hbiUyMG9mZmljZSUyMGNvbXB1dGVyJTIwZGVza3xlbnwxfHx8fDE3NjQwMDUxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Clean hospital interior with smiling staff"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who I Help Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">You're Not Alone in This</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Medical billing doesn't have to feel overwhelming. I work with professionals at every stage who want to level up their skills, clean up their processes, and feel confident in their work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>New Billers & Career Changers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Just starting out? I'll help you build a rock-solid foundation in coding, claims, and compliance so you can step into any billing role with confidence.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Office Managers & Billing Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Struggling with AR backlogs, denials, or team training? I offer hands-on consulting and mentoring to streamline your revenue cycle and reduce stress.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Healthcare Providers & Practice Owners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Want to understand what's really happening with your billing? I provide clear, actionable insights so you can make informed decisions and protect your revenue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">How I Can Help You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-gray-900 mb-4">Training & Courses</h3>
              <p className="text-gray-600 mb-4">
                Self-paced and live courses designed to take you from beginner to proficient. Learn medical billing, coding, AR management, and practice workflows at your own pace—with expert support every step of the way.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-gray-900 mb-4">AR Cleanup Consulting</h3>
              <p className="text-gray-600 mb-4">
                Drowning in unpaid claims? I'll audit your accounts receivable, identify bottlenecks, recover lost revenue, and implement systems to keep your AR healthy long-term.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-gray-900 mb-4">1-on-1 Mentoring & Coaching</h3>
              <p className="text-gray-600 mb-4">
                Get personalized guidance tailored to your specific challenges. Whether you need help with a tricky claim, career advice, or a billing strategy session—I'm here for you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-gray-900 mb-4">Billing Guidance for Providers</h3>
              <p className="text-gray-600 mb-4">
                Understand what's happening behind the scenes in your practice. I'll review your processes, explain the numbers, and help you hold your billing team accountable.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild className="hover:underline underline-offset-4">
              <Link to="/booking">View All Services →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Learn at Your Own Pace—With Real-World Support</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              My courses aren't just videos you watch alone. They're interactive, practical, and designed for real billing scenarios you'll face every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Medical Billing Foundations</CardTitle>
                <CardDescription>Perfect for beginners</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn the full cycle from patient intake to payment posting—plus common pitfalls and how to avoid them.
                </p>
                <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <Link to="/course/foundations">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AR Management Mastery</CardTitle>
                <CardDescription>Take control of your AR</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn proven strategies to reduce days in AR, handle denials, and boost collections.
                </p>
                <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <Link to="/course/ar-management">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Coding & Compliance</CardTitle>
                <CardDescription>Go deeper</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Go deeper into CPT, ICD-10, modifiers, and payer-specific rules. Stay compliant and maximize reimbursement.
                </p>
                <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <Link to="/course/advanced-coding">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild className="hover:underline underline-offset-4">
              <Link to="/courses">Browse All Courses →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">What Billers & Providers Are Saying</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Don't just take my word for it. Here's what students, clients, and practice managers have experienced working with me.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <p className="mb-4">
                "Shannon's AR cleanup consulting saved our practice over $50,000 in recovered claims. She's incredibly knowledgeable and patient."
              </p>
              <p>— Jessica T., Office Manager</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <p className="mb-4">
                "I went from knowing nothing about billing to landing my first job in 3 months. Shannon's courses are practical and easy to follow."
              </p>
              <p>— Mark L., Medical Biller</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <p className="mb-4">
                "Finally, someone who can explain billing in plain English! Shannon helped me understand what was happening with my practice finances."
              </p>
              <p>— Dr. Sarah M., Family Physician</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Billing Insights You Can Actually Use</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No fluff, no jargon overload—just practical tips, real-world advice, and updates you need to stay sharp in the ever-changing world of medical billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>5 Common Denial Reasons and How to Fix Them</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn the most common reasons claims get denied and the exact steps to resolve them quickly.
                </p>
                <Button asChild variant="link" className="p-0">
                  <Link to="/blog">Read More →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Clean Up AR in 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  A step-by-step action plan to tackle aging accounts receivable and get your practice back on track.
                </p>
                <Button asChild variant="link" className="p-0">
                  <Link to="/blog">Read More →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CPT vs ICD-10: Understanding the Difference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Confused about medical coding? This beginner-friendly guide breaks down the basics in plain language.
                </p>
                <Button asChild variant="link" className="p-0">
                  <Link to="/blog">Read More →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild variant="outline">
              <Link to="/blog">Read the Latest Posts →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-4">Get Billing Tips Straight to Your Inbox</h2>
          <p className="text-gray-600 mb-8">
            Join my email list for weekly tips, industry updates, course announcements, and exclusive resources you won't find anywhere else.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1"
            />
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors">Count Me In</Button>
          </form>
          <p className="text-gray-500 mt-4">
            I respect your inbox. Unsubscribe anytime. Your information is never shared.
          </p>
        </div>
      </section>
    </div>
  );
}
