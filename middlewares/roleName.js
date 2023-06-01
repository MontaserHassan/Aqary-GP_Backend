/* eslint-disable consistent-return */
module.exports = (role) => (req, res, next) => {
  if (role === 'admin') next();
  const userTokenDecoded = {
    email: 'muhammed.adel.elshall@gmail.com',
    roleId: 2,
    role: {
      name: 'admin',
      blockUser: true,
      deleteAds: true,
    },
  };
  if (userTokenDecoded.role !== 'admin') {
    return res.json({
      message: 'You are not authorized to perform this action',
    });
  }
  next();
};
