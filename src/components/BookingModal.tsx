import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle: string;
  servicePrice: string;
}

export function BookingModal({ open, onOpenChange, serviceTitle, servicePrice }: BookingModalProps) {
  const [date, setDate] = useState<Date>();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timePreference: '',
    timezone: '',
    experience: '',
    notes: '',
    payment: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date) {
      alert('Please select a date');
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      id: Date.now(),
      serviceTitle,
      servicePrice,
      date: date.toISOString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      timePreference: formData.timePreference,
      timezone: formData.timezone,
      experience: formData.experience,
      notes: formData.notes,
      payment: formData.payment,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Store in localStorage (you can replace this with API call)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      console.log('Booking submitted:', bookingData);

      setIsSubmitting(false);
      onOpenChange(false);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        timePreference: '',
        timezone: '',
        experience: '',
        notes: '',
        payment: '',
      });
      setDate(undefined);

      alert(`Booking confirmed for ${formData.firstName}! You'll receive a confirmation email at ${formData.email} with payment instructions and session details.`);
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error submitting your booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Your Session</DialogTitle>
          <DialogDescription>
            Complete the form below to book your {serviceTitle}. You'll receive a confirmation email with payment instructions and Zoom details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Service Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Service</span>
              <span>{serviceTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Price</span>
              <span>{servicePrice}</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Scheduling Preferences */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Scheduling Preferences</h3>
            
            <div className="space-y-2">
              <Label>Preferred Date *</Label>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Select a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setDatePopoverOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timePreference">Preferred Time *</Label>
              <Select value={formData.timePreference} onValueChange={(value) => handleSelectChange('timePreference', value)}>
                <SelectTrigger id="timePreference">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9am">9:00 AM - 10:00 AM</SelectItem>
                  <SelectItem value="10am">10:00 AM - 11:00 AM</SelectItem>
                  <SelectItem value="11am">11:00 AM - 12:00 PM</SelectItem>
                  <SelectItem value="1pm">1:00 PM - 2:00 PM</SelectItem>
                  <SelectItem value="2pm">2:00 PM - 3:00 PM</SelectItem>
                  <SelectItem value="3pm">3:00 PM - 4:00 PM</SelectItem>
                  <SelectItem value="4pm">4:00 PM - 5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone *</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleSelectChange('timezone', value)}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern (EST/EDT)</SelectItem>
                  <SelectItem value="cst">Central (CST/CDT)</SelectItem>
                  <SelectItem value="mst">Mountain (MST/MDT)</SelectItem>
                  <SelectItem value="pst">Pacific (PST/PDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Session Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Your Billing Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => handleSelectChange('experience', value)}>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Complete Beginner</SelectItem>
                  <SelectItem value="some">Some Experience (1-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">What would you like help with? *</Label>
              <Textarea
                id="notes"
                placeholder="Please describe your specific challenges or questions so I can prepare for our session..."
                className="min-h-[100px]"
                value={formData.notes}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Payment Preference</h3>
            
            <div className="space-y-2">
              <Label htmlFor="payment">How would you like to pay?</Label>
              <Select value={formData.payment} onValueChange={(value) => handleSelectChange('payment', value)}>
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Email Invoice (Pay before session)</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                  <SelectItem value="zelle">Zelle</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-gray-500">You'll receive payment instructions in your confirmation email.</p>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-gray-600">
              By submitting this form, you agree to the cancellation policy: Sessions must be cancelled or rescheduled at least 24 hours in advance for a full refund.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
