import mongoose from "mongoose"
import "dotenv/config"

mongoose.set("strictQuery", false); // Xoá dòng cảnh báo

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    } 
}