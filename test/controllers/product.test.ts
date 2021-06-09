import request from 'supertest'

import app from '../../src/app'
import * as dbHelper from '../dbHelper'
import { ReviewDocument } from '../../src/models/product'
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
  reviews: ReviewDocument[]
  image?: string
}

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

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
    .attach(
      'image',
      '/Users/Giovana/Documents/Bootcamp/Integrify-code/ft7-fullstack-assignment/backend/src/uploads/2021-05-24T11:35:47.172Z61pHAEJ4NML._AC_UX679_.jpg'
    )
    .set('Authorization', `Bearer ${token}`)
}

describe('product controller', () => {
  let token: string

  beforeEach(async () => {
    await dbHelper.connectDb()

    const user = await createUser()
    token = user.token
  })

  afterEach(async () => {
    await dbHelper.clearDb()
  })

  afterAll(async () => {
    await dbHelper.closeDb()
  })

  test('should create a new product', async () => {
    const res = await createProduct(token)
    expect(res.status).toBe(200)

    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('product x')
  })

  test('should create a review and add it to product', async () => {
    const res1 = await createProduct(token)
    expect(res1.status).toBe(200)
    const productId = res1.body._id

    const review = {
      name: 'user 1',
      comment: 'review user',
      rating: 5,
    }

    const res = await request(app)
      .put(`/api/v1/products/review/${productId}`)
      .send(review)
    expect(res.status).toBe(200)
    expect(res.body.generalRating).toBeGreaterThan(0)
    expect(res.body.reviews.length).toEqual(1)
  })

  test('should not create a review with the wrong data', async () => {
    const res1 = await createProduct(token)
    expect(res1.status).toBe(200)

    const productId = res1.body._id

    const review = {
      //   name: 'user 1',
      //   comment: 'review user',
      rating: 10,
    }

    const res = await request(app)
      .put(`/api/v1/products/review/${productId}`)
      .send(review)
    expect(res.status).toBe(400)
  })

  test('should get back all products', async () => {
    const res1 = await createProduct(token)
    expect(res1.status).toBe(200)

    const res2 = await createProduct(token, {
      title: 'product 2',
      description: 'description of product 2',
      category: 'category 2',
      countInStock: 2,
      price: 2,
      color: 'white',
      size: 'small',
      generalRating: 0,
    })

    expect(res2.status).toBe(200)

    const res = await request(app).get('/api/v1/products/')

    expect(res.body.length).toEqual(2)
    expect(res.body[0]._id).toEqual(res1.body._id)
    expect(res.body[1]._id).toEqual(res2.body._id)
  })

  test('should get back one product', async () => {
    const res1 = await createProduct(token)
    expect(res1.status).toBe(200)

    const productId = res1.body._id
    const res = await request(app).get(`/api/v1/products/${productId}`)
    expect(res.body._id).toBe(productId)
  })

  test('should not get back product with wrong id', async () => {
    const res = await request(app).get(
      `/api/v1/products/${nonExistingProductId}`
    )
    expect(res.status).toBe(404)
  })

  test('should update an existing product', async () => {
    const res1 = await createProduct(token)
    expect(res1.status).toBe(200)

    const productId = res1.body._id

    const update = {
      title: 'product update',
      description: 'description of product 2',
      category: 'category 2',
      countInStock: 2,
      price: 2,
      generalRating: 0,
    }

    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .send(update)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.title).toEqual('product update')
    expect(res.body.countInStock).toEqual(2)
  })

  test('should delete an existing product', async () => {
    const res1 = await createProduct(token)
    expect(res1.status).toBe(200)

    const productId = res1.body._id

    const res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const resGet = await request(app).get(`/api/v1/products/${productId}`)
    expect(resGet.status).toBe(404)
  })
})
