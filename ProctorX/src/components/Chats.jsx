import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../styles/chats.css";

const socket = io("http://localhost:3000"); // Adjust backend URL if needed

const Chats = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("student")); // or "admin"
    setUser(storedUser);

    socket.on("chatMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      text: message,
      sender: user?.role || "student",
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Live Chat</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <b>{msg.sender.toUpperCase()}</b>: {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chats;