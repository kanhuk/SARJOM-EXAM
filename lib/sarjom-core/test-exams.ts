import {
  saveExam,
  getExam,
  listExams,
} from './exams.js';

const exam = {
  id: 'ugc-net-economics-exam',
  contentType: 'exam' as const,
  title: 'UGC NET Economics Examination',
  description:
    'UGC NET Economics examination schedule and related official information.',
  officialUrl:
    'https://ugcnet.nta.ac.in/',
  officialSource:
    'National Testing Agency',
  status: 'upcoming',
  updatedAt: new Date().toISOString(),
  metadata: {
    examName: 'UGC NET',
    subject: 'Economics',
    conductingBody: 'National Testing Agency',
    examMode: 'Computer Based Test',
    examDate: null,
    applicationStatus: 'See official notification',
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM EXAM SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveExam(exam);

console.log(
  'SAVE:',
  saved.contentType === 'exam'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getExam('ugc-net-economics-exam');

console.log(
  'GET:',
  fetched?.title === 'UGC NET Economics Examination'
    ? 'PASSED'
    : 'FAILED',
);

const all = await listExams();

console.log(
  'LIST:',
  all.some(
    item => item.id === 'ugc-net-economics-exam',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log('TOTAL EXAMS:', all.length);

console.log('');
console.log('========================================');
console.log(' EXAM SERVICE TEST COMPLETE');
console.log('========================================');
