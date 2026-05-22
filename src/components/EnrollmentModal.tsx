import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface EnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseName: string;
  coursePrice: string;
  fullPrice: number;
  monthlyPrice: number;
}

export function EnrollmentModal({
  open,
  onOpenChange,
  courseId,
  courseName,
  coursePrice,
  fullPrice,
  monthlyPrice,
}: EnrollmentModalProps) {
  const [planType, setPlanType] = useState<'full' | 'monthly'>('full');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          planType,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Store enrollment data temporarily for success page
        const enrollmentData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          courseId,
          planType,
        };
        console.log('Storing enrollment data in sessionStorage:', enrollmentData);
        sessionStorage.setItem('enrollmentData', JSON.stringify(enrollmentData));
        console.log('Retrieved from sessionStorage to verify:', sessionStorage.getItem('enrollmentData'));

        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enroll in {courseName}</DialogTitle>
          <DialogDescription>
            Choose your payment plan and complete your enrollment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEnroll} className="space-y-6 mt-4">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose Your Plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Price Plan */}
              <Card
                className={`cursor-pointer transition-all border-2 ${
                  planType === 'full'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => setPlanType('full')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Pay in Full</CardTitle>
                      <CardDescription>One-time payment</CardDescription>
                    </div>
                    {planType === 'full' && (
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">
                      ${(fullPrice / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Complete access immediately
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 mt-3">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Lifetime access
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> All materials included
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Plan */}
              <Card
                className={`cursor-pointer transition-all border-2 ${
                  planType === 'monthly'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => setPlanType('monthly')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Monthly Plan</CardTitle>
                      <CardDescription>Flexible subscription</CardDescription>
                    </div>
                    {planType === 'monthly' && (
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">
                      ${(monthlyPrice / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">per month, cancel anytime</p>
                    <ul className="text-sm text-gray-700 space-y-1 mt-3">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Cancel anytime
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Same content access
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Terms */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              By clicking "Proceed to Payment," you agree to our Terms of Service and Privacy Policy.
              You'll be securely redirected to Stripe to complete your payment.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
