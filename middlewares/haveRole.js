module.exports = (role) => (req, res, next) => {
  if (role === 'admin') next();
  res.json({
    message: 'You are not authorized to perform this action',
  });
};
