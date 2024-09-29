import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const {message} = req.body;
        const receiverId = req.params.receiverId;


        let conversationRoom = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });


        if (!conversationRoom) {
            conversationRoom = await Conversation.create({
                members: [senderId, receiverId]
            });
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        conversationRoom.messages.push(newMessage._id);
        await conversationRoom.save();

        res.status(200).json(newMessage);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const getConversation = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;

        const conversationRoom = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversationRoom) {
            return res.status(200).json({ messages: [] });
        }


        res.status(200).json(conversationRoom.messages);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
     }
};