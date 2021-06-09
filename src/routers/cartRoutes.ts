import express from 'express'

import {
  findOneCart,
  createCart,
  deleteFromCart,
  deleteCart,
} from '../controllers/cart'

const router = express.Router()

// Every path we define here will get /api/v1/cart prefix

router.get('/:userId', findOneCart)
router.post('/:userId', createCart)
router.put('/:userId/:productId', deleteFromCart)
router.delete('/:userId', deleteCart)

export default router
