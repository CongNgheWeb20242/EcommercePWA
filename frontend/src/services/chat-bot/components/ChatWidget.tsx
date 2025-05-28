import React, { useState, useEffect, useRef } from 'react';
import { askChatbot } from '@/utils/chatbot';
import chatBotIcon from '../chat-bot.png';

type Message = {
  type: 'user' | 'bot';
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const toggleWidget = () => setOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { type: 'user', content: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askChatbot(currentInput);
      const cleanedRes = res
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();
      setMessages((prev) => [...prev, { type: 'bot', content: cleanedRes }]);
    } catch (error) {
      console.error('Error calling askChatbot:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: '<p class="text-red-500">Không thể kết nối AI.</p>' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Nút bật/tắt */}
      <button
        onClick={toggleWidget}
        className="fixed bottom-6 right-6 bg-blue-200 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-500 transition flex items-center justify-center text-2xl z-50 cursor-pointer"
      >
        <img src={chatBotIcon} alt="Chat-bot icon" className="w-8 h-8" />
      </button>

      {/* Widget */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden z-40">
          {/* Header */}
          <div className="bg-blue-500 text-white px-4 py-2 font-semibold text-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={chatBotIcon} alt="Bot" className="w-5 h-5" />
              Ecommerce - Trợ lý AI bán hàng
            </div>
            <button onClick={toggleWidget} className="text-white hover:text-gray-200 text-lg">x</button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 text-sm">
            {/* Tin nhắn chào mặc định */}
            <div className="flex justify-start">
              <div className="max-w-[90%] px-4 py-2 rounded-xl break-words overflow-x-auto bg-white text-gray-800 rounded-bl-none shadow">
                Xin chào, tôi có thể giúp gì cho bạn?
              </div>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] px-4 py-2 rounded-xl break-words overflow-x-auto ${msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow'
                    }`}
                  style={{ wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))}

            {loading && <div className="text-gray-400">Đang trả lời...</div>}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="w-full border rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập câu hỏi..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );

}