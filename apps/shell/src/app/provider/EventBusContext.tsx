import { createContext, useContext, useState, type ReactNode } from 'react';
import type { EventBus } from '@bookhub/event-bus';
import { createEventBus } from '@bookhub/event-bus';

const EventBusContext = createContext<EventBus | null>(null);

export function EventBusProvider({ children }: { children: ReactNode }) {
  // Создаём bus один раз за жизнь провайдера.
  // useState с lazy initializer гарантирует, что createEventBus
  // не будет вызываться при каждом ререндере.
  const [bus] = useState(() => createEventBus({ bufferSize: 100 }));

  return (
    <EventBusContext.Provider value={bus}>
      {children}
    </EventBusContext.Provider>
  );
}

export function useEventBus(): EventBus {
  const bus = useContext(EventBusContext);
  if (!bus) {
    throw new Error('useEventBus must be used within <EventBusProvider>');
  }
  return bus;
}