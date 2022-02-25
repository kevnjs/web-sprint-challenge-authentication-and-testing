// Write your tests here
const jokes = require('./jokes/jokes-data')
const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server')


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})


test('sanity', () => {
  expect(true).toBe(true)
})

describe('check environment', () => {
  test('process env is === testing', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})

describe('Jokes data exists', () => {
  test('Jokes data object has data', () => {
    expect(jokes).toHaveLength(3)
    expect(jokes).toEqual(expect.arrayContaining([...jokes]))
  })
})


describe('New user is registered', () => {
  test('User is created', async () => {
    let [id] = await db('users').insert({username: 'admin', password: 'admin'})
    const result = await db('users').where({ id })
    expect(result).toEqual([{id: id, username: 'admin', password: 'admin'}])
    expect(await db('users')).toHaveLength(1)
  })
})

describe('Jokes GET with token', () => {
  test('Login with tokens and receive jokes', async () => {
    const result = await request(server).post('/api/auth/login', {username: 'kevin', password: '1234'})
    expect(result).toBe('kev')
  })
})



describe('Jokes does not GET without token', () => {
  test('Sending request without token gets error', async () => {
    const result = await request(server).get('/api/jokes')
    expect(result.headers.authorization).toBeUndefined()
    expect(result.body).toEqual({message: 'token required'})
  })
})



