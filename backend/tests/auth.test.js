const { test, describe } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');

describe('Security & Authentication Token Tests', () => {
  const secret = process.env.JWT_SECRET || 'test_jwt_secret_key_2026';

  test('Signs and verifies valid JWT for donor role', () => {
    const payload = { id: '6ad748ef6b04d42374739af1', role: 'donor' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.role, 'donor');
  });

  test('Signs and verifies valid JWT for admin role', () => {
    const payload = { id: '6ad748ef6b04d42374739af9', role: 'admin' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.role, 'admin');
  });

  test('Rejects expired or tampered tokens', () => {
    const expiredToken = jwt.sign({ id: '123' }, secret, { expiresIn: '-1s' });
    assert.throws(() => {
      jwt.verify(expiredToken, secret);
    }, /jwt expired/);

    assert.throws(() => {
      jwt.verify('invalid.token.structure', secret);
    }, /invalid token|jwt malformed/);
  });
});
