import User from '../models/userModel.js';

export const getUsers = async (req, res) => {
    const currUser = req.user;
    try {
        const users = await User.find({ _id: { $ne: currUser._id } });
        res.json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

