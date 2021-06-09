import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '../helpers/apiError'

dotenv.config({ path: '.env' })

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.header('Authorization')
    const token = authorization?.split(' ')[1]

    if (!token) {
      return res.status(400).json({ msg: 'Invalid Authentication' })
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        next(new UnauthorizedError('Invalid token', err))
      }
      req.user = user
      next()
    })
  } catch (err) {
    next(new UnauthorizedError('No token', err))
  }
}
