const mongoose = require('mongoose');
const defaultRoles = require('./defaults/roles');
const logger = require('../config/logger');

const actionSchema = new mongoose.Schema({
  // 1 is most powerfull value
  // 1 can do anything can 2 or 3 can it
  // 0 blocked User
  roleRank: { type: Number, default: 0, unique: true },
  canBlockUser: { type: Boolean, default: false },
  canDeletePropertyAds: { type: Boolean, default: false },
  canDeleteProperty: { type: Boolean, default: false },
  canShowDashboard: { type: Boolean, default: false },
});

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    maxLength: 128,
    minLength: 2,
  },
  actions: actionSchema,
  rank: { type: Number, default: 0 },
});

const RoleModel = mongoose.model('Role', roleSchema);

RoleModel.on('index', async (err) => {
  if (err) {
    logger.error(err);
  } else {
    const rolesCount = await RoleModel.countDocuments();
    if (rolesCount === 0) {
      await RoleModel.insertMany(defaultRoles);
    }
  }
});

module.exports = RoleModel;