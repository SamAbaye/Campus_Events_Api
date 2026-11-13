import { Injectable } from '@nestjs/common';
import { SEED_EVENTS } from './events.seed.js';
import type { Event } from './events.types.js';

export interface EventsRepository {
  all(): Event[];
  byId(id: number): Event | undefined;
  save(event: Event): Event;
}

@Injectable()
export class EventsRepositoryImpl implements EventsRepository {
  private readonly rows = new Map<number, Event>(
    SEED_EVENTS.map((event) => [event.id, event]),
  );

  all(): Event[] {
    return [...this.rows.values()];
  }

  byId(id: number): Event | undefined {
    return this.rows.get(id);
  }

  save(event: Event): Event {
    this.rows.set(event.id, event);
    return event;
  }
}
