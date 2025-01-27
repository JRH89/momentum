"use client";

import { useState, useEffect, useRef } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";

// Helper function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

const LiveChat = ({ userId, projectId, customerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatId = projectId; // Unique chat ID

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const chatRef = collection(db, "chats", chatId, "messages");

    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      loadedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []); // Removed unnecessary dependency: messages

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className=" sm:pr-5">
      <h1 className="text-2xl font-semibold mb-2 mt-4">Live Chat</h1>
      <div className="flex border-2 border-black flex-col h-[400px] w-full sm:w-1/2 rounded-lg shadow-md shadow-black">
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-2 rounded-t-lg bg-backgroundPrimary border-b-2 border-black"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #000000",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-3/4 ${
                message.userId === userId ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`p-3 rounded-lg border-2 border-black ${
                  message.userId === userId
                    ? "bg-green-100 ml-auto justify-end items-end w-full flex flex-col" // Confirm color for user's messages
                    : "bg-white"
                }`}
              >
                <p className="text-black font-medium">{message.text}</p>
                <p className="text-xs mt-1 text-black">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-white w-full rounded-b-lg flex items-center gap-3 mx-auto justify-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border-2 border-black rounded-lg text-lg font-medium 
                     focus:outline-none  focus:ring-offset-2"
            placeholder="Message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 border-2 border-black bg-confirm 
                     text-black font-bold flex text-lg  
                     duration-300
                     
                     shadow-md rounded-lg shadow-black
                     hover:shadow-lg hover:shadow-black"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
