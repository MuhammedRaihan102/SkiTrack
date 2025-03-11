const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.userId })
            .populate('relatedSkill', 'name');
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGoal = async (req, res) => {
    try {
        const goal = new Goal({
            ...req.body,
            user: req.user.userId
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true }
        );
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};