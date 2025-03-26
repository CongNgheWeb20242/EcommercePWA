import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    
    // URL-friendly version của name (dùng trong SEO)
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    // Số lượng sản phẩm còn trong kho
    countInStock: { type: Number, required: true },
    rating: { type: Number, default: 0 }, // Không cần required, vì giá trị sẽ được cập nhật dần
    numReviews: { type: Number, default: 0 }, // Mặc định là 0 khi chưa có review
    
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
