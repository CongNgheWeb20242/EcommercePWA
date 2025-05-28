import mongoose from 'mongoose';
import Product from './productModel.js';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

// Auto-update averageRating after save
reviewSchema.post('save', async function () {
  await Product.updateAverageRating(this.productId);
});

// Auto-update averageRating after remove
reviewSchema.post('remove', async function () {
  await Product.updateAverageRating(this.productId);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;