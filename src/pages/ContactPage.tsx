import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Calendar } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! I\'ll get back to you within 1-2 business days.');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gray-900 mb-4 md:mb-6">Let's Talk About Your Billing Needs</h1>
          <p className="text-gray-600">
            Whether you have a question about a course, need help with a tricky claim, or want to schedule a consultation—I'm here to help. Fill out the form below and I'll get back to you within 1-2 business days.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Me a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What can I help you with?"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell me more about what you need..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Email Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">
                    Prefer to email directly?
                  </p>
                  <a
                    href="mailto:hello@shannonmariebilling.com"
                    className="text-blue-600 hover:underline"
                  >
                    hello@shannonmariebilling.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Book a Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ready to schedule a consultation or coaching session?
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/booking">View Booking Options</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h4 className="text-gray-900 mb-2">Response Time</h4>
                  <p className="text-gray-600">
                    I read every message personally and aim to respond within 1-2 business days. If your question is urgent, please mention that in your message.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-6">Looking for Quick Answers?</h2>
          <p className="text-gray-600 mb-8">
            Many common questions are answered in my FAQ section. You might find what you're looking for there.
          </p>
          <Button asChild variant="outline" size="lg" className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Link to="/faq">Browse FAQs</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
