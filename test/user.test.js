import request from 'supertest';
import app from '../index.js';
import { expect } from 'chai';
import {
  InputValidationExpection,
  BadRequestExpection,
} from '../utils/errors.js';

describe('User Service Tests', () => {
  it('Should authenticate the user', async () => {
    const authRequest = {
      email: 'jane@email.io',
      password: 'SimplePassword1?',
    };
    const response = await request(app)
      .post('/users/authenticate')
      .send(authRequest);

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('application/json');
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('accessToken');
    expect(response.body).to.have.property('message', 'Login successful');
  });

  it('Should throw an InputValidationExpection', async () => {
    const authRequest = {
      email: 'jane@email.o',
      password: 'SimplePassword1?',
    };

    try {
      const response = await request(app)
        .post('/users/authenticate')
        .send(authRequest);
    } catch (error) {
      expect(error).to.be.an.instanceOf(InputValidationExpection);
      expect(error.message).to.equal('A valid email address is required');
    }
  });

  it('Should throw an BadRequestException', async () => {
    const authRequest = {
      email: 'jane@email.io',
      password: 'SimplePasswor1?',
    };

    try {
      const response = await request(app)
        .post('/users/authenticate')
        .send(authRequest);
    } catch (error) {
      expect(error).to.be.an.instanceOf(BadRequestExpection);
      expect(error.message).to.equal('Incorrect credentials');
    }
  });
});
