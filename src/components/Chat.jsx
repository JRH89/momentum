"use client";

import { useState, useEffect, useRef } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";

// Helper function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LiveChat = ({ userId, projectId, customerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatId = projectId; // Unique chat ID

  const messagesContainerRef = useRef(null); // Ref for the messages container

  useEffect(() => {
    const chatRef = collection(db, "chats", chatId, "messages");

    // Real-time listener for messages
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort messages by timestamp in ascending order
      loadedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(loadedMessages);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [chatId]);

  useEffect(() => {
    // Scroll to the bottom of the messages container whenever the messages are updated
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageRef = doc(collection(db, "chats", chatId, "messages"));
    await setDoc(messageRef, {
      text: newMessage,
      userId,
      timestamp: new Date().toISOString(),
    });

    setNewMessage("");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2 mt-4">Live Chat</h1>
      <div className="flex border-2 border-black flex-col h-[400px] w-full sm:w-1/2 rounded-lg shadow-lg">
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 rounded-t-lg overflow-y-auto scrollbar-thin scrollbar-thumb-backgroundSecondary scrollbar-track-gray-200 p-4 space-y-2 bg-gray-100"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 mx-auto rounded-lg text-sm w-full flex ${
                message.userId === userId
                  ? "self-end bg-white text-black justify-end"
                  : "self-start bg-gray-200 justify-start"
              }`}
            >
              <div>
                {message.text}
                <div className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(message.timestamp)} {/* Display Timestamp */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-white border-t-2 border-black rounded-b-lg flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border-black px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 border-2 border-black bg-confirm shadow-md shadow-black text-black font-medium hover:shadow-lg hover:shadow-black rounded-lg duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default LiveChat;
