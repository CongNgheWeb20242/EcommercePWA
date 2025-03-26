import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
