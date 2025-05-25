import cloudinary from './cloudinary.js';

export const uploadBase64Image = async (base64Data, folder = 'products') => {
  try {
    // Kiểm tra nếu dữ liệu đầu vào là URL (bắt đầu bằng http:// hoặc https://)
    if (typeof base64Data === 'string' && (base64Data.startsWith('http://') || base64Data.startsWith('https://'))) {
      console.log('Phát hiện URL ảnh, trả về trực tiếp:', base64Data);
      return base64Data; // Trả về URL trực tiếp nếu đã là URL
    }
    
    // Xử lý upload nếu là dữ liệu base64
    const res = await cloudinary.uploader.upload(base64Data, { folder });
    return res.secure_url;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    throw new Error('Image upload failed');
  }
};