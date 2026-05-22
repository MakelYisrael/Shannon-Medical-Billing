import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sgMail from '@sendgrid/mail';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

let stripe = null;
const STRIPE_ENABLED = process.env.STRIPE_SECRET_KEY &&
                       process.env.STRIPE_SECRET_KEY.startsWith('sk_') &&
                       process.env.STRIPE_SECRET_KEY.length > 20 &&
                       !process.env.STRIPE_SECRET_KEY.includes('placeholder');

if (STRIPE_ENABLED) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe enabled with real API key');
} else {
  console.log('⚠️  Stripe mocked for development (no real API key provided)');
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3001',
      FRONTEND_URL,
    ];

    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

const enrollmentsFile = path.join(__dirname, 'data', 'enrollments.json');
const refundsFile = path.join(__dirname, 'data', 'refunds.json');
const sessionsFile = path.join(__dirname, 'data', 'sessions.json');

const ensureDataFiles = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(enrollmentsFile)) {
    fs.writeFileSync(enrollmentsFile, JSON.stringify([]));
  }
  if (!fs.existsSync(refundsFile)) {
    fs.writeFileSync(refundsFile, JSON.stringify([]));
  }
  if (!fs.existsSync(sessionsFile)) {
    fs.writeFileSync(sessionsFile, JSON.stringify([]));
  }
};

const getEnrollments = () => {
  ensureDataFiles();
  const data = fs.readFileSync(enrollmentsFile, 'utf-8');
  return JSON.parse(data);
};

const saveEnrollment = (enrollment) => {
  const enrollments = getEnrollments();
  enrollments.push(enrollment);
  fs.writeFileSync(enrollmentsFile, JSON.stringify(enrollments, null, 2));
};

const getRefunds = () => {
  ensureDataFiles();
  const data = fs.readFileSync(refundsFile, 'utf-8');
  return JSON.parse(data);
};

const saveRefund = (refund) => {
  const refunds = getRefunds();
  refunds.push(refund);
  fs.writeFileSync(refundsFile, JSON.stringify(refunds, null, 2));
};

const updateRefund = (refundId, updates) => {
  const refunds = getRefunds();
  const index = refunds.findIndex((r) => r.id === refundId);
  if (index !== -1) {
    refunds[index] = { ...refunds[index], ...updates };
    fs.writeFileSync(refundsFile, JSON.stringify(refunds, null, 2));
    return refunds[index];
  }
  return null;
};

const getSessions = () => {
  ensureDataFiles();
  const data = fs.readFileSync(sessionsFile, 'utf-8');
  return JSON.parse(data);
};

const saveSession = (session) => {
  const sessions = getSessions();
  sessions.push(session);
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
};

const sendConfirmationEmail = async (email, firstName, lastName, courseName, planType, amount) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured. Skipping email.');
      return;
    }

    const planText = planType === 'monthly' ? 'Monthly Subscription' : 'Full Payment';
    const amountText = '$' + (amount / 100).toFixed(2);

    const msg = {
      to: email,
      from: ADMIN_EMAIL,
      subject: `Enrollment Confirmation - ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome, ${firstName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for enrolling in <strong>${courseName}</strong>. Your enrollment has been confirmed.
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Enrollment Details</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Plan:</strong> ${planText}</p>
            <p><strong>Amount:</strong> ${amountText}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="color: #666; line-height: 1.6;">
            You will receive further instructions on how to access your course materials shortly.
          </p>
          <p style="color: #666; line-height: 1.6;">
            If you have any questions, please don't hesitate to contact us.
          </p>
          <p style="color: #999; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

const sendRefundApprovalEmail = async (email, firstName, lastName, courseName, amount, refundId) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured. Skipping email.');
      return;
    }

    const amountText = '$' + (amount / 100).toFixed(2);

    const msg = {
      to: email,
      from: ADMIN_EMAIL,
      subject: `Refund Approved - ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Refund Approved</h2>
          <p style="color: #666; line-height: 1.6;">
            Your refund request for <strong>${courseName}</strong> has been approved.
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Refund Details</h3>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Amount:</strong> ${amountText}</p>
            <p><strong>Status:</strong> Approved</p>
            <p><strong>Refund ID:</strong> ${refundId}</p>
          </div>
          <p style="color: #666; line-height: 1.6;">
            The funds will be returned to your original payment method within 5-10 business days.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Thank you for giving us the opportunity to work with you.
          </p>
          <p style="color: #999; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Refund approval email sent to ${email}`);
  } catch (error) {
    console.error('Error sending refund approval email:', error);
  }
};

