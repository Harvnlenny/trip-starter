import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptPage, decryptField } from '../tools/crypt.mjs';

const TPL = 'T=%%TITLE%% S=%%SALT%% I=%%IV%% C=%%CT%% N=%%ITER%%';
const grab = (out, k) => out.match(new RegExp(k + '=([^ ]+)'))[1];

test('encryptPage output decrypts back to the original plaintext', async () => {
  const plaintext = '<h1>Secret itinerary</h1>';
  const out = await encryptPage({ plaintext, template: TPL, password: 'hunter2', title: 'Taiwan' });
  assert.match(out, /T=Taiwan/);
  const back = await decryptField({
    ciphertextB64: grab(out, 'C'), saltB64: grab(out, 'S'), ivB64: grab(out, 'I'),
    iterations: Number(grab(out, 'N')), password: 'hunter2',
  });
  assert.equal(back, plaintext);
});

test('wrong password fails to decrypt', async () => {
  const out = await encryptPage({ plaintext: 'x', template: TPL, password: 'right', title: 't' });
  await assert.rejects(decryptField({
    ciphertextB64: grab(out, 'C'), saltB64: grab(out, 'S'), ivB64: grab(out, 'I'),
    iterations: Number(grab(out, 'N')), password: 'wrong',
  }));
});
