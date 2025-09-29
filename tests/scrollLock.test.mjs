import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadTSModule = (relativePath) => {
  const absolutePath = join(__dirname, '..', relativePath);
  const source = readFileSync(absolutePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
  });

  const module = { exports: {} };
  const localRequire = createRequire(absolutePath);
  const compiled = new Function('exports', 'require', 'module', '__filename', '__dirname', outputText);
  compiled(module.exports, localRequire, module, absolutePath, dirname(absolutePath));
  return module.exports;
};

const { isNearBottom, shouldAutoScroll } = loadTSModule('src/utils/scrollLock.ts');

test('isNearBottom treats close desktop offsets as near bottom', () => {
  const metrics = { scrollTop: 920, scrollHeight: 1000, clientHeight: 60 };
  assert.equal(isNearBottom(metrics, 120, false), true);
});

test('isNearBottom blocks auto-scroll when sufficiently far on desktop', () => {
  const metrics = { scrollTop: 400, scrollHeight: 1200, clientHeight: 400 };
  assert.equal(isNearBottom(metrics, 120, false), false);
});

test('isNearBottom expands tolerance on mobile devices', () => {
  const metrics = { scrollTop: 520, scrollHeight: 1200, clientHeight: 500 };
  assert.equal(isNearBottom(metrics, 120, true), true);
});

test('isNearBottom still respects large gaps on mobile', () => {
  const metrics = { scrollTop: 200, scrollHeight: 1200, clientHeight: 600 };
  assert.equal(isNearBottom(metrics, 120, true), false);
});

test('shouldAutoScroll forces scroll when event is user initiated', () => {
  const metrics = { scrollTop: 10, scrollHeight: 2000, clientHeight: 600 };
  assert.equal(shouldAutoScroll({ metrics, isMobile: false, userInitiated: true }), true);
});

test('shouldAutoScroll holds position when user is browsing history', () => {
  const metrics = { scrollTop: 200, scrollHeight: 2000, clientHeight: 600 };
  assert.equal(shouldAutoScroll({ metrics, threshold: 150, isMobile: false, userInitiated: false }), false);
});

test('shouldAutoScroll allows catch-up when user is near bottom again', () => {
  const metrics = { scrollTop: 1300, scrollHeight: 2000, clientHeight: 680 };
  assert.equal(shouldAutoScroll({ metrics, threshold: 150, isMobile: false, userInitiated: false }), true);
});
