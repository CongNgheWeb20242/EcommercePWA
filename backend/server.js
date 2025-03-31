import express from "express";
import path from "path";
import 'dotenv/config'
import cors from "cors"
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

const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Test connect
app.get("/api/user", (req, res) => {
  res.json({ name: "John Doe", email: "john@example.com" });
})

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
