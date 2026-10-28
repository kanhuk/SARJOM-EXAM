import {
  saveSyllabus,
  getSyllabus,
  listSyllabi,
} from './syllabus.js';

const syllabus = {
  id: 'ugc-net-economics',
  contentType: 'syllabus' as const,
  title: 'UGC NET Economics Syllabus',
  description:
    'UGC NET Economics syllabus and examination structure.',
  officialUrl:
    'https://ugcnet.nta.ac.in/',
  officialSource:
    'National Testing Agency',
  status: 'published',
  updatedAt:
    new Date().toISOString(),
  metadata: {
    examName: 'UGC NET',
    subject: 'Economics',
    conductingBody:
      'National Testing Agency',
    papers: [
      {
        name: 'Paper 1',
        description:
          'General Teaching and Research Aptitude',
        units: [],
      },
      {
        name: 'Paper 2',
        description: 'Economics',
        units: [
          'Micro Economics',
          'Macro Economics',
          'Statistics and Econometrics',
          'Mathematical Economics',
          'International Economics',
          'Public Economics',
          'Money and Banking',
          'Growth and Development Economics',
          'Environmental Economics',
          'Indian Economy',
        ],
      },
    ],
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM SYLLABUS SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveSyllabus(syllabus);

console.log(
  'SAVE:',
  saved.contentType === 'syllabus'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getSyllabus(
    'ugc-net-economics',
  );

console.log(
  'GET:',
  fetched?.title ===
    'UGC NET Economics Syllabus'
    ? 'PASSED'
    : 'FAILED',
);

const all =
  await listSyllabi();

console.log(
  'LIST:',
  all.some(
    item =>
      item.id ===
      'ugc-net-economics',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log(
  'TOTAL SYLLABI:',
  all.length,
);

console.log('');
console.log('========================================');
console.log(' SYLLABUS SERVICE TEST COMPLETE');
console.log('========================================');
