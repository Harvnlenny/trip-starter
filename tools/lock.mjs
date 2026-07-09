#!/usr/bin/env node
// Interactive: prompt for a password, encrypt ../index.html into ../../<slug>-page/index.html.
// The password never leaves this machine and is never stored.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { encryptPage } from './crypt.mjs';

export function parseConfig(text) {
  const get = (k) => {
    const m = text.match(new RegExp('^' + k + '="?([^"\\n]*)"?$', 'm'));
    return m ? m[1] : '';
  };
  return { name: get('TRIP_NAME'), slug: get('TRIP_SLUG') };
}

let stdinBuffer = '';

function promptHidden(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(query);
    stdin.resume();
    if (stdin.setRawMode) stdin.setRawMode(true);
    let pw = '';

    const processInput = (input) => {
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        const code = ch.charCodeAt(0);
        if (ch === '\n' || ch === '\r' || code === 4) {
          if (stdin.setRawMode) stdin.setRawMode(false);
          stdin.pause();
          stdinBuffer = input.slice(i + 1);
          process.stdout.write('\n'); resolve(pw);
          return true;
        } else if (code === 3) { process.stdout.write('\n'); process.exit(1); }
        else if (code === 127 || code === 8) { pw = pw.slice(0, -1); }
        else { pw += ch; }
      }
      return false;
    };

    if (stdinBuffer.length > 0) {
      const buf = stdinBuffer;
      stdinBuffer = '';
      if (processInput(buf)) return;
    }

    const onData = (chunk) => {
      const str = chunk.toString('utf8');
      if (processInput(str)) {
        stdin.removeListener('data', onData);
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const cfg = parseConfig(await readFile(`${here}/../trip.config`, 'utf8'));
  if (!cfg.slug) { console.error('X trip.config missing TRIP_SLUG. Run setup-trip.sh first.'); process.exit(1); }
  const plaintext = await readFile(`${here}/../index.html`, 'utf8');
  const template  = await readFile(`${here}/locked-template.html`, 'utf8');
  const OUT = `${here}/../../${cfg.slug}-page/index.html`;

  const pw  = await promptHidden('Set page password: ');
  const pw2 = await promptHidden('Confirm password:  ');
  if (pw !== pw2) { console.error('X Passwords do not match.'); process.exit(1); }
  if (pw.length < 6) { console.error('X Use at least 6 characters.'); process.exit(1); }

  const out = await encryptPage({ plaintext, template, password: pw, title: cfg.name || 'Trip' });
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, out, 'utf8');
  console.log(`OK: Encrypted page written to ${cfg.slug}-page/index.html (AES-256-GCM).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
