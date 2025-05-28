import { uploadBase64Image } from '../lib/uploadImage.js';

export const handleChatImageUpload = async (req, res) => {
  const { image, folder } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Không có dữ liệu ảnh (image) được cung cấp.' });
  }

  try {
    // Sử dụng hàm uploadBase64Image đã có
    // folder có thể được gửi từ frontend hoặc đặt mặc định ở đây, ví dụ: 'chat_images'
    const imageUrl = await uploadBase64Image(image, folder || 'chat_images');
    
    if (!imageUrl) { // Trường hợp uploadBase64Image trả về undefined/null do lỗi không bắt được bên trong
        throw new Error('URL ảnh không được trả về từ dịch vụ upload.');
    }

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Lỗi khi xử lý upload ảnh chat:', error);
    // Trả về lỗi chi tiết hơn nếu có thể, hoặc một thông báo chung
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định từ server khi upload ảnh.';
    res.status(500).json({ message: 'Upload ảnh thất bại.', error: errorMessage });
  }
}; 