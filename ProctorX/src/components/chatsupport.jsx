import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const Chatsupport = ({ isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (messageData) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && messageData.testid === user.testid) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });
  
    socket.on("chatHistory", (history) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const filteredHistory = history.filter(msg => msg.testid === user.testid);
        setMessages(filteredHistory);
      }
    });
  
    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
    };
  }, []);
  

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
  
    const messageData = {
      testid: user.testid, // Ensure testid is included
      sender: isAdmin ? "Admin" : user.emailid,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
  
    socket.emit("sendMessage", messageData);
    setNewMessage(""); // Clear input
  };
  

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h3>Chat Support</h3>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === "Admin" ? "admin-msg" : "student-msg"}
            >
              <strong>{msg.sender}:</strong> {msg.text}
              
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatsupport;