export const EventStatuses = ['Upcoming', 'Past', 'Ongoing', 'Canceled'] as const;
export const SessionModes = ['Online', 'Offline', 'Canceled'] as const;

export type EventStatus = (typeof EventStatuses)[number];
export type SessionMode = (typeof SessionModes)[number];

export type Event = {
  readonly id: number;
  title: string;
  description: string;
  location: string;
  eventDate: Date;
  category: string;
  isPublished: boolean;
  status: EventStatus;
  sessions: Session[];
};

export type Session = {
  readonly id: number;
  eventId: number;
  title: string;
  startAt: string;
  endAt: string;
  room: string;
  mode: SessionMode;
};

export type FindEventsQuery = {
  category?: string;
  location?: string;
  isPublished?: boolean;
  sortBy?: 'eventDate' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};
