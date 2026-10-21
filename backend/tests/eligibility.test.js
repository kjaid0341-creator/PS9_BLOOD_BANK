const { test, describe } = require('node:test');
const assert = require('node:assert');
const { calculateEligibility } = require('../utils/eligibility');

describe('Blood Donation Eligibility Unit Tests', () => {
  test('Eligible donor: age between 18 and 65, last donation over 90 days ago', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 25); // 25 years old

    const lastDonation = new Date();
    lastDonation.setDate(lastDonation.getDate() - 120); // 120 days ago

    const result = calculateEligibility(dob, lastDonation, 90);
    assert.strictEqual(result.isEligible, true);
    assert.strictEqual(result.age, 25);
    assert.strictEqual(result.reasons.length, 0);
    assert.ok(result.nextEligibleDate instanceof Date);
  });

  test('Eligible first-time donor: age 20, no previous donation', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 20);

    const result = calculateEligibility(dob, null, 90);
    assert.strictEqual(result.isEligible, true);
    assert.strictEqual(result.age, 20);
    assert.strictEqual(result.reasons.length, 0);
  });

  test('Ineligible donor: under 18 years old', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 16); // 16 years old

    const result = calculateEligibility(dob, null, 90);
    assert.strictEqual(result.isEligible, false);
    assert.strictEqual(result.age, 16);
    assert.ok(result.reasons[0].includes('at least 18 years old'));

    // Next eligible date must project to 18th birthday
    assert.ok(result.nextEligibleDate instanceof Date);
    const expectedYear = dob.getFullYear() + 18;
    assert.strictEqual(result.nextEligibleDate.getFullYear(), expectedYear);
  });

  test('Ineligible donor: over 65 years old', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 67); // 67 years old

    const result = calculateEligibility(dob, null, 90);
    assert.strictEqual(result.isEligible, false);
    assert.strictEqual(result.age, 67);
    assert.ok(result.reasons[0].includes('65 years or younger'));
    assert.strictEqual(result.nextEligibleDate, null);
  });

  test('Ineligible donor: donation gap not satisfied (e.g., donated 30 days ago with 90-day gap)', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 30); // 30 years old

    const lastDonation = new Date();
    lastDonation.setDate(lastDonation.getDate() - 30); // 30 days ago

    const result = calculateEligibility(dob, lastDonation, 90);
    assert.strictEqual(result.isEligible, false);
    assert.ok(result.reasons.some((r) => r.includes('90 days must pass')));
    assert.ok(result.nextEligibleDate instanceof Date);
  });

  test('Dynamic donation gap: custom 60-day gap evaluation', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 28);

    const lastDonation = new Date();
    lastDonation.setDate(lastDonation.getDate() - 70); // 70 days ago

    // With 90 days gap -> ineligible
    const res90 = calculateEligibility(dob, lastDonation, 90);
    assert.strictEqual(res90.isEligible, false);

    // With 60 days gap -> eligible
    const res60 = calculateEligibility(dob, lastDonation, 60);
    assert.strictEqual(res60.isEligible, true);
  });

  test('Invalid input handling: missing or invalid Date of Birth', () => {
    const resNull = calculateEligibility(null, null, 90);
    assert.strictEqual(resNull.isEligible, false);

    const resInvalid = calculateEligibility('not-a-date', null, 90);
    assert.strictEqual(resInvalid.isEligible, false);
  });

  test('Edge case: Future date of birth or donation date rejected', () => {
    const futureDob = new Date();
    futureDob.setFullYear(futureDob.getFullYear() + 2);

    const result = calculateEligibility(futureDob, null, 90);
    assert.strictEqual(result.isEligible, false);
    assert.ok(result.reasons[0].includes('future'));
  });
});
