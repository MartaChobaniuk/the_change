import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EventType } from '../types/EventType';
import { getEvents } from '../services/events';

type Context = {
  events: EventType[];
  loadEvents: () => void;
  loading: boolean;
  errorMessage: string;
};

const State: Context = {
  events: [] as EventType[],
  loadEvents: () => {},
  loading: false,
  errorMessage: '',
};

export const EventsContext = React.createContext(State);

type Props = {
  children: React.ReactNode;
};

export const EventsProvider: React.FC<Props> = ({ children }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await getEvents();

      setEvents(data);
    } catch {
      setEvents([]);
      setErrorMessage('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const value = useMemo(
    () => ({
      events,
      loadEvents,
      errorMessage,
      loading,
    }),
    [events, loadEvents, errorMessage, loading],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};
