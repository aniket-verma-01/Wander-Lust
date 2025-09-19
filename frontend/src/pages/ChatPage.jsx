import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../Socket";

export default function ChatPage() {
  const { authorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId || !authorId) {
    console.error("Missing userId or authorId");
    return;
  }

  // ✅ Ensure socket is connected
  if (!socket.connected) {
    socket.connect();
  }

  // ✅ Join only the logged-in user's own room
  socket.emit("joinRoom", { userId });

  // ✅ Fetch chat history from API
  fetch(`https://tripsage-backend.onrender.com/api/chat/${authorId}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) {
      setMessages(data);
    } else {
      setMessages([]); // prevent map error
    }
  })
  .catch(err => {
    console.error("Error fetching chat history:", err);
    setMessages([]);
  });

  return () => {
    socket.off("receiveMessage");
  };
}, [authorId]);


  const sendMessage = () => {
    const userId = localStorage.getItem("userId");
    const senderName = localStorage.getItem("name"); // Save name at login

    if (!input.trim()) return;

    socket.emit("sendMessage", {
      roomId: authorId,
      senderId: userId,
      receiverId: authorId,
      senderName,
      text: input
    });

    setMessages((prev) => [...prev, { text: input, senderName: senderName || "You" }]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Chat with Author</h2>
      <div className="bg-white p-4 rounded shadow w-full max-w-md h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.senderName || "Unknown"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full max-w-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border p-2 rounded-l"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
