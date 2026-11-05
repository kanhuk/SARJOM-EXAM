export interface IndianState {
  code: string;
  name: string;
  type: 'state' | 'union-territory';
}

export const INDIAN_STATES: IndianState[] = [
  ['AP','Andhra Pradesh','state'],['AR','Arunachal Pradesh','state'],['AS','Assam','state'],['BR','Bihar','state'],['CG','Chhattisgarh','state'],['GA','Goa','state'],['GJ','Gujarat','state'],['HR','Haryana','state'],['HP','Himachal Pradesh','state'],['JH','Jharkhand','state'],['KA','Karnataka','state'],['KL','Kerala','state'],['MP','Madhya Pradesh','state'],['MH','Maharashtra','state'],['MN','Manipur','state'],['ML','Meghalaya','state'],['MZ','Mizoram','state'],['NL','Nagaland','state'],['OD','Odisha','state'],['PB','Punjab','state'],['RJ','Rajasthan','state'],['SK','Sikkim','state'],['TN','Tamil Nadu','state'],['TS','Telangana','state'],['TR','Tripura','state'],['UP','Uttar Pradesh','state'],['UK','Uttarakhand','state'],['WB','West Bengal','state'],
  ['AN','Andaman and Nicobar Islands','union-territory'],['CH','Chandigarh','union-territory'],['DN','Dadra and Nagar Haveli and Daman and Diu','union-territory'],['DL','Delhi','union-territory'],['JK','Jammu and Kashmir','union-territory'],['LA','Ladakh','union-territory'],['LD','Lakshadweep','union-territory'],['PY','Puducherry','union-territory'],
].map(([code,name,type]) => ({ code, name, type: type as IndianState['type'] }));

export const ODISHA_DISTRICTS = [
  'Angul','Balangir','Balasore','Bargarh','Bhadrak','Boudh','Cuttack','Deogarh','Dhenkanal','Gajapati','Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Kendujhar','Khordha','Koraput','Malkangiri','Mayurbhanj','Nabarangpur','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Subarnapur','Sundargarh'
] as const;
