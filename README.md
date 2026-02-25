# <div style="display:flex; flex-direction:row; gap:18px; align-items:center;"><img src="./icon.svg" style="height:64px"/> Conversation Session Service </div>

A small NestJS + MongoDB service powering conversation sessions and their events for a Voice AI platform.

It exposes APIs to create/upsert sessions, append immutable events, fetch a session with its events (with pagination), and complete a session.

---

### Stack

- **Runtime**: Node.js (TypeScript)
- **Framework**: NestJS
- **Database**: MongoDB (via `@nestjs/mongoose` / `mongoose`)

---

### Prerequisites

- Node.js 20+ installed
- npm (comes with Node)
- A running MongoDB instance (local or remote)

By default the service connects to:

- URI: `mongodb://127.0.0.1:27017`
- Database name: `voiceAI`

You can adjust this in `src/app.module.ts` if needed.

---

### Setup

From the project root:

```bash
cd conversation-session-service
npm install
```

Build the project:

```bash
npm run build
```

Run in development mode (with watch):

```bash
npm run start:dev
```

Run in production mode (after `npm run build`):

```bash
npm run start:prod
```

The service listens on `http://localhost:3000` by default.

---

### API Overview

Base URL: `http://localhost:3000`
Before making any api call you need to get UUID's for sessionId and eventId, I used online UUID generators.
Here's the [uuid-generator link](https://fusionauth.io/dev-tools/uuid-generator)

#### 1. Create or Upsert Session

- **Endpoint**: `POST /sessions`
- **Behavior**:
  - If `sessionId` does **not** exist: creates a new session.
  - If `sessionId` already exists: returns the existing session (no changes).
- **Body**:

```json
{
  "sessionId": "uuid-string",
  "status": "initiated | active | completed | failed",
  "language": "en",
  "startedAt": "2024-01-01T00:00:00.000Z",
  "endedAt": "2024-01-01T00:10:00.000Z",
  "metadata": {
    "any": "json"
  }
}
```

- **Response**: `201 Created`

```json
{
    "message": "Session retrieved or created successfully",
    "session": {
        "_id": "699e0b60d70db9de8d536a19",
        "sessionId": "44af1a89-978d-48fc-b4b7-95820f92f201",
        "__v": 0,
        "endedAt": "2026-02-24T20:38:53.932Z",
        "language": "en",
        "metadata": {
            "any": "json"
        },
        "startedAt": "2025-02-01T00:00:00.000Z",
        "status": "completed"
    }
}
```

Idempotent under repeated calls for the same `sessionId`.


#### 2. Get Sessions

- **Endpoint**: `GET /sessions`
- **Behavior**:
  - Returns sessions.
  - Returns sessions ordered by `timestamp` ascending.
  - Supports simple limit/offset pagination.

- **Response**: `200 Ok`

```json
{
    "pagination": {
        "limit": 50,
        "offset": 0,
        "total": 3
    },
    "sessions": [
        {
            "_id": "699f34431ae5a3dc40776831",
            "sessionId": "c2046bef-aab2-4629-b73d-acd02fb2e7ac",
            "__v": 0,
            "endedAt": "2026-02-25T17:47:56.347Z",
            "language": "en",
            "metadata": {
                "any": "json"
            },
            "startedAt": "2024-01-01T00:00:00.000Z",
            "status": "completed"
        },
        {
            "_id": "699e0a80d70db9de8d536a17",
            "sessionId": "551db9e2-7775-40a4-9c3f-20610f9811e3",
            "__v": 0,
            "endedAt": null,
            "language": "en",
            "metadata": {
                "any": "json"
            },
            "startedAt": "2025-01-01T00:00:00.000Z",
            "status": "active"
        },
        {
            "_id": "699e0b60d70db9de8d536a19",
            "sessionId": "44af1a89-978d-48fc-b4b7-95820f92f201",
            "__v": 0,
            "endedAt": "2026-02-25T17:43:56.402Z",
            "language": "en",
            "metadata": {
                "any": "json"
            },
            "startedAt": "2025-02-01T00:00:00.000Z",
            "status": "completed"
        }
    ]
}
```

