const express = require('express');
const { Update, Campaign } = require('../models/index.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// POST /api/updates - Create a campaign update (only creator can post)
router.post(
  '/',
  protect,
  async (req, res) => {
    try {
      const { campaignId, title, content } = req.body;

      if (!campaignId || !title || !content) {
        return res.status(400).json({ message: 'Campaign ID, title, and content are required' });
      }

      // Check if campaign exists
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      // Only the campaign creator can post an update
      if (campaign.creatorId !== req.user.id) {
        return res.status(403).json({ message: 'Only the campaign creator can post updates' });
      }

      const update = await Update.create({
        campaignId,
        title,
        content,
      });

      res.status(201).json({
        success: true,
        update,
      });
    } catch (error) {
      console.error('Create update error:', error);
      res.status(500).json({ message: 'Server error creating update' });
    }
  }
);

// GET /api/updates/campaign/:campaignId - Get updates for a campaign
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const updates = await Update.findAll({
      where: { campaignId: req.params.campaignId },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ message: 'Server error fetching updates' });
  }
});

module.exports = router;