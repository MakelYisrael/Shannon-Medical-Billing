import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Clock, Calendar, TrendingUp, Stethoscope, HelpCircle, FileText } from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { SchedulingModal } from '../components/SchedulingModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BookingPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [schedulingModalOpen, setSchedulingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ title: '', price: '' });

  const handleBookNow = (title: string, price: string) => {
    setSelectedService({ title, price });
    setBookingModalOpen(true);
  };

  const handleScheduleDiscovery = () => {
    setSchedulingModalOpen(true);
  };

  const services = [
    {
      title: '30-Minute Coaching Call',
      price: '$75',
      duration: '30 minutes',
      icon: Clock,
      description: 'Perfect for quick questions, claim troubleshooting, or a focused check-in. Bring your specific issue and we\'ll work through it together.',
      expectations: [
        'One-on-one Zoom or phone session',
        'Focused guidance on your specific question or challenge',
        'Actionable next steps you can implement right away',
      ],
      bestFor: 'Billers or office staff who need targeted help on a specific issue.',
    },
    {
      title: '60-Minute Strategy Session',
      price: '$150',
      duration: '60 minutes',
      icon: Calendar,
      description: 'A deeper dive into your billing challenges. Whether it\'s process improvement, workflow optimization, or career strategy, we\'ll create a clear action plan.',
      expectations: [
        'In-depth review of your current processes or situation',
        'Personalized recommendations and strategies',
        'Follow-up resources and templates to support your next steps',
      ],
      bestFor: 'Office managers, billing supervisors, or anyone looking to level up their approach.',
    },
    {
      title: 'AR Cleanup Consulting',
      price: 'Custom pricing',
      duration: 'Project-based',
      icon: TrendingUp,
      description: 'Let\'s get your accounts receivable back on track. I\'ll audit your AR, identify problem areas, recover unpaid claims, and train your team to maintain a healthy revenue cycle.',
      expectations: [
        'Comprehensive AR audit and aging report review',
        'Prioritized action plan with timelines',
        'Hands-on support with claims follow-up and appeals',
        'Staff training to prevent future backlogs',
      ],
      bestFor: 'Practices with high AR over 90 days, frequent denials, or billing staff turnover.',
      cta: 'Schedule Discovery Call',
    },
    {
      title: 'Provider Consulting Session',
      price: '$200/hour',
      duration: '60 minutes',
      icon: Stethoscope,
      description: 'For healthcare providers and practice owners who want to understand what\'s really happening with their billing. I\'ll review your reports, explain the numbers, and help you ask the right questions.',
      expectations: [
        'Clear, jargon-free explanations of your billing metrics',
        'Insight into whether your billing team is performing effectively',
        'Recommendations for improving revenue and reducing write-offs',
      ],
      bestFor: 'Physicians, dentists, therapists, and practice owners who want billing transparency.',
    },
    {
      title: 'Career Q&A Session',
      price: '$60',
      duration: '30 minutes',
      icon: HelpCircle,
      description: 'Thinking about a career in medical billing? Not sure what certifications to pursue or how to land your first job? Let\'s talk about your goals and map out your path.',
      expectations: [
        'Honest advice about the medical billing career landscape',
        'Guidance on certifications, training, and job search strategies',
        'Resources to help you get started or advance',
      ],
      bestFor: 'Career changers, recent graduates, or anyone exploring medical billing.',
    },
    {
      title: 'Resume & Application Review',
      price: '$100',
      duration: '3-5 business days',
      icon: FileText,
      description: 'Get personalized feedback on your resume, cover letter, or job application. I\'ll help you highlight your billing skills and experience in a way that gets noticed.',
      expectations: [
        'Detailed review with tracked edits and comments',
        'Suggestions for stronger language and formatting',
        'Tips for tailoring applications to specific roles',
      ],
      bestFor: 'Billers applying for new roles or looking to advance.',
      cta: 'Submit Resume',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gray-900 mb-4 md:mb-6">Book a Session with Shannon Marie</h1>
          <p className="text-gray-600 mb-4 md:mb-6">
            Whether you need quick guidance, in-depth consulting, or career support—I offer flexible options to fit your needs and budget. Choose the session that's right for you and let's tackle your billing challenges together.
          </p>
          <p className="text-gray-600">
            All sessions are conducted via Zoom or phone. You'll receive a confirmation email with session details and a calendar invite after booking.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="h-10 w-10 text-blue-600" />
                      <div className="text-right">
                        <div className="text-blue-600">{service.price}</div>
                        <div className="text-gray-500">{service.duration}</div>
                      </div>
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <h4 className="text-gray-900 mb-3">What to expect:</h4>
                    <ul className="space-y-2 mb-4">
                      {service.expectations.map((item, i) => (
                        <li key={i} className="text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-600">
                      <strong>Best for:</strong> {service.bestFor}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        if (service.cta === 'Schedule Discovery Call') {
                          handleScheduleDiscovery();
                        } else {
                          handleBookNow(service.title, service.price);
                        }
                      }}
                    >
                      {service.cta || 'Book Now'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expectations & Payment Terms */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center">Expectations & Payment Terms</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-gray-900 mb-3">Booking & Scheduling</h3>
              <p className="text-gray-600">
                Once you book, you'll receive a confirmation email with a Zoom link or phone number. Please arrive on time—sessions start promptly and cannot be extended due to late arrivals.
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Cancellations</h3>
              <p className="text-gray-600">
                Please provide at least 24 hours' notice if you need to reschedule. Cancellations with less than 24 hours' notice will forfeit 50% of the session fee.
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Payment</h3>
              <p className="text-gray-600">
                All sessions are paid in advance at the time of booking. Payment plans available for AR consulting engagements.
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Confidentiality</h3>
              <p className="text-gray-600">
                All consulting sessions are HIPAA-compliant. Your information and any PHI discussed are kept strictly confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6">Still Have Questions?</h2>
          <p className="text-blue-100 mb-8">
            Not sure which service is right for you? Send me a message and I'll help you choose the best option for your needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Contact Me</Link>
          </Button>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        serviceTitle={selectedService.title}
        servicePrice={selectedService.price}
      />

      {/* Scheduling Modal */}
      <SchedulingModal
        open={schedulingModalOpen}
        onOpenChange={setSchedulingModalOpen}
      />
    </div>
  );
}