const courseData = {
  'medical-billing-foundations': {
    name: 'Medical Billing Foundations',
    description: 'Learn the full cycle from patient intake to payment posting',
    fullPrice: 29700,
    monthlyPrice: 9900,
  },
  'medical-coding-essentials': {
    name: 'Medical Coding Essentials',
    description: 'Learn CPT, ICD-10, and HCPCS coding basics with real-world examples',
    fullPrice: 29700,
    monthlyPrice: 9900,
  },
  'ar-management-mastery': {
    name: 'AR Management Mastery',
    description: 'Learn proven strategies to reduce days in AR and boost collections',
    fullPrice: 39700,
    monthlyPrice: 13200,
  },
  'advanced-coding-compliance': {
    name: 'Advanced Coding & Compliance',
    description: 'Go deeper into CPT, ICD-10, modifiers, and payer-specific rules',
    fullPrice: 49700,
    monthlyPrice: 16600,
  },
};

let stripeProducts = {};

const initializeStripeProducts = async () => {
  try {
    for (const [courseId, courseInfo] of Object.entries(courseData)) {
      const productName = courseInfo.name;

      if (STRIPE_ENABLED && stripe) {
        const product = await stripe.products.create({
          name: productName,
          description: courseInfo.description,
          metadata: { courseId },
        });

        const fullPriceObj = await stripe.prices.create({
          product: product.id,
          unit_amount: courseInfo.fullPrice,
          currency: 'usd',
          type: 'one_time',
          metadata: { planType: 'full' },
        });

        const monthlyPriceObj = await stripe.prices.create({
          product: product.id,
          unit_amount: courseInfo.monthlyPrice,
          currency: 'usd',
          recurring: { interval: 'month' },
          type: 'recurring',
          metadata: { planType: 'monthly' },
        });

        stripeProducts[courseId] = {
          productId: product.id,
          fullPrice: fullPriceObj.id,
          monthlyPrice: monthlyPriceObj.id,
        };
      } else {
        stripeProducts[courseId] = {
          productId: `mock_prod_${courseId}`,
          fullPrice: `mock_price_${courseId}_full`,
          monthlyPrice: `mock_price_${courseId}_monthly`,
        };
      }

      console.log(`✅ Initialized product for ${productName}`);
    }
    console.log('All products initialized');
  } catch (error) {
    console.error('Error initializing products:', error.message);
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/courses', (req, res) => {
  const courses = Object.entries(courseData).map(([id, data]) => ({
    id,
    ...data,
    prices: stripeProducts[id] || {},
  }));
  res.json(courses);
});

