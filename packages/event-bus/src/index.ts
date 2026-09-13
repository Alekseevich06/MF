import type { BookHubEvents, EventName, EventPayload } from '@bookhub/contracts';

interface EventBusOptions {
  bufferSize?: number;
}

export interface EventBus {
  emit<K extends EventName>(event: K, payload: EventPayload<K>): void;
  on<K extends EventName>(event: K, handler: (payload: EventPayload<K>) => void): () => void;
  onAny(handler: (event: EventName, payload: unknown) => void): () => void;
  clear(): void;
}

export function createEventBus(options: EventBusOptions = {}): EventBus {
  const bufferSize = options.bufferSize ?? 100;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Handler = (payload: any) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandler = (event: EventName, payload: any) => void;

  interface BufferedEvent {
    event: EventName;
    payload: unknown;
  }

  // Заполни сам:
  const subMap = new Map<EventName, Set<Handler>>();  // подсказка: ключ — имя события, значение — Set handler'ов
  const subSet = new Set<AnyHandler>();          // подсказка: Set handler'ов для onAny
  const buffer: BufferedEvent[] = [];   
  
  return {
    emit(event, payload) {
        const newObj = {event, payload}

        buffer.push(newObj)

        if(buffer.length > bufferSize) buffer.shift()
            
        const eventKey = subMap.get(newObj.event)

        if(eventKey) {
            const arr = [...eventKey]
            for (const handler of arr) {
                handler(payload)
            }
        }

        const anyHandlers = [...subSet];
            for (const handler of anyHandlers) {
                handler(event, payload);
            }
        
      },
      on(event, handler) {
        // 1. Получить Set или создать новый
        const handlers = subMap.get(event) ?? new Set<Handler>();
        
        // 2. Добавить handler в Set
        handlers.add(handler);
        
        // 3. Положить Set обратно в Map (важно! если создали новый)
        subMap.set(event, handlers);
        
        // 4. Replay: пройтись по buffer, для каждого события с этим именем вызвать handler
        for (const entry of buffer) {
          if (entry.event === event) {
            handler(entry.payload as EventPayload<typeof event>);
          }
        }
        
        // 5. Вернуть функцию отписки
        return () => {
          handlers.delete(handler);
        };
      },
      onAny(handler) {

        subSet.add(handler);
        
        for(const entry of buffer) {
            handler(entry.event, entry.payload)
        }

        return () => {
          subSet.delete(handler);
        };
      },
    clear() {
      
            subMap.clear()
            subSet.clear()
            buffer.length = 0
    }
  };
}