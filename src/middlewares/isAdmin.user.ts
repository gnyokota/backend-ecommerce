import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import userModel from '../models/user'
import { UnauthorizedError } from '../helpers/apiError'

dotenv.config({ path: '.env' })

type User = {
  firstName: string
  email: string
  isAdmin: boolean
  token: string
}

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user information by id
    const user = await userModel.findOne({
      email: (req.user as User).email,
    })

    if (user?.isAdmin) {
      next()
    }
  } catch (err) {
    next(new UnauthorizedError('Invalid token', err))
  }
}
