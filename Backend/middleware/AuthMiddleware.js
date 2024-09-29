import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();

}catch(error){
    console.error(error);
    res.status(500).json({message: "Server Error"});
};

};