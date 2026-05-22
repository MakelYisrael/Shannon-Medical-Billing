import { useState, useEffect } from 'react';
import { LogOut, Eye, EyeOff } from 'lucide-react';

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

interface Refund {
  id: string;
  enrollmentId: string;
  email: string;
  firstName: string;
  lastName: string;
  courseName: string;
  planType: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  denialReason?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [activeTab, setActiveTab] = useState<'enrollments' | 'refunds'>('enrollments');
  const [approveLoading, setApproveLoading] = useState<string | null>(null);
  const [denyLoading, setDenyLoading] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState<{ [key: string]: string }>({});
  const [emailFilter, setEmailFilter] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      loadEnrollments();
      loadRefunds();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
      loadEnrollments();
      loadRefunds();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const tkn = token || localStorage.getItem('adminToken');
      const response = await fetch(`${BACKEND_URL}/api/admin/enrollments`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });

      if (!response.ok) throw new Error('Failed to load enrollments');
      const data = await response.json();
      setEnrollments(data);
    } catch (err) {
      console.error('Error loading enrollments:', err);
    }
  };

  const loadRefunds = async () => {
    try {
      const tkn = token || localStorage.getItem('adminToken');
      const response = await fetch(`${BACKEND_URL}/api/admin/refunds`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });

      if (!response.ok) throw new Error('Failed to load refunds');
      const data = await response.json();
      setRefunds(data);
    } catch (err) {
      console.error('Error loading refunds:', err);
    }
  };

  const handleApproveRefund = async (refundId: string) => {
    setApproveLoading(refundId);
    try {
      const tkn = token || localStorage.getItem('adminToken');
      const response = await fetch(`${BACKEND_URL}/api/admin/approve-refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tkn}`,
        },
        body: JSON.stringify({ refundId }),
      });

      if (!response.ok) throw new Error('Failed to approve refund');
      loadRefunds();
    } catch (err) {
      console.error('Error approving refund:', err);
    } finally {
      setApproveLoading(null);
    }
  };

  const handleDenyRefund = async (refundId: string) => {
    setDenyLoading(refundId);
    try {
      const tkn = token || localStorage.getItem('adminToken');
      const response = await fetch(`${BACKEND_URL}/api/admin/deny-refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tkn}`,
        },
        body: JSON.stringify({
          refundId,
          reason: denyReason[refundId] || 'Refund request denied',
        }),
      });

      if (!response.ok) throw new Error('Failed to deny refund');
      loadRefunds();
      setDenyReason((prev) => ({ ...prev, [refundId]: '' }));
    } catch (err) {
      console.error('Error denying refund:', err);
    } finally {
      setDenyLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  // Filter enrollments by email
  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.email && enrollment.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  // Filter refunds by email
  const filteredRefunds = refunds.filter((refund) =>
    refund.email && refund.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Dashboard</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Email Filter */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <label htmlFor="email-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Email Address
          </label>
          <input
            id="email-filter"
            type="email"
            placeholder="Search by email (e.g., user@example.com)"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {emailFilter && (
            <p className="text-sm text-gray-600 mt-2">
              Found {activeTab === 'enrollments' ? filteredEnrollments.length : filteredRefunds.length} result(s)
            </p>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'enrollments'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Enrollments ({emailFilter ? filteredEnrollments.length : enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'refunds'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Refunds ({emailFilter ? filteredRefunds.filter((r) => r.status === 'pending').length : refunds.filter((r) => r.status === 'pending').length})
          </button>
        </div>

        {activeTab === 'enrollments' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Course</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {emailFilter ? 'No enrollments match this email' : 'No enrollments yet'}
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enrollment.firstName} {enrollment.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{enrollment.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{enrollment.courseName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enrollment.planType === 'monthly' ? 'Monthly' : 'Full Price'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${enrollment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            enrollment.subscriptionStatus === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {enrollment.subscriptionStatus === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="space-y-4">
            {filteredRefunds.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                {emailFilter ? 'No refunds match this email' : 'No refund requests yet'}
              </div>
            ) : (
              filteredRefunds.map((refund) => (
                <div key={refund.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {refund.firstName} {refund.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{refund.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        refund.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : refund.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Course</p>
                      <p className="text-sm font-medium text-gray-900">{refund.courseName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Plan</p>
                      <p className="text-sm font-medium text-gray-900">
                        {refund.planType === 'monthly' ? 'Monthly' : 'Full Price'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Amount</p>
                      <p className="text-sm font-medium text-gray-900">${refund.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Days Since Enrollment</p>
                      <p className="text-sm font-medium text-gray-900">{refund.daysSinceEnrollment || 0}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-600 uppercase mb-1">Reason</p>
                    <p className="text-sm text-gray-900">{refund.reason}</p>
                  </div>

                  {refund.status === 'denied' && refund.denialReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs text-gray-600 uppercase mb-1">Denial Reason</p>
                      <p className="text-sm text-gray-900">{refund.denialReason}</p>
                    </div>
                  )}

                  {refund.status === 'pending' && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 uppercase block mb-1">
                          Denial Reason (if denying)
                        </label>
                        <input
                          type="text"
                          value={denyReason[refund.id] || ''}
                          onChange={(e) =>
                            setDenyReason((prev) => ({ ...prev, [refund.id]: e.target.value }))
                          }
                          placeholder="Leave empty if approving"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRefund(refund.id)}
                          disabled={approveLoading === refund.id}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm font-medium transition"
                        >
                          {approveLoading === refund.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDenyRefund(refund.id)}
                          disabled={denyLoading === refund.id}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm font-medium transition"
                        >
                          {denyLoading === refund.id ? 'Processing...' : 'Deny'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
