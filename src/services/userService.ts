import bcrypt from 'bcrypt'
import { getToken } from '../middlewares/token.user'
import UserModel, { UserDocument } from '../models/user'

type UserToken = Partial<UserDocument> & {
  token: string
}
type FindAllType = () => Promise<UserDocument[]>
type FindOneUser = (userId: string) => Promise<UserDocument>
type CreateUserType = (user: UserDocument) => Promise<UserToken>
type signInUserType = (email: string, password: string) => Promise<UserToken>
type UpdateUserType = (
  userId: string,
  inputData: Partial<UserDocument>
) => Promise<UserDocument>
type DeleteUserType = (userId: string) => Promise<UserDocument | null>

const findAllUsers: FindAllType = () => {
  return UserModel.find().exec()
}

const findOneUser: FindOneUser = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId).exec()
    // .exec() will return a true Promise

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }
    return user
  } catch (error) {
    throw new Error(error.message)
  }
}

const createUser: CreateUserType = async (user: UserDocument) => {
  const newUser = await user.save()

  const finalUser = {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: getToken(newUser),
  }

  return finalUser
}

const signInUser: signInUserType = async (email: string, password: string) => {
  try {
    const signedUser = await UserModel.findOne({
      email: email,
    })

    if (signedUser && bcrypt.compareSync(password, signedUser.password)) {
      const userData = {
        id: signedUser._id,
        firstName: signedUser.firstName,
        email: signedUser.email,
        isAdmin: signedUser.isAdmin,
        token: getToken(signedUser),
      }
      return userData
    } else {
      throw new Error('Invalid email or password!')
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateUser: UpdateUserType = async (
  userId: string,
  inputData: Partial<UserDocument>
) => {
  try {
    const user = await UserModel.findById(userId).exec()

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }
    if (inputData.firstName) {
      user.firstName = inputData.firstName
    }
    if (inputData.lastName) {
      user.lastName = inputData.lastName
    }
    if (inputData.email) {
      user.email = inputData.email
    }
    if (inputData.password) {
      user.password = inputData.password
    }

    if (
      Boolean(inputData.isAdmin) === true ||
      Boolean(inputData.isAdmin) === false
    ) {
      user.isAdmin = Boolean(inputData.isAdmin)
    }

    return user.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteUser: DeleteUserType = (userId: string) => {
  return UserModel.findByIdAndDelete(userId).exec()
}

export default {
  findAllUsers,
  findOneUser,
  createUser,
  signInUser,
  updateUser,
  deleteUser,
}
