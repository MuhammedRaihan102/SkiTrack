const Skill = require('../models/Skill');

exports.createSkill = async (req, res) => {
  try {
    const { name, description, proficiency } = req.body;
    const skill = new Skill({
      user: req.user.userId,
      name,
      description,
      proficiency
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.userId });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { name, description, proficiency } = req.body;
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, description, proficiency },
      { new: true }
    );
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};