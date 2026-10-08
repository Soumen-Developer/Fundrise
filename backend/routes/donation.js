const express = require('express');
const { Donation, Campaign, User } = require('../models/index.js');
const { protect } = require('../middleware/auth.js');
const { sequelize } = require('../config/db.js');

const router = express.Router();

// Razorpay setup
let razorpay;
try {
  razorpay = require('razorpay');
} catch (e) {
  // Razorpay may not be available in all environments
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret_key_here';

// Mock mode for development when Razorpay keys are placeholders
const isMockMode = RAZORPAY_KEY_ID === 'rzp_test_your_key_id_here' || RAZORPAY_KEY_SECRET === 'your_razorpay_secret_key_here';

// POST /api/donations/create-order - Create Razorpay order
router.post(
  '/create-order',
  protect,
  async (req, res) => {
    try {
      const { amount } = req.body; // amount in ₹

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid amount is required' });
      }

      if (isMockMode) {
        // Mock order creation for development
        const mockOrderId = `order_mock_${Date.now()}`;
        const mockAmountInPaise = Math.round(amount * 100);
        return res.json({
          success: true,
          orderId: mockOrderId,
          amount: mockAmountInPaise,
          currency: 'INR',
        });
      }

      if (!razorpay) {
        return res.status(500).json({ success: false, message: 'Razorpay not configured' });
      }

      const options = {
        amount: Math.round(amount * 100), // Convert ₹ to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ success: false, message: 'Server error creating order' });
    }
  }
);

// POST /api/donations/verify - Verify payment & save donation
router.post(
  '/verify',
  protect,
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        campaignId,
        amount,
        isAnonymous,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !campaignId ||
        !amount
      ) {
        return res.status(400).json({
          success: false,
          message: 'All payment fields are required',
        });
      }

      // In mock mode, skip signature verification
      if (!isMockMode && !razorpay) {
        return res.status(500).json({ success: false, message: 'Razorpay not configured' });
      }

      // Verify HMAC signature
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      let expectedSignature;

      if (isMockMode) {
        // In mock mode, accept any signature
        expectedSignature = razorpay_signature;
      } else {
        const crypto = require('crypto');
        expectedSignature = crypto
          .createHmac('sha256', RAZORPAY_KEY_SECRET)
          .update(sign)
          .digest('hex');
      }

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature',
        });
      }

      // Check if campaign exists and is accepting donations
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      if (campaign.status !== 'Approved' && campaign.status !== 'Active') {
        return res.status(400).json({ message: 'Campaign is not accepting donations' });
      }

      // Create donation inside a transaction
      const [donation, created] = await Donation.findOrCreate({
        where: {
          userId: req.user.id,
          campaignId,
          orderId: razorpay_order_id,
        },
        defaults: {
          userId: req.user.id,
          campaignId,
          amount: Number(amount),
          isAnonymous,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          status: 'succeeded',
        },
      });

      // If donation already exists, don't create again (allow multiple donations though)
      if (!created) {
        // Update existing donation status if still pending
        if (donation.status !== 'succeeded') {
          await donation.update({ status: 'succeeded', paymentId: razorpay_payment_id, orderId: razorpay_order_id });
        }
      }

      // Increment campaign raised amount and backer count in transaction
      await sequelize.transaction(async (t) => {
        await campaign.increment('raisedAmount', { by: Number(amount) }, { transaction: t });
        await campaign.increment('backersCount', { by: 1 }, { transaction: t });

        // Set campaign Successful if goal is reached
        if (campaign.raisedAmount >= campaign.goalAmount) {
          await campaign.update({ status: 'Successful' }, { transaction: t });
        }
      });

      res.status(201).json({
        success: true,
        donation: {
          ...donation.dataValues,
          user: req.user.id,
        },
        campaign: {
          raisedAmount: campaign.raisedAmount,
          backersCount: campaign.backersCount,
          status: campaign.status,
        },
      });
    } catch (error) {
      console.error('Verify payment error:', error);
      res.status(500).json({ success: false, message: 'Server error verifying payment' });
    }
  }
);

// Keep the original GET endpoints for donations
// GET /api/donations/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] },
        { model: Campaign, attributes: ['id', 'title'] },
      ],
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error fetching donation' });
  }
});

// GET /api/donations/user/:userId
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Users can only see their own donations, admins can see any
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const donations = await Donation.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Campaign, attributes: ['title', 'goalAmount', 'raisedAmount', 'status'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

// GET /api/donations/campaign/:campaignId
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { campaignId: req.params.campaignId, status: 'succeeded' },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error('Get campaign donations error:', error);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

module.exports = router;