import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import { aiService } from "../services/aiService";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the RoadSOS Assistant. Ask me about road safety, emergencies, first aid, or how to use the app.",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    const updatedHistory = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    setMessages(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const res = await aiService.chat(text, updatedHistory);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res.data.reply ||
            "Sorry, I couldn't process that.",
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to connect right now. If this is an emergency, trigger the SOS button immediately.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-xl flex items-center justify-center text-white transition-all"
        >
          <MessageCircle size={30} />
        </button>
      )}

      {/* Chat Window */}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[95vw]">

          <Card className="overflow-hidden shadow-2xl">

            {/* Header */}

            <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center">

              <div className="flex items-center gap-2">

                <Bot size={20} />

                <div>
                  <h3 className="font-semibold">
                    RoadSOS Assistant
                  </h3>

                  <p className="text-xs opacity-80">
                    AI Emergency Helper
                  </p>
                </div>

              </div>

              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>

            </div>

            {/* Messages */}

            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-red-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">

                      {msg.role === "assistant" ? (
                        <Bot size={14} />
                      ) : (
                        <User size={14} />
                      )}

                      <span className="font-semibold text-xs">
                        {msg.role === "assistant"
                          ? "Assistant"
                          : "You"}
                      </span>

                    </div>

                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-sm text-gray-500">
                  Assistant is typing...
                </div>
              )}

              <div ref={bottomRef} />

            </div>

            {/* Input */}

            <div className="border-t p-3 flex gap-2">

              <input
                type="text"
                placeholder="Ask something..."
                className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <Button
                variant="danger"
                onClick={sendMessage}
                disabled={loading}
              >
                <Send size={16} />
              </Button>

            </div>

          </Card>

        </div>
      )}
    </>
  );
};

export default ChatWidget;