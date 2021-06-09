import express from 'express'

import {
  findAllProducts,
  findOneProduct,
  createProduct,
  createReview,
  updateProduct,
  deleteProduct,
} from '../controllers/product'
import { isAuthenticated } from '../middlewares/isAuthenticated.user'
import { isAdmin } from '../middlewares/isAdmin.user'
import { uploadImage } from '../middlewares/multer.product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAllProducts)
router.get('/:productId', findOneProduct)
router.post('/', isAuthenticated, isAdmin, uploadImage, createProduct)
router.put('/review/:productId', createReview)
router.put('/:productId', isAuthenticated, isAdmin, updateProduct)
router.delete('/:productId', isAuthenticated, isAdmin, deleteProduct)

export default router
