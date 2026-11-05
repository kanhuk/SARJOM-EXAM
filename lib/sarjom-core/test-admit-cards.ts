import {
  saveAdmitCard,
  getAdmitCard,
  listAdmitCards,
} from './admit-cards.js';

const admitCard = {
  id: 'ugc-net-economics-admit-card',
  contentType: 'admit-card' as const,
  title: 'UGC NET Economics Admit Card',
  description:
    'Official admit card information for UGC NET Economics.',
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
console.log(' SARJOM ADMIT CARD SERVICE TEST');
console.log('========================================');
console.log('');

const saved = await saveAdmitCard(admitCard);

console.log(
  'SAVE:',
  saved.contentType === 'admit-card'
    ? 'PASSED'
    : 'FAILED',
);

const fetched =
  await getAdmitCard('ugc-net-economics-admit-card');

console.log(
  'GET:',
  fetched?.title === 'UGC NET Economics Admit Card'
    ? 'PASSED'
    : 'FAILED',
);

const all = await listAdmitCards();

console.log(
  'LIST:',
  all.some(
    item =>
      item.id === 'ugc-net-economics-admit-card',
  )
    ? 'PASSED'
    : 'FAILED',
);

console.log('');
console.log('TOTAL ADMIT CARDS:', all.length);

console.log('');
console.log('========================================');
console.log(' ADMIT CARD SERVICE TEST COMPLETE');
console.log('========================================');
