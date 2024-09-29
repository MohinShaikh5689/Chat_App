import React from "react";
import Sidebar from "../components/sidebar";
import Chat from "../components/chatComponent";
import '../css/chat.css'

const ChatPage = () => {
    return (
        <div className="chat-page">
        <Sidebar />
        <Chat />
        </div>
    );
}

export default ChatPage;