import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongoServer = new MongoMemoryServer()

export const connectDb = async () => {
  const uri = await mongoServer.getUri()

  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(uri, mongooseOptions)
}

export const closeDb = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
}

export const clearDb = async () => {
  const myCollections = mongoose.connection.collections

  for (const key in myCollections) {
    const collection = myCollections[key]
    await collection.deleteMany({})
  }
}
