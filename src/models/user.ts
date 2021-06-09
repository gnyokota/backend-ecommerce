import { Schema, Document, model } from 'mongoose'

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  isAdmin: boolean
}

const UserModel = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default model<UserDocument>('userModel', UserModel)
