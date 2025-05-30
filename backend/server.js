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

// Custom middlewares & config
import { devLogger } from './middlewares/morganLogger.js';
import { connectDB } from './lib/db.js';
import './lib/passport.js';
import { baseUrl } from './lib/utils.js';
import { askQuestion } from "./lib/chatbot.js"

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

// Swagger API Docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(passport.initialize());
app.use(cookieParser());
app.use(devLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS - Cho phép FE gọi API từ cả local + hosting
app.use(
  cors({
    origin: true,
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

app.post('/api/ai/ask', async (req, res) => {
  console.log('Received AI request:', req.body);
  const { question } = req.body;
  
  if (!question) {
    console.error('No question provided in request');
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    console.log('Processing question:', question);
    const answer = await askQuestion(question);
    console.log('Got answer from AI:', answer);
    res.json({ answer });
  } catch (error) {
    console.error('Error in /api/ai/ask:', error);
    res.status(500).json({ error: 'Lỗi AI' });
  }
});

app.use('/', (req, res) => {
  res.send(
    `Hello from ${process.env.NODE_ENV} mode, Server running at ${baseUrl()}`
  );
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Docs: ${baseUrl()}/api-docs`);
});
