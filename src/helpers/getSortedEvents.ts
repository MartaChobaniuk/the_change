/* eslint-disable no-console */
import { EventType } from '../types/EventType';
import { FilterSelection } from '../types/FilterType';

export const filteredEv = (
  events: EventType[],
  filters: FilterSelection,
  query: string,
): EventType[] => {
  let filteredEvents = [...events];

  if (query) {
    const queryLowerCase = query.toLowerCase();

    filteredEvents = filteredEvents.filter(event => {
      return (
        event.title.toLowerCase().includes(queryLowerCase) ||
        event.description.toLowerCase().includes(queryLowerCase) ||
        event.region.toLowerCase().includes(queryLowerCase)
      );
    });
  }

  if (filters.opportunityType?.includes('VOLUNTARY')) {
    filteredEvents = filteredEvents.filter(
      event => event.opportunityType === 'VOLUNTARY',
    );
  } else if (filters.opportunityType?.includes('WISHES')) {
    filteredEvents = filteredEvents.filter(
      event => event.opportunityType === 'WISHES',
    );
  }

  if (filters.assistanceType?.includes('VOLUNTEERING')) {
    filteredEvents = filteredEvents.filter(
      event => event.assistanceType === 'VOLUNTEERING',
    );
  } else if (filters.assistanceType?.includes('DONATION')) {
    filteredEvents = filteredEvents.filter(
      event => event.assistanceType === 'DONATION',
    );
  }

  if (filters.categoryId) {
    filteredEvents = filteredEvents.filter(
      event => event.categoryId === filters.categoryId,
    );
  }

  if (filters.region) {
    filteredEvents = filteredEvents.filter(
      event => event.region.toLowerCase() === filters.region?.toLowerCase(),
    );
  }

  if (filters.timeDemands) {
    filteredEvents = filteredEvents.filter(
      event => event.timeDemands === filters.timeDemands,
    );
  }

  if (filters.startDate) {
    filteredEvents = filteredEvents.filter(event => {
      if (!event.startingDate) {
        return false;
      }

      const eventDate = new Date(event.startingDate);

      if (isNaN(eventDate.getTime())) {
        return false;
      }

      const startOfDay = filters.startDate ? new Date(filters.startDate) : null;

      if (startOfDay === null) {
        return false;
      }

      startOfDay.setHours(0, 0, 0, 0);

      if (filters.endDate) {
        const endOfDay = new Date(filters.endDate);

        endOfDay.setHours(23, 59, 59, 999);

        return eventDate >= startOfDay && eventDate <= endOfDay;
      } else {
        return (
          eventDate.getTime() >= startOfDay.getTime() &&
          eventDate.getTime() < startOfDay.setDate(startOfDay.getDate() + 1)
        );
      }
    });
  }

  if (filters.timeDemands) {
    filteredEvents = filteredEvents.filter(event => {
      if (!event.timeDemands) {
        return false;
      }

      // eslint-disable-next-line max-len, prettier/prettier
      return event.timeDemands.toLowerCase() ===  (filters.timeDemands ?? '').toLowerCase();
    });
  }

  return filteredEvents;
};
