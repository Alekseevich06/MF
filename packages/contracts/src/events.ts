export interface BookHubEvents {
  'catalog:book-opened': {
    bookId: string;
    authorId: string;
    timestamp: number;
  };
  'catalog:filter-changed': {
    authorIds: string[];
  };
  'authors:author-selected': {
    authorId: string;
  };
  'analytics:report-requested': {
    authorIds: string[];
    from: string;
    to: string;
  };
}

export type EventName = keyof BookHubEvents;
export type EventPayload<K extends EventName> = BookHubEvents[K];
