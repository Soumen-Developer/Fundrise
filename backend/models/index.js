const User = require('./User.js');
const Campaign = require('./Campaign.js');
const Donation = require('./Donation.js');
const Comment = require('./Comment.js');
const Update = require('./Update.js');

// User <-> Campaign
User.hasMany(Campaign, { foreignKey: 'creatorId', as: 'createdCampaigns' });
Campaign.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Campaign.belongsTo(User, { foreignKey: 'creatorId' });

// User <-> Donation
User.hasMany(Donation, { foreignKey: 'userId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'userId' });
Donation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Campaign <-> Donation
Campaign.hasMany(Donation, { foreignKey: 'campaignId', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaignId' });
Donation.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Campaign <-> Comment
Campaign.hasMany(Comment, { foreignKey: 'campaignId', as: 'comments' });
Comment.belongsTo(Campaign, { foreignKey: 'campaignId' });

// Campaign <-> Update
Campaign.hasMany(Update, { foreignKey: 'campaignId', as: 'updates' });
Update.belongsTo(Campaign, { foreignKey: 'campaignId' });
Update.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

module.exports = { User, Campaign, Donation, Comment, Update };