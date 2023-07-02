const RoleModel = require("../models/RoleModel");

/* eslint-disable consistent-return */
module.exports = (roleName) => (req, res, next) => {
  try {
    const role = RoleModel.findOne({name: roleName});
    const userRole = RoleModel.findOneById(req.user.roleId);
    if (userRole.rank > role.rank) {
      throw ({
        status: 401,
        message: 'You are not authorized to perform this action',
      });
    }
  } catch (err) {
    throw ({
      status: 401,
      message: 'You are not authorized to perform this action',
    });
  }
  return next();
};
