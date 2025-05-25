import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import passport from 'passport';
import { fileURLToPath } from 'url';
import orderReportRoutes from './routes/orderReportRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Import http and Socket.IO Server
import http from 'http';
import { Server } from 'socket.io';

// Import ChatMessage model
import ChatMessage from './models/chatMessageModel.js';

// Custom middlewares & config
import { devLogger } from './middlewares/morganLogger.js';
import { connectDB } from './lib/db.js';
import './lib/passport.js';
import { baseUrl } from './lib/utils.js';

// Routes
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Config
dotenv.config();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect Database
await connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['http://localhost:5173', 'https://your-fe-domain.com'] // Nhớ cập nhật domain frontend của bạn
        : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Swagger API Docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(passport.initialize());
app.use(cookieParser());
app.use(devLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* Do đã deploy tách biệt fe - be nên không cần: host riêng 

// Serve frontend in production
// if (NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/frontend/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
//   );
// }

*/

// CORS - Cho phép FE gọi API từ cả local + hosting
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['http://localhost:5173', 'https://your-fe-domain.com']
        : 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderReportRoutes);
app.use('/api/chat', chatRoutes);

app.use('/', (req, res) => {
  res.send(
    `Hello from ${process.env.NODE_ENV} mode, Server running at ${baseUrl()}`
  );
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Lắng nghe sự kiện 'joinRoom' để user tham gia vào phòng chat riêng với admin
  // conversationId có thể là userId của user
  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room ${conversationId}`);
  });

  // Lắng nghe sự kiện 'disconnect'
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Ví dụ: Lắng nghe một sự kiện tên là 'chatMessage' từ client
  socket.on('chatMessage', async (data) => {
    console.log('Message from client ' + socket.id + ':', data);
    try {
      // Giả sử client gửi object data có dạng: 
      // { conversationId: 'someUserId', sender: { id: 'userId', name: 'UserName', role: 'user' }, message: 'Hello' }
      // Hoặc { conversationId: 'someUserId', sender: { name: 'Admin', role: 'admin' }, message: 'Hi user' }
      
      const newMessage = new ChatMessage({
        conversationId: data.conversationId,
        sender: {
          id: data.sender.id, // Sẽ là undefined nếu admin gửi và admin không có id user
          name: data.sender.name, 
          role: data.sender.role,
        },
        message: data.message,
      });

      const savedMessage = await newMessage.save();
      console.log('Message saved to DB:', savedMessage);

      // Gửi tin nhắn đã lưu (với _id và timestamps) tới phòng chat cụ thể
      // Hoặc có thể io.emit nếu muốn gửi global, nhưng gửi vào room sẽ hiệu quả hơn
      io.to(savedMessage.conversationId).emit('newChatMessage', savedMessage);

    } catch (error) {
      console.error('Error saving chat message:', error);
      // Có thể gửi thông báo lỗi về cho client nếu cần
      socket.emit('chatMessageError', { message: 'Could not save message', error: error.message });
    }
  });

  // Các xử lý sự kiện khác của Socket.IO sẽ ở đây
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Docs: ${baseUrl()}/api-docs`);
});