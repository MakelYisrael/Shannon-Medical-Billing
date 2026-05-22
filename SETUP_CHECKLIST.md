# Setup Checklist

Follow this checklist to get all features up and running.

## ✅ Phase 1: Local Development Setup

- [ ] **Backend Dependencies Installed**
  ```bash
  cd server
  npm install
  ```
  Installs: express, stripe, @sendgrid/mail, cors, dotenv, uuid

- [ ] **Created `.env` file**
  ```bash
  cd server
  cp .env.example .env
  ```

- [ ] **Added Stripe Keys**
  - [ ] Got Stripe API keys from https://dashboard.stripe.com
  - [ ] Added `STRIPE_SECRET_KEY` (starts with sk_test_)
  - [ ] Added `STRIPE_PUBLISHABLE_KEY` (starts with pk_test_)

- [ ] **Backend Server Running**
  ```bash
  cd server
  npm run dev
  ```
  Check for: "🚀 Server running on http://localhost:3001"

- [ ] **Frontend Server Running** (in separate terminal)
  ```bash
  npm run dev
  ```
  Access at: http://localhost:5173

## ✅ Phase 2: Test Basic Features (Local)

- [ ] **Test Enrollment Flow**
  - [ ] Go to http://localhost:5173/courses
  - [ ] Click "Enroll Now" on any course
  - [ ] Select Full Price or Monthly
  - [ ] Use test card: `4242 4242 4242 4242`
  - [ ] See success page
  - [ ] Check `server/data/enrollments.json` has record

- [ ] **Test Admin Dashboard**
  - [ ] Go to http://localhost:5173/admin
  - [ ] Login with `admin@example.com` / `admin123`
  - [ ] See enrollments list
  - [ ] See refunds tab (empty initially)

- [ ] **Test Refund Request Page**
  - [ ] Go to http://localhost:5173/refunds
  - [ ] Enter email from enrollment
  - [ ] Select enrollment
  - [ ] Request refund (if within 14 days)
  - [ ] Check `server/data/refunds.json` has request

## ✅ Phase 3: Email Configuration (Optional but Recommended)

- [ ] **Get SendGrid API Key**
  - [ ] Go to https://app.sendgrid.com
  - [ ] Create new API Key (Settings → API Keys)
  - [ ] Copy the key

- [ ] **Configure SendGrid**
  - [ ] Add to `server/.env`: `SENDGRID_API_KEY=SG.xxx`
  - [ ] Update `ADMIN_EMAIL=your-verified-email@example.com`
  - [ ] Verify this email in SendGrid (required!)

- [ ] **Test Email Sending**
  - [ ] Make test enrollment
  - [ ] Check email inbox for confirmation
  - [ ] Check SendGrid Activity for delivery status

## ✅ Phase 4: Stripe Webhooks (For Production)

- [ ] **Create Webhook in Stripe**
  - [ ] Go to https://dashboard.stripe.com/webhooks
  - [ ] Create new endpoint
  - [ ] URL: `https://your-backend-url/api/webhook`
  - [ ] Events: Select `checkout.session.completed`

- [ ] **Add Webhook Secret**
  - [ ] Copy signing secret from Stripe
  - [ ] Add to `server/.env`: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

- [ ] **Test Webhook**
  - [ ] Stripe dashboard shows successful deliveries
  - [ ] Backend logs show webhook processing

## ✅ Phase 5: Admin Password Security

- [ ] **Change Default Admin Password**
  - [ ] Update `ADMIN_PASSWORD` in `server/.env`
  - [ ] Use strong, unique password
  - [ ] Don't use `admin123` in production!

## ✅ Phase 6: Production Deployment

### Prepare for Deployment

- [ ] **Update to Live Stripe Keys**
  - [ ] Get live API keys (sk_live_..., pk_live_...)
  - [ ] Update `server/.env`

- [ ] **Set NODE_ENV=production**
  - [ ] Update `server/.env` to `NODE_ENV=production`

- [ ] **Update Backend URL**
  - [ ] Update `FRONTEND_URL` in `server/.env`
  - [ ] Should be production frontend domain

### Deploy Backend

- [ ] **Set Up Railway Account**
  - [ ] Go to https://railway.app
  - [ ] Sign up with GitHub

- [ ] **Deploy Backend to Railway**
  - [ ] Connect your GitHub repository
  - [ ] Railway auto-detects Node.js app
  - [ ] Add environment variables in Railway dashboard:
    - [ ] `STRIPE_SECRET_KEY` (live key)
    - [ ] `STRIPE_PUBLISHABLE_KEY` (live key)
    - [ ] `STRIPE_WEBHOOK_SECRET` (live webhook secret)
    - [ ] `SENDGRID_API_KEY`
    - [ ] `ADMIN_EMAIL`
    - [ ] `ADMIN_PASSWORD` (strong password!)
    - [ ] `FRONTEND_URL` (your production frontend domain)
    - [ ] `NODE_ENV=production`

- [ ] **Get Railway Backend URL**
  - [ ] Copy public URL from Railway dashboard
  - [ ] Format: `https://xxxxx.railway.app`

