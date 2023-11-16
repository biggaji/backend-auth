import app from '../index.js';
import request from 'supertest';
import { expect } from 'chai';
import { InputValidationExpection } from '../utils/errors.js';

const createUserPayload = {
  firstName: 'Tobi',
  lastName: 'Ajibade',
  email: 'tobiajibade@gmail.com',
  role: 'cto',
  password: 'SimplePassword1?',
};

const loginPayload = {
  email: 'tobiajibade@gmail.com',
  password: 'SimplePassword1?',
};

const badLoginPayload = {
  email: 'tobiajibade@gmailcom',
  password: 'SimplePassword1?',
};

describe('Unit tests for user service', () => {
  // it('It should create a new user', async () => {
  //   const response = await request(app).post('/users').send(createUserPayload);

  //   expect(response.status).to.equal(201);
  //   expect(response.body).to.have.property('user');
  //   expect(response.body).to.have.property('message');
  //   expect(response.body.user).to.have.property('_id');
  //   expect(response.body.user).to.not.have.property('password');
  //   expect(response.body).to.have.property('message', 'Account created');
  // });

  it('It should authenticate the user', async () => {
    const response = await request(app)
      .post('/users/authenticate')
      .send(loginPayload);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('accessToken');
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('message', 'Login successful');
  });

  it('It should authenticate the user and have a accessToken returned', async () => {
    const response = await request(app)
      .post('/users/authenticate')
      .send(loginPayload);

    expect(response.body).to.have.property('accessToken');
  });

  it('It should authenticate the user and have a message property', async () => {
    const response = await request(app)
      .post('/users/authenticate')
      .send(loginPayload);

    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('message', 'Login successful');
  });

  it('It should throw an InputValidationExpection', async () => {
    try {
      const response = await request(app)
        .post('/users/authenticate')
        .send(badLoginPayload);
    } catch (error) {
      expect(error).to.be.instanceOf(InputValidationExpection);
      expect(error).to.have.property('message');
      expect(error.message).to.have.property(
        'message',
        'A valid email address is required',
      );
    }
  });
});
