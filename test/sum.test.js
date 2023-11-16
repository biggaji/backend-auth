import { sum } from '../sum.js';
import { expect } from 'chai';

describe('Testing the sum function', () => {
  it('Sum of 2 and 4 should equal 6', (done) => {
    expect(sum(2, 4)).to.equal(6);
    done();
  });

  it('Sum of 7 and 3 should not equal 8', (done) => {
    expect(sum(7, 3)).to.not.equal(8);
    done();
  });
});