#### 3. Add Event to Session

- **Endpoint**: `POST /sessions/:sessionId/events`
- **Behavior**:
  - Session must exist.
  - `(sessionId, eventId)` must be unique per session.
  - Duplicate requests with the same `(sessionId, eventId)` return the same event (no duplication).
- **Body**:

```json
{
  "eventId": "uuid-string",
  "sessionId": "same-as-path-param",
  "type": "user_speech | bot_speech | system",
  "payload": {
    "any": "json"
  },
  "timestamp": "2024-01-01T00:00:01.000Z"
}
```

- **Response**: `201 Created`

```json
{
    "message": "Event added successfully",
    "event": {
        "_id": "699e0bfed70db9de8d536a1a",
        "eventId": "47fcf5a0-7b80-4a28-baf2-01cdcc4cc39b",
        "sessionId": "44af1a89-978d-48fc-b4b7-95820f92f201",
        "__v": 0,
        "payload": {
            "any": "json"
        },
        "timestamp": "2025-02-01T00:10:01.000Z",
        "type": "system"
    }
}
```

#### 4. Get Session with Events (Paginated)

- **Endpoint**: `GET /sessions/:sessionId`
- **Query params**:
  - `limit` (optional, default `50`, max `100`)
  - `offset` (optional, default `0`)
- **Behavior**:
  - Returns the session document.
  - Returns events ordered by `timestamp` ascending.
  - Supports simple limit/offset pagination.
- **Response**:

```json
{
    "session": {
        "_id": "699e0b60d70db9de8d536a19",
        "sessionId": "44af1a89-978d-48fc-b4b7-95820f92f201",
        "__v": 0,
        "endedAt": "2026-02-24T20:38:53.932Z",
        "language": "en",
        "metadata": {
            "any": "json"
        },
        "startedAt": "2025-02-01T00:00:00.000Z",
        "status": "completed"
    },
    "events": [
        {
            "_id": "699e0bfed70db9de8d536a1a",
            "eventId": "47fcf5a0-7b80-4a28-baf2-01cdcc4cc39b",
            "sessionId": "44af1a89-978d-48fc-b4b7-95820f92f201",
            "__v": 0,
            "payload": {
                "any": "json"
            },
            "timestamp": "2025-02-01T00:10:01.000Z",
            "type": "system"
        }
    ],
    "pagination": {
        "limit": 50,
        "offset": 0,
        "total": 1
    }
}
```

#### 5. Complete Session

- **Endpoint**: `POST /sessions/:sessionId/complete`
- **Behavior**:
  - Sets `status` to `completed`.
  - Sets `endedAt` to the current server time.
  - Idempotent: repeated calls keep the session completed.
- **Response**: `200 OK`

```json
{
    "message": "Session completed successfully",
    "session": {
        "_id": "699e0b60d70db9de8d536a19",
        "sessionId": "44af1a89-978d-48fc-b4b7-95820f92f201",
        "__v": 0,
        "endedAt": "2026-02-24T20:55:02.282Z",
        "language": "en",
        "metadata": {
            "any": "json"
        },
        "startedAt": "2025-02-01T00:00:00.000Z",
        "status": "completed"
    }
}
```

---

### Error Handling

- Returns standard NestJS HTTP errors (`400`, `404`, etc.).
- Examples:
  - `404 Not Found` when a session does not exist.
  - `400 Bad Request` when validation fails or `sessionId` in the body does not match the URL.

---

### Assumptions

- `sessionId` and `eventId` are UUIDs provided by upstream systems.
- Authentication/authorization is handled by an upstream API gateway or service; this project focuses on core session storage and retrieval only.
- Payloads for events and metadata are arbitrary JSON objects stored as-is.
- Time fields (`startedAt`, `timestamp`, `endedAt`) are passed as ISO-8601 strings and transformed into `Date` objects by NestJS validation/transform.

