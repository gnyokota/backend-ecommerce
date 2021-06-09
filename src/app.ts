import express from 'express'
import cors from 'cors'

import apiErrorHandler from './middlewares/apiErrorHandler'
import userRoutes from './routers/userRoutes'
import productRoutes from './routers/productRoutes'
import cartRoutes from './routers/cartRoutes'

const app = express()

const PORT = process.env.PORT
// Express configuration
app.set('port', PORT || 3000)

// Use common 3rd-party middlewares
app.use(express.json())
app.use('/src/uploads', express.static('src/uploads'))
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Use user router
app.use('/api/v1/users', userRoutes)

// Use product router
app.use('/api/v1/products', productRoutes)

// Use product router
app.use('/api/v1/cart', cartRoutes)

// Custom API error handler
app.use(apiErrorHandler)

//check if the server is running:
app.get('/', (req, res) => {
  res.send('Server is running properly ✌️')
})

export default app
