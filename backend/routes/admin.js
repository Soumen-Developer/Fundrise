const express = require('express');
const { User, Campaign, Donation } = require('../models/index.js');
const { protect, authorize } = require('../middleware/auth.js');
const { sequelize } = require('../config/db.js');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/admin/stats - Platform statistics
router.get(
  '/stats',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalCampaigns = await Campaign.count();
      const totalFundsRaised = await Donation.sum('amount', { where: { status: 'succeeded' } });
      const pendingCount = await Campaign.count({ where: { status: 'Pending' } });

      // Donations over time (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const donationsOverTime = await Donation.findAll({
        attributes: [
          [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        ],
        where: {
          createdAt: { [Op.gte]: sixMonthsAgo },
          status: 'succeeded',
        },
        group: [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM')],
        order: [[sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']],
        raw: true,
      });

      // Campaigns by category
      const campaignsByCategory = await Campaign.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('raisedAmount')), 0), 'totalRaised'],
        ],
        group: ['category'],
        raw: true,
      });

      res.json({
        success: true,
        stats: {
          totalUsers,
          totalCampaigns,
          totalFundsRaised: totalFundsRaised || 0,
          pendingCount,
          donationsOverTime,
          campaignsByCategory,
        },
      });
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ success: false, message: 'Server error fetching stats' });
    }
  }
);

// GET /api/admin/pending-campaigns - List pending campaigns
router.get(
  '/pending-campaigns',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const pendingCampaigns = await Campaign.findAll({
        where: { status: 'Pending' },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'email'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json({
        success: true,
        count: pendingCampaigns.length,
        campaigns: pendingCampaigns,
      });
    } catch (error) {
      console.error('Pending campaigns error:', error);
      res.status(500).json({ success: false, message: 'Server error fetching pending campaigns' });
    }
  }
);

// PUT /api/admin/campaigns/:id/approve - Approve campaign
router.put(
  '/campaigns/:id/approve',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const campaign = await Campaign.findByPk(req.params.id);
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      await campaign.update({ status: 'Active', isVerified: true });
      res.json({
        success: true,
        message: 'Campaign approved successfully',
        campaign,
      });
    } catch (error) {
      console.error('Approve campaign error:', error);
      res.status(500).json({ success: false, message: 'Server error approving campaign' });
    }
  }
);

// PUT /api/admin/campaigns/:id/reject - Reject campaign with reason
router.put(
  '/campaigns/:id/reject',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { reason } = req.body;
      const campaign = await Campaign.findByPk(req.params.id);
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      await campaign.update({ rejectionReason: reason || 'Campaign rejected by admin', status: 'Rejected' });
      res.json({
        success: true,
        message: 'Campaign rejected',
        campaign,
      });
    } catch (error) {
      console.error('Reject campaign error:', error);
      res.status(500).json({ success: false, message: 'Server error rejecting campaign' });
    }
  }
);

// GET /api/admin/users - List users
router.get(
  '/users',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'isBlocked', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      res.json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ success: false, message: 'Server error listing users' });
    }
  }
);

// PUT /api/admin/users/:id/block - Block/unblock user
router.put(
  '/users/:id/block',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const nextBlockedState = !user.isBlocked;
      await user.update({ isBlocked: nextBlockedState });

      res.json({
        success: true,
        message: nextBlockedState ? 'User blocked successfully' : 'User unblocked successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: nextBlockedState,
        },
      });
    } catch (error) {
      console.error('Block/unblock user error:', error);
      res.status(500).json({ success: false, message: 'Server error blocking/unblocking user' });
    }
  }
);

module.exports = router;