import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function EnrollmentCancelledPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 rounded-full p-4">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enrollment Cancelled
          </h1>
          <p className="text-gray-600 mb-8">
            Your enrollment process was cancelled. No payment was charged to your account.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What Happened?</h2>
            <p className="text-gray-700 mb-4">
              You chose to cancel during the checkout process. Your payment information was not processed, and no charges have been made to your account.
            </p>
            <p className="text-gray-700">
              If you changed your mind or have questions about the course, we'd love to help!
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-600 font-medium">What would you like to do?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate(-1)}
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="border-t pt-6">
            <p className="text-gray-600 text-sm mb-3">Have questions or concerns?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
              <Button 
                variant="link" 
                className="text-blue-600"
                onClick={() => navigate('/faq')}
              >
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
