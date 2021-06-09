import { Request, Response, NextFunction } from 'express'

import productModel from '../models/product'
import { UserDocument } from '../models/user'
import productServices from '../services/productService'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

//GET all Request
export const findAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await productServices.findAllProducts())
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//Get one Request
export const findOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.productId
    res.json(await productServices.findOneProduct(id))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//POST Request
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body
    const imagePath = req.file.path

    const newProduct = new productModel({
      title: inputData.title,
      description: inputData.description,
      category: inputData.category,
      countInStock: +inputData.countInStock,
      variant: {
        ...inputData.variant,
        price: +inputData.price,
        color: inputData.color,
        size: inputData.size,
      },
      image: imagePath,
      generalRating: inputData.generalRating ? inputData.generalRating : 0,
      reviews: [],
    })

    res.json(await productServices.createProduct(newProduct))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//PUT Request Review
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body
    const id = req.params.productId
    res.json(await productServices.createReview(id, inputData))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new NotFoundError('Product not found', error))
    }
  }
}

//PUT request
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.productId
    const inputData = req.body
    res.json(await productServices.updateProduct(id, inputData))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//DELETE Requesst
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.productId
    res
      .status(204)
      .json({ deletedProduct: await productServices.deleteProduct(id) })
      .end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