- [ ] **Update Stripe Webhooks**
  - [ ] Go to Stripe webhooks
  - [ ] Update endpoint URL: `https://your-railway-url/api/webhook`
  - [ ] Copy new signing secret
  - [ ] Update `STRIPE_WEBHOOK_SECRET` in Railway

### Deploy Frontend

Choose one deployment platform:

#### Option A: Netlify
- [ ] **Deploy to Netlify**
  - [ ] Go to https://netlify.com
  - [ ] Connect GitHub repository
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Add environment variable: `VITE_BACKEND_URL=https://your-railway-url`
  - [ ] Deploy

#### Option B: Vercel
- [ ] **Deploy to Vercel**
  - [ ] Go to https://vercel.com
  - [ ] Import GitHub repository
  - [ ] Add environment variable: `VITE_BACKEND_URL=https://your-railway-url`
  - [ ] Deploy

#### Option C: Railway (Full Stack)
- [ ] **Deploy Frontend to Railway**
  - [ ] Add `VITE_BACKEND_URL` environment variable
  - [ ] Configure build and start commands

## ✅ Phase 7: Production Testing

- [ ] **Test Full Enrollment Flow**
  - [ ] Visit production domain
  - [ ] Go to courses page
  - [ ] Click "Enroll Now"
  - [ ] Use real card (or test card for testing)
  - [ ] Receive confirmation email

- [ ] **Test Admin Dashboard**
  - [ ] Access `/admin` on production domain
  - [ ] Login with production credentials
  - [ ] View enrollments and refunds

- [ ] **Test Refund Flow**
  - [ ] Go to `/refunds` page
  - [ ] Submit refund request
  - [ ] Go to admin dashboard
  - [ ] Approve/deny refund
  - [ ] Check refund email sent

- [ ] **Monitor Stripe Dashboard**
  - [ ] Check for successful payments
  - [ ] Verify webhook deliveries
  - [ ] Monitor dispute/chargeback alerts

## ✅ Phase 8: Post-Deployment

- [ ] **Monitor System Health**
  - [ ] Check backend logs daily
  - [ ] Monitor Stripe dashboard
  - [ ] Check SendGrid activity

- [ ] **Update Contact Information**
  - [ ] Update admin email if needed
  - [ ] Update contact pages with support info

- [ ] **Document for Future**
  - [ ] Save all API keys securely
  - [ ] Document admin dashboard access
  - [ ] Keep recovery/backup procedures

- [ ] **Notify Users** (if applicable)
  - [ ] Let students know about new refund policy
  - [ ] Send welcome emails if not automatic

---

## Important Reminders

### Security
- 🔒 Never commit `.env` files to git
- 🔒 Never share secret API keys
- 🔒 Change admin password from default
- 🔒 Use HTTPS in production always
- 🔒 Keep API keys secure in environment variables

### Testing
- 💳 Use Stripe test cards: `4242 4242 4242 4242`
- 📧 Use test email addresses for testing
- 🧪 Test full flow before production
- ⚠️ Don't test with real cards in development

### Files You Changed
```
server/
├── server.js (UPDATED - added email, admin, refund endpoints)
├── package.json (UPDATED - added @sendgrid/mail)
├── .env.example (UPDATED - added new env vars)
├── railway.json (NEW)
└── README.md (UPDATED - comprehensive docs)

src/
├── pages/
│   ├── AdminDashboard.tsx (NEW)
│   └── RefundCancellationPage.tsx (NEW)
└── App.tsx (UPDATED - added routes)

Project root:
├── DEPLOYMENT_GUIDE.md (NEW)
├── IMPLEMENTATION_SUMMARY.md (NEW)
├── QUICK_START.md (NEW)
└── SETUP_CHECKLIST.md (NEW - this file)
```

---

## Quick Reference URLs

| Resource | URL |
|----------|-----|
| Stripe Dashboard | https://dashboard.stripe.com |
| Stripe API Docs | https://stripe.com/docs |
| SendGrid Dashboard | https://app.sendgrid.com |
| SendGrid Docs | https://sendgrid.com/docs |
| Railway App | https://railway.app |
| Railway Docs | https://docs.railway.app |
| Netlify | https://netlify.com |
| Vercel | https://vercel.com |

---

## Getting Help

1. **Setup issues?** Check QUICK_START.md
2. **Deployment help?** See DEPLOYMENT_GUIDE.md
3. **What was implemented?** Read IMPLEMENTATION_SUMMARY.md
4. **API documentation?** See server/README.md

---

## Success Indicators

✅ You've completed setup when:

1. Backend runs without errors
2. Frontend loads without errors
3. Can make test enrollments
4. Enrollments appear in admin dashboard
5. Can request refunds and admin can approve/deny them
6. Confirmation emails arrive (if SendGrid configured)
7. All deployed to production with live Stripe keys

---

**You're ready to go! 🚀**

Start with Phase 1, then Phase 2 to test locally. When satisfied, proceed to Phase 6+ for production deployment.

Need help? See the documentation files or contact support resources above.
