import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String, // Hoặc mongoose.Schema.Types.ObjectId nếu bạn muốn tham chiếu đến một model Conversation riêng
      required: true,
      index: true, // Để truy vấn nhanh hơn theo conversationId
    },
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến User model cho người dùng
        // Có thể là null hoặc một giá trị đặc biệt nếu người gửi là admin và không có trong User model
      },
      name: { type: String, required: true }, // Tên hiển thị (ví dụ: tên user hoặc "Admin")
      role: { type: String, enum: ['user', 'admin'], required: true },
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    // Bạn có thể thêm các trường khác như isRead, etc.
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage; 