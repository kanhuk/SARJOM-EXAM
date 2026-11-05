import {
  saveResult,
  getResult,
  listResults,
} from './results.js';

const result = {
  id: 'ugc-net-economics-result',
  contentType: 'result' as const,
  title: 'UGC NET Economics Result',
  description:
    'Official result information for UGC NET Economics.',
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
    resultStatus: 'pending',
    resultUrl: null,
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM RESULT SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveResult(result);

console.log(
  'SAVE:',
  saved.contentType === 'result'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getResult('ugc-net-economics-result');

console.log(
  'GET:',
  fetched?.title === 'UGC NET Economics Result'
    ? 'PASSED'
    : 'FAILED',
);

const all = await listResults();

console.log(
  'LIST:',
  all.some(
    item =>
      item.id === 'ugc-net-economics-result',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log('TOTAL RESULTS:', all.length);

console.log('');
console.log('========================================');
console.log(' RESULT SERVICE TEST COMPLETE');
console.log('========================================');
