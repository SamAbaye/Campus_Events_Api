import { Module } from '@nestjs/common';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { EVENTS_REPOSITORY_TOKEN } from './events.constants.js';
import { EventsRepositoryImpl } from './events.repository.js';
@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: EVENTS_REPOSITORY_TOKEN,
      useClass: EventsRepositoryImpl,
    }
  ]
})
export class EventsModule {}
