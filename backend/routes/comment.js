const express = require('express');
const { Comment, Campaign, User } = require('../models/index.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// POST /api/comments - Add a comment to a campaign
router.post('/', protect, async (req, res) => {
  try {
    const { campaignId, text } = req.body;

    if (!campaignId || !text) {
      return res.status(400).json({ message: 'Campaign ID and comment text are required' });
    }

    // Check if campaign exists
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const comment = await Comment.create({
      userId: req.user.id,
      campaignId,
      text,
    });

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error creating comment' });
  }
});

// GET /api/comments/campaign/:campaignId - Get comments for a campaign
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { campaignId: req.params.campaignId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
});

module.exports = router;