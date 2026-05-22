import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function PoliciesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gray-900 mb-4 md:mb-6">Policies & Legal Information</h1>
          <p className="text-gray-600">
            Transparency matters. Here's everything you need to know about my policies regarding privacy, refunds, terms of service, and HIPAA compliance.
          </p>
        </div>
      </section>

      {/* Policies */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="hipaa" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="hipaa">HIPAA</TabsTrigger>
              <TabsTrigger value="refund">Refund Policy</TabsTrigger>
              <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            </TabsList>

            {/* HIPAA Disclaimer */}
            <TabsContent value="hipaa">
              <Card>
                <CardHeader>
                  <CardTitle>HIPAA Compliance & Confidentiality</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p className="text-gray-600 mb-4">
                    Shannon Marie Consulting is committed to protecting your privacy and maintaining HIPAA compliance in all services provided.
                  </p>

                  <h3 className="text-gray-900 mt-6 mb-3">What this means:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>Any protected health information (PHI) shared during consulting, coaching, or training sessions is kept strictly confidential.</li>
                    <li>All communication, file sharing, and video conferencing is conducted using secure, HIPAA-compliant platforms.</li>
                    <li>I will never share, sell, or disclose your information to third parties without your explicit consent.</li>
                  </ul>

                  <h3 className="text-gray-900 mt-6 mb-3">Your Responsibility:</h3>
                  <p className="text-gray-600 mb-4">
                    When sharing PHI during sessions, please ensure you have the proper authorization to do so. Redact patient names and identifying information whenever possible.
                  </p>

                  <p className="text-gray-600">
                    <strong>Please note:</strong> While I provide billing guidance and education, I am not a covered entity under HIPAA unless contracted as a business associate. If you require a Business Associate Agreement (BAA) for consulting services, please let me know and I will provide one.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Refund Policy */}
            <TabsContent value="refund">
              <Card>
                <CardHeader>
                  <CardTitle>Refund & Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h3 className="text-gray-900 mb-3">Courses</h3>
                  <p className="text-gray-600 mb-4">
                    I want you to feel confident in your purchase. If you're not satisfied with a course within <strong>14 days of enrollment</strong>, contact me for a full refund—no questions asked.
                  </p>
                  <p className="text-gray-600 mb-6">
                    After 14 days, refunds are not available, but I'm happy to discuss switching to a different course if the content isn't the right fit.
                  </p>

                  <h3 className="text-gray-900 mb-3">Consulting & Coaching Sessions</h3>
                  <p className="text-gray-600 mb-4">
                    All sessions are paid in advance and are non-refundable. However, if you need to reschedule, please provide at least <strong>24 hours' notice</strong> and we'll find a new time that works.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Cancellations with less than 24 hours' notice will forfeit 50% of the session fee. No-shows forfeit the full fee.
                  </p>

                  <h3 className="text-gray-900 mb-3">AR Cleanup & Custom Consulting Projects</h3>
                  <p className="text-gray-600 mb-4">
                    Custom projects require a deposit to begin work. Deposits are non-refundable, but the remainder is due upon completion. If you're not satisfied with the work, we'll discuss adjustments before final payment is due.
                  </p>

                  <p className="text-gray-600">
                    <strong>Questions about refunds?</strong> Contact me at hello@shannonmariebilling.com and we'll work it out.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Terms & Conditions */}
            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p className="text-gray-600 mb-4">
                    <strong>Last Updated:</strong> November 24, 2025
                  </p>

                  <p className="text-gray-600 mb-4">
                    By using this website, enrolling in courses, or booking services with Shannon Marie Consulting, you agree to the following terms:
                  </p>

                  <h3 className="text-gray-900 mb-3">1. Services Provided</h3>
                  <p className="text-gray-600 mb-4">
                    Shannon Marie Consulting provides educational training, consulting, and mentoring services related to medical billing and revenue cycle management. Services are for educational and advisory purposes only and do not constitute legal, financial, or medical advice.
                  </p>

                  <h3 className="text-gray-900 mb-3">2. Enrollment & Access</h3>
                  <p className="text-gray-600 mb-4">
                    Course access is granted upon payment and is for individual use only. You may not share, reproduce, or distribute course materials without written permission.
                  </p>

                  <h3 className="text-gray-900 mb-3">3. Intellectual Property</h3>
                  <p className="text-gray-600 mb-4">
                    All course content, resources, templates, and materials are the intellectual property of Shannon Marie Consulting and are protected by copyright law. Unauthorized reproduction or distribution is prohibited.
                  </p>

                  <h3 className="text-gray-900 mb-3">4. Payment</h3>
                  <p className="text-gray-600 mb-4">
                    All payments are due at the time of booking or enrollment unless a payment plan has been arranged. Failure to complete payment may result in loss of access to courses or services.
                  </p>

                  <h3 className="text-gray-900 mb-3">5. Limitation of Liability</h3>
                  <p className="text-gray-600 mb-4">
                    Shannon Marie Consulting is not liable for any financial losses, compliance issues, or billing errors that occur as a result of implementing guidance or strategies shared in courses or consulting sessions. You are responsible for ensuring compliance with all applicable laws and payer regulations.
                  </p>

                  <h3 className="text-gray-900 mb-3">6. Modification of Terms</h3>
                  <p className="text-gray-600 mb-4">
                    I reserve the right to update these terms at any time. Continued use of services after changes are posted constitutes acceptance of the new terms.
                  </p>

                  <h3 className="text-gray-900 mb-3">7. Governing Law</h3>
                  <p className="text-gray-600 mb-4">
                    These terms are governed by the laws of the United States. Any disputes will be resolved through binding arbitration.
                  </p>

                  <p className="text-gray-600">
                    <strong>Questions?</strong> Contact hello@shannonmariebilling.com
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Policy */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p className="text-gray-600 mb-4">
                    <strong>Last Updated:</strong> November 24, 2025
                  </p>

                  <p className="text-gray-600 mb-4">
                    Your privacy matters. This policy explains how I collect, use, and protect your personal information.
                  </p>

                  <h3 className="text-gray-900 mb-3">1. Information I Collect</h3>
                  <p className="text-gray-600 mb-4">
                    I collect information you provide directly, such as:
                  </p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>Name, email address, phone number (when you contact me or enroll in services)</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                    <li>Any information you share during consulting or coaching sessions</li>
                  </ul>
                  <p className="text-gray-600 mb-4">
                    I also collect non-personal information such as website usage data through cookies and analytics tools.
                  </p>

                  <h3 className="text-gray-900 mb-3">2. How I Use Your Information</h3>
                  <p className="text-gray-600 mb-4">
                    I use your information to:
                  </p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>Provide courses, consulting, and support services</li>
                    <li>Send course materials, updates, and email newsletters (you can unsubscribe anytime)</li>
                    <li>Process payments and manage accounts</li>
                    <li>Improve my website and services</li>
                  </ul>

                  <h3 className="text-gray-900 mb-3">3. How I Protect Your Information</h3>
                  <p className="text-gray-600 mb-4">
                    I use industry-standard security measures to protect your data, including secure hosting, encrypted payment processing, and HIPAA-compliant communication tools when handling PHI.
                  </p>

                  <h3 className="text-gray-900 mb-3">4. Sharing Your Information</h3>
                  <p className="text-gray-600 mb-4">
                    I do not sell or share your personal information with third parties, except:
                  </p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>With payment processors to complete transactions</li>
                    <li>When required by law</li>
                  </ul>

                  <h3 className="text-gray-900 mb-3">5. Cookies</h3>
                  <p className="text-gray-600 mb-4">
                    This website uses cookies to improve your experience and analyze website traffic. You can disable cookies in your browser settings, but some features may not work properly.
                  </p>

                  <h3 className="text-gray-900 mb-3">6. Third-Party Links</h3>
                  <p className="text-gray-600 mb-4">
                    This website may contain links to third-party websites. I am not responsible for the privacy practices of those sites.
                  </p>

                  <h3 className="text-gray-900 mb-3">7. Your Rights</h3>
                  <p className="text-gray-600 mb-4">
                    You have the right to:
                  </p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>Access the personal information I have about you</li>
                    <li>Request corrections or deletion of your information</li>
                    <li>Opt out of email communications at any time</li>
                  </ul>

                  <h3 className="text-gray-900 mb-3">8. Changes to This Policy</h3>
                  <p className="text-gray-600 mb-4">
                    I may update this privacy policy periodically. Changes will be posted on this page with an updated "Last Updated" date.
                  </p>

                  <p className="text-gray-600">
                    <strong>Questions or Requests?</strong> Contact me at hello@shannonmariebilling.com
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}