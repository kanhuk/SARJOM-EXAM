import {
  saveScholarship,
  getScholarship,
  listScholarships,
} from './scholarships.js';

const scholarship = {
  id: 'national-scholarship-portal',
  contentType: 'scholarship' as const,
  title: 'National Scholarship Portal',
  description:
    'Government scholarship information and application platform.',
  officialUrl:
    'https://scholarships.gov.in/',
  officialSource:
    'Government of India',
  stateCode: 'ALL',
  status: 'active',
  updatedAt: new Date().toISOString(),
  metadata: {
    scholarshipName: 'National Scholarship Portal',
    category: 'Education',
    beneficiary: 'Eligible students',
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM SCHOLARSHIP SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveScholarship(scholarship);

console.log(
  'SAVE:',
  saved.contentType === 'scholarship'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getScholarship('national-scholarship-portal');

console.log(
  'GET:',
  fetched?.title === 'National Scholarship Portal'
    ? 'PASSED'
    : 'FAILED',
);

const all = await listScholarships();

console.log(
  'LIST:',
  all.some(
    item => item.id === 'national-scholarship-portal',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log('TOTAL SCHOLARSHIPS:', all.length);
console.log('');
console.log('========================================');
console.log(' SCHOLARSHIP SERVICE TEST COMPLETE');
console.log('========================================');
