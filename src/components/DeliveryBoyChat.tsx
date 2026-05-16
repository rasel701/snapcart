"use client";
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Loader, Send, Sparkle } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface props {
  orderId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId | undefined | string;
  role: string | undefined;
}

const DeliveryBoyChat = ({ orderId, senderId, role }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { userData } = useSelector((state: RootState) => state.user);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-message-room", orderId);
    socket.on("send-message", (message) => {
      console.log("socke Message", message);
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("send-message");
    };
  }, [orderId]);

  const sendMessage = async () => {
    const socket = getSocket();
    const message = {
      senderId: senderId,
      text: newMessage,
      roomId: orderId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);

    setNewMessage("");
  };

  useEffect(() => {
    const getAllMessage = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        setMessages(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessage();
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiSuggest = async () => {
    console.log("Hello");
    let lastMsg = "";
    if (role === "delivery") {
      const deliveryMsg = messages.filter(
        (item) => item.senderId === userData?._id,
      );
      lastMsg = deliveryMsg[deliveryMsg.length - 1].text;
    }

    if (role === "user") {
      const userMsg = messages.filter(
        (item) => item.senderId === userData?._id,
      );
      lastMsg = userMsg[userMsg.length - 1].text;
    }
    setIsGenerating(true);
    console.log("current text: ", lastMsg);
    try {
      const res = await axios.post("/api/chat/ai-suggestions", {
        message: lastMsg,
        role: role,
      });
      const result = res.data.data.split(",");
      setSuggestions([...result]);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700 text-sm">
          Quick Replies
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={isGenerating}
          className="px-3 py-1 text-sm flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200"
          onClick={handleAiSuggest}
        >
          <Sparkle />
          {isGenerating ? <Loader className="animate-spin" /> : " AI Suggest"}
        </motion.button>
      </div>

      <div className="flex gap-2 flex-wrap mb-2 ">
        {suggestions.map((s, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.9 }}
            className="px-3 py-1 text-xs bg-green-100 border-green-200 text-shadow-green-700 cursor-pointer"
            onClick={() => setNewMessage(s)}
          >
            {s}
          </motion.div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3" ref={chatBoxRef}>
        <AnimatePresence>
          {messages?.map((msg) => (
            <motion.div
              key={msg._id.toString()}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.senderId === senderId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${msg.senderId === senderId ? "bg-green-600 text-white rounded-l-lg rounded-tr-xl px-3" : "bg-gray-100 text-gray-800 rounded-bl-none px-3 rounded-sm"}`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          value={newMessage}
          placeholder="Type a Message..."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white cursor-pointer"
          onClick={sendMessage}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryBoyChat;
