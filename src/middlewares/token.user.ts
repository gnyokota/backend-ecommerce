import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { UserDocument } from '../models/user'

dotenv.config({ path: '.env' })

export const getToken = (user: Partial<UserDocument>) => {
  return jwt.sign(
    {
      firstName: user.firstName,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '30d',
    }
  )
}
