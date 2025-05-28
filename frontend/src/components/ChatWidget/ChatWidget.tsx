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
  message?: string; // Sẽ là optional
  imageUrl?: string; // Thêm trường này
  messageType?: 'text' | 'image'; // Thêm trường này
  createdAt?: string; // Timestamp từ MongoDB
}

// Địa chỉ backend của bạn - Cần cập nhật cho đúng
const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production' 
                            ? 'YOUR_PRODUCTION_BACKEND_URL' // Ví dụ: https://api.yourdomain.com
                            : 'http://localhost:3000';     // Giả sử backend chạy ở port 3000

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(''); // Sẽ được dùng cho caption khi gửi ảnh sau
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  // State cho việc gửi ảnh
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Để vô hiệu hóa input/button khi tải

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref cho input file
  
  // Lấy user thực tế từ Zustand store
  const user = useUserStore((state) => state.user);

  const currentUserInfo = user ? { // Đổi tên biến để rõ ràng hơn
    id: user._id,
    name: user.name,
    role: 'user' as 'user' | 'admin', // User luôn có role 'user'
  } : null;
  // conversationId sẽ là userId của user, hoặc một ID duy nhất nếu user chưa login
  // Hiện tại, nếu user chưa login, widget sẽ không hiển thị (do check !user)
  // const conversationId = user ? user._id : ''; 

  // Lấy các giá trị cần thiết cho dependencies của useEffect
  const currentUserId = user?._id; // Đây cũng chính là conversationId cho user
  const currentUserIsAdmin = user?.isAdmin;

  useEffect(() => {
    // Nếu không có user ID (chưa login) hoặc user là admin, thì ngắt kết nối nếu có và thoát
    if (!currentUserId || currentUserIsAdmin) {
      if (socketRef.current) {
        console.log('UserChat: Disconnecting socket (no user/admin).');
        socketRef.current.disconnect();
        socketRef.current = null; // Quan trọng: đặt lại ref thành null để có thể tạo mới sau này
      }
      setMessages([]); // Xóa tin nhắn cũ nếu user logout/là admin
      return; // Không làm gì thêm
    }

    // Chỉ thiết lập socket nếu chưa có, hoặc đã bị ngắt kết nối
    if (!socketRef.current || !socketRef.current.connected) {
      // Nếu socket cũ tồn tại nhưng không connected, đảm bảo disconnect hẳn trước khi tạo mới
      if (socketRef.current && !socketRef.current.connected) {
        console.log('UserChat: Socket was disconnected, explicitly disconnecting before creating new one.');
        socketRef.current.disconnect();
      }

      console.log('UserChat: Attempting to create new socket instance.');
      socketRef.current = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('UserChat: Connected to Socket.IO server', socketRef.current?.id);
        if (currentUserId) { // currentUserId chắc chắn tồn tại ở đây
          socketRef.current?.emit('joinRoom', currentUserId);
          console.log(`UserChat: Emitted joinRoom for ${currentUserId}`);
        }
        // Nếu widget đang mở khi kết nối (hoặc mở lại), fetch lịch sử chat
        if (isOpen && currentUserId) {
            console.log('UserChat: Fetching chat history on connect (widget is open).')
            fetchChatHistory(currentUserId); 
        }
      });

      socketRef.current.on('newChatMessage', (newMessage: IChatMessage) => {
        console.log('UserChat: Received newChatMessage', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (!isOpen && newMessage.sender.role === 'admin') {
          setHasUnreadMessages(true);
        }
      });

      socketRef.current.on('chatMessageError', (error) => {
        console.error('UserChat: Chat message error:', error);
      });
    } 
    // Không cần `else` ở đây, vì nếu socket đã connect và user/room không đổi, không cần làm gì thêm
    // Việc fetch history khi mở widget đã được xử lý trong toggleChat

    // Cleanup function của useEffect
    return () => {
      // Logic cleanup này sẽ chạy khi dependencies thay đổi HOẶC component unmount.
      // Chúng ta chỉ muốn ngắt kết nối hoàn toàn khi user không còn hợp lệ (đã xử lý ở đầu effect)
      // hoặc khi component thực sự unmount (khó phân biệt rõ ràng ở đây nếu không có thêm state).
      // Hiện tại, việc ngắt kết nối chủ yếu dựa vào logic đầu effect khi user/admin status thay đổi.
      // Nếu muốn socket ngắt khi component unmount (ví dụ chuyển trang khác), logic sau có thể cần thiết:
      // if (socketRef.current) {
      //   console.log('UserChat: useEffect cleanup - Disconnecting socket on unmount/dep change');
      //   socketRef.current.disconnect();
      //   socketRef.current = null;
      // }
    };
  }, [currentUserId, currentUserIsAdmin, isOpen]); // Dependencies đã thay đổi

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!currentUserId || currentUserIsAdmin) return null;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset giá trị của input file
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // currentUserId được lấy từ user state ở trên, đảm bảo là ID của user hiện tại
    if (!socketRef.current || !currentUserInfo || !currentUserId ) return;

    if (isUploadingImage || (!message.trim() && !selectedImage)) {
      return;
    }

    if (selectedImage) {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        if (!base64Image) {
            console.error("UserChat: FileReader did not produce a base64 string.");
            alert("Lỗi khi đọc file ảnh. Vui lòng thử lại.");
            setIsUploadingImage(false);
            return;
        }
        try {
          console.log("UserChat: Sending image to backend...");
          // Log dữ liệu gửi đi để debug
          // console.log("UserChat: Payload:", JSON.stringify({ image: base64Image }).substring(0, 100)); 

          const uploadResponse = await fetch(SOCKET_SERVER_URL + '/api/upload/chat-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image }),
          });

          if (!uploadResponse.ok) {
            let errorData = { message: 'Lỗi không xác định từ server.' };
            try {
                errorData = await uploadResponse.json();
            } catch { // Bỏ qua tham số lỗi nếu không dùng
                console.error("UserChat: Could not parse error response from server", await uploadResponse.text());
            }
            console.error("UserChat: Error uploading image", uploadResponse.status, errorData);
            throw new Error(errorData.message || 'Lỗi khi tải ảnh lên.');
          }

          const { imageUrl } = await uploadResponse.json();

          const chatMessageData: Omit<IChatMessage, '_id' | 'createdAt'> = {
            conversationId: currentUserId, // Sử dụng currentUserId
            sender: {
              id: currentUserInfo.id,
              name: currentUserInfo.name,
              role: currentUserInfo.role,
            },
            message: message.trim() || undefined, 
            imageUrl,
            messageType: 'image',
          };
          socketRef.current?.emit('chatMessage', chatMessageData);
          
          setMessage('');
          handleRemoveImage(); 

        } catch (error) {
          console.error("UserChat: Lỗi khi gửi ảnh:", error);
          alert('Lỗi gửi ảnh: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.onerror = (error) => {
        console.error("UserChat: Lỗi đọc file:", error);
        alert('Không thể đọc file ảnh đã chọn.');
        setIsUploadingImage(false);
      };
    } else if (message.trim()) { 
      const chatMessageData: Omit<IChatMessage, '_id' | 'createdAt'> = {
        conversationId: currentUserId, // Sử dụng currentUserId
        sender: {
          id: currentUserInfo.id,
          name: currentUserInfo.name,
          role: currentUserInfo.role,
        },
        message: message.trim(),
        messageType: 'text',
      };
      socketRef.current?.emit('chatMessage', chatMessageData);
      setMessage('');
    }
  };

  const fetchChatHistory = async (convId: string) => { 
    if (!convId) return;
    console.log(`UserChat: Fetching chat history for ${convId}`);
    try {
      const res = await fetch(SOCKET_SERVER_URL + '/api/chat/' + convId);
      if (!res.ok) {
        console.error(`UserChat: Error fetching history - ${res.status}`);
        throw new Error('Lỗi khi lấy lịch sử chat');
      }
      const data: IChatMessage[] = await res.json();
      setMessages(data);
      console.log(`UserChat: Fetched ${data.length} messages.`);
    } catch (err) {
      console.error('UserChat: Failed to fetch chat history', err);
      setMessages([]); // Đặt lại messages nếu có lỗi để tránh hiển thị cũ
    }
  };

  const toggleChat = () => {
    const newIsOpenState = !isOpen;
    setIsOpen(newIsOpenState);
    if (newIsOpenState && currentUserId) { // currentUserId thay cho conversationId ở đây
      // Lịch sử chat sẽ được fetch bởi 'connect' event của socket nếu socket kết nối lại,
      // hoặc nếu nó đã kết nối và messages rỗng (xem trong useEffect của socket).
      // Tuy nhiên, để đảm bảo, có thể gọi fetch ở đây nếu messages đang rỗng.
      if (messages.length === 0) {
        console.log("UserChat: toggleChat - fetching history as messages are empty and widget is opening.");
        fetchChatHistory(currentUserId);
      }
      setHasUnreadMessages(false);
    }
  };

  return (
    <div className={'chat-widget-container ' + (isOpen ? 'open' : '')}>
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
                key={msg._id || ('user-msg-' + index)}
                className={'message-item ' + (msg.sender.role === currentUserInfo?.role ? 'sent' : 'received')}>
                
                {/* Không hiển thị tên người gửi nếu là currentUser gửi */} 
                {msg.sender.role !== currentUserInfo?.role && (
                    <span className="message-sender">{msg.sender.name}:</span>
                )}

                {msg.messageType === 'image' && msg.imageUrl ? (
                  <div className="chat-message-image-container"> {/* Thêm class để style sau */}
                    {msg.message && <p className="chat-image-caption">{msg.message}</p>} {/* Caption nếu có */}
                    <img src={msg.imageUrl} alt={msg.message || 'Hình ảnh chat'} className="chat-image-content" />
                  </div>
                ) : (
                  <span className="message-text">{msg.message}</span>
                )}

                {msg.createdAt && (
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-form">
            {imagePreview && (
              <div className="image-preview-container-user">
                <img src={imagePreview} alt="Xem trước" className="image-preview-user" />
                <button type="button" onClick={handleRemoveImage} className="remove-image-button-user" disabled={isUploadingImage}>×</button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="visually-hidden"
              aria-label="Tải ảnh lên"
              disabled={isUploadingImage}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="attach-button-user"
              disabled={isUploadingImage}
            >
              {/* Sử dụng icon SVG hoặc text. Ví dụ đơn giản: */}
              📎 
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedImage ? "Nhập caption (tùy chọn)..." : "Nhập tin nhắn..."}
              className="chat-input"
              disabled={isUploadingImage}
            />
            <button type="submit" className="send-button" disabled={isUploadingImage || (!message.trim() && !selectedImage)}>
              {isUploadingImage ? 'Đang gửi...' : 'Gửi'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 