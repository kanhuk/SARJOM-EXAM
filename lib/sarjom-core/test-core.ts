import { deriveRecruitmentLifecycle } from './lifecycle.js';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`SARJOM CORE TEST FAILED: ${message}`);
}

const open = deriveRecruitmentLifecycle({
  applicationStartDate: '2026-08-01',
  applicationDeadline: '2026-12-31',
  examDate: undefined,
  admitCardUrl: undefined,
  resultUrl: undefined,
  answerKeyUrl: undefined,
  isExpected: false,
  superseded: false,
});

const upcoming = deriveRecruitmentLifecycle({
  applicationStartDate: '2099-01-01',
  applicationDeadline: '2099-01-31',
  examDate: undefined,
  admitCardUrl: undefined,
  resultUrl: undefined,
  answerKeyUrl: undefined,
  isExpected: false,
  superseded: false,
});

const expected = deriveRecruitmentLifecycle({
  applicationStartDate: undefined,
  applicationDeadline: undefined,
  examDate: undefined,
  admitCardUrl: undefined,
  resultUrl: undefined,
  answerKeyUrl: undefined,
  isExpected: true,
  superseded: false,
});

assert(['open', 'closing-soon'].includes(open), 'open recruitment lifecycle');
assert(upcoming === 'upcoming', 'upcoming lifecycle');
assert(expected === 'upcoming', 'expected recruitment lifecycle');

console.log('SARJOM CORE TESTS PASSED');
