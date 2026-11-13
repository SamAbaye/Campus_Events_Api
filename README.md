# Campus Events API

A NestJS and TypeScript API for browsing campus events and their sessions. The project uses in-memory sample data, so it does not need a database.

## Requirements

- Node.js
- npm

## Run the API

From the project folder, install dependencies and start the development server:

```bash
npm install
npm run start:dev
```

The API listens on `http://localhost:3000`. Event routes use the `/api` prefix.

## Data model

- An event has an ID, title, description, location, date, category, publication flag, status, and a list of sessions.
- A session has an ID, event ID, title, start and end times, room, and mode.
- A session's `eventId` should match the ID of the event whose `sessions` array contains it.
- Seed data is defined in `src/events/events.seed.ts`. Changes made through the API are kept in memory and reset when the server restarts.

Event statuses are `Upcoming`, `Past`, `Ongoing`, and `Canceled`. Session modes are `Online`, `Offline`, and `Canceled`.

## Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/events` | List events with optional filtering, sorting, and pagination |
| GET | `/api/events/upcoming` | List events dated today or later |
| GET | `/api/events/:id` | Get one event by ID |
| GET | `/api/events/:eventId/sessions` | List sessions belonging to an event |
| GET | `/api/events/:eventId/sessions/:sessionId` | Get one session belonging to an event |
| POST | `/api/events` | Create an event |

The fixed `/upcoming` route is declared before the dynamic `/:id` route so that `upcoming` is treated as a route name, not an event ID.

## List options

`GET /api/events` supports these query parameters:

| Parameter | Description | Example |
| --- | --- | --- |
| `category` | Filter by category (case-insensitive exact match) | `?category=technology` |
| `location` | Filter by location (case-insensitive exact match) | `?location=online` |
| `isPublished` | Filter by publication status | `?isPublished=true` |
| `sortBy` | Sort by `eventDate` or `title` | `?sortBy=eventDate` |
| `order` | Sort `asc` or `desc` | `?order=desc` |
| `page` | Page number, starting at 1; default is 1 | `?page=2` |
| `limit` | Items per page; default is 5 | `?limit=3` |

Filtering happens first, sorting second, and pagination last. The API sorts a copy of the results so the seed data keeps its original order.

The list response has this shape:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 5,
  "totalPages": 0
}
```

For example:

```text
GET /api/events?category=technology&sortBy=eventDate&order=asc&page=1&limit=5
```

## Create an event

Send JSON to `POST /api/events`. `title`, `description`, `category`, `location`, and `eventDate` are required. `eventDate` must be a valid date. `status` and `isPublished` are optional; when omitted, status is set to `Upcoming` for today or a future date and `Past` for an earlier date, and `isPublished` defaults to `true`. New events start with an empty sessions list.

Example using curl in Bash:

```bash
curl -i -X POST "http://localhost:3000/api/events" \
  -H "Content-Type: application/json" \
  --data-raw '{"title":"Intro to Cloud Computing","description":"A beginner-friendly campus workshop.","location":"Engineering Block, Room 2","eventDate":"2026-12-04T09:00:00.000Z","category":"technology","isPublished":true}'
```

## Try the API with curl

```bash
curl -i "http://localhost:3000/api/events"
curl -i "http://localhost:3000/api/events?category=technology"
curl -i "http://localhost:3000/api/events?isPublished=false"
curl -i "http://localhost:3000/api/events?sortBy=eventDate&order=asc&page=1&limit=2"
curl -i "http://localhost:3000/api/events/upcoming"
curl -i "http://localhost:3000/api/events/1"
curl -i "http://localhost:3000/api/events/1/sessions"
curl -i "http://localhost:3000/api/events/1/sessions/101"
curl -i "http://localhost:3000/api/events/9999"
```

The `-i` option prints the HTTP status code with each response.

## Status codes

- `200 OK` for successful GET requests.
- `201 Created` for a successful event creation.
- `400 Bad Request` for invalid request data or query parameters.
- `404 Not Found` when the requested event or a session under that event does not exist.
