import express from "express";
import path from "path";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Connect Database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/api/keys/paypal", (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID || "sb");
// });
// app.get("/api/keys/google", (req, res) => {
//   res.send({ key: process.env.GOOGLE_API_KEY || "" });
// });

app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Liên quan đến production
// Chưa test nhưng đoán khả năng cao ở đây sai
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
  );
}

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: err.message });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
