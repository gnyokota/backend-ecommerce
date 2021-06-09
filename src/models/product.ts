import { Schema, Document, model } from 'mongoose'

export interface ReviewDocument extends Document {
  name: string
  rating: number
  comment: string
}

export interface ProductDocument extends Document {
  title: string
  description: string
  category: string
  countInStock: number
  variant: {
    price: number
    color: string
    size: string
  }
  image: string
  generalRating: number
  reviews: ReviewDocument[]
}

const ProductModel = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    default: 0,
    required: true,
  },
  variant: {
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  image: {
    type: String,
  },
  generalRating: {
    type: Number,
    default: 0,
    required: true,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        required: true,
      },
    },
  ],
})

export default model<ProductDocument>('productModel', ProductModel)
