import {Body, Controller, Get, Param, ParseIntPipe, Post, Query} from '@nestjs/common';
import { CreateEventDto } from './dto/create-events.dto.js';
import { FindEventsQueryDto } from './dto/find-events-query.dto.js';
import { EventsService } from './events.service.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get()
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':eventId/sessions/:sessionId')
  findSession(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.eventsService.findSession(eventId, sessionId);
  }

  @Get(':eventId/sessions')
  findSessions(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventsService.findSessions(eventId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findById(id);
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    return this.eventsService.create(body);
  }
}
