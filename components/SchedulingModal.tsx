import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';

interface SchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SchedulingModal({ open, onOpenChange }: SchedulingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Show success message
    alert('Discovery call request submitted! I will review your information and send you available time slots within 24 hours.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Your AR Cleanup Discovery Call</DialogTitle>
          <DialogDescription>
            This complimentary 20-minute call helps me understand your AR challenges so I can create a customized cleanup plan for your practice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Service Information */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <div className="bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                ✓
              </div>
              <div>
                <h4 className="text-gray-900 mb-1">Free Discovery Call - 20 Minutes</h4>
                <p className="text-gray-600">
                  We'll discuss your current AR situation, identify quick wins, and determine if AR cleanup consulting is right for you. No obligation.
                </p>
              </div>
            </div>
          </div>

          {/* Practice Information */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Practice Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="practiceName">Practice Name *</Label>
              <Input id="practiceName" placeholder="ABC Medical Group" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty/Practice Type *</Label>
              <Select required>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family Medicine / Primary Care</SelectItem>
                  <SelectItem value="internal">Internal Medicine</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="behavioral">Behavioral Health / Mental Health</SelectItem>
                  <SelectItem value="physical">Physical Therapy</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="chiropractic">Chiropractic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="providers">Number of Providers</Label>
                <Select>
                  <SelectTrigger id="providers">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Provider</SelectItem>
                    <SelectItem value="2-3">2-3 Providers</SelectItem>
                    <SelectItem value="4-5">4-5 Providers</SelectItem>
                    <SelectItem value="6+">6+ Providers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingStaff">Current Billing Staff</Label>
                <Select>
                  <SelectTrigger id="billingStaff">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None (Provider handles it)</SelectItem>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2-3">2-3 People</SelectItem>
                    <SelectItem value="outsourced">Outsourced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Your Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactFirstName">First Name *</Label>
                <Input id="contactFirstName" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactLastName">Last Name *</Label>
                <Input id="contactLastName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Your Role/Title *</Label>
              <Input id="title" placeholder="e.g., Office Manager, Billing Supervisor, Practice Owner" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address *</Label>
              <Input id="contactEmail" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <Input id="contactPhone" type="tel" required />
            </div>
          </div>

          {/* AR Situation */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Current AR Situation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="arAmount">Approximate Total AR Balance</Label>
              <Select>
                <SelectTrigger id="arAmount">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under50k">Under $50,000</SelectItem>
                  <SelectItem value="50-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250-500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="over500k">Over $500,000</SelectItem>
                  <SelectItem value="unsure">Not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>What AR challenges are you facing? (Check all that apply)</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="challenge1" />
                  <label htmlFor="challenge1" className="text-gray-700 cursor-pointer">
                    High percentage of AR over 90 days
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="challenge2" />
                  <label htmlFor="challenge2" className="text-gray-700 cursor-pointer">
                    Frequent claim denials
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="challenge3" />
                  <label htmlFor="challenge3" className="text-gray-700 cursor-pointer">
                    Slow payment posting
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="challenge4" />
                  <label htmlFor="challenge4" className="text-gray-700 cursor-pointer">
                    Disorganized billing processes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="challenge5" />
                  <label htmlFor="challenge5" className="text-gray-700 cursor-pointer">
                    Staff turnover / training issues
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="challenge6" />
                  <label htmlFor="challenge6" className="text-gray-700 cursor-pointer">
                    Don't know where to start
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">How urgent is this issue?</Label>
              <Select>
                <SelectTrigger id="urgency">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical - Affecting cash flow now</SelectItem>
                  <SelectItem value="urgent">Urgent - Need help within 2 weeks</SelectItem>
                  <SelectItem value="moderate">Moderate - Within next month</SelectItem>
                  <SelectItem value="planning">Planning ahead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea 
                id="details" 
                placeholder="Tell me more about your situation. What's your biggest frustration with AR right now?"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Your Availability</h3>
            
            <div className="space-y-2">
              <Label>Best days for a call (Check all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mon" />
                  <label htmlFor="mon" className="text-gray-700 cursor-pointer">Monday</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tue" />
                  <label htmlFor="tue" className="text-gray-700 cursor-pointer">Tuesday</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="wed" />
                  <label htmlFor="wed" className="text-gray-700 cursor-pointer">Wednesday</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="thu" />
                  <label htmlFor="thu" className="text-gray-700 cursor-pointer">Thursday</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="fri" />
                  <label htmlFor="fri" className="text-gray-700 cursor-pointer">Friday</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Preferred Time of Day</Label>
              <Select>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="callTimezone">Your Timezone *</Label>
              <Select required>
                <SelectTrigger id="callTimezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern (EST/EDT)</SelectItem>
                  <SelectItem value="cst">Central (CST/CDT)</SelectItem>
                  <SelectItem value="mst">Mountain (MST/MDT)</SelectItem>
                  <SelectItem value="pst">Pacific (PST/PDT)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <span>📅 Next Steps:</span> After you submit this form, I'll review your information and email you within 24 hours with 3-4 available time slots for our discovery call.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Schedule My Discovery Call'}
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
