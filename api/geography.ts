import { INDIAN_STATES, ODISHA_DISTRICTS } from '../lib/sarjom-core/geography.js';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const requestedState =
    typeof req.query?.state === 'string'
      ? req.query.state.toUpperCase()
      : '';

  const selectedState = INDIAN_STATES.find(
    (state) => state.code === requestedState,
  );

  return res.status(200).json({
    success: true,

    states: INDIAN_STATES,

    selectedState: selectedState ?? null,

    /*
     * Universal geography response.
     *
     * More state district datasets will be added to the
     * geography core without changing the Jobs UI/API contract.
     */
    districts:
      requestedState === 'OD'
        ? ODISHA_DISTRICTS
        : [],

    hasDistrictData:
      requestedState === 'OD',

    message:
      requestedState && !selectedState
        ? 'Unknown state code.'
        : undefined,
  });
}
