import { NewOpportunityType } from '../types/NewOpportunityType';
import { client } from '../utils/httpClient';

export const addOpportunity = (data: NewOpportunityType) => {
  return client.post<NewOpportunityType>('/events', data);
};
