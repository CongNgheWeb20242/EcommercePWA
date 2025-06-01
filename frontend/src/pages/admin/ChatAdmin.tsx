import React, { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './ChatAdmin.css';
import { userStore } from '@/store/userStore';

interface IChatMessage {
  _id?: string;
  conversationId: string;
  sender: {
    id?: string;
    name: string;
    role: 'user' | 'admin';
  };
  message?: string; // Sẽ là optional nếu có ảnh
  imageUrl?: string; // URL của ảnh sau khi upload
  messageType?: 'text' | 'image'; // Phân biệt loại tin nhắn
  createdAt?: string;
}

interface IConversation {
  _id: string; // conversationId
  lastMessage: IChatMessage;
}

const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'YOUR_PRODUCTION_BACKEND_URL'
  : 'http://localhost:3000';

const API_BASE_URL = SOCKET_SERVER_URL;

const IMAGE_UPLOAD_ENDPOINT = `${API_BASE_URL}/api/upload/chat-image`;
const MAX_IMAGE_SIZE_MB = 2; // Giới hạn 2MB cho ảnh

const ChatAdmin: React.FC = () => {
  const user = userStore((state) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const previousSelectedConversationIdRef = useRef<string | null>(null);

  // State cho việc gửi ảnh
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.isAdmin) {
      console.log('ChatAdmin: Admin user detected, attempting to connect socket...');
      const newSocket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
        // auth: { token: user.token } // Nếu backend yêu cầu token để xác thực socket
      });

      newSocket.on('connect', () => {
        console.log('ChatAdmin: Socket connected successfully.', newSocket.id);
        setSocket(newSocket);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('ChatAdmin: Socket disconnected. Reason:', reason);
        setSocket(null);
      });

      newSocket.on('connect_error', (error) => {
        console.error('ChatAdmin: Socket connection error:', error);
        setSocket(null);
      });

      // Lắng nghe tin nhắn mới từ server
      newSocket.on('newChatMessage', (newMessage: IChatMessage) => {
        console.log('ChatAdmin: Received new chat message:', newMessage);

        // Cập nhật messages nếu tin nhắn thuộc về conversation đang chọn
        // Sử dụng callback form của setState để đảm bảo state messages là mới nhất
        if (newMessage.conversationId === previousSelectedConversationIdRef.current) { // So sánh với ref vì selectedConversationId có thể chưa cập nhật ngay
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        // Cập nhật lastMessage trong danh sách conversations
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv._id === newMessage.conversationId
              ? { ...conv, lastMessage: newMessage }
              : conv
          ).sort((a, b) => { // Sắp xếp lại để conv có tin nhắn mới nhất lên đầu (hoặc theo logic khác)
            // Ví dụ: sắp xếp theo thời gian của lastMessage
            const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return timeB - timeA; // Mới nhất lên đầu
          })
        );

        // TODO: Xử lý unread messages count nếu cần
      });

      // Cleanup khi component unmount hoặc user thay đổi
      return () => {
        console.log('ChatAdmin: Cleaning up socket connection and listeners.');
        newSocket.off('newChatMessage'); // Gỡ listener khi cleanup
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      // Nếu không phải admin, đảm bảo socket đã ngắt (nếu có từ trước)
      if (socket) {
        console.log('ChatAdmin: User is not admin, disconnecting existing socket.');
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]); // Chạy lại khi user thay đổi (ví dụ: login/logout)

  useEffect(() => {
    if (user?.isAdmin && socket?.connected) {
      const fetchConversations = async () => {
        try {
          console.log('ChatAdmin: Fetching conversations...');
          const response = await fetch(`${API_BASE_URL}/api/chat`);
          if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.statusText}`);
          }
          let data: IConversation[] = await response.json();
          // Sắp xếp conversations ban đầu theo lastMessage.createdAt
          data = data.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return timeB - timeA; // Mới nhất lên đầu
          });
          console.log('ChatAdmin: Conversations fetched:', data);
          setConversations(data);
        } catch (error) {
          console.error(error);
          setConversations([]);
        }
      };
      fetchConversations();
    }
  }, [user?.isAdmin, socket]);

  useEffect(() => {
    if (!selectedConversationId || !socket?.connected || !user?.isAdmin) {
      if (!selectedConversationId) {
        setMessages([]);
      }
      return;
    }

    const fetchHistoryAndJoinRoom = async () => {
      try {
        console.log(`ChatAdmin: Fetching history for ${selectedConversationId}`);
        const response = await fetch(`${API_BASE_URL}/api/chat/${selectedConversationId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chat history: ${response.statusText}`);
        }
        const historyMessages: IChatMessage[] = await response.json();
        console.log('ChatAdmin: History fetched:', historyMessages);
        setMessages(historyMessages);
      } catch (error) {
        console.error(error);
        setMessages([]);
      }
    };

    fetchHistoryAndJoinRoom();

    if (previousSelectedConversationIdRef.current && previousSelectedConversationIdRef.current !== selectedConversationId) {
      console.log(`ChatAdmin: Leaving room ${previousSelectedConversationIdRef.current}`);
      socket.emit('leaveRoom', previousSelectedConversationIdRef.current);
    }

    console.log(`ChatAdmin: Joining room ${selectedConversationId}`);
    socket.emit('joinRoom', selectedConversationId);
    previousSelectedConversationIdRef.current = selectedConversationId;

    return () => {
      if (socket?.connected && selectedConversationId) {
        console.log(`ChatAdmin: Leaving room ${selectedConversationId} on cleanup`);
        socket.emit('leaveRoom', selectedConversationId);
      }
    };
  }, [selectedConversationId, socket, user?.isAdmin]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn một file ảnh (JPEG, PNG, GIF).');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        alert(`Kích thước ảnh không được vượt quá ${MAX_IMAGE_SIZE_MB}MB.`);
        return;
      }
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Không reset inputText ở đây để user có thể nhập caption
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file để có thể chọn lại cùng file
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImageFile) || !selectedConversationId || !user || !socket || !socket.connected || isUploadingImage) {
      return;
    }

    setIsUploadingImage(true);

    try {
      let messageToSend: Omit<IChatMessage, '_id' | 'createdAt'>;

      if (selectedImageFile) {
        const base64ImageData = imagePreviewUrl;

        if (!base64ImageData) {
          throw new Error("Không thể đọc dữ liệu ảnh.");
        }

        const uploadResponse = await fetch(IMAGE_UPLOAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64ImageData }),
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({ message: 'Lỗi không xác định khi upload ảnh.' }));
          throw new Error(errorData.message || 'Upload ảnh thất bại.');
        }
        const { imageUrl } = await uploadResponse.json();
        messageToSend = {
          conversationId: selectedConversationId,
          sender: { id: user._id, name: user.name, role: 'admin' },
          message: inputText.trim() || undefined,
          imageUrl,
          messageType: 'image',
        };
      } else {
        messageToSend = {
          conversationId: selectedConversationId,
          sender: { id: user._id, name: user.name, role: 'admin' },
          message: inputText.trim(),
          messageType: 'text',
        };
      }

      socket.emit('chatMessage', messageToSend);
      // Không thêm tin nhắn vào state messages ngay, đợi server gửi lại qua socket để nhất quán
      setInputText('');
      removeSelectedImage(); // Xóa ảnh đã chọn và preview sau khi gửi

    } catch (error) {
      console.error('ChatAdmin: Error sending message:', error);
      alert('Lỗi gửi tin nhắn: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!user || !user.isAdmin) {
    return <div className="chat-admin-no-access">Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.</div>;
  }

  if (!isOpen) {
    return (
      <button
        className="chat-admin-toggle-button"
        onClick={() => setIsOpen(true)}
      >
        Hỗ trợ Chat (Admin)
      </button>
    );
  }

  return (
    <div className="chat-admin-panel">
      <div className="chat-admin-header">
        <span>Hỗ trợ Khách hàng</span>
        <button onClick={() => setIsOpen(false)} className="chat-admin-close-button">×</button>
      </div>
      <div className="chat-admin-content">
        <div className="chat-admin-conversation-list">
          <h3 className="conversation-list-header">Cuộc trò chuyện</h3>
          {conversations.length === 0 && <p>Chưa có cuộc trò chuyện nào.</p>}
          {conversations.map((conv) => (
            <div
              key={conv._id}
              className={`conversation-item ${selectedConversationId === conv._id ? 'selected' : ''}`}
              onClick={() => setSelectedConversationId(conv._id)}
            >
              <div>ID: {conv._id}</div>
              {conv.lastMessage && (
                <div className="conversation-last-message">
                  <strong>{conv.lastMessage.sender.name}:</strong>
                  {conv.lastMessage.messageType === 'image' && conv.lastMessage.imageUrl ? '[Hình ảnh]' : conv.lastMessage.message}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-area">
          <div className="chat-area-header">
            {selectedConversationId ? (
              <span>Chat với: {selectedConversationId}</span>
            ) : (
              <span>Chọn một cuộc trò chuyện</span>
            )}
          </div>
          <div className="chat-area-messages">
            {selectedConversationId && messages.length === 0 && <p>Chưa có tin nhắn nào cho cuộc trò chuyện này.</p>}
            {!selectedConversationId && <p>Vui lòng chọn một cuộc trò chuyện để xem tin nhắn.</p>}
            {messages.map((msg, index) => (
              <div key={msg._id || `msg-${index}`} className={`message-item ${msg.sender.role === 'admin' ? 'sent' : 'received'}`}>
                <div className="message-sender">{msg.sender.name}</div>
                {msg.messageType === 'image' && msg.imageUrl ? (
                  <div className="chat-message-image-container">
                    {msg.message && <p className="chat-image-caption">{msg.message}</p>}
                    <img src={msg.imageUrl} alt={msg.message || 'Hình ảnh chat'} className="chat-image-content" />
                  </div>
                ) : (
                  <div className="message-text">{msg.message}</div>
                )}
                {msg.createdAt && <div className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {selectedConversationId && (
            <div className="chat-area-input-wrapper">
              {imagePreviewUrl && (
                <div className="chat-image-upload-preview">
                  <img src={imagePreviewUrl} alt="Preview" />
                  <button onClick={removeSelectedImage} className="remove-preview-button">×</button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="chat-area-input-form">
                <button type="button" onClick={triggerFileInput} className="chat-admin-attach-button" disabled={isUploadingImage}>
                  {/* Thay bằng icon SVG hoặc font icon nếu muốn */}
                  📎
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageFileChange}
                  disabled={isUploadingImage}
                  aria-label="Chọn ảnh để gửi"
                />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedImageFile ? 'Nhập caption cho ảnh (tùy chọn)...' : "Nhập tin nhắn..."}
                  disabled={!socket || !socket.connected || isUploadingImage}
                  className="chat-input-text-field"
                />
                <button
                  type="submit"
                  className="chat-admin-send-button"
                  disabled={(!inputText.trim() && !selectedImageFile) || !socket || !socket.connected || isUploadingImage}
                >
                  {isUploadingImage ? 'Đang gửi...' : 'Gửi'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin; 