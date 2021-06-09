import express from 'express'

import {
  findAllUsers,
  findOneUSer,
  createUser,
  signInUser,
  updateUser,
  deleteUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', findAllUsers)
router.get('/:userId', findOneUSer)
router.post('/', createUser)
router.post('/signin', signInUser)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)

export default router
