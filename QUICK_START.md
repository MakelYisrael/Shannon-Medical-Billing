# Quick Start Guide

Get your application running with all new features in 5 minutes.

## Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This installs all required packages including:
- `express` - Web framework
- `stripe` - Payment processing
- `@sendgrid/mail` - Email service
- Other dependencies

## Step 2: Configure Environment Variables

### Create `.env` file in the `server` directory:

```bash
cp .env.example .env
```

### Edit `server/.env` and add your credentials:

```
# Core Settings
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Stripe (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# SendGrid (Optional but recommended - get from https://app.sendgrid.com)
SENDGRID_API_KEY=SG.YOUR_API_KEY_HERE

# Admin Dashboard
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password_here
```

**⚠️ IMPORTANT:** Never commit `.env` to git. It's already in `.gitignore`.

## Step 3: Start the Backend

```bash
# From the server directory
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📱 Frontend: http://localhost:5173
✅ Created Stripe product for Medical Billing Foundations
✅ Created Stripe product for AR Management Mastery
✅ Created Stripe product for Advanced Coding & Compliance
All Stripe products initialized
```

## Step 4: Start the Frontend (In another terminal)

```bash
# From project root
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Step 5: Test the Features

### Enrollment & Payment
1. Go to http://localhost:5173/courses
2. Click "Enroll Now" on any course
3. Select Full Price or Monthly
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete payment
6. Should see enrollment success page
7. Check email confirmation (if SendGrid configured)

### Refund Request
1. Go to http://localhost:5173/refunds
2. Enter your email address
3. Click "Find Enrollments"
4. Select an enrollment
5. Request refund (if within 14 days) or cancel subscription

### Admin Dashboard
1. Go to http://localhost:5173/admin
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123` (or your custom password)
3. View enrollments and refunds
4. Approve or deny refund requests

---

## Stripe Test Cards

Use these cards for testing in development:

| Purpose | Card Number | Expires | CVC |
|---------|------------|---------|-----|
| Success | 4242 4242 4242 4242 | Any future | Any |
| Decline | 4000 0000 0000 0002 | Any future | Any |
| 3D Secure | 4000 2500 0000 3155 | Any future | Any |

---

## File Locations Reference

| Feature | File |
|---------|------|
| Backend | `server/server.js` |
| Admin Dashboard | `src/pages/AdminDashboard.tsx` |
| Refund/Cancel Page | `src/pages/RefundCancellationPage.tsx` |
| Backend Config | `server/.env.example` |
| Deployment Guide | `DEPLOYMENT_GUIDE.md` |
| Complete Docs | `server/README.md` |

---

## Common Issues

### Port 3001 already in use
```bash
# Change PORT in server/.env
PORT=3002
```

### CORS Error
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Should be: `http://localhost:5173` for local development

### SendGrid emails not sending
- Check SendGrid API key is correct
- Verify sender email is verified in SendGrid (blue checkmark)
- Check SendGrid Activity Log for bounce/delivery errors

### Stripe errors
- Double-check API keys are correct
- Ensure using test keys (sk_test_..., pk_test_...)
- Check Stripe Dashboard for API logs

---

## Next Steps

Once everything is running:

1. **Configure SendGrid** (optional but recommended)
   - Go to https://app.sendgrid.com
   - Create API key
   - Add to `server/.env`

2. **Test the Admin Dashboard**
   - Make a test enrollment
   - Go to `/admin` and approve/deny refunds

3. **Setup Stripe Webhooks**
   - For production, follow DEPLOYMENT_GUIDE.md

4. **Deploy to Production**
   - Follow DEPLOYMENT_GUIDE.md for Railway setup
   - Change to Stripe live keys
   - Update admin password

---

## Production Deployment

When ready to deploy:

1. Read `DEPLOYMENT_GUIDE.md` thoroughly
2. Get Stripe live API keys
3. Set up Railway.app account
4. Update all environment variables
5. Deploy frontend (Netlify, Vercel, Railway, etc.)
6. Run production checklist in DEPLOYMENT_GUIDE.md

---

## Documentation

- **QUICK_START.md** - This file (setup & testing)
- **DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **IMPLEMENTATION_SUMMARY.md** - What was implemented
- **server/README.md** - Backend API documentation

---

## Get Help

| Question | Resource |
|----------|----------|
| Stripe integration? | https://stripe.com/docs |
| SendGrid emails? | https://sendgrid.com/docs |
| Railway deployment? | https://docs.railway.app |
| React/Frontend? | https://react.dev |
| Express/Node backend? | https://expressjs.com |

---

**You're all set! 🎉**

Your application now has:
- ✅ Stripe payment processing
- ✅ Email confirmations
- ✅ Admin dashboard
- ✅ Refund management
- ✅ Subscription cancellation

Happy coding!
