import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './ChatWidget.css'; // Sẽ tạo file CSS này sau
import { useUserStore } from '@/store/userStore';

// Định nghĩa kiểu cho tin nhắn (nên đồng bộ với backend)
interface IChatMessage {
  _id?: string; // ID từ MongoDB
  conversationId: string;
  sender: {
    id?: string; // User ID hoặc null/undefined cho admin
    name: string;
    role: 'user' | 'admin';
  };
  message: string;
  createdAt?: string; // Timestamp từ MongoDB
}

// Địa chỉ backend của bạn - Cần cập nhật cho đúng
const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production' 
                            ? 'YOUR_PRODUCTION_BACKEND_URL' // Ví dụ: https://api.yourdomain.com
                            : 'http://localhost:3000';     // Giả sử backend chạy ở port 3000

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Lấy user thực tế từ Zustand store
  const user = useUserStore((state) => state.user);

  const currentUser = user ? {
    id: user._id,
    name: user.name,
    role: 'user' as 'user' | 'admin',
  } : null;
  const conversationId = user ? user._id : '';

  useEffect(() => {
    if (!user || user.isAdmin) return;
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server', socketRef.current?.id);
      if (conversationId) {
        socketRef.current?.emit('joinRoom', conversationId);
      }
    });
    socketRef.current.on('newChatMessage', (newMessage: IChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (!isOpen && newMessage.sender.role === 'admin') {
        setHasUnreadMessages(true);
      }
    });
    socketRef.current.on('chatMessageError', (error) => {
      console.error('Chat message error:', error);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!user || user.isAdmin) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socketRef.current && currentUser) {
      const chatMessageData: Omit<IChatMessage, '_id' | 'createdAt'> = {
        conversationId,
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
        },
        message: message.trim(),
      };
      socketRef.current.emit('chatMessage', chatMessageData);
      setMessage('');
    }
  };

  // Lấy lịch sử chat khi mở widget
  const fetchChatHistory = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/chat/${conversationId}`);
      if (!res.ok) throw new Error('Lỗi khi lấy lịch sử chat');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      // Khi mở widget, tải lịch sử chat
      fetchChatHistory(conversationId);
      setHasUnreadMessages(false);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chat-widget-container ${isOpen ? 'open' : ''}`}>
      {/* Nút toggle này sẽ được ẩn trên mobile khi chat window mở, theo logic CSS */}
      <button className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? 'Đóng Chat' : 'Chat với Admin'}
        {!isOpen && hasUnreadMessages && <span className="unread-indicator"></span>}
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Hỗ trợ trực tuyến</span>
            <button className="chat-close-button-header" onClick={toggleChat} title="Đóng chat">
              ×
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={msg._id || index} 
                className={`message-item ${msg.sender.role === currentUser!.role ? 'sent' : 'received'}`}>
                <span className="message-sender">{msg.sender.name}:</span>
                <span className="message-text">{msg.message}</span>
                {msg.createdAt && (
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="chat-input"
            />
            <button type="submit" className="send-button">Gửi</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 