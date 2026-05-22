# Shannon Marie Backend - Payment & Enrollment System

This is the Node.js/Express backend for handling Stripe payments, course enrollment, email confirmations, and refund management.

## Features

- ✅ Stripe payment processing (one-time and recurring)
- ✅ Course enrollment management
- ✅ Email confirmations via SendGrid
- ✅ Admin dashboard for enrollment and refund management
- ✅ Refund request processing (14-day policy for full price, immediate for subscriptions)
- ✅ Monthly subscription cancellation
- ✅ Webhook support for Stripe events
- ✅ JSON-based data persistence

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
NODE_ENV=development
PORT=3001
STRIPE_SECRET_KEY=sk_test_your_new_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_new_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FRONTEND_URL=http://localhost:5173
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password_here
```

**IMPORTANT:** Never commit the `.env` file to version control. Use your platform's (Railway, Heroku, etc.) environment variable settings for production.

### 3. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

You should see output like:
```
🚀 Server running on http://localhost:3001
📱 Frontend: http://localhost:5173
✅ Created Stripe product for Medical Billing Foundations
✅ Created Stripe product for AR Management Mastery
✅ Created Stripe product for Advanced Coding & Compliance
All Stripe products initialized
```

## API Endpoints

### Public Enrollment Endpoints

#### 1. Get Courses
```
GET /api/courses
```
Returns list of all courses with Stripe product information.

#### 2. Create Checkout Session
```
POST /api/checkout-session
Content-Type: application/json

