import React, { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUserStore } from '@/store/userStore';
import './ChatAdmin.css';

interface IChatMessage {
  _id?: string;
  conversationId: string;
  sender: {
    id?: string;
    name: string;
    role: 'user' | 'admin';
  };
  message: string;
  createdAt?: string;
}

interface IConversation {
  _id: string; // conversationId
  lastMessage: IChatMessage;
}

const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'YOUR_PRODUCTION_BACKEND_URL'
  : 'http://localhost:3000';

const ChatAdmin: React.FC = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState<{ [key: string]: boolean }>({});
  const [hasGlobalUnread, setHasGlobalUnread] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const user = useUserStore((state) => state.user);
  const previousConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch('/api/chat');
      const data = await res.json();
      setConversations(data);
    };
    if (user?.isAdmin) {
        fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!selectedConversation?._id) return;
    const fetchHistory = async () => {
      const res = await fetch(`/api/chat/${selectedConversation._id}`);
      const data = await res.json();
      setMessages(data);
      setUnread((prev) => ({ ...prev, [selectedConversation._id]: false }));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    fetchHistory();
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    socketRef.current = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('Admin connected to Socket.IO server');
      if (selectedConversation?._id) {
        socketRef.current?.emit('joinRoom', selectedConversation._id);
        previousConversationIdRef.current = selectedConversation._id;
      }
    });

    socketRef.current.on('newChatMessage', (newMessage: IChatMessage) => {
      console.log('Admin received newChatMessage:', newMessage, 'Current selected:', selectedConversation?._id, 'Is panel open:', isOpen);
      
      // Logic cập nhật unread cho từng conversation
      if (newMessage.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, newMessage]);
        setUnread((prev) => ({ ...prev, [newMessage.conversationId]: false }));
      } else {
        setUnread((prev) => ({ ...prev, [newMessage.conversationId]: true }));
      }

      // Logic cập nhật hasGlobalUnread
      // Dấu đỏ chỉ nên xuất hiện khi tin nhắn MỚI NHẤT là từ USER và panel ĐANG ĐÓNG
      if (newMessage.sender.role === 'user' && !isOpen) {
        console.log('Triggering global unread for admin panel');
        setHasGlobalUnread(true);
      }
  
      // Logic cập nhật và sắp xếp lại danh sách conversations
      setConversations((prevConversations) => {
        const existingConvIndex = prevConversations.findIndex(c => c._id === newMessage.conversationId);
        let updatedConversations;
        if (existingConvIndex !== -1) {
          const conversationToUpdate = { ...prevConversations[existingConvIndex], lastMessage: newMessage };
          updatedConversations = [
            conversationToUpdate,
            ...prevConversations.slice(0, existingConvIndex),
            ...prevConversations.slice(existingConvIndex + 1)
          ];
        } else {
          updatedConversations = [
            { _id: newMessage.conversationId, lastMessage: newMessage },
            ...prevConversations
          ];
          // Nếu là cuộc trò chuyện mới, cũng cần set unread cho nó nếu không phải là cuộc trò chuyện đang xem
          if (newMessage.conversationId !== selectedConversation?._id) {
            setUnread((prev) => ({ ...prev, [newMessage.conversationId]: true }));
          }
        }
        return updatedConversations;
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Admin disconnected from Socket.IO server');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Admin socket connection error:', err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, isOpen]);

  useEffect(() => {
    if (!socketRef.current || !socketRef.current.connected) return;

    const currentConvId = selectedConversation?._id;
    const previousConvId = previousConversationIdRef.current;

    if (previousConvId && previousConvId !== currentConvId) {
      socketRef.current.emit('leaveRoom', previousConvId);
      console.log(`Admin left room: ${previousConvId}`);
    }

    if (currentConvId && currentConvId !== previousConvId) {
      socketRef.current.emit('joinRoom', currentConvId);
      console.log(`Admin joined room: ${currentConvId}`);
      previousConversationIdRef.current = currentConvId;
      setUnread((prev) => ({ ...prev, [currentConvId]: false }));
    } else if (!currentConvId && previousConvId) {
      socketRef.current.emit('leaveRoom', previousConvId);
      console.log(`Admin left room: ${previousConvId} (no conversation selected)`);
      previousConversationIdRef.current = null;
    }

  }, [selectedConversation, setUnread]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && selectedConversation && messages.length > 0) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isOpen, selectedConversation, messages]);

  if (!user || !user.isAdmin) return <div className="chat-admin-no-access">Bạn không có quyền truy cập trang này.</div>;

  if (!isOpen) {
    return (
      <button
        className="chat-admin-toggle-button"
        onClick={() => {
          setIsOpen(true);
          setHasGlobalUnread(false);
        }}
      >
        Chat hỗ trợ
        {!isOpen && hasGlobalUnread && 
          <span className="unread-indicator"></span>}
      </button>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation || !user) return;
    const chatMessageData: Omit<IChatMessage, '_id' | 'createdAt'> = {
      conversationId: selectedConversation._id,
      sender: {
        name: user.name,
        role: 'admin',
      },
      message: message.trim(),
    };
    socketRef.current?.emit('chatMessage', chatMessageData);
    setMessage('');
  };

  return (
    <div className="chat-admin-panel">
      {/* Header */}
      <div className="chat-admin-header">
        <span className="chat-admin-header-title">Hỗ trợ khách hàng</span>
        <button
          onClick={() => setIsOpen(false)}
          className="chat-admin-close-button"
          title="Đóng chat"
        >
          ×
        </button>
      </div>
      <div className="chat-admin-content">
        {/* Danh sách user đã chat */}
        <div className="chat-admin-conversation-list">
          <h3 className="conversation-list-header">Khách</h3>
          {conversations.length === 0 && <div className="chat-admin-no-conversations">Chưa có cuộc trò chuyện nào.</div>}
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => {
                setSelectedConversation(conv);
                setUnread((prev) => ({ ...prev, [conv._id]: false }));
              }}
              className={`conversation-item ${selectedConversation?._id === conv._id ? 'selected' : ''}`.trim()}
            >
              <div className="conversation-item-details">
                <span className={`conversation-id ${unread[conv._id] ? 'unread' : ''}`.trim()}>
                  {conv._id}
                </span>
                {unread[conv._id] && (
                  <span className="conversation-unread-badge"></span>
                )}
              </div>
              <div className={`conversation-last-message ${unread[conv._id] ? 'unread' : ''}`.trim()}>
                {conv.lastMessage?.sender?.name}: {conv.lastMessage?.message}
              </div>
            </div>
          ))}
        </div>
        {/* Khung chat */}
        <div className="chat-area">
          <div className="chat-area-header">
            {selectedConversation ? (
              <>
                Chat với user: <span className="user-id">{selectedConversation._id}</span>
              </>
            ) : (
              <span className="chat-admin-select-conversation">Chọn một khách hàng để xem và trả lời tin nhắn</span>
            )}
          </div>
          <div className="chat-area-messages">
            {selectedConversation ? (
              messages.length === 0 ? (
                <div className="chat-admin-no-conversations">Chưa có tin nhắn nào.</div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg._id || idx}
                    className={`chat-area-message-item ${msg.sender.role === 'admin' ? 'sent' : 'received'}`}
                  >
                    <span className={`message-sender-name ${msg.sender.role === 'admin' ? 'admin-sent' : ''}`.trim()}>{msg.sender.name}:</span>
                    <span className="message-text-content">{msg.message}</span>
                    {msg.createdAt && (
                      <span className="message-timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                ))
              )
            ) : null}
            <div ref={messagesEndRef} />
          </div>
          {selectedConversation && (
            <form onSubmit={handleSendMessage} className="chat-area-input-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="chat-area-input"
              />
              <button type="submit" className="chat-area-send-button">
                Gửi
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin; 