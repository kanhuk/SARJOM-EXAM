import { modificationType } from './auto-engine.js';

const cases = [
  ['cancellation', 'notification', 'Cancellation of Recruitment Advertisement 28/2026', 'https://example.gov.in/cancellation-28-2026.pdf'],
  ['postponement', 'notification', 'Postponement of Examination Advertisement 28/2026', 'https://example.gov.in/postponement-28-2026.pdf'],
  ['corrigendum', 'notification', 'Corrigendum to Advertisement 28/2026', 'https://example.gov.in/corrigendum-28-2026.pdf'],
  ['extension', 'notification', 'Extension of Last Date Advertisement 28/2026', 'https://example.gov.in/extension-28-2026.pdf'],
  ['revised', 'notification', 'Revised Recruitment Notification 28/2026', 'https://example.gov.in/revised-28-2026.pdf'],
] as const;

console.log('');
console.log('========================================');
console.log(' SARJOM MODIFICATION DETECTION TEST');
console.log('========================================');
console.log('');

for (const [expected, type, title, url] of cases) {
  const actual = modificationType(type, title, url);

  console.log(
    `${expected.toUpperCase()}: ${actual}`,
  );

  if (actual !== expected) {
    throw new Error(
      `${expected} detection failed. Got: ${actual}`,
    );
  }
}

console.log('');
console.log('========================================');
console.log(' MODIFICATION DETECTION PASSED');
console.log('========================================');
console.log('');
