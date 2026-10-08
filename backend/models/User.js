const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db.js');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('visitor', 'user', 'admin'),
    defaultValue: 'user',
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

// Hash password before creating user
const salt = process.env.BCRYPT_SALT_ROUNDS || 12;
const bcrypt = require('bcryptjs');

User.addHook('beforeCreate', async (user) => {
  if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(Number(salt)));
  }
});

// Hash password before updating user if password changed
User.addHook('beforeUpdate', async (user) => {
  if (user.changed('password')) {
    if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(Number(salt)));
    }
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

User.User = User;
module.exports = User;