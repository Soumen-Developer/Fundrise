const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fundrise_default_production_jwt_secret_key_2026';

const jwtSign = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { jwtSign, JWT_SECRET };