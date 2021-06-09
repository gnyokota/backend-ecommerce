import request from 'supertest'

import app from '../../src/app'
import * as dbHelper from '../dbHelper'
import { UserDocument } from '../../src/models/user'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

const createUser = async (inputData?: Partial<UserDocument>) => {
  let user: Partial<UserDocument> = {
    firstName: 'user x',
    lastName: 'user x',
    email: 'userx@gmail.com',
    password: '1111111',
  }

  if (inputData) {
    user = { ...inputData }
  }
  return await request(app).post('/api/v1/users/').send(user)
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connectDb()
  })

  afterEach(async () => {
    await dbHelper.clearDb()
  })

  afterAll(async () => {
    await dbHelper.closeDb()
  })

  it('should create a new user', async () => {
    const res = await createUser()

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('should not create a user with wrong data', async () => {
    const res = await createUser({
      firstName: 'user x',
      lastName: 'user x',
      // email: 'userx@gmail.com',
      // password: '1111111',
      isAdmin: false,
    })

    expect(res.status).toBe(500)
  })

  it('should sign in the user and create a token', async () => {
    const res1 = await createUser()
    expect(res1.status).toBe(200)

    const signInData = {
      email: res1.body.email,
      password: '1111111',
    }

    const res = await request(app).post('/api/v1/users/signin').send(signInData)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.firstName).toBe('user x')
  })

  it('should not sign with the wrong data', async () => {
    const res1 = await createUser()
    expect(res1.status).toBe(200)

    const signInData = {
      email: res1.body.email,
      password: 'wrongdata',
    }

    const res = await request(app).post('/api/v1/users/signin').send(signInData)
    expect(res.status).toEqual(401)
  })

  it('should get back all users', async () => {
    const res1 = await createUser({
      firstName: 'user 1',
      lastName: 'user 1',
      email: 'user1@gmail.com',
      password: '1111111',
      isAdmin: false,
    })
    const res2 = await createUser({
      firstName: 'user 2',
      lastName: 'user 2',
      email: 'user2@gmail.com',
      password: '2222222',
      isAdmin: true,
    })

    const res = await request(app).get('/api/v1/users/')

    expect(res.body.length).toEqual(2)
    expect(res.body[0].email).toEqual(res1.body.email)
    expect(res.body[1].email).toEqual(res2.body.email)
  })

  it('should get back one user', async () => {
    const res1 = await createUser()
    expect(res1.status).toBe(200)

    const userId = res1.body._id
    const res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.body._id).toEqual(userId)
  })

  it('should not get back user with wrong id', async () => {
    const res = await request(app).get(`/api/v1/users/${nonExistingUserId}`)
    expect(res.status).toBe(404)
  })

  it('should update an existing user', async () => {
    const res1 = await createUser()
    expect(res1.status).toBe(200)

    const userId = res1.body.id
    const update = {
      firstName: 'user update',
      isAdmin: true,
    }

    const res = await request(app).put(`/api/v1/users/${userId}`).send(update)
    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('user update')
    expect(res.body.isAdmin).toEqual(true)
  })

  it('should delete an existing user', async () => {
    const res1 = await createUser()
    expect(res1.status).toBe(200)
    const userId = res1.body.id

    const res = await request(app).delete(`/api/v1/users/${userId}`)
    expect(res.status).toEqual(204)

    const resGet = await request(app).get(`/api/v1/users/${userId}`)
    expect(resGet.status).toEqual(404)
  })
})
