import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum:['male','female']
    },  
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
} ,{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;