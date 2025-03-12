import { EventType } from '../types/EventType';
import { WishType } from '../types/WishType';
import { client } from '../utils/httpClient';

export const getEvents = () => {
  return client.get<EventType[]>('/events');
};

export const getEventById = (eventId: string) => {
  return client.get<EventType>(`/events/${eventId}`);
};

export const sendContactWish = (wish: WishType) => {
  return client.post<void>('/contacts', wish);
};
