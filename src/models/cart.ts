import { Schema, Document, model } from 'mongoose'
import { ProductDocument } from './product'
import { UserDocument } from './user'

type Item = {
  product: ProductDocument | string
  qty: number
}

export interface CartDocument extends Document {
  user: UserDocument | string
  items: Item[]
}

const CartModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'userModel', required: true },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'productModel',
        required: true,
      },
      qty: { type: Number, default: 1 },
    },
  ],
})

export default model<CartDocument>('cartModel', CartModel)
