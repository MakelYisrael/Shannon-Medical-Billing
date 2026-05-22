import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle2, Mail } from 'lucide-react';

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  planType: 'full' | 'monthly';
  email: string;
  firstName: string;
  lastName: string;
  paymentStatus: string;
  amount: number;
  enrollmentDate: string;
}

export default function EnrollmentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const courseId = searchParams.get('course_id');
    const planType = searchParams.get('plan_type') as 'full' | 'monthly';
    const isMock = searchParams.get('mock') === 'true';

    if (!sessionId || !courseId) {
      setError('Missing enrollment information');
      setLoading(false);
      return;
    }

    const confirmEnrollment = async () => {
      try {
        // Retrieve enrollment data from sessionStorage (set by EnrollmentModal)
        const enrollmentDataStr = sessionStorage.getItem('enrollmentData');
        console.log('Retrieved from sessionStorage:', enrollmentDataStr);
        let enrollmentData: any = {};

        if (enrollmentDataStr) {
          try {
            enrollmentData = JSON.parse(enrollmentDataStr);
            console.log('Parsed enrollment data:', enrollmentData);
          } catch (e) {
            console.warn('Could not parse enrollment data from sessionStorage:', e);
          }
        } else {
          console.warn('No enrollment data found in sessionStorage');
        }

        const requestBody: any = {
          sessionId,
          courseId,
          planType,
        };

        // Add user data if available from sessionStorage
        if (enrollmentData.email) {
          requestBody.email = enrollmentData.email;
        }
        if (enrollmentData.firstName) {
          requestBody.firstName = enrollmentData.firstName;
        }
        if (enrollmentData.lastName) {
          requestBody.lastName = enrollmentData.lastName;
        }

        console.log('Final request body being sent:', requestBody);
        console.log('SessionId:', sessionId, 'CourseId:', courseId);

        const response = await fetch('/api/enrollment-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Enrollment confirmation error:');
          console.error('Status:', response.status);
          console.error('Error message:', errorData.error);
          console.error('Received:', errorData.received);
          console.error('Request body sent:', {
            sessionId,
            courseId,
            planType,
            email: enrollmentData.email,
            firstName: enrollmentData.firstName,
            lastName: enrollmentData.lastName,
          });
          throw new Error(errorData.error || 'Failed to confirm enrollment');
        }

        const data = await response.json();
        setEnrollment(data.enrollment);
        localStorage.setItem('userEmail', data.enrollment.email);

        // Clear sessionStorage after successful enrollment
        sessionStorage.removeItem('enrollmentData');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    confirmEnrollment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your enrollment...</p>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Enrollment Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to process your enrollment'}</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Enrollment Confirmed!
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Welcome to {enrollment.courseName}. We're excited to have you!
          </p>

          {/* Enrollment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">
                  {enrollment.firstName} {enrollment.lastName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{enrollment.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Course</span>
                <span className="font-medium text-gray-900">{enrollment.courseName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900 capitalize">
                  {enrollment.planType === 'monthly' ? 'Monthly Subscription' : 'Full Price'}
                </span>
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-bold text-green-600">${enrollment.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              What Happens Next
            </h2>

            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span className="text-gray-700">
                  Check your email at <strong>{enrollment.email}</strong> for your welcome message with login credentials
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span className="text-gray-700">
                  Log in to the course portal and start learning immediately
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span className="text-gray-700">
                  Access all course materials, including videos, PDFs, and Q&A sessions
                </span>
              </li>

              {enrollment.planType === 'monthly' && (
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span className="text-gray-700">
                    Your monthly subscription will renew on the same day each month. Cancel anytime.
                  </span>
                </li>
              )}
            </ol>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Important</h3>
            <p className="text-sm text-yellow-800">
              If you don't receive your welcome email within 15 minutes, please check your spam folder or contact us at support@shannonmarie.com
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/portal')}
            >
              Go to Course Portal
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/courses')}
            >
              Browse More Courses
            </Button>
          </div>

          {/* Support Footer */}
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-gray-600 text-sm mb-2">Need help getting started?</p>
            <Button 
              variant="link" 
              className="text-blue-600 hover:underline"
              onClick={() => window.location.href = 'mailto:support@shannonmarie.com'}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
