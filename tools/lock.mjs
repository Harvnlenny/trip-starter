#!/usr/bin/env node
// Encrypts the plaintext ../index.html into ../../<slug>-page/index.html.
// The password never leaves this machine and is never stored.
//
// Password entry adapts to how this is launched:
//   - Automated tests: set TRIP_PAGE_PW_FROM_STDIN=1 to read two password
//     lines from stdin.
//   - A real terminal (stdin is a TTY): a hidden terminal prompt.
//   - Driven by Claude / no terminal: a native GUI password box
//     (macOS osascript, Windows PowerShell, Linux zenity/kdialog).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import process from 'node:process';
import { encryptPage } from './crypt.mjs';

export function parseConfig(text) {
  const get = (k) => {
    const m = text.match(new RegExp('^' + k + '="?([^"\\n]*)"?$', 'm'));
    return m ? m[1] : '';
  };
  return { name: get('TRIP_NAME'), slug: get('TRIP_SLUG') };
}

// ---- terminal (TTY) hidden prompt ------------------------------------------
let stdinBuffer = '';
function promptHiddenTTY(query) {
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
      const buf = stdinBuffer; stdinBuffer = '';
      if (processInput(buf)) return;
    }
    const onData = (chunk) => {
      const str = chunk.toString('utf8');
      if (processInput(str)) stdin.removeListener('data', onData);
    };
    stdin.on('data', onData);
  });
}

// ---- native GUI password box ------------------------------------------------
// Returns the typed string, or null if cancelled / no GUI tool is available.
function guiPrompt(title, message) {
  const platform = os.platform();
  try {
    if (platform === 'darwin') {
      const esc = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      const script =
        `display dialog ${esc(message)} with title ${esc(title)} ` +
        `default answer "" with hidden answer buttons {"Cancel","OK"} default button "OK"`;
      const out = execFileSync('osascript', ['-e', script], { encoding: 'utf8' });
      const m = out.match(/text returned:([\s\S]*)$/);
      return m ? m[1].replace(/\r?\n$/, '') : '';
    }
    if (platform === 'win32') {
      const ps =
        `$ErrorActionPreference='Stop';` +
        `$c = Get-Credential -UserName 'trip-page' -Message ${JSON.stringify(message)};` +
        `if ($c) { [Console]::Out.Write($c.GetNetworkCredential().Password) } else { exit 1 }`;
      const out = execFileSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8' });
      return out.replace(/\r?\n$/, '');
    }
    try {
      const out = execFileSync('zenity', ['--password', `--title=${title}`], { encoding: 'utf8' });
      return out.replace(/\r?\n$/, '');
    } catch (_) {
      const out = execFileSync('kdialog', ['--password', message], { encoding: 'utf8' });
      return out.replace(/\r?\n$/, '');
    }
  } catch (_) {
    return null;
  }
}

function readAllStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end', () => resolve(data));
  });
}

function validatePair(pw, pw2) {
  if (pw !== pw2) { console.error('X Passwords do not match. Nothing was published.'); process.exit(1); }
  if (pw.length < 6) { console.error('X Use at least 6 characters. Nothing was published.'); process.exit(1); }
  return pw;
}

async function readConfirmedPassword() {
  if (process.env.TRIP_PAGE_PW_FROM_STDIN) {
    const data = await readAllStdin();
    const parts = data.split(/\r?\n/);
    return validatePair(parts[0] || '', parts[1] || '');
  }
  if (process.stdin.isTTY) {
    const pw  = await promptHiddenTTY('Set page password: ');
    const pw2 = await promptHiddenTTY('Confirm password:  ');
    return validatePair(pw, pw2);
  }
  const pw = guiPrompt('Trip page password',
    'Set a password for your trip page (at least 6 characters):');
  if (pw === null) {
    console.error('X Could not get the password (cancelled, or no password box available). ' +
      'Nothing was published. Ask Claude to publish again, or run "bash tools/publish.sh" in a terminal.');
    process.exit(1);
  }
  const pw2 = guiPrompt('Confirm password', 'Type the same password again to confirm:');
  if (pw2 === null) { console.error('X Password confirmation was cancelled. Nothing was published.'); process.exit(1); }
  return validatePair(pw, pw2);
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const cfg = parseConfig(await readFile(`${here}/../trip.config`, 'utf8'));
  if (!cfg.slug) { console.error('X trip.config missing TRIP_SLUG. Run setup-trip.sh first.'); process.exit(1); }
  const plaintext = await readFile(`${here}/../index.html`, 'utf8');
  const template  = await readFile(`${here}/locked-template.html`, 'utf8');
  const OUT = `${here}/../../${cfg.slug}-page/index.html`;

  const pw = await readConfirmedPassword();

  const out = await encryptPage({ plaintext, template, password: pw, title: cfg.name || 'Trip' });
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, out, 'utf8');
  console.log(`OK: Encrypted page written to ${cfg.slug}-page/index.html (AES-256-GCM).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
