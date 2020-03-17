process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const knex = require('../db/connection');

chai.use(chaiSorted);

describe('/api', () => {
  beforeEach(() => knex.seed.run());
  after(() => knex.destroy());
  it('ERROR:GET:404 returns an error message for route not found', () => {
    return request(app)
      .get('/not-a-route')
      .expect(404)
      .then(res => {
        expect(res.body.error).to.equal('page not found');
      });
  });
  describe('/topics', () => {
    it('GET:200 returns an object containing an array of all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an('array');
        });
    });
  });
  describe('/users/:username', () => {
    it('GET:200 returns an object of a particular user', () => {
      return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then(res => {
          expect(res.body.user).to.eql({
            username: 'rogersop',
            name: 'paul',
            avatar_url:
              'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
          });
        });
    });
    it('ERROR:GET:404 returns an error message for username not found', () => {
      return request(app)
        .get('/api/users/not-a-username')
        .expect(404)
        .then(res => {
          expect(res.body.error).to.equal('username not found');
        });
    });
  });
  describe('/articles/:article_id', () => {
    it('GET:200 returns an article object as specified by the article_id', () => {
      return request(app)
        .get('/api/articles/9')
        .expect(200)
        .then(res => {
          expect(res.body.article).to.eql({
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: new Date(533132514171).toISOString(),
            votes: 0,
            comment_count: 2
          });
        });
    });
    it("ERROR:GET:404 returns an error message for an article which doesn't exist", () => {
      return request(app)
        .get('/api/articles/0')
        .expect(404)
        .then(res => {
          expect(res.body.error).to.equal('article not found');
        });
    });
  });
});