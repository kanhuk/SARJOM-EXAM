import assert from 'node:assert/strict';
import { isVerifiedPyq } from './pyqs.js';
import type { SarjomGenericRecord } from './types.js';

const verified: SarjomGenericRecord = {
  id: 'test-pyq-verification',
  contentType: 'pyq',
  title: 'Test PYQ',
  officialUrl: 'https://example.org/official-paper.pdf',
  officialSource: 'Test official source',
  lastVerifiedAt: '2026-10-12T00:00:00.000Z',
  status: 'published',
  metadata: {
    verificationStatus: 'verified',
    question: 'Test question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answerIndex: 1,
    exam: 'Test exam',
    subject: 'Test subject',
    topic: 'Test topic',
  },
};

assert.equal(isVerifiedPyq(verified), true);

assert.equal(
  isVerifiedPyq({ ...verified, status: 'draft' }),
  false,
  'Draft questions must not be publicly listed.',
);

assert.equal(
  isVerifiedPyq({
    ...verified,
    metadata: { ...verified.metadata, verificationStatus: 'pending' },
  }),
  false,
  'Unverified questions must not be publicly listed.',
);

assert.equal(
  isVerifiedPyq({ ...verified, officialUrl: undefined }),
  false,
  'Questions without official provenance must be rejected.',
);

assert.equal(
  isVerifiedPyq({
    ...verified,
    metadata: { ...verified.metadata, answerIndex: 99 },
  }),
  false,
  'Invalid answer indexes must be rejected.',
);

console.log('SARJOM PYQ VERIFICATION TESTS PASSED');
