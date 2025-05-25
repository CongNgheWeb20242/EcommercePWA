import { GoogleGenAI } from '@google/genai';
import Product from '../models/productModel.js';
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function askQuestion(question) {
  console.log('\n=== New Chat Question ===');
  console.log('Question:', question);

  try {
    if (!GEMINI_API_KEY) {
      console.error('❌ ERROR: GEMINI_API_KEY is not configured');
      throw new Error('AI API key not configured');
    }

    console.log('📦 Fetching products from database...');
    const products = await Product.find({});
    console.log(`✅ Found ${products.length} products`);

    const productHTML = products
      .map(
        (product) => `
          <div style="
            border: 1px solid #ddd;
            padding: 16px;
            margin-bottom: 16px;
            margin-top: 16px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            gap: 16px;
            background-color: #ffffff;
            transition: transform 0.2s ease;
          ">
            <div>
              <img
                src="${product.image}"
                alt="${product.name}"
                style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc;"
              />
            </div>
            <div>
              <h3 style="font-size: 16px; margin: 0 0 6px 0; color: #222;">${product.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">
                <strong>Giá:</strong> ${product.price.toLocaleString()} VNĐ
              </p>
              <a
                href="http://localhost:5173/user/product/${product._id}"
                target="_blank"
                style="font-size: 14px; text-decoration: underline; color: #007bff;"
              >Xem sản phẩm</a>
            </div>
          </div>
        `
      )
      .join('');

    const lowerCaseQuestion = question.trim().toLowerCase();
    const greetings = [
      'hello',
      'hi',
      'xin chào',
      'chào',
      'chào bạn',
    ];

    if (greetings.some((greet) => lowerCaseQuestion.includes(greet))) {
      return `
    <p>Xin chào! 👋</p>
    <p>Tôi là trợ lý của <strong>EcommerPWA</strong>!</p>
    <p>Tôi có thể hỗ trợ gì cho bạn hôm nay?</p>
  `;
    }

    const prompt = `
      Bạn là một trợ lý bán hàng chuyên nghiệp, thân thiện và nói tiếng Việt.
      Bạn có thể trả lời những câu hỏi chung như "Xin chào", "Bạn là ai", hoặc cung cấp thông tin về các sản phẩm dưới đây nếu liên quan.
      
      Dưới đây là danh sách sản phẩm (hiển thị dạng HTML):
      
      ${productHTML}
      
      Câu hỏi của khách hàng: "${question}"

      Phản hồi ngắn gọn, thân thiện, có thể sử dụng HTML nếu cần để trình bày sản phẩm đẹp và dễ hiểu.
      Nếu khách hỏi chào, giới thiệu bản thân hoặc hỏi chức năng thì trả lời tương ứng.
      `;

    console.log('🤖 Sending request to Gemini AI...');
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    if (!result || !result.candidates || !result.candidates.length) {
      console.error('❌ ERROR: Invalid response from Gemini AI:', result);
      throw new Error('Invalid AI response');
    }

    console.log('✅ Got response from AI');
    const answer =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Không có phản hồi từ AI.';
    return answer.replace(/(\n|\r)/g, ' ').trim();
  } catch (error) {
    console.error('\n❌ ERROR in askQuestion:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return `<p style="color: red;">Xin lỗi, hiện tại tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau!</p>`;
  }
}

// Export the function for use in routes
export { askQuestion };
