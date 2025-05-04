import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // properties
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    isVisible: { type: Boolean, default: true }, // Whether the product is visible to customers

    // relations
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
