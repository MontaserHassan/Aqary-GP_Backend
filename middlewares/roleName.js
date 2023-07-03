const RoleModel = require("../models/RoleModel");
const User = require("../models/userModel");

/* eslint-disable consistent-return */
module.exports = (roleName) => async (req, res, next) => {
  try {
    const role = await RoleModel.findOne({role_name: roleName});
    const userRole = await RoleModel.findById(req.user.roleId);
    if (userRole.rank > role.rank) {
      throw ({
        status: 401,
        message: 'You are not authorized to perform this action',
      });
    }
  } catch (err) {
    console.log(err.message)
    return res.status(err.status || 500).json({ message: err.message });
  }
  return next();
};
