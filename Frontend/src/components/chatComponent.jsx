import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../css/chat.css';
import axios from "axios";
import { io } from "socket.io-client"; // Import Socket.IO client

const Chat = () => {
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
  
    const userId = localStorage.getItem("userId");
    const data = localStorage.getItem("users");
    const users = JSON.parse(data);
    console.log(users);

    const socket = io("http://localhost:3000"); // Connect to the Socket.IO server


    // Fetch messages from the backend
    const fetchChatMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/chat/${id}`, {
                withCredentials: true
            });
            
            // Ensure the response data is an array before setting the state
            if (Array.isArray(response.data)) {
                setChatMessages(response.data);
            } else {
                console.error("Expected an array of messages, but received:", response.data);
                setChatMessages([]); // Set to empty array if the data is not an array
            }
          
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Initial fetching of chat messages
        fetchChatMessages();

        // Listen for incoming messages through Socket.IO
        socket.on('receiveMessage', (messageData) => {
            setChatMessages((prevMessages) => [...prevMessages, messageData]);
        });

        return () => {
            socket.disconnect(); // Disconnect from the socket when component unmounts
        };
    }, [id]);

    // Send message to the server and emit it through Socket.IO
    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/api/chat/${id}`, { message }, {
                withCredentials: true
            });
            socket.emit('sendMessage', response.data); // Emit message to Socket.IO
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div >
            <div >
                {users.map((user,index) => user._id === id &&
                    <div className="userDetail">
                        <img src={user.profilePicture} alt="profile" />
                        <h2 key={index}>{user.name}</h2>
                    </div>
                 )}
            </div>

            <div className="chat">
            <div className="chat-container">
                {chatMessages.map((msg) => (
                    <div key={msg._id} className={`message ${msg.senderId === userId ? 'my-message' : 'received-message'}`}>
                        <p>{msg.message}</p>
                    </div>
                ))}
            </div>
            <form className="chat-form" onSubmit={sendMessage}>
                <div className="input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                    />
                    <button type="submit" className="send-btn">&#10148;</button>
                </div>
            </form>
            </div>
            
        </div>
    );
};

export default Chat;
