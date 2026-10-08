const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Campaign, User, Donation, Comment, Update } = require('../models/index.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Whitelisted fields for campaign creation and editing
const CAMPAIGN_WHITELIST = [
  'title',
  'description',
  'story',
  'category',
  'goalAmount',
  'deadline',
  'image',
  'videoUrl',
];

// GET /api/campaigns - List campaigns with filtering, search, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status,
      search,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    // Filter by status if provided, otherwise show Active or Approved by default (or all if requested)
    if (status && status !== 'all') {
      where.status = status;
    } else if (!status) {
      // By default show publicly active or approved campaigns
      where.status = { [Op.in]: ['Active', 'Approved', 'Successful'] };
    }

    // Filter by category
    if (category && category !== 'all') {
      where.category = category;
    }

    // Search by title or description
    if (search && search.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sort === 'most_funded' || sort === 'most_funded') {
      order = [['raisedAmount', 'DESC']];
    } else if (sort === 'ending_soon') {
      order = [['deadline', 'ASC']];
    } else if (sort === 'newest') {
      order = [['createdAt', 'DESC']];
    }

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const pageLimit = parseInt(limit, 10);

    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
      order,
      limit: pageLimit,
      offset,
      distinct: true,
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / pageLimit),
      currentPage: parseInt(page, 10),
      campaigns,
    });
  } catch (error) {
    console.error('List campaigns error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching campaigns' });
  }
});

// GET /api/campaigns/:id - Get a single campaign with details
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'avatar', 'email'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
        },
        {
          model: Update,
          as: 'updates',
        },
        {
          model: Donation,
          as: 'donations',
          where: { status: 'succeeded' },
          required: false,
          limit: 10,
          include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Get single campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching campaign' });
  }
});

// POST /api/campaigns - Create a new campaign
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('story').trim().notEmpty().withMessage('Story is required'),
    body('category')
      .isIn(['education', 'medical', 'startup', 'creative', 'social', 'environment', 'other'])
      .withMessage('Invalid category'),
    body('goalAmount').isFloat({ min: 1 }).withMessage('Valid goal amount required'),
    body('deadline').isISO8601().withMessage('Valid deadline required'),
    body('image').optional().isString(),
    body('videoUrl').optional().isString(),
  ],
  protect,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // Filter to whitelisted fields only and ensure status starts as Pending
      const whitelistedData = Object.keys(req.body)
        .filter((key) => CAMPAIGN_WHITELIST.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      whitelistedData.status = 'Pending';
      whitelistedData.creatorId = req.user.id;

      const campaign = await Campaign.create(whitelistedData);

      res.status(201).json({
        success: true,
        campaign,
      });
    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({ success: false, message: 'Server error creating campaign' });
    }
  }
);

// PUT /api/campaigns/:id - Edit a campaign (only by creator and before donations)
router.put(
  '/:id',
  [
    ...CAMPAIGN_WHITELIST.map(
      (field) => body(field).optional().notEmpty().withMessage(`${field} cannot be empty`)
    ),
  ],
  protect,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const campaign = await Campaign.findByPk(req.params.id);

      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      // Check if user is the creator
      if (campaign.creatorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this campaign' });
      }

      // Check if campaign already received donations (admins can still edit)
      const donationCount = await Donation.count({
        where: { campaignId: req.params.id, status: 'succeeded' },
      });

      if (donationCount > 0 && req.user.role !== 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot edit campaign after receiving donations' });
      }

      // Filter to whitelisted fields only
      const whitelistedData = {};
      for (const key of CAMPAIGN_WHITELIST) {
        if (req.body[key] !== undefined) {
          whitelistedData[key] = req.body[key];
        }
      }

      delete whitelistedData.status;
      delete whitelistedData.raisedAmount;
      delete whitelistedData.creatorId;
      delete whitelistedData.isVerified;

      await campaign.update(whitelistedData);

      res.json({
        success: true,
        campaign,
      });
    } catch (error) {
      console.error('Edit campaign error:', error);
      res.status(500).json({ success: false, message: 'Server error editing campaign' });
    }
  }
);

// DELETE /api/campaigns/:id - Delete a campaign (only by creator and before donations)
router.delete('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Check if user is creator or admin
    if (campaign.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this campaign' });
    }

    // Check if campaign received donations
    const donationCount = await Donation.count({
      where: { campaignId: req.params.id, status: 'succeeded' },
    });

    if (donationCount > 0 && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete campaign after receiving donations' });
    }

    await campaign.destroy();

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting campaign' });
  }
});

module.exports = router;