{
  "courseId": "medical-billing-foundations",
  "planType": "full" | "monthly",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

Returns:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

#### 3. Confirm Enrollment
```
POST /api/enrollment-confirmation
Content-Type: application/json

{
  "sessionId": "cs_test_...",
  "courseId": "medical-billing-foundations",
  "planType": "full" | "monthly",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

Returns enrollment details. Triggers confirmation email via SendGrid.

#### 4. Get Enrollment
```
GET /api/enrollment/:enrollmentId
```

#### 5. Get All Enrollments
```
GET /api/enrollments
```

### Refund & Cancellation Endpoints

#### 6. Submit Refund Request
```
POST /api/refund-request
Content-Type: application/json

{
  "enrollmentId": "uuid-here",
  "reason": "Course content didn't match expectations"
}
```

Returns refund request with status "pending".
- **Full price**: Available within 14 days of enrollment
- **Monthly**: Can request anytime during active subscription

#### 7. Cancel Monthly Subscription
```
POST /api/cancel-subscription
Content-Type: application/json

{
  "enrollmentId": "uuid-here"
}
```

Only works for monthly subscriptions. Cancels on Stripe and updates status.

### Admin Endpoints (Require Authorization)

All admin endpoints require Bearer token authorization:
```
Authorization: Bearer <token>
```

#### 8. Admin Login
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}
```

Returns:
```json
{
  "success": true,
  "token": "base64_encoded_token",
  "message": "Login successful"
}
```

#### 9. Get All Enrollments (Admin)
```
GET /api/admin/enrollments
Authorization: Bearer <token>
```

Returns array of all enrollments with details.

#### 10. Get All Refund Requests (Admin)
```
GET /api/admin/refunds
Authorization: Bearer <token>
```

Returns array of refund requests with statuses.

#### 11. Approve Refund
```
POST /api/admin/approve-refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "refundId": "uuid-here"
}
```

Processes refund through Stripe and sends approval email to student.

#### 12. Deny Refund
```
POST /api/admin/deny-refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "refundId": "uuid-here",
  "reason": "Purchase was within return period"
}
```

Denies refund request and optionally provides reason.

### Webhook Endpoints

#### 13. Stripe Webhook
```
POST /api/webhook
Content-Type: application/json
Stripe-Signature: <signature>
```

Handles Stripe events (checkout.session.completed, etc.)

## File Structure

```
server/
├── server.js              # Main Express app with all endpoints
├── package.json           # Dependencies
├── .env.example           # Environment variables template
├── .env                  # (Create this - never commit!)
├── railway.json          # Railway deployment config
├── data/
│   ├── enrollments.json   # Enrollment records
│   ├── refunds.json       # Refund requests
│   └── sessions.json      # Checkout session data
└── README.md             # This file
```

## How It Works

### Payment & Enrollment Flow

1. User clicks "Enroll Now" on the frontend
2. Frontend opens EnrollmentModal with plan selection
3. User selects Full Price or Monthly Plan
4. User enters name and email
5. Frontend calls `/api/checkout-session`
6. Backend creates Stripe Checkout Session
7. User is redirected to Stripe checkout page
8. User completes payment on Stripe
9. Stripe redirects to `/enrollment-success` page
10. Frontend calls `/api/enrollment-confirmation`
11. Backend confirms enrollment and stores in JSON file
12. **Confirmation email sent via SendGrid** (if configured)
13. Success page displays enrollment details

### Refund & Cancellation Flow

**For Full Price Purchases:**
1. User goes to `/refunds` page and enters email
2. Selects enrollment and provides refund reason
3. Request submitted to backend
4. Backend checks if within 14-day window
5. Admin logs in at `/admin` dashboard
6. Approves or denies refund request
7. If approved: Refund processed through Stripe, approval email sent
8. If denied: Optional reason provided to user

**For Monthly Subscriptions:**
1. User goes to `/refunds` page
2. Selects monthly enrollment
3. Clicks "Cancel Subscription"
4. Backend cancels Stripe subscription immediately
5. User's status updated to "cancelled"
6. Access continues until end of billing period

### Stripe Products Created Automatically

On startup, the backend creates three Stripe products with pricing tiers:

**Product 1: Medical Billing Foundations**
- Full Price: $297.00 (one-time)
- Monthly Plan: $99.00/month

**Product 2: AR Management Mastery**
- Full Price: $397.00 (one-time)
- Monthly Plan: $132.00/month

**Product 3: Advanced Coding & Compliance**
- Full Price: $497.00 (one-time)
- Monthly Plan: $166.00/month

## Data Storage

### Enrollments (`data/enrollments.json`)
Each enrollment contains:
- Enrollment ID (UUID)
- Course ID and Name
- User information (name, email)
- Payment details (amount, status)
- Plan type (full or monthly)
- Enrollment date
- Subscription status (active, completed, cancelled)
- Stripe Session ID and Customer ID

### Refunds (`data/refunds.json`)
Each refund request contains:
- Refund ID (UUID)
- Enrollment ID
- User information
- Course and plan details
- Reason for refund
- Status (pending, approved, denied)
- Days since enrollment (for 14-day window calculation)
- Admin notes (if denied)

### Email Confirmations
When a user enrolls, SendGrid sends:
- Enrollment confirmation with course details
- User name, plan type, and amount
- Professional HTML email template

When a refund is approved:
- Refund approval notification
- Refund amount and timeline
- Refund ID for reference

## Deployment

### Recommended: Railway

1. Go to https://railway.app
2. Create new project and connect GitHub
3. Select your repository
4. Railway auto-detects Node.js app
5. Add environment variables in Variables tab
6. Deploy - Railway handles automatically

See `DEPLOYMENT_GUIDE.md` for complete Railway setup.

### Alternative: Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name

# Set environment variables
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_...
heroku config:set SENDGRID_API_KEY=SG...
heroku config:set ADMIN_PASSWORD=secure_password
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main
```

### Alternative: AWS Lambda, DigitalOcean, or Netlify Functions
All support Node.js/Express applications. Configure environment variables through their respective dashboards.

For complete deployment instructions, see `DEPLOYMENT_GUIDE.md`

## Email Configuration (SendGrid)

SendGrid is optional but recommended for sending transactional emails:

1. Get SendGrid API Key from https://app.sendgrid.com
2. Add to `.env` as `SENDGRID_API_KEY`
3. Configure `ADMIN_EMAIL` as the sender (must be verified in SendGrid)
4. System automatically sends:
   - Enrollment confirmations
   - Refund approval notifications

If SendGrid is not configured, the system continues to work but emails won't be sent.

## Admin Dashboard

Access at `/admin` endpoint on your frontend.

**Features:**
- Login with admin email/password
- View all enrollments in table format
- View pending refund requests
- Approve refunds (processes through Stripe)
- Deny refunds with optional reasons
- Monitor subscription statuses

**Default Credentials** (change in production!):
- Email: admin@example.com
- Password: admin123

## Important Security Notes

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use rotated Stripe keys** - Old exposed keys should be revoked
3. **HTTPS only in production** - All Stripe communication must use HTTPS
4. **Change admin password** - Update `ADMIN_PASSWORD` in production
5. **Validate webhook signatures** - All Stripe webhook events are signature-verified
6. **Secure student data** - Use database instead of JSON files in production
7. **Use Stripe customer IDs** - For tracking payments per user
8. **SendGrid security** - Never expose SendGrid API key in frontend
9. **Admin token** - Base64 encoded credentials, use HTTPS in production

## Environment Variables Checklist

- [ ] `STRIPE_SECRET_KEY` set with rotated test/live key
- [ ] `STRIPE_PUBLISHABLE_KEY` set with rotated test/live key
- [ ] `STRIPE_WEBHOOK_SECRET` set from Stripe webhook
- [ ] `FRONTEND_URL` set to your frontend domain
- [ ] `SENDGRID_API_KEY` set (optional for emails)
- [ ] `ADMIN_EMAIL` set to your admin email
- [ ] `ADMIN_PASSWORD` set to strong password (change from default!)
- [ ] `NODE_ENV` set appropriately (development/production)
- [ ] `.env` file added to `.gitignore`
- [ ] Webhook configured in Stripe dashboard

## Troubleshooting

### "stripe is not defined"
Make sure you've run `npm install` and have `stripe` in package.json dependencies.

### "PORT already in use"
Change PORT in `.env` or kill the process using port 3001.

### "CORS error"
Make sure `FRONTEND_URL` in `.env` matches your frontend domain exactly.

### "Stripe API error"
- Verify API keys are correct
- Check that keys haven't been revoked
- Make sure you're using test keys (sk_test_... and pk_test_...)

## Support

For backend issues or questions, check:
- Stripe API documentation: https://stripe.com/docs/api
- Express.js docs: https://expressjs.com/
- Node.js docs: https://nodejs.org/

## Next Steps

1. Set up environment variables
2. Start the server (`npm run dev`)
3. Test endpoints with curl or Postman
4. Deploy to production
5. Update FRONTEND_URL when deploying frontend
6. Monitor Stripe dashboard for payments
