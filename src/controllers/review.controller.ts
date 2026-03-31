import { NextFunction, Response } from 'express'
import { createReview, listReviewsForProduct } from '../services/review.service'

export const createReviewController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { productId, rating, comment } = req.body
    if (!productId || rating == null || !comment) {
      res.status(400)
      throw new Error('productId, rating, and comment are required')
    }
    const r = Number(rating)
    if (Number.isNaN(r) || r < 1 || r > 5) {
      res.status(400)
      throw new Error('rating must be between 1 and 5')
    }
    const result = await createReview(req.user._id, String(productId), r, String(comment))
    res.status(201).json(result)
  } catch (e) {
    next(e)
  }
}

export const listReviewsController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params
    const result = await listReviewsForProduct(productId)
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
}
