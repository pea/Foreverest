const stravaHelper = require('../stravaHelper.js');
const validator = require('validator');

describe('getRequestAccessURL', () => {
  it('returns URL', () => {
    expect.assertions(1);
    return stravaHelper
        .getRequestAccessURL()
        .then((response) => {
          expect(validator.isURL(response)).toBe(true);
        });
  });
});
