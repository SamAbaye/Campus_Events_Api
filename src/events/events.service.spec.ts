import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service.js';
import { EVENTS_REPOSITORY_TOKEN } from './events.constants.js';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: EVENTS_REPOSITORY_TOKEN, useValue: {} },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
