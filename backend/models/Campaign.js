const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('education', 'medical', 'startup', 'creative', 'social', 'environment', 'other'),
    allowNull: false,
  },
  goalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  raisedAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  videoUrl: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Active', 'Successful', 'Expired', 'Rejected'),
    defaultValue: 'Pending',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  backersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Campaigns',
  timestamps: true,
});

Campaign.Campaign = Campaign;
module.exports = Campaign;