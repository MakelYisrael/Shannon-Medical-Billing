# Deployment Guide

This guide covers deploying the Shannon Marie application with backend, email confirmations, admin dashboard, and refund management.

## Prerequisites

- Node.js 18+ installed
- A Stripe account with API keys
- A SendGrid account with API key (optional but recommended for email confirmations)
- A Railway account (for backend deployment)

## Setup Instructions

### 1. Backend Setup

#### Local Development

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your credentials to `.env`:
   ```
   NODE_ENV=development
   PORT=3001
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   FRONTEND_URL=http://localhost:5173
   SENDGRID_API_KEY=SG.your_sendgrid_key_here
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_admin_password_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Get Your API Keys

#### Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API Keys
3. Copy your Secret Key and Publishable Key
4. For webhooks, go to Developers → Webhooks
5. Create a new endpoint pointing to `https://your-domain.com/api/webhook`
6. Copy the signing secret

#### SendGrid API Key

1. Go to [SendGrid Dashboard](https://app.sendgrid.com)
2. Navigate to Settings → API Keys
3. Create a new API Key
4. Copy and save it securely

### 3. Email Configuration

SendGrid is used for sending enrollment confirmation emails and refund approval notifications.

**Features:**
- Automatic enrollment confirmations sent to students
- Refund approval notifications
- Professional HTML email templates

If SendGrid API key is not configured, the system will continue to work but emails won't be sent.

### 4. Admin Dashboard

Access the admin dashboard at `/admin`

**Default credentials:**
- Email: admin@example.com
- Password: admin123 (change in .env file as `ADMIN_PASSWORD`)

**Admin Features:**
- View all enrollments
- Review refund requests
- Approve/Deny refunds with optional reasons
- Monitor subscription statuses

### 5. Refund & Cancellation Policy

**Full Price Purchases:**
- 14-day refund period from enrollment date
- Requires admin approval
- Processed within 5-10 business days

**Monthly Subscriptions:**
- Can be cancelled anytime
- Access continues until end of billing period
- Immediate effect

### 6. Deploy to Railway

#### Step-by-Step Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Go to [Railway.app](https://railway.app)

3. Sign up or log in to your Railway account

4. Click "New Project" → "Deploy from GitHub"

5. Connect your GitHub account and select your repository

6. Railway will automatically detect the project

7. Add environment variables:
   - Go to Variables tab
   - Add all variables from your `.env` file:
     ```
     NODE_ENV=production
     PORT=3001
     STRIPE_SECRET_KEY=sk_live_your_production_key
     STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
     STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
     SENDGRID_API_KEY=SG.your_sendgrid_key
     ADMIN_EMAIL=your-admin@example.com
     ADMIN_PASSWORD=your_secure_password
     FRONTEND_URL=https://your-domain.com
     ```

8. Deploy:
   - Railway will auto-deploy when you push to your main branch
   - Or click "Deploy" button manually

9. Get your backend URL:
   - Railway assigns a public URL
   - Copy it from the "Services" section

#### Connect Frontend to Backend

1. Update your frontend environment configuration:
   - Create `.env.local` in the frontend directory (if needed)
   - Add: `VITE_BACKEND_URL=https://your-railway-backend-url.com`

2. Or update directly in `src/pages/AdminDashboard.tsx` and other components:
   ```typescript
   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://your-backend-url.com';
   ```

### 7. Set Up Stripe Webhooks

1. In Railway, go to your backend service
2. Copy the public URL
3. In Stripe Dashboard, go to Developers → Webhooks
4. Create a new endpoint:
   - URL: `https://your-railway-url/api/webhook`
   - Events: Select `checkout.session.completed`
5. Copy the signing secret and add to Railway environment variables as `STRIPE_WEBHOOK_SECRET`

### 8. Frontend Deployment

The frontend can be deployed to various platforms:

#### Netlify (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - `VITE_BACKEND_URL`: Your Railway backend URL
7. Deploy

#### Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Framework: Vite/React
5. Add environment variables
6. Deploy

#### Railway (for entire stack)

You can also deploy the entire application on Railway in a single project using workspaces.

## API Endpoints

### Public Endpoints

- `GET /health` - Server health check
- `GET /api/courses` - Get all courses with pricing
- `POST /api/checkout-session` - Create Stripe checkout session
- `POST /api/enrollment-confirmation` - Confirm enrollment
- `GET /api/enrollment/:enrollmentId` - Get enrollment details
- `GET /api/enrollments` - Get all enrollments (used by refund page)
- `POST /api/refund-request` - Submit refund request
- `POST /api/cancel-subscription` - Cancel monthly subscription

### Admin Endpoints (Require Bearer Token)

- `POST /api/admin/login` - Login and get token
- `GET /api/admin/enrollments` - Get all enrollments
- `GET /api/admin/refunds` - Get all refund requests
- `POST /api/admin/approve-refund` - Approve a refund
- `POST /api/admin/deny-refund` - Deny a refund

## Testing

### Test Mode

1. Use Stripe's test keys (starting with `sk_test_`)
2. Use test card numbers for payments:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 2500 0000 3155`

### Local Testing

1. Start backend: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Test checkout flow
4. Check admin dashboard
5. Submit refund requests
6. Test email confirmations (check SendGrid logs)

## Troubleshooting

### Backend Won't Start

- Check Node.js version: `node --version` (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check PORT is not already in use

### Stripe Integration Issues

- Verify API keys are correct
- Check STRIPE_SECRET_KEY starts with `sk_`
- Verify webhook secret is set correctly
- Check Stripe events in Dashboard for errors

### Email Not Sending

- Verify SendGrid API key is valid
- Check email templates in `server.js`
- Verify sender email is authorized in SendGrid
- Check SendGrid dashboard for bounce/delivery logs

### Railway Deployment Issues

- Check build logs in Railway dashboard
- Verify environment variables are set
- Ensure package.json scripts are correct
- Check public URL is accessible

### CORS Errors

- Update FRONTEND_URL in backend .env
- Ensure Frontend URL matches where frontend is deployed
- Check browser console for specific CORS errors

## Security Best Practices

1. **Never commit `.env` files** - Use Railway's environment variable dashboard
2. **Rotate admin password** regularly - Update in environment variables
3. **Use HTTPS** - Both frontend and backend should use HTTPS in production
4. **Validate inputs** - All API endpoints validate user inputs
5. **Stripe webhook signing** - Always verify webhook signatures
6. **Separate keys** - Use test keys for development, live keys for production

## Support & Resources

- Stripe Documentation: https://stripe.com/docs
- SendGrid Documentation: https://sendgrid.com/docs
- Railway Documentation: https://docs.railway.app
- React Documentation: https://react.dev
- Node.js Documentation: https://nodejs.org/docs

## Production Checklist

- [ ] Update admin password to strong, unique password
- [ ] Switch to Stripe live keys
- [ ] Set NODE_ENV=production
- [ ] Configure production FRONTEND_URL
- [ ] Set up SendGrid for production email sending
- [ ] Test complete checkout flow
- [ ] Test refund request and approval flow
- [ ] Verify email confirmations sending
- [ ] Set up monitoring and error tracking
- [ ] Test webhook processing
- [ ] Create backup of enrollments data
- [ ] Update privacy policy and terms
- [ ] Set up SSL/HTTPS certificates
- [ ] Test on mobile devices
- [ ] Performance testing and optimization
