import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import userModel from '../models/user'
import userServices from '../services/userService'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from '../helpers/apiError'

//GET all Request
export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await userServices.findAllUsers())
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

//GET one Request
export const findOneUSer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id: string = req.params.userId
    res.json(await userServices.findOneUser(id))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

//POST Request
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, isAdmin } = req.body
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
      isAdmin,
    })

    res.json(await userServices.createUser(user))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//POST Sign in Request

export const signInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    res.json(await userServices.signInUser(email, password))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new UnauthorizedError('Invalid email or password!', error))
    }
  }
}

//PUT Request
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body
    const id = req.params.userId

    res.json(await userServices.updateUser(id, inputData))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

//DELETE Request
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.userId
    res
      .status(204)
      .json({ deletedUser: await userServices.deleteUser(id) })
      .end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
