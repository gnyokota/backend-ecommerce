import request from 'supertest'

import app from '../../src/app'
import * as dbHelper from '../dbHelper'
import { UserDocument } from '../../src/models/user'

interface ProductDocumentTest extends Document {
  title: string
  description: string
  category: string
  countInStock: number
  price: number
  color: string
  size: string
  generalRating: number
  qty: number
}

type InputData = {
  productId: string
  quantity: number
}

const createUser = async (inputData?: Partial<UserDocument>) => {
  let user: Partial<UserDocument> = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@gmail.com',
    password: 'abcd',
    isAdmin: true,
  }
  if (inputData) {
    user = { ...user, ...inputData }
  }
  return request(app)
    .post('/api/v1/users')
    .send(user)
    .then((res) => res.body)
}

const createProduct = async (
  token: string,
  inputData?: Partial<ProductDocumentTest>
) => {
  let product: Partial<ProductDocumentTest> = {
    title: 'product x',
    description: 'description of product x',
    category: 'category x',
    countInStock: 10,
    price: 100,
    color: 'black',
    size: 'large',
    generalRating: 0,
    qty: 2,
  }

  if (inputData) {
    product = { ...inputData }
  }

  return request(app)
    .post('/api/v1/products')
    .set('Content-Type', 'multipart/form-data')
    .field('title', product.title as string)
    .field('description', product.description as string)
    .field('category', product.category as string)
    .field('countInStock', (product.countInStock as number).toString())
    .field('price', (product.price as number).toString())
    .field('color', product.color as string)
    .field('size', product.size as string)
    .field('generalRating', (product.generalRating as number).toString())
    .field('qty', (product.price as number).toString())
    .attach(
      'image',
      '/Users/Giovana/Documents/Bootcamp/Integrify-code/ft7-fullstack-assignment/backend/src/uploads/2021-05-24T11:35:47.172Z61pHAEJ4NML._AC_UX679_.jpg'
    )
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

const createCart = async (
  uid: string,
  id: string,
  inputData?: Partial<InputData>
) => {
  let cart: Partial<InputData> = {
    productId: id,
    quantity: 2,
  }

  if (inputData) {
    cart = { ...inputData }
  }

  return await request(app).post(`/api/v1/cart/${uid}`).send(cart)
}

describe('cart controller', () => {
  let uid: string
  let id: string
  let token: string

  beforeEach(async () => {
    await dbHelper.connectDb()
    const user = await createUser()
    uid = user.id
    token = user.token
    const resProd = await createProduct(token)
    id = resProd._id
  })

  afterEach(async () => {
    await dbHelper.clearDb()
  })

  afterAll(async () => {
    await dbHelper.closeDb()
  })

  it('should create a new cart', async () => {
    const res = await createCart(uid, id)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.items.length).toEqual(1)
  })

  it('should not create a cart with the wrong data', async () => {
    const res = await createCart(uid, 'soething')
    expect(res.status).toBe(400)
  })

  it('should get back the user cart', async () => {
    const res1 = await createCart(uid, id)
    expect(res1.status).toBe(200)

    const res = await request(app).get(`/api/v1/cart/${uid}`)
    expect(res.status).toBe(200)
  })

  it('should remove a product inside the cart', async () => {
    const res1 = await createCart(uid, id)
    expect(res1.status).toBe(200)

    const res = await request(app).put(`/api/v1/cart/${uid}/${id}`)
    expect(res.status).toEqual(200)
    expect(res.body.items.length).toEqual(0)
  })

  it('should delete the entire cart of the user', async () => {
    const res1 = await createCart(uid, id)
    expect(res1.status).toBe(200)

    const res = await request(app).delete(`/api/v1/cart/${uid}`)
    expect(res.status).toEqual(204)
    const resGet = await request(app).get(`/api/v1/cart/${uid}`)
    expect(resGet.status).toEqual(404)
  })
})
