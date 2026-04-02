import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const ChatBox = ({ disputeId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/chat/${disputeId}/messages`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [disputeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await API.post(`/chat/${disputeId}/messages`, { message: text.trim() });
      setText("");
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const roleBubbleColor = (role, isSelf) => {
    if (role === "MODERATOR") return "bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 text-purple-900 dark:text-purple-200";
    if (isSelf) return "bg-blue-600 text-white";
    return "bg-slate-100 dark:bg-[#1a2744] text-slate-800 dark:text-slate-200";
  };

  const roleNameColor = (role) => {
    if (role === "BUYER") return "text-blue-600 dark:text-blue-400";
    if (role === "SELLER") return "text-emerald-600 dark:text-emerald-400";
    if (role === "MODERATOR") return "text-purple-600 dark:text-purple-400";
    return "text-slate-500 dark:text-slate-400";
  };

  return (
    <div className="flex flex-col h-[400px] rounded-xl bg-white dark:bg-[#152039] border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none overflow-hidden transition-colors duration-300">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-[#0f1729]">
        {messages.length === 0 && (
          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-10">No messages yet</p>
        )}
        {messages.map((msg) => {
          const isSelf = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
              <span className={`text-xs font-medium mb-1 ${roleNameColor(msg.sender.role)}`}>
                {msg.sender.name}
                {msg.sender.role === "MODERATOR" && " ⚖️"}
              </span>
              <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${roleBubbleColor(msg.sender.role, isSelf)}`}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#152039] flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#0f1729] border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