app.post('/api/checkout-session', async (req, res) => {
  try {
    const { courseId, planType, email, firstName, lastName } = req.body;

    if (!courseId || !planType || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!stripeProducts[courseId]) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseData[courseId];
    const products = stripeProducts[courseId];

    if (STRIPE_ENABLED && stripe) {
      const priceId = planType === 'monthly' ? products.monthlyPrice : products.fullPrice;

      const lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];

      const sessionConfig = {
        customer_email: email,
        line_items: lineItems,
        mode: planType === 'monthly' ? 'subscription' : 'payment',
        success_url: `${FRONTEND_URL}/enrollment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}&plan_type=${planType}`,
        cancel_url: `${FRONTEND_URL}/enrollment-cancelled`,
        metadata: {
          courseId,
          planType,
          firstName,
          lastName,
        },
      };

      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } else {
      const mockSessionId = `mock_session_${uuidv4()}`;
      const mockUrl = `${FRONTEND_URL}/enrollment-success?session_id=${mockSessionId}&course_id=${courseId}&plan_type=${planType}&mock=true`;

      res.json({
        sessionId: mockSessionId,
        url: mockUrl,
      });
    }
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/enrollment-confirmation', async (req, res) => {
  try {
    let { sessionId, courseId, planType, email, firstName, lastName } = req.body;

    console.log('Enrollment confirmation request:', {
      sessionId,
      courseId,
      planType,
      email,
      firstName,
      lastName,
      bodyKeys: Object.keys(req.body),
    });

    if (!sessionId || !courseId) {
      const errorMsg = `Missing required fields: sessionId=${sessionId ? '✓' : '✗'}, courseId=${courseId ? '✓' : '✗'}`;
      console.error(errorMsg);
      console.error('Full request body:', req.body);
      return res.status(400).json({
        error: errorMsg,
        received: { sessionId, courseId, planType, email, firstName, lastName },
        allBodyKeys: Object.keys(req.body)
      });
    }

    let session;
    let amount;

    if (STRIPE_ENABLED && stripe && sessionId.startsWith('cs_')) {
      try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
        amount = session.amount_total;

        // Extract user data from Stripe session metadata if not provided in request
        if (!firstName && session.metadata?.firstName) {
          firstName = session.metadata.firstName;
        }
        if (!lastName && session.metadata?.lastName) {
          lastName = session.metadata.lastName;
        }
        if (!email && session.customer_email) {
          email = session.customer_email;
        }
        if (!planType && session.metadata?.planType) {
          planType = session.metadata.planType;
        }
      } catch (stripeError) {
        console.warn('Error retrieving Stripe session:', stripeError.message);
        // Fall back to provided data or use defaults
        if (!amount) {
          amount = planType === 'monthly' ? courseData[courseId].monthlyPrice : courseData[courseId].fullPrice;
        }
      }
    } else {
      // Mock or development mode
      amount = planType === 'monthly' ? courseData[courseId].monthlyPrice : courseData[courseId].fullPrice;
    }

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields. Please ensure email, firstName, and lastName are provided.',
        received: { email, firstName, lastName, sessionId, courseId }
      });
    }

    const enrollment = {
      id: uuidv4(),
      courseId,
      courseName: courseData[courseId].name,
      planType: planType || 'full',
      email,
      firstName,
      lastName,
      stripeSessionId: sessionId,
      stripeCustomerId: session?.customer || 'mock_customer',
      paymentStatus: session?.payment_status || 'paid',
      enrollmentDate: new Date().toISOString(),
      amount: Math.round(amount / 100),
      subscriptionStatus: planType === 'monthly' ? 'active' : 'completed',
    };

    saveEnrollment(enrollment);

    await sendConfirmationEmail(
      email,
      firstName,
      lastName,
      courseData[courseId].name,
      planType,
      amount
    );

    res.json({
      success: true,
      enrollment,
      message: `Successfully enrolled in ${enrollment.courseName}`,
    });
  } catch (error) {
    console.error('Enrollment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/enrollment/:enrollmentId', (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const enrollments = getEnrollments();
    const enrollment = enrollments.find((e) => e.id === enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/enrollments', (req, res) => {
  try {
    const enrollments = getEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    if (!STRIPE_ENABLED || !stripe) {
      console.log('⚠️  Webhook received but Stripe not enabled (development mode)');
      res.json({ received: true });
      return;
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Payment successful:', session.id);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = Buffer.from(`${email}:${password}`).toString('base64');
      res.json({
        success: true,
        token,
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message });
  }
});

const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.slice(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      req.admin = { email };
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/admin/enrollments', verifyAdminToken, (req, res) => {
  try {
    const enrollments = getEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error('Get admin enrollments error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/refunds', verifyAdminToken, (req, res) => {
  try {
    const refunds = getRefunds();
    res.json(refunds);
  } catch (error) {
    console.error('Get admin refunds error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/refund-request', async (req, res) => {
  try {
    const { enrollmentId, reason } = req.body;

    if (!enrollmentId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const enrollments = getEnrollments();
    const enrollment = enrollments.find((e) => e.id === enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const enrollmentDate = new Date(enrollment.enrollmentDate);
    const today = new Date();
    const daysSinceEnrollment = Math.floor((today - enrollmentDate) / (1000 * 60 * 60 * 24));

    if (enrollment.planType === 'full' && daysSinceEnrollment > 14) {
      return res.status(400).json({
        error: 'Refund window expired. Full price purchases are refundable within 14 days of purchase.',
      });
    }

    const refund = {
      id: uuidv4(),
      enrollmentId,
      email: enrollment.email,
      firstName: enrollment.firstName,
      lastName: enrollment.lastName,
      courseName: enrollment.courseName,
      planType: enrollment.planType,
      amount: enrollment.amount,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      daysSinceEnrollment,
    };

    saveRefund(refund);

    res.json({
      success: true,
      refund,
      message: 'Refund request submitted. An admin will review your request.',
    });
  } catch (error) {
    console.error('Refund request error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/approve-refund', verifyAdminToken, async (req, res) => {
  try {
    const { refundId } = req.body;

    if (!refundId) {
      return res.status(400).json({ error: 'Refund ID required' });
    }

    const refund = getRefunds().find((r) => r.id === refundId);

    if (!refund) {
      return res.status(404).json({ error: 'Refund not found' });
    }

    if (refund.status !== 'pending') {
      return res.status(400).json({ error: `Refund is already ${refund.status}` });
    }

    try {
      if (STRIPE_ENABLED && stripe) {
        const refundObj = await stripe.refunds.create({
          charge: refund.stripeChargeId || undefined,
          amount: Math.round(refund.amount * 100),
        });

        const updated = updateRefund(refundId, {
          status: 'approved',
          stripeRefundId: refundObj.id,
          approvedAt: new Date().toISOString(),
          approvedBy: req.admin.email,
        });

        await sendRefundApprovalEmail(
          refund.email,
          refund.firstName,
          refund.lastName,
          refund.courseName,
          refund.amount * 100,
          refundId
        );

        res.json({
          success: true,
          refund: updated,
          message: 'Refund approved and processed',
        });
      } else {
        const updated = updateRefund(refundId, {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: req.admin.email,
        });

        await sendRefundApprovalEmail(
          refund.email,
          refund.firstName,
          refund.lastName,
          refund.courseName,
          refund.amount * 100,
          refundId
        );

        res.json({
          success: true,
          refund: updated,
          message: 'Refund approved (Development mode)',
        });
      }
    } catch (error) {
      const updated = updateRefund(refundId, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: req.admin.email,
      });

      await sendRefundApprovalEmail(
        refund.email,
        refund.firstName,
        refund.lastName,
        refund.courseName,
        refund.amount * 100,
        refundId
      );

      console.log('Note: Refund marked approved but Stripe processing had issues:', error.message);
      res.json({
        success: true,
        refund: updated,
        message: 'Refund approved (Note: Manual Stripe processing may be needed)',
      });
    }
  } catch (error) {
    console.error('Approve refund error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/deny-refund', verifyAdminToken, async (req, res) => {
  try {
    const { refundId, reason } = req.body;

    if (!refundId) {
      return res.status(400).json({ error: 'Refund ID required' });
    }

    const updated = updateRefund(refundId, {
      status: 'denied',
      denialReason: reason,
      deniedAt: new Date().toISOString(),
      deniedBy: req.admin.email,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Refund not found' });
    }

    res.json({
      success: true,
      refund: updated,
      message: 'Refund denied',
    });
  } catch (error) {
    console.error('Deny refund error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    if (!enrollmentId) {
      return res.status(400).json({ error: 'Enrollment ID required' });
    }

    const enrollments = getEnrollments();
    const enrollment = enrollments.find((e) => e.id === enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (enrollment.planType !== 'monthly') {
      return res.status(400).json({ error: 'Only monthly subscriptions can be cancelled' });
    }

    if (STRIPE_ENABLED && stripe) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: enrollment.stripeCustomerId,
          limit: 10,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          await stripe.subscriptions.cancel(subscription.id);
          console.log(`✅ Subscription ${subscription.id} cancelled`);
        }
      } catch (error) {
        console.error('Error cancelling Stripe subscription:', error.message);
      }
    } else {
      console.log('⚠️  Subscription cancellation requested (development mode)');
    }

    const index = enrollments.findIndex((e) => e.id === enrollmentId);
    if (index !== -1) {
      enrollments[index].subscriptionStatus = 'cancelled';
      enrollments[index].cancelledAt = new Date().toISOString();
      fs.writeFileSync(enrollmentsFile, JSON.stringify(enrollments, null, 2));
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

const startServer = async () => {
  ensureDataFiles();
  await initializeStripeProducts();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend: ${FRONTEND_URL}`);
  });
};

startServer().catch(console.error);
