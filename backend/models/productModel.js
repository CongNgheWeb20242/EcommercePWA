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

    size: [{ type: String }],
    color: [{ type: String }],

    // relations
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    averageRating: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

productSchema.statics.updateAverageRating = async function (productId) {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$productId', avg: { $avg: '$rating' } } }
  ]);
  const avg = result[0]?.avg || 0;
  // Only update if changed
  await this.updateOne(
    { _id: productId, averageRating: { $ne: avg } },
    { $set: { averageRating: avg } }
  );
  return avg;
}

const Product = mongoose.model('Product', productSchema);
export default Product;
