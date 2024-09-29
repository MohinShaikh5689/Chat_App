import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        
    }
};

export default connectToMongoDB;