/* eslint-disable consistent-return */
module.exports = (role) => (req, res, next) => {
  const userTokenDecoded = {
    email: 'muhammed.adel.elshall@gmail.com',
    roleId: 2,
    role: {
      name: 'admin',
      actions: {
        blockUser: true,
        deleteAds: true,
      },
    },
  };
  if (userTokenDecoded.role.name !== role) {
    return res.json({
      message: 'You are not authorized to perform this action',
    });
  }
  next();
};
