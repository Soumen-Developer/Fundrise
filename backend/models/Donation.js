const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  message: {
    type: DataTypes.TEXT,
  },
  paymentId: {
    type: DataTypes.STRING,
  },
  orderId: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed'),
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Donations',
  timestamps: true,
});

Donation.Donation = Donation;
module.exports = Donation;