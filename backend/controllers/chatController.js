import ChatMessage from '../models/chatMessageModel.js';

export const getChatHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await ChatMessage.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử chat', error: error.message });
  }
};

export const getAllConversations = async (req, res) => {
  try {
    // Lấy tất cả conversationId duy nhất, kèm tin nhắn cuối cùng
    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: 1 } },
      { $group: { _id: '$conversationId', lastMessage: { $last: '$$ROOT' } } },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách cuộc trò chuyện', error: error.message });
  }
}; 