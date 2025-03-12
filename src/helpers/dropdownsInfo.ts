export const categoryId: Record<string, string> = {
  '4fa0ac81-9e49-43c1-8f19-99d3f4457180': 'Military Support',
  '70bf397c-ad80-446e-9d35-a4e77f4c4513': 'Humanitarian Aid',
  'b7717f14-944f-4642-bf30-d7c714239cd9': 'Medical Assistance',
  '65b9e72d-6ad7-4dba-95e6-7eb8a40b1772': 'Reconstruction & Infrastructure',
  '807af9ec-424f-4f9a-a756-e17d4b60f3a4': 'Mental Health',
  '906431b6-07de-441a-91fb-38fa069356d9': 'Education & Mentorship',
  '8fde5b19-bbc1-4188-b3e0-eb540a9bb644': 'Community & Local Initiatives',
  '26b9055c-e94a-4869-a89c-35efc5951492': 'Cultural & Historical Preservation',
  '7636e8b3-06ea-4d58-8b73-f35d90d0a6b9': 'Animal Rescue',
};

export const opportunityType = ['VOLUNTARY', 'WISHES'];

export const assistanceType = ['VOLUNTEERING', 'DONATION'];

export const region = [
  'Kyiv',
  'Kharkiv',
  'Odesa',
  'Dnipro',
  'Zaporizhzhia',
  'Kremenchuk',
  'Mykolaiv',
  'Mariupol',
  'Vinnytsia',
  'Chernihiv',
  'Poltava',
  'Cherkasy',
  'Khmelnytskyi',
  'Ternopil',
  'Ivano-Frankivsk',
  'Zhytomyr',
  'Kirovohrad',
  'Luhansk',
  'Donetsk',
  'Chernivtsi',
  'Kherson',
  'Zakarpattia',
  'Lutsk',
  'Rivne',
  'Lviv',
  'Sumy',
];

export const timeDemands: Record<string, [number, number]> = {
  'Up to 1 hour': [0, 1],
  '1-6 hours': [1, 6],
  'Up to a day': [7, 24],
  'Up to a week': [25, 144],
  'Up to a month': [145, 744],
  '1 - 3 months': [745, 2232],
  '3 - 6 months': [2233, 4464],
  'Up to a year': [4465, 8950],
  'More than a year': [8951, Infinity],
};
