import multer from 'multer'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: function (req: Request, file, callback) {
    callback(null, 'src/uploads/')
  },
  filename: function (req: Request, file, callback) {
    callback(null, new Date().toISOString() + file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
})

export const uploadImage = upload.single('image')
