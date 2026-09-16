const request = require('supertest')
const assert = require('node:assert')
const app = require('../src/app')
const db = require('../src/db')

describe('Web API with Express Tests', () => {
  // Reset database before each test to guarantee test isolation
  beforeEach(() => {
    db.reset()
  })

  describe('Part 1: Refactored routes from previous lab', () => {
    it('GET / should return 200 with API routes overview', async () => {
      const res = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)

      assert.strictEqual(res.body.message, 'Welcome to the Web API with Express')
      assert.ok(res.body.routes)
    })

    it('GET /hello should return anonymous greeting', async () => {
      const res = await request(app)
        .get('/hello')
        .expect(200)

      assert.strictEqual(res.text, 'Hello anonymous')
    })

    it('GET /hello?name=Alice should return personalized greeting with query param', async () => {
      const res = await request(app)
        .get('/hello?name=Alice')
        .expect(200)

      assert.strictEqual(res.text, 'Hello Alice')
    })

    it('GET /hello/Bob should return personalized greeting with route param', async () => {
      const res = await request(app)
        .get('/hello/Bob')
        .expect(200)

      assert.strictEqual(res.text, 'Hello Bob')
    })

    it('GET /hello?name=Yvan should return student presentation', async () => {
      const res = await request(app)
        .get('/hello?name=Yvan')
        .expect(200)

      assert.match(res.text, /Yvan Focsa/)
    })

    it('GET /about should return JSON content from content/about.json', async () => {
      const res = await request(app)
        .get('/about')
        .expect('Content-Type', /json/)
        .expect(200)

      assert.strictEqual(res.body.title, 'About')
      assert.strictEqual(res.body.author, 'Yvan Focsa')
    })

    it('GET /unknown-route should return 404', async () => {
      const res = await request(app)
        .get('/unknown-route')
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Endpoint not found')
    })
  })

  describe('Part 2: Articles API (/articles)', () => {
    it('GET /articles should list all articles', async () => {
      const res = await request(app)
        .get('/articles')
        .expect('Content-Type', /json/)
        .expect(200)

      assert(Array.isArray(res.body))
      assert.strictEqual(res.body.length, 1)
      assert.strictEqual(res.body[0].id, '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b')
      assert.strictEqual(res.body[0].title, 'My article')
    })

    it('GET /articles/:articleId should return an article by ID', async () => {
      const res = await request(app)
        .get('/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b')
        .expect('Content-Type', /json/)
        .expect(200)

      assert.strictEqual(res.body.id, '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b')
      assert.strictEqual(res.body.author, 'Liz Gringer')
    })

    it('GET /articles/:articleId should return 404 when article does not exist', async () => {
      const res = await request(app)
        .get('/articles/non-existent-id')
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Article not found')
    })

    it('POST /articles should create a new article with generated UUID and date', async () => {
      const newArticlePayload = {
        title: 'New Node.js Discoveries',
        content: 'Express makes building APIs intuitive.',
        author: 'John Doe'
      }

      const res = await request(app)
        .post('/articles')
        .send(newArticlePayload)
        .expect('Content-Type', /json/)
        .expect(201)

      assert.ok(res.body.id)
      assert.strictEqual(res.body.title, newArticlePayload.title)
      assert.strictEqual(res.body.content, newArticlePayload.content)
      assert.strictEqual(res.body.author, newArticlePayload.author)
      assert.ok(res.body.date)

      // Verify the article is persisted
      const listRes = await request(app).get('/articles').expect(200)
      assert.strictEqual(listRes.body.length, 2)
    })

    it('POST /articles should return 400 when required fields are missing', async () => {
      const invalidPayload = {
        title: 'Only title'
      }

      const res = await request(app)
        .post('/articles')
        .send(invalidPayload)
        .expect('Content-Type', /json/)
        .expect(400)

      assert.ok(res.body.error)
    })
  })

  describe('Part 2: Comments API (/articles/:articleId/comments)', () => {
    const validArticleId = '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b'
    const validCommentId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

    it('GET /articles/:articleId/comments should return all comments for an article', async () => {
      const res = await request(app)
        .get(`/articles/${validArticleId}/comments`)
        .expect('Content-Type', /json/)
        .expect(200)

      assert(Array.isArray(res.body))
      assert.strictEqual(res.body.length, 1)
      assert.strictEqual(res.body[0].id, validCommentId)
      assert.strictEqual(res.body[0].articleId, validArticleId)
    })

    it('GET /articles/:articleId/comments should return 404 if article does not exist', async () => {
      const res = await request(app)
        .get('/articles/unknown-article-id/comments')
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Article not found')
    })

    it('POST /articles/:articleId/comments should add a new comment with UUID and timestamp', async () => {
      const newCommentPayload = {
        content: 'Great article, thanks for sharing!',
        author: 'Alice Cooper'
      }

      const res = await request(app)
        .post(`/articles/${validArticleId}/comments`)
        .send(newCommentPayload)
        .expect('Content-Type', /json/)
        .expect(201)

      assert.ok(res.body.id)
      assert.ok(typeof res.body.timestamp === 'number')
      assert.strictEqual(res.body.articleId, validArticleId)
      assert.strictEqual(res.body.content, newCommentPayload.content)
      assert.strictEqual(res.body.author, newCommentPayload.author)

      // Verify the comment count increased
      const listRes = await request(app)
        .get(`/articles/${validArticleId}/comments`)
        .expect(200)
      assert.strictEqual(listRes.body.length, 2)
    })

    it('POST /articles/:articleId/comments should return 404 when target article does not exist', async () => {
      const res = await request(app)
        .post('/articles/invalid-article-id/comments')
        .send({ content: 'Nice', author: 'Bob' })
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Article not found')
    })

    it('POST /articles/:articleId/comments should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post(`/articles/${validArticleId}/comments`)
        .send({ author: 'Missing content' })
        .expect('Content-Type', /json/)
        .expect(400)

      assert.ok(res.body.error)
    })

    it('GET /articles/:articleId/comments/:commentId should return the specific comment', async () => {
      const res = await request(app)
        .get(`/articles/${validArticleId}/comments/${validCommentId}`)
        .expect('Content-Type', /json/)
        .expect(200)

      assert.strictEqual(res.body.id, validCommentId)
      assert.strictEqual(res.body.articleId, validArticleId)
      assert.strictEqual(res.body.author, 'Bob McLaren')
    })

    it('GET /articles/:articleId/comments/:commentId should return 404 for non-existent comment', async () => {
      const res = await request(app)
        .get(`/articles/${validArticleId}/comments/unknown-comment-id`)
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Comment not found')
    })

    it('GET /articles/:articleId/comments/:commentId should return 404 for non-existent article', async () => {
      const res = await request(app)
        .get(`/articles/unknown-article/comments/${validCommentId}`)
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Article not found')
    })
  })
})
