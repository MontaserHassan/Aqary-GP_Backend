const RoleModel = require("../models/RoleModel");
const User = require("../models/userModel");

/* eslint-disable consistent-return */
module.exports = (roleName) => async (req, res, next) => {
  try {
    const role = await RoleModel.findOne({role_name: roleName});
    if (req.user.roleId.rank === 0 || req.user.roleId.rank > role.rank) {
      throw ({
        status: 401,
        message: 'You are not authorized to perform this action',
      });
    }
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  return next();
};
