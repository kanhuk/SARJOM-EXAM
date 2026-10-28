import {
  saveService,
  getService,
  listServices,
} from './services.js';

const service = {
  id: 'odisha-residence-certificate',
  contentType: 'service' as const,
  title: 'Odisha Residence Certificate',
  description:
    'Information and access guidance for obtaining a Residence Certificate in Odisha.',
  stateCode: 'OD',
  officialUrl:
    'https://edistrict.odisha.gov.in/',
  officialSource:
    'Government of Odisha',
  status: 'active',
  updatedAt: new Date().toISOString(),
  metadata: {
    department: 'Revenue & Disaster Management Department',
    category: 'Citizen Certificate',
    beneficiary: 'Citizens requiring proof of residence',
    eligibility: [
      'Applicant must satisfy the applicable Odisha residence requirements.',
    ],
    documentsRequired: [
      'Identity proof',
      'Address/residence proof',
    ],
    applicationProcess: [
      'Apply through the designated government service portal.',
      'Submit the required documents.',
      'Track the application using the official portal.',
    ],
  },
};

console.log('');
console.log('========================================');
console.log(' SARJOM CITIZEN SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveService(service);

console.log(
  'SAVE:',
  saved.contentType === 'service'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getService('odisha-residence-certificate');

console.log(
  'GET:',
  fetched?.title === 'Odisha Residence Certificate'
    ? 'PASSED'
    : 'FAILED',
);

const all = await listServices();

console.log(
  'LIST:',
  all.some(
    item =>
      item.id === 'odisha-residence-certificate',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log('TOTAL SERVICES:', all.length);

console.log('');
console.log('========================================');
console.log(' CITIZEN SERVICE TEST COMPLETE');
console.log('========================================');
