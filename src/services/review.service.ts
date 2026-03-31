import mongoose from 'mongoose'
import { ProductModel } from '../models/product'
import { ReviewModel } from '../models/review'

export async function createReview(
  userId: mongoose.Types.ObjectId,
  productId: string,
  rating: number,
  comment: string
) {
  const product = await ProductModel.findById(productId)
  if (!product) {
    throw new Error('Product not found')
  }

  const review = await ReviewModel.create({
    user: userId,
    product: productId,
    rating,
    comment
  })

  const newCount = product.ratingsCount + 1
  const newAvg =
    newCount === 0 ? rating : (product.ratingsAverage * product.ratingsCount + rating) / newCount

  await ProductModel.findByIdAndUpdate(productId, {
    $push: { reviews: review._id },
    ratingsAverage: newAvg,
    ratingsCount: newCount
  })

  return ReviewModel.findById(review._id).populate('user', 'name email')
}

export async function listReviewsForProduct(productId: string) {
  return ReviewModel.find({ product: productId, isApproved: true })
    .sort({ createdAt: -1 })
    .populate('user', 'name')
}
