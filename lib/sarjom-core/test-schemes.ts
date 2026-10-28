import {
  saveScheme,
  getScheme,
  listSchemes,
} from './schemes.js';

const scheme = {
  id: 'pm-kisan',
  contentType: 'scheme' as const,

  title: 'PM-KISAN',
  
  description:
    'Pradhan Mantri Kisan Samman Nidhi scheme.',

  officialUrl:
    'https://pmkisan.gov.in/',

  officialSource:
    'Government of India',

  stateCode: 'ALL',

  status: 'active',

  updatedAt:
    new Date().toISOString(),

  metadata: {
    schemeName:
      'Pradhan Mantri Kisan Samman Nidhi',

    ministry:
      'Ministry of Agriculture and Farmers Welfare',

    category:
      'Agriculture',

    beneficiary:
      'Eligible farmer families',

    eligibility: [],

    benefits: [],

    applicationProcess: [],

    documentsRequired: [],
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM SCHEME SERVICE TEST');
console.log('========================================');
console.log('');

const saved =
  await saveScheme(scheme);

console.log(
  'SAVE:',
  saved.contentType === 'scheme'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getScheme('pm-kisan');

console.log(
  'GET:',
  fetched?.title === 'PM-KISAN'
    ? 'PASSED'
    : 'FAILED',
);

const all =
  await listSchemes();

console.log(
  'LIST:',
  all.some(
    item => item.id === 'pm-kisan',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log(
  'TOTAL SCHEMES:',
  all.length,
);

console.log('');
console.log('========================================');
console.log(' SCHEME SERVICE TEST COMPLETE');
console.log('========================================');
