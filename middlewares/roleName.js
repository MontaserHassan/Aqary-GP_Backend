const RoleModel = require("../models/RoleModel");

/* eslint-disable consistent-return */
module.exports = (roleName) => (req, res, next) => {
  const userTokenDecoded = {
    email: 'muhammed.adel.elshall@gmail.com',
    roleId: 2,
    role: {
      _id: 2,
      rank:1,
      name: 'admin',
      actions: {
        blockUser: true,
        deleteAds: true,
      },
    },
  };
  const role = RoleModel.findOne({name: roleName});
  if (userTokenDecoded.role.rank > role.rank) {
    return res.json({
      message: 'You are not authorized to perform this action',
    });
  }
  return next();
};
