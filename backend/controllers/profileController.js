const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.userId }).populate('user', ['name', 'email']);
    
    if (!profile) {
      const user = await User.findById(req.user.userId);
      profile = new Profile({
        user: req.user.userId,
        name: user.name,
        email: user.email
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};