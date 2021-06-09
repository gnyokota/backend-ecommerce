import { Request, Response, NextFunction } from 'express'

import cartServices from '../services/cartService'

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

export const findOneCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    res.json(await cartServices.findOneCart(userId))
  } catch (error) {
    next(new NotFoundError('Cart not found', error))
  }
}

export const createCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, qty } = req.body
    const userId = req.params.userId

    res.json(await cartServices.createCart(userId, productId, qty))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//DELETE Products Requesst
export const deleteFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, productId } = req.params
    res.json(await cartServices.deleteFromCart(userId, productId))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//DELETE Requesst
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    res
      .status(204)
      .json({ deletedCart: await cartServices.deleteCart(userId) })
      .end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
