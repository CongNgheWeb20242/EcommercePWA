import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import passport from 'passport';
import { fileURLToPath } from 'url';

// Custom middlewares & config
import { devLogger } from './middlewares/morganLogger.js';
import { connectDB } from './lib/db.js';
import './lib/passport.js';

// Routes
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Config
dotenv.config();
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';

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

// Serve frontend in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
  );
}

// CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRoutes);

// Start HTTP Server (no HTTPS)
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs/`);
});