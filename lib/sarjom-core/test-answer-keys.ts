import {
  saveAnswerKey,
  getAnswerKey,
  listAnswerKeys,
} from './answer-keys.js';

const answerKey = {
  id: 'ugc-net-economics-answer-key',
  contentType: 'answer-key' as const,
  title: 'UGC NET Economics Answer Key',
  description:
    'Official answer key information for UGC NET Economics.',
  officialUrl:
    'https://ugcnet.nta.ac.in/',
  officialSource:
    'National Testing Agency',
  status: 'pending',
  updatedAt: new Date().toISOString(),
  metadata: {
    examId: 'ugc-net-economics-exam',
    examName: 'UGC NET',
    subject: 'Economics',
    releaseStatus: 'pending',
    downloadUrl: null,
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM ANSWER KEY SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveAnswerKey(answerKey);

console.log(
  'SAVE:',
  saved.contentType === 'answer-key'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getAnswerKey('ugc-net-economics-answer-key');

console.log(
  'GET:',
  fetched?.title === 'UGC NET Economics Answer Key'
    ? 'PASSED'
    : 'FAILED',
);

const all = await listAnswerKeys();

console.log(
  'LIST:',
  all.some(
    item =>
      item.id === 'ugc-net-economics-answer-key',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log('TOTAL ANSWER KEYS:', all.length);

console.log('');
console.log('========================================');
console.log(' ANSWER KEY SERVICE TEST COMPLETE');
console.log('========================================');
