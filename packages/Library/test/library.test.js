/* eslint-disable import/no-named-as-default */
import mocha from 'mocha';
import chai from 'chai';

// eslint-disable-next-line import/no-named-as-default-member
import getPatientScores from '../src/getPatientScores.js';

const { it, describe } = mocha;
const { expect } = chai;

describe('Library', () => {
  it('should get patient scores', () => {
    const facilityLocation = {
      longitude: -43,
      latitude: 200,
    };
    const result = getPatientScores(facilityLocation);
    expect(result).to.have.length(10);
  });
});
