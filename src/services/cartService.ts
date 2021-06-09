import { ProductDocument } from '../models/product'
import cartModel, { CartDocument } from '../models/cart'

type FindOneCart = (userId: string) => Promise<CartDocument>
type CreateCart = (
  userId: string,
  productId: string,
  qty: number
) => Promise<CartDocument>
type deleteFromCart = (
  userId: string,
  productId: string
) => Promise<CartDocument>
type deleteCart = (userId: string) => Promise<CartDocument | null>

const findOneCart: FindOneCart = async (userId: string) => {
  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate(
        'user items.product',
        '_id  email _id title variant.price image'
      )
      .exec()
    if (!cart) {
      throw new Error(`User cart ${userId} not found`)
    }
    return cart
  } catch (error) {
    throw new Error(error.message)
  }
}

const createCart: CreateCart = async (
  userId: string,
  productId: string,
  qty: number
) => {
  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate('user items.product', '_id email _id title variant.price image')
      .exec()
    if (!cart) {
      const newCart = new cartModel({
        user: userId,
        items: [
          {
            product: productId,
            qty: qty,
          },
        ],
      })
      return newCart.save()
    }

    const addedProduct = cart.items.find((item) => {
      return (item.product as ProductDocument)._id == productId
    })

    if (addedProduct) {
      addedProduct.qty += qty
      cart.items = [
        ...cart.items.filter(
          (item) => (item.product as ProductDocument)._id != productId
        ),
        addedProduct,
      ]

      return cart.save()
    }

    cart.items.push({ product: productId, qty: qty })

    return cart.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteFromCart = async (userId: string, productId: string) => {
  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate(
        'user items.product',
        '_id lastName email _id title variant.price'
      )
      .exec()

    if (!cart) {
      throw new Error(`User cart ${userId} not found`)
    }

    const existingProduct = cart.items.find((item) => {
      return (item.product as ProductDocument)._id == productId
    })

    if (existingProduct) {
      cart.items = [
        ...cart.items.filter(
          (item) => (item.product as ProductDocument)._id != productId
        ),
      ]

      return cart.save()
    } else {
      throw new Error(`Product ${productId} not found`)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteCart = (userId: string) => {
  return cartModel.deleteOne({ user: userId }).exec()
}

export default { findOneCart, createCart, deleteFromCart, deleteCart }
