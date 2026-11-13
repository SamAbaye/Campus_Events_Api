import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EVENTS_REPOSITORY_TOKEN } from './events.constants.js';
import type { CreateEventDto } from './dto/create-events.dto.js';
import type { EventsRepository } from './events.repository.js';
import type { Event, FindEventsQuery, Session } from './events.types.js';

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENTS_REPOSITORY_TOKEN)
    private readonly eventsRepository: EventsRepository,
  ) {}

  findAll(query: FindEventsQuery) {
    const filtered = this.eventsRepository.all().filter((event) => {
      const matchesCategory = query.category
        ? event.category.toLowerCase() === query.category.toLowerCase()
        : true;
      const matchesLocation = query.location
        ? event.location.toLowerCase() === query.location.toLowerCase()
        : true;
      const matchesPublished =
        query.isPublished === undefined || event.isPublished === query.isPublished;

      return matchesCategory && matchesLocation && matchesPublished;
    });

    const sortBy = query.sortBy ?? 'eventDate';
    const direction = query.order === 'desc' ? -1 : 1;
    const sorted = [...filtered].sort((a, b) => {
      const comparison =
        sortBy === 'title'
          ? a.title.localeCompare(b.title)
          : a.eventDate.getTime() - b.eventDate.getTime();
      return comparison * direction;
    });

    const page = query.page ?? 1;
    const limit = query.limit ?? 5;
    const offset = (page - 1) * limit;

    return {
      items: sorted.slice(offset, offset + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  findUpcoming(): Event[] {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    return this.eventsRepository
      .all()
      .filter((event) => event.eventDate.getTime() >= startOfToday.getTime())
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  }

  findById(id: number): Event {
    const event = this.eventsRepository.byId(id);
    if (!event) {
      throw new NotFoundException(`Event ${id} was not found`);
    }
    return event;
  }

  findSessions(eventId: number): Session[] {
    return this.findById(eventId).sessions;
  }

  findSession(eventId: number, sessionId: number): Session {
    const event = this.findById(eventId);
    const session = event.sessions.find((item) => item.id === sessionId);
    if (!session) {
      throw new NotFoundException(
        `Session ${sessionId} was not found under event ${eventId}`,
      );
    }
    return session;
  }

  create(dto: CreateEventDto): Event {
    const nextId = Math.max(0, ...this.eventsRepository.all().map((event) => event.id)) + 1;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const status =
      dto.status ?? (dto.eventDate >= today ? 'Upcoming' : 'Past');

    return this.eventsRepository.save({
      ...dto,
      id: nextId,
      status,
      isPublished: dto.isPublished ?? true,
      sessions: [],
    });
  }
}
