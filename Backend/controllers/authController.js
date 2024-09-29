import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";


export const SignUp = async (req , res) =>{
    const {name , email, password,confirmPassword, gender} = req.body;

    try {
        
        if(password !== confirmPassword){
            return res.status(400).json({message: "Password do not match"});
        }

        const existingUser = await User.findOne({email});

        if (existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if (user){
            generateToken(user._id,res);

            res.status(201).json(user);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

export const LogIn = async (req , res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    
    try{
        
        if(!user){
            return res.status(401).json({message: "Invalid user or password"});
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        
        
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid user or password"});
        }

        generateToken(user._id,res);
        
    
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: req.cookies.jwt
        });

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
    
};

export const getProfile = async (req , res) =>{
    const user = req.user;
    res.status(200).json(user);
};

export const updateProfile = async (req , res) =>{
    const user = req.user;
    const {name, email, profilePicture} = req.body;
    const updatedUser = await User.findByIdAndUpdate(user._id, {name, email, profilePicture}, {new: true});
    res.status(200).json(updatedUser);
};


export const getUsers = async (req, res) => {
    const currUser = req.user;
    try {
        const users = await User.find({ _id: { $ne: currUser._id } });
        res.json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserByName = async (req, res) => {
    const { name } = req.params;

    try {
        // Create a regular expression for case-insensitive search
        const regex = new RegExp(name, 'i'); // 'i' for case-insensitivity
        const users = await User.find({ name: regex }); // Find all users matching the regex

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(users); // Return the list of matching users
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
