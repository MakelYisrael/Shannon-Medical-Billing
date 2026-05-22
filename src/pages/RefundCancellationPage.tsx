import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Enrollment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseName: string;
  planType: string;
  amount: number;
  enrollmentDate: string;
  subscriptionStatus?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function RefundCancellationPage() {
  const navigate = useNavigate();
  const [enrollmentId, setEnrollmentId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [foundEnrollments, setFoundEnrollments] = useState<Enrollment[]>([]);
  const [showEnrollmentsList, setShowEnrollmentsList] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    if (email) {
      setUserEmail(email);
      loadUserEnrollments(email);
    } else {
      setLoadingEnrollments(false);
    }
  }, []);

  const loadUserEnrollments = async (email: string) => {
    setLoadingEnrollments(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/enrollments`);
      if (!response.ok) throw new Error('Failed to load enrollments');
      const data: Enrollment[] = await response.json();
      const userEnrollments = data.filter((e) => e.email === email);
      setFoundEnrollments(userEnrollments);
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setError('Failed to load enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleSearchByEmail = async () => {
    if (!userEmail) {
      setError('Please enter an email address');
      return;
    }
    await loadUserEnrollments(userEmail);
    setShowEnrollmentsList(true);
  };

  const handleSelectEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setEnrollmentId(enrollment.id);
    setShowEnrollmentsList(false);
  };

  const handleSubmitRefundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentId || !refundReason) {
      setError('Please select an enrollment and provide a reason');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/refund-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          reason: refundReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit refund request');
      }

      setSuccess(true);
      setEnrollmentId('');
      setRefundReason('');
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit refund request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!enrollmentId) {
      setError('Please select an enrollment');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      setSuccess(true);
      setEnrollmentId('');
      setSelectedEnrollment(null);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const isFullPrice = selectedEnrollment?.planType === 'full';
  const enrollmentDate = selectedEnrollment ? new Date(selectedEnrollment.enrollmentDate) : null;
  const today = new Date();
  const daysSinceEnrollment = enrollmentDate
    ? Math.floor((today.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const canRefund = !isFullPrice || (isFullPrice && daysSinceEnrollment <= 14);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refunds & Cancellations</h1>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-800">Your request has been submitted successfully.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {!selectedEnrollment ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Your Enrollment</h2>
                <p className="text-gray-600 mb-4">
                  Enter your email address to find your enrollments and manage refunds or subscriptions.
                </p>

                <div className="space-y-3">
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSearchByEmail}
                    disabled={loadingEnrollments}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                  >
                    {loadingEnrollments ? 'Loading...' : 'Find Enrollments'}
                  </button>
                </div>

                {showEnrollmentsList && foundEnrollments.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-gray-900">Your Enrollments</h3>
                    {foundEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        onClick={() => handleSelectEnrollment(enrollment)}
                        className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                      >
                        <p className="font-semibold text-gray-900">{enrollment.courseName}</p>
                        <p className="text-sm text-gray-600">
                          {enrollment.planType === 'monthly' ? 'Monthly Subscription' : 'Full Price'} - $
                          {enrollment.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {showEnrollmentsList && foundEnrollments.length === 0 && (
                  <p className="mt-4 text-gray-600">No enrollments found for this email address.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">{selectedEnrollment.courseName}</h3>
                <p className="text-sm text-blue-800">
                  {selectedEnrollment.planType === 'monthly' ? 'Monthly Subscription' : 'Full Price'} - $
                  {selectedEnrollment.amount.toFixed(2)}
                </p>
              </div>

              {selectedEnrollment.planType === 'monthly' ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancel Subscription</h2>
                  <p className="text-gray-600 mb-4">
                    You can cancel your monthly subscription at any time. Your access will continue until the end of
                    your billing period.
                  </p>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
                  >
                    {loading ? 'Processing...' : 'Cancel Subscription'}
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Refund</h2>

                  {daysSinceEnrollment > 14 ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Refund window expired:</strong> You are outside the 14-day refund period. Unfortunately,
                        refunds are only available within 14 days of purchase.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-4">
                        You have {14 - daysSinceEnrollment} days remaining to request a refund.
                      </p>

                      <form onSubmit={handleSubmitRefundRequest} className="space-y-4">
                        <div>
                          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Refund *
                          </label>
                          <textarea
                            id="reason"
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Please tell us why you'd like a refund..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading || !refundReason}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
                        >
                          {loading ? 'Submitting...' : 'Submit Refund Request'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedEnrollment(null);
                  setEnrollmentId('');
                  setRefundReason('');
                  setShowEnrollmentsList(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
              >
                Select Different Enrollment
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Refund Policy</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Full Price Purchases:</strong> 14-day refund period from purchase date</li>
              <li>• <strong>Monthly Subscriptions:</strong> Cancel anytime, continues until end of billing period</li>
              <li>• <strong>Approval:</strong> Refunds require admin approval</li>
              <li>• <strong>Processing:</strong> Approved refunds are processed within 5-10 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
