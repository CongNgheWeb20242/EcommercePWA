import express from "express";
import path from "path";
import 'dotenv/config'
import cors from "cors"
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";

import { connectDB } from "./lib/db.js";

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Connect Database
connectDB();

const app = express();

// Swagger API Docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cookieParser());
// Tăng giới hạn kích thước payload
app.use(express.json({ limit: '10mb' })); // Cho phép payload JSON tối đa 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Cho phép payload URL-encoded tối đa 10MB

// Cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRouter);

// Liên quan đến production (tạm thời chưa động đến)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs/`);
});
