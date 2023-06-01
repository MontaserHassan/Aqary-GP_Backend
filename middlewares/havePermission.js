/* eslint-disable consistent-return */
module.exports = (permission) => (req, res, next) => {
  const userTokenDecoded = {
    email: 'muhammed.adel.elshall@gmail.com',
    roleId: 2,
    role: {
      name: 'admin',
      blockUser: true,
      deleteAds: true,
    },
  };
  if (!Object.keys(userTokenDecoded.role).includes(permission)) {
    return res.json({
      message: 'You are not authorized to perform this action',
    });
  }
  next();
};
