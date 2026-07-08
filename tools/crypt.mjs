// tools/crypt.mjs — pure AES-256-GCM page encryption (no prompts, no file I/O).
import { webcrypto as crypto } from 'node:crypto';

export const ITER = 250000;
const enc = new TextEncoder();
const b64 = (u) => Buffer.from(u).toString('base64');
const b2u = (b) => Uint8Array.from(Buffer.from(b, 'base64'));

export async function encryptPage({ plaintext, template, password, title }) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const km   = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key  = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct   = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  return template
    .replaceAll('%%TITLE%%', title)
    .replace('%%SALT%%', b64(salt))
    .replace('%%IV%%',   b64(iv))
    .replace('%%CT%%',   b64(new Uint8Array(ct)))
    .replace('%%ITER%%', String(ITER));
}

export async function decryptField({ ciphertextB64, saltB64, ivB64, iterations, password }) {
  const km  = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: b2u(saltB64), iterations, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const pt  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b2u(ivB64) }, key, b2u(ciphertextB64));
  return new TextDecoder().decode(pt);
}
