exports.getMe = async (req, res) => {
  const user = req.user;
  res.json({ user });
};
