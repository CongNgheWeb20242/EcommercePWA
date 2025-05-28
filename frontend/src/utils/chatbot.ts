import { axiosInstance } from '@/config/axios';

export async function askChatbot(question: string): Promise<string> {
  try {
    const response = await axiosInstance.post('/ai/ask', { question });
    return response.data.answer;
  } catch (error) {
    console.error('askChatbot: Error during API call:', error);
    throw new Error('Server AI lỗi');
  }
}