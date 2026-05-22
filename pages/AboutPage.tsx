import { CheckCircle2, Award, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 to-fuchsia-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-gray-900 mb-4 md:mb-6">Hi, I'm Shannon Marie</h1>
              <p className="text-gray-600 mb-4 md:mb-6">
                I'm a medical billing consultant, educator, and your partner in navigating the complex world of healthcare revenue. With years of real-world billing experience and a passion for teaching, I help billers, office managers, and healthcare providers turn billing chaos into clarity—and confusion into cash flow.
              </p>
              <p className="text-gray-600 mb-6 md:mb-8">
                Whether you're just starting out or you've been in billing for years, my goal is the same: to equip you with the knowledge, confidence, and tools you need to succeed.
              </p>
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                <Link to="/courses">Explore My Courses</Link>
              </Button>
            </div>
            <div className="relative order-first lg:order-last">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTczMjczMDkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional business portrait"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              I'm a medical billing consultant, educator, and problem-solver who's spent years in the trenches of revenue cycle management—and I'm here to help you navigate it with clarity and confidence.
            </p>
            <p className="text-gray-600 mb-6">
              I didn't start out as a billing expert. Like many of you, I learned on the job, made mistakes, asked a million questions, and slowly pieced together how this incredibly complex system actually works. Along the way, I discovered something important: <strong>medical billing doesn't have to be confusing—it just needs to be taught the right way.</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Today, I help new billers build careers they're proud of, support office managers in cleaning up messy AR, and guide healthcare providers through the financial side of their practice. Whether you need training, consulting, or just someone to walk you through a tough claim, I'm here for it.
            </p>
            <p className="text-gray-600 mb-6">
              I believe that when billing is done right, everyone wins. Providers get paid fairly. Patients aren't surprised by unexpected bills. And billers? They get to go home knowing they made a real impact.
            </p>
            <p className="text-gray-600">
              Let's make medical billing less stressful and a lot more successful—together.
            </p>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-900 mb-12">Why You Can Trust My Guidance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900">10+ years in medical billing and revenue cycle management</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900">Certified Professional Biller (CPB)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900">Certified in ICD-10, CPT, and HCPCS coding</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900">Trained hundreds of billers and office staff nationwide</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900">Specialized expertise in AR cleanup and denial management</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900">HIPAA-compliant consulting and training practices</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-center mt-8">
            I've worked across specialties—primary care, behavioral health, physical therapy, specialty surgery, and more. No matter your niche, I understand the nuances.
          </p>
        </div>
      </section>

      {/* What Makes Me Different */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-900 mb-12">Real Experience. Real Solutions. Real Support.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-gray-900 mb-3">I Don't Just Teach Theory—I Teach What Actually Works</h3>
                <p className="text-gray-600">
                  My courses and consulting are based on real-world experience, not outdated textbooks. You'll learn the tricks, shortcuts, and strategies that make billing faster, easier, and more accurate.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-gray-900 mb-3">I Speak Human, Not Billing Robot</h3>
                <p className="text-gray-600">
                  Medical billing has enough confusing acronyms. I break things down in plain language so you actually understand what you're doing and why it matters.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-gray-900 mb-3">I'm With You Beyond the Course</h3>
                <p className="text-gray-600">
                  My students and clients aren't just numbers. I offer ongoing support, live Q&A sessions, and a community where you can ask questions and get real answers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-gray-900 mb-3">I've Been Where You Are</h3>
                <p className="text-gray-600">
                  Whether you're staring at a denial you don't understand or managing a team that's overwhelmed, I've been there. I know what it's like—and I know how to fix it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AR Cleanup Expertise */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-6">Get Paid Faster—Without the Overwhelm</h2>
          <p className="text-center text-blue-100 mb-12">
            Accounts receivable cleanup is one of my specialties. If your AR is over 90 days, your denial rate is climbing, or you're not sure where to even start—I can help.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 rounded-full p-2 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2">Comprehensive AR audit</h3>
                <p className="text-blue-100">
                  I'll review your aging reports, identify problem claims, and prioritize what needs immediate attention.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 rounded-full p-2 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2">Claims recovery</h3>
                <p className="text-blue-100">
                  I'll work directly with payers (or guide your team) to resubmit, appeal, and recover revenue you thought was lost.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 rounded-full p-2 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2">Process improvement</h3>
                <p className="text-blue-100">
                  I'll identify why claims are getting stuck and implement systems to prevent future backlogs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 rounded-full p-2 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2">Team training</h3>
                <p className="text-blue-100">
                  I'll teach your staff how to stay on top of AR so it doesn't spiral out of control again.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center mt-12">
            <strong>The result?</strong> Cleaner AR, faster payments, and a billing process that actually works.
          </p>
        </div>
      </section>

      {/* Why My Teaching Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-900 mb-6">Learn It Right the First Time</h2>
          <p className="text-center text-gray-600 mb-12">
            My teaching philosophy is simple: <strong>you learn best when you understand the "why" behind the "what."</strong>
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              I don't just tell you to use a certain code or follow a payer rule—I explain why it matters, how it affects reimbursement, and what happens if you get it wrong. That way, when something changes (and it always does), you're able to adapt on your own.
            </p>

            <h3 className="text-gray-900 mb-4">My courses include:</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>Real claim examples and case studies</li>
              <li>Step-by-step workflows you can use immediately</li>
              <li>Live support and Q&A sessions</li>
              <li>Community access for ongoing learning</li>
            </ul>

            <p className="text-gray-600">
              <strong>Because billing isn't just about memorizing codes—it's about thinking critically, solving problems, and building confidence.</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}