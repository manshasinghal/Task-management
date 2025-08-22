const User = require('../models/Users');


const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    console.log('fetched')
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const updateUser = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role || user.role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, updateUser, deleteUser };