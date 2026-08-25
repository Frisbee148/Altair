# Real-Time Collaborative Code Editor — Comprehensive Project Plan

## 1. Project Overview

Build a browser-based **real-time collaborative code editor** where multiple users can enter the same workspace, edit code simultaneously, communicate through an integrated chat, execute code, and see each other's presence/cursor positions in real time.

The goal is **not** to build another basic Monaco Editor wrapper.

The project should demonstrate understanding of:

* Real-time distributed systems
* WebSockets
* Conflict-free collaborative editing
* TypeScript across the entire stack
* State synchronization
* Authentication and authorization
* Distributed backend architecture
* Sandboxed code execution
* Database design
* Caching
* Horizontal scaling
* Observability
* Fault tolerance
* Testing
* CI/CD
* Containerization

A strong resume description would ultimately position it as:

> **A production-style real-time collaborative IDE supporting concurrent multi-user editing, presence synchronization, isolated code execution, persistent workspaces, and horizontally scalable WebSocket infrastructure.**

---

# 2. Product Vision

The application should feel like a lightweight combination of:

**VS Code + Google Docs + CodeTogether**

A user should be able to:

1. Create an account.
2. Create a project/workspace.
3. Create files inside it.
4. Invite collaborators.
5. Open a file simultaneously with other users.
6. Edit the file concurrently.
7. See other users' cursors and selections.
8. Receive changes in real time.
9. Run the code.
10. View stdout/stderr/output.
11. Chat with collaborators.
12. See who is online.
13. Disconnect and reconnect without losing work.
14. View previous versions of the file.
15. Restore older versions.
16. Continue working even when the backend is horizontally scaled.

---

# 3. Core Features

## MVP

The first version should contain:

### Authentication

* Register
* Login
* Logout
* Password hashing
* JWT/session authentication
* Refresh tokens
* Protected routes

### Project management

* Create project
* Rename project
* Delete project
* Add collaborators
* Remove collaborators
* Project roles

Roles:

```text
OWNER
EDITOR
VIEWER
```

### File system

Support:

```text
Project
 ├── src
 │   ├── index.ts
 │   ├── utils.ts
 │   └── app.ts
 ├── tests
 │   └── app.test.ts
 ├── package.json
 └── README.md
```

Operations:

* Create file
* Delete file
* Rename file
* Create directory
* Rename directory
* Delete directory

### Editor

Use Monaco Editor.

Support:

* Syntax highlighting
* TypeScript
* JavaScript
* JSON
* Markdown
* Python
* Java
* C++
* etc.

### Real-time collaboration

Users editing the same file should see:

* Text changes
* Cursor positions
* Selection ranges
* User names
* User colors
* Online/offline status

### Code execution

Users should be able to:

```text
Run
↓
Create execution job
↓
Queue
↓
Sandbox
↓
Execute
↓
Capture output
↓
Return result
```

### Chat

Project-level chat:

```text
Alice: I fixed the authentication bug.

Bob: Great, I'll review it.
```

### Persistence

Persist:

* Users
* Projects
* Files
* Collaboration sessions
* Versions
* Messages
* Execution jobs

---

# 4. What Makes This Resume-Worthy

A normal project:

```text
React
   ↓
Express
   ↓
MongoDB
```

is not particularly impressive.

Your project should instead demonstrate:

```text
                 ┌───────────────┐
                 │    Browser    │
                 │ Monaco Editor │
                 └───────┬───────┘
                         │
                    WebSocket
                         │
                ┌────────▼────────┐
                │ Collaboration   │
                │     Server      │
                └───────┬─────────┘
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
    Redis Pub/Sub    PostgreSQL      Job Queue
        │                                │
        │                                ▼
        │                         Execution Workers
        │                                │
        │                                ▼
        │                           Sandboxes
        │
        ▼
 Multiple collaboration
       servers
```

This gives you several strong interview topics:

* Why WebSockets?
* Why Redis?
* Why PostgreSQL?
* Why CRDT/OT?
* How does collaboration work?
* What happens when two users edit simultaneously?
* How do you recover after disconnect?
* How do multiple WebSocket servers synchronize?
* How do you prevent arbitrary code execution from compromising the host?
* How do you scale the system?
* How do you guarantee persistence?

---

# 5. Recommended Tech Stack

Everything should be TypeScript/JavaScript based.

## Frontend

### Framework

**Next.js**

Use:

```text
Next.js
React
TypeScript
```

### Editor

**Monaco Editor**

This is the editor used by VS Code and gives the project a professional IDE experience.

### Styling

Use one of:

```text
Tailwind CSS
```

or

```text
CSS Modules
```

Recommended:

**Tailwind CSS**

### State Management

Use:

```text
Zustand
```

Keep global state small.

Example:

```text
authStore
projectStore
editorStore
presenceStore
terminalStore
```

### Client-side collaboration

Use a CRDT implementation such as:

```text
Yjs
```

with a WebSocket provider.

---

# 6. Backend Architecture

Use a modular Node.js backend.

Recommended:

```text
Node.js
TypeScript
Fastify
```

Fastify is a good fit because it is lightweight and performant.

Architecture:

```text
apps/
    web/
    api/
    collaboration/
    worker/
```

You can use a monorepo.

Recommended tooling:

```text
pnpm
Turborepo
```

Structure:

```text
collab-editor/
│
├── apps/
│   ├── web/
│   ├── api/
│   ├── collaboration/
│   └── worker/
│
├── packages/
│   ├── types/
│   ├── config/
│   ├── database/
│   ├── auth/
│   ├── logger/
│   └── shared/
│
├── infra/
│   ├── docker/
│   ├── postgres/
│   └── redis/
│
├── tests/
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# 7. Backend Services

Don't immediately split everything into microservices.

Start with a **modular monolith + dedicated collaboration service + worker**.

Architecture:

```text
                 Internet
                    │
                    ▼
              Load Balancer
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      API Server         Collaboration
                           Servers
          │                   │
          │                   │
          ▼                   ▼
      PostgreSQL            Redis
                               │
                               ▼
                           Pub/Sub
          
API Server
    │
    ▼
  Queue
    │
    ▼
 Worker Pool
    │
    ▼
 Sandboxed Execution
```

---

# 8. API Server Responsibilities

The API server handles normal HTTP operations.

Examples:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:id/files
POST   /api/projects/:id/files
PATCH  /api/files/:id
DELETE /api/files/:id

POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId

GET    /api/files/:id/versions
POST   /api/files/:id/restore

POST   /api/executions
GET    /api/executions/:id

GET    /api/projects/:id/messages
POST   /api/projects/:id/messages
```

---

# 9. Real-Time Collaboration Architecture

This is the most important part of the project.

Do **not** implement collaboration by simply sending:

```text
"replace the entire file"
```

every time someone types.

That does not scale and creates conflicts.

Instead use a CRDT architecture.

Recommended:

```text
Monaco
  ↓
Yjs document
  ↓
WebSocket provider
  ↓
Collaboration server
  ↓
Redis
```

---

# 10. Why CRDT?

Suppose two users start with:

```text
console.log("Hello");
```

Alice adds:

```text
console.log("Hello World");
```

Bob simultaneously changes it to:

```text
console.log("Hello!");
```

A naïve last-write-wins implementation could lose one user's work.

A collaborative editing system needs a mechanism for merging concurrent edits.

CRDTs are designed around this problem.

Your system should maintain a shared document state where operations can be merged deterministically.

---

# 11. Yjs Architecture

Conceptually:

```text
User A
 Monaco
   │
 Y.Text
   │
 Yjs Update
   │
 WebSocket
   │
 Collaboration Server
   │
 Redis
   │
 WebSocket
   │
 User B
```

Each editor maintains a local CRDT representation.

When a user modifies text:

```text
Editor Change
      ↓
Yjs Update
      ↓
Encode update
      ↓
WebSocket
      ↓
Server
      ↓
Broadcast
      ↓
Other clients
```

---

# 12. Presence System

Presence is separate from the actual document state.

Track:

```typescript
interface Presence {
    userId: string;
    name: string;
    color: string;
    cursor?: CursorPosition;
    selection?: Selection;
    status: "active" | "idle";
}
```

Cursor:

```typescript
interface CursorPosition {
    line: number;
    column: number;
}
```

Selection:

```typescript
interface Selection {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
}
```

Presence should be ephemeral.

Do **not** persist every cursor movement into PostgreSQL.

---

# 13. WebSocket Protocol

Define explicit message types.

Example:

```typescript
type ClientMessage =
    | JoinDocumentMessage
    | LeaveDocumentMessage
    | DocumentUpdateMessage
    | AwarenessUpdateMessage
    | PingMessage;
```

Example:

```typescript
interface DocumentUpdateMessage {
    type: "DOCUMENT_UPDATE";
    documentId: string;
    update: Uint8Array;
}
```

Presence:

```typescript
interface AwarenessUpdateMessage {
    type: "AWARENESS_UPDATE";
    documentId: string;
    userId: string;
    cursor?: CursorPosition;
    selection?: Selection;
}
```

This makes the protocol strongly typed.

---

# 14. Multiple Collaboration Servers

This is where the project becomes substantially more interesting.

Suppose:

```text
Alice → Collaboration Server 1

Bob → Collaboration Server 2
```

How does Bob receive Alice's changes?

You cannot rely on an in-memory WebSocket connection alone.

Use Redis Pub/Sub.

```text
Server 1
   │
   │ publish
   ▼
 Redis
   │
   │ subscribe
   ▼
Server 2
```

Example channel:

```text
document:{documentId}
```

Update:

```text
Alice
  ↓
Server 1
  ↓
Redis publish
  ↓
Server 2
  ↓
Bob
```

This allows the collaboration layer to scale horizontally.

---

# 15. Persistence Strategy

Don't write every keystroke directly to PostgreSQL.

Instead:

```text
User edit
   ↓
CRDT update
   ↓
memory
   ↓
Redis
   ↓
periodic persistence
   ↓
PostgreSQL
```

Possible persistence strategy:

```text
Every N seconds
OR
after N updates
OR
when room becomes empty
```

Persist a document snapshot.

Database:

```text
documents
document_snapshots
document_updates
```

For the initial version, snapshots are enough.

Later, implement update logs.

---

# 16. Offline / Reconnection

A strong project should handle:

```text
User loses internet
       ↓
WebSocket disconnect
       ↓
Editor continues locally
       ↓
Network returns
       ↓
Reconnect
       ↓
Synchronize missing updates
```

CRDTs make this significantly easier.

The UI should show:

```text
● Connected
```

or:

```text
● Reconnecting...
```

or:

```text
● Offline
```

---

# 17. Code Execution Architecture

Never execute user-submitted code directly inside the API server.

Bad:

```typescript
exec(userCode);
```

This is dangerous.

Instead:

```text
Client
  ↓
Execution API
  ↓
Job Queue
  ↓
Worker
  ↓
Sandbox
  ↓
Execute
  ↓
Output
  ↓
Client
```

---

# 18. Execution Queue

Use:

**BullMQ + Redis**

Job:

```typescript
interface ExecutionJob {
    id: string;
    projectId: string;
    userId: string;
    language: string;
    files: Record<string, string>;
    entryFile: string;
}
```

Flow:

```text
POST /executions
        ↓
Create job
        ↓
BullMQ
        ↓
Worker
        ↓
Docker sandbox
        ↓
Run program
        ↓
Capture stdout
        ↓
Capture stderr
        ↓
Store result
```

---

# 19. Sandbox Security

The execution container should have:

* CPU limit
* Memory limit
* Execution timeout
* Process limit
* Network disabled
* Read-only base filesystem
* Temporary working directory
* Non-root execution
* Restricted capabilities

Example conceptual Docker invocation:

```text
--network none
--memory 256m
--cpus 0.5
--pids-limit 64
--read-only
```

The exact production hardening should be verified against the container runtime/security model rather than assuming Docker alone makes execution safe.

---

# 20. Languages

Start with:

```text
TypeScript
JavaScript
Python
```

Then optionally add:

```text
Java
C++
Go
Rust
```

But don't start with ten languages.

The resume value comes from architecture, not the number of compilers.

---

# 21. Terminal UI

Create an integrated terminal/output panel.

Example:

```text
┌────────────────────────────────────────┐
│ Editor                                 │
│                                        │
│ const x = 10;                          │
│ console.log(x);                        │
│                                        │
├────────────────────────────────────────┤
│ TERMINAL                               │
│                                        │
│ $ npm test                             │
│                                        │
│ ✓ 12 tests passed                      │
│                                        │
└────────────────────────────────────────┘
```

Tabs:

```text
TERMINAL
OUTPUT
PROBLEMS
```

---

# 22. Project Chat

Add a right-side collaboration panel.

Example:

```text
┌──────────────────┐
│ Team Chat        │
├──────────────────┤
│                  │
│ Alice             │
│ Fixed auth bug   │
│                  │
│ Bob              │
│ I'll review it   │
│                  │
├──────────────────┤
│ Message...       │
└──────────────────┘
```

Chat should support:

```text
@mentions
timestamps
online status
message history
```

A later feature could allow:

```text
"@Alice check line 42"
```

with a clickable editor location.

---

# 23. File Explorer

VS-Code-style:

```text
EXPLORER

▾ src
    index.ts
    auth.ts
    server.ts

▾ tests
    auth.test.ts

package.json
README.md
```

Operations:

```text
Create
Rename
Delete
Move
```

Drag-and-drop can be a later feature.

---

# 24. Collaboration Presence

Top-right:

```text
      🟢 Alice
      🟢 Bob
      🟡 Charlie
```

Editor:

```text
const result = calculate();

// Alice's cursor
             ↑
          Alice
```

Each user should have a consistent generated color within a project.

---

# 25. Authentication

Recommended:

```text
Argon2
```

for password hashing.

Authentication flow:

```text
Register
   ↓
Hash password
   ↓
PostgreSQL
```

Login:

```text
Credentials
   ↓
Verify password
   ↓
Issue session
```

Use secure HTTP-only cookies for browser sessions rather than putting long-lived authentication secrets in localStorage.

---

# 26. Authorization

Every project should enforce:

```text
OWNER
EDITOR
VIEWER
```

Permissions:

| Action         | Owner | Editor |       Viewer |
| -------------- | ----: | -----: | -----------: |
| View files     |     ✓ |      ✓ |            ✓ |
| Edit files     |     ✓ |      ✓ |            ✗ |
| Execute code   |     ✓ |      ✓ | configurable |
| Invite users   |     ✓ |      ✗ |            ✗ |
| Remove users   |     ✓ |      ✗ |            ✗ |
| Delete project |     ✓ |      ✗ |            ✗ |
| View history   |     ✓ |      ✓ |            ✓ |

Authorization must be checked on the server.

Never rely only on frontend UI restrictions.

---

# 27. Database

Use:

**PostgreSQL**

Schema:

```text
users
projects
project_members
files
file_versions
sessions
messages
execution_jobs
execution_results
```

Possible schema:

### users

```text
id
email
username
password_hash
created_at
updated_at
```

### projects

```text
id
name
owner_id
created_at
updated_at
```

### project_members

```text
project_id
user_id
role
created_at
```

### files

```text
id
project_id
parent_id
name
type
path
created_at
updated_at
```

### file_versions

```text
id
file_id
version
snapshot
created_by
created_at
```

### messages

```text
id
project_id
user_id
content
created_at
```

### execution_jobs

```text
id
project_id
user_id
language
status
created_at
started_at
finished_at
```

---

# 28. Redis Usage

Redis should have multiple responsibilities.

## 1. Pub/Sub

Cross-server collaboration events.

```text
document:{id}
presence:{projectId}
```

## 2. Queue backend

BullMQ.

## 3. Ephemeral state

Examples:

```text
presence:{documentId}
active-users:{projectId}
```

## 4. Rate limiting

Examples:

```text
login attempts
execution requests
WebSocket connection attempts
```

---

# 29. Caching

Potential cache:

```text
project metadata
user sessions
file tree
```

But don't aggressively cache everything.

The database remains the source of truth for durable application state.

---

# 30. Frontend Architecture

Recommended structure:

```text
src/
├── app/
│
├── components/
│   ├── editor/
│   ├── explorer/
│   ├── terminal/
│   ├── chat/
│   ├── presence/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── projects/
│   ├── collaboration/
│   ├── execution/
│   └── chat/
│
├── hooks/
├── lib/
├── stores/
├── types/
└── utils/
```

---

# 31. Editor Architecture

Important distinction:

```text
Monaco Editor
```

is responsible for the editing UI.

```text
Yjs
```

is responsible for collaborative document state.

Do not tightly couple your application logic to Monaco.

Architecture:

```text
               Monaco
                 │
                 ▼
          Editor Adapter
                 │
                 ▼
               Y.Text
                 │
           ┌─────┴─────┐
           │           │
       Local State   Network
                       │
                    WebSocket
```

This makes the collaboration layer replaceable.

---

# 32. Opening a File

Flow:

```text
User clicks index.ts
        ↓
GET file metadata
        ↓
Open collaboration room
        ↓
Create Y.Doc
        ↓
Connect provider
        ↓
Synchronize state
        ↓
Bind Y.Text ↔ Monaco
```

---

# 33. Closing a File

When the user closes a file:

```text
Detach Monaco
      ↓
Stop awareness updates
      ↓
Remove document subscription
      ↓
Leave room
```

If no users remain:

```text
Persist snapshot
      ↓
Destroy in-memory room
```

---

# 34. Room Management

The collaboration server maintains rooms:

```typescript
Map<DocumentId, CollaborationRoom>
```

A room:

```typescript
interface CollaborationRoom {
    documentId: string;
    clients: Set<Client>;
    document: Y.Doc;
    lastActivity: number;
}
```

For multiple server instances, room membership is local to each server while updates propagate through Redis.

---

# 35. WebSocket Connection Lifecycle

```text
CONNECT
   ↓
AUTHENTICATE
   ↓
SUBSCRIBE
   ↓
JOIN DOCUMENT
   ↓
SYNC STATE
   ↓
AWARENESS
   ↓
DOCUMENT UPDATES
   ↓
PING/PONG
   ↓
DISCONNECT
```

Handle:

```text
authentication failure
invalid room
permission denied
malformed message
heartbeat timeout
reconnection
duplicate connections
```

---

# 36. Error Handling

Every backend response should have consistent structure.

Example:

```typescript
interface ApiError {
    code: string;
    message: string;
    requestId: string;
}
```

Example:

```json
{
  "code": "PROJECT_ACCESS_DENIED",
  "message": "You do not have access to this project.",
  "requestId": "req_123"
}
```

Do not expose sensitive internal error details.

---

# 37. Validation

Use:

**Zod**

for runtime validation.

Example:

```typescript
const CreateProjectSchema = z.object({
    name: z.string().min(1).max(100)
});
```

Use these schemas across:

```text
HTTP
WebSocket
queue messages
environment variables
```

---

# 38. Type Safety

A major advantage of using TypeScript everywhere is shared contracts.

Create:

```text
packages/types
```

Example:

```typescript
export interface Project {
    id: string;
    name: string;
    ownerId: string;
}
```

Then:

```text
Frontend
     ↓
shared types
     ↑
Backend
```

This avoids duplicated interfaces.

---

# 39. API Contract

Use either:

```text
OpenAPI
```

or a strongly typed RPC approach.

A good option:

```text
tRPC
```

for application APIs.

However, because the project explicitly demonstrates backend architecture and interoperable APIs, REST + OpenAPI is arguably easier to demonstrate in interviews.

Recommended:

```text
REST
+
OpenAPI
+
Zod
```

---

# 40. Logging

Use:

**Pino**

Structured logs:

```json
{
  "level": "info",
  "requestId": "abc123",
  "userId": "u123",
  "projectId": "p123",
  "event": "document_update"
}
```

Avoid:

```text
console.log("something happened")
```

throughout production code.

---

# 41. Observability

For a resume-level project, add:

```text
OpenTelemetry
```

Track:

```text
HTTP latency
WebSocket connections
document synchronization latency
execution queue latency
execution duration
database latency
Redis latency
```

Metrics should include:

```text
active_users
active_documents
websocket_connections
execution_jobs_total
execution_failures_total
document_sync_latency
```

---

# 42. Distributed Tracing

For an execution request:

```text
Browser
   ↓
API
   ↓
Redis/BullMQ
   ↓
Worker
   ↓
Docker
```

A trace can show that entire lifecycle.

This is particularly useful when discussing distributed systems in interviews.

---

# 43. Rate Limiting

Important endpoints:

```text
/login
/register
/executions
/chat messages
WebSocket connection
```

Example conceptual policy:

```text
Login:
5 attempts / minute / IP
```

Exact production values should be configurable rather than hardcoded.

---

# 44. Security Requirements

Implement:

```text
HTTPS
secure cookies
CSRF protection where applicable
CORS restrictions
Content Security Policy
rate limiting
input validation
authorization checks
SQL parameterization/ORM
sandboxed execution
dependency auditing
secret management
```

Never allow:

```text
user code → API server shell
```

---

# 45. ORM

Use:

**Drizzle ORM**

or:

**Prisma**

For this project I would choose **Drizzle** because it keeps SQL concepts relatively visible while remaining strongly typed.

---

# 46. Testing Strategy

Do not only write frontend component tests.

You need several testing layers.

## Unit tests

Test:

```text
permission logic
file tree operations
message validation
execution state transitions
utility functions
```

## Integration tests

Test:

```text
API + PostgreSQL
API + Redis
queue + worker
```

## Collaboration tests

Very important.

Simulate:

```text
Client A edits
Client B edits
A and B edit simultaneously
A disconnects
B continues
A reconnects
```

Verify convergence.

---

# 47. End-to-End Tests

Use:

**Playwright**

Example:

```text
Browser A logs in
Browser B logs in

A opens project
B joins project

A edits index.ts

B observes update

B modifies another section

A observes update

A runs code

A receives output
```

This is excellent resume evidence.

---

# 48. Performance Testing

Use:

**k6**

Test:

```text
100 WebSocket clients
500 WebSocket clients
1000 WebSocket clients
```

Measure:

```text
connection success rate
message latency
CPU usage
memory usage
Redis throughput
```

Don't claim a performance number until you actually benchmark it.

---

# 49. CI/CD

Use:

**GitHub Actions**

Pipeline:

```text
Pull Request
     ↓
Lint
     ↓
Typecheck
     ↓
Unit Tests
     ↓
Integration Tests
     ↓
Build
     ↓
Docker Build
```

Main branch:

```text
merge
 ↓
build image
 ↓
push registry
 ↓
deploy
```

---

# 50. Docker

Development:

```text
docker-compose
```

Services:

```text
postgres
redis
api
collaboration
worker
web
```

Example:

```text
                    ┌───────────┐
                    │   Web     │
                    └─────┬─────┘
                          │
              ┌───────────┴──────────┐
              ▼                      ▼
          API Server            Collaboration
              │                      │
              ▼                      ▼
          PostgreSQL               Redis
              ▲                      ▲
              │                      │
              └────── Worker ────────┘
```

---

# 51. Deployment Architecture

A reasonable first production deployment:

```text
Cloudflare
     │
     ▼
Load Balancer
     │
 ┌───┴───────────┐
 │               │
 ▼               ▼
Web             API
                 │
        ┌────────┴────────┐
        ▼                 ▼
     Redis             PostgreSQL
        │
        ▼
   Collaboration
      Servers
        │
        ▼
     Workers
        │
        ▼
    Sandboxes
```

Possible cloud choices:

```text
AWS
GCP
Azure
Fly.io
Render
Railway
```

For a serious portfolio project, AWS is useful for learning infrastructure, but the project architecture should remain cloud-agnostic where practical.

---

# 52. Recommended Repository

```text
collaborative-editor/
│
├── apps/
│   │
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   └── stores/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── projects/
│   │   │   │   ├── files/
│   │   │   │   ├── chat/
│   │   │   │   └── execution/
│   │   │   └── server.ts
│   │
│   ├── collaboration/
│   │   ├── src/
│   │   │   ├── rooms/
│   │   │   ├── protocol/
│   │   │   ├── websocket/
│   │   │   ├── persistence/
│   │   │   └── redis/
│   │
│   └── worker/
│       ├── src/
│       │   ├── queues/
│       │   ├── executors/
│       │   ├── sandbox/
│       │   └── workers/
│
├── packages/
│   ├── types/
│   ├── config/
│   ├── database/
│   ├── auth/
│   ├── logger/
│   └── validation/
│
├── infra/
│   ├── docker/
│   └── scripts/
│
├── tests/
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# 53. Development Phases

Do **not** build everything simultaneously.

## Phase 1 — Foundation

Build:

```text
monorepo
Next.js
Fastify
PostgreSQL
Drizzle
Redis
Docker
```

Deliverable:

```text
Application boots locally with one command.
```

---

# 54. Phase 2 — Authentication

Implement:

```text
register
login
logout
sessions
protected routes
```

Deliverable:

```text
User can securely log in.
```

---

# 55. Phase 3 — Project Management

Implement:

```text
create project
project list
project page
members
roles
```

Deliverable:

```text
User can create collaborative workspace.
```

---

# 56. Phase 4 — File System

Implement:

```text
file tree
create file
delete file
rename file
directories
```

Deliverable:

```text
Project behaves like a small IDE.
```

---

# 57. Phase 5 — Monaco

Add:

```text
Monaco
tabs
syntax highlighting
file switching
editor state
```

At this point it becomes a normal code editor.

---

# 58. Phase 6 — Single-User Persistence

Implement:

```text
autosave
snapshots
version history
restore
```

Before introducing collaboration, ensure documents persist correctly.

---

# 59. Phase 7 — Collaboration

This is the major milestone.

Implement:

```text
Yjs
WebSocket
rooms
document synchronization
presence
cursor positions
selections
```

Deliverable:

```text
Two browser windows edit the same file simultaneously.
```

---

# 60. Phase 8 — Horizontal Scaling

Run:

```text
collaboration-1
collaboration-2
```

Then:

```text
Client A → server 1
Client B → server 2
```

Synchronize through:

```text
Redis Pub/Sub
```

This is an excellent demonstration feature.

---

# 61. Phase 9 — Code Execution

Implement:

```text
BullMQ
worker
Docker sandbox
execution API
terminal
results
timeouts
```

Deliverable:

```text
User writes TypeScript → Run → output appears.
```

---

# 62. Phase 10 — Chat

Implement:

```text
project chat
message persistence
real-time delivery
presence
```

---

# 63. Phase 11 — Reliability

Add:

```text
reconnection
retry policies
heartbeats
idempotency
timeouts
error recovery
```

---

# 64. Phase 12 — Testing

Add:

```text
unit
integration
collaboration convergence
E2E
load tests
```

---

# 65. Phase 13 — Observability

Implement:

```text
structured logs
metrics
tracing
request IDs
dashboard
```

---

# 66. Phase 14 — Deployment

Deploy:

```text
frontend
API
collaboration
workers
PostgreSQL
Redis
```

Then test:

```text
multiple users
multiple servers
network failure
worker failure
database restart
```

---

# 67. Final User Flow

A polished demo should look like this:

```text
Landing Page
      ↓
Login
      ↓
Dashboard
      ↓
Create Project
      ↓
Workspace
      │
      ├── File Explorer
      │
      ├── Monaco Editor
      │
      ├── Presence
      │
      ├── Chat
      │
      └── Terminal
```

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ CodeSync       project-alpha       ● 3 collaborators    Run │
├───────────────┬───────────────────────────────────┬──────────┤
│ EXPLORER      │                                   │ CHAT     │
│               │  1 const app = express();        │          │
│ ▾ src         │  2                               │ Alice    │
│   index.ts    │  3 app.get("/", () => {          │ Looks    │
│   auth.ts     │  4     ...                       │ good     │
│               │  5 });                           │          │
│ package.json  │                                   │ Bob      │
│               │        ↑ Bob's cursor            │ I'll     │
│               │                                   │ test it  │
├───────────────┴───────────────────────────────────┴──────────┤
│ TERMINAL                                                     │
│ $ npm test                                                   │
│ ✓ 18 tests passed                                            │
└──────────────────────────────────────────────────────────────┘
```

---

# 68. Resume-Level Differentiators

After the core system works, add **two or three**, not twenty.

### Version history

```text
Version 42
Version 41
Version 40
```

Diff:

```text
- old code
+ new code
```

### Comments

Users can comment on lines.

```text
const x = calculate();
          └── Bob: Should this be cached?
```

### File locking indicators

Not as the mechanism for collaboration, but as useful UI:

```text
Editing:
Alice
Bob
```

### Session replay

Record collaboration events and replay a session.

### Code review

Add:

```text
diff
comments
approve
request changes
```

### AI assistant

Only after the collaboration architecture works.

For example:

```text
Explain selected code
Generate tests
Fix error
```

AI should be an optional feature rather than the central selling point.

---

# 69. What You Should NOT Build Initially

Avoid scope explosion.

Do not initially build:

```text
video conferencing
voice chat
full Git hosting
complete VS Code extension marketplace
20 programming languages
AI agent
microservice architecture with 15 services
Kubernetes cluster
custom compiler infrastructure
```

These make the project larger without necessarily making it better.

---

# 70. MVP Definition

The MVP is complete when this scenario works:

```text
User A logs in
      ↓
Creates project
      ↓
Creates index.ts
      ↓
Invites User B
      ↓
User B joins
      ↓
Both open index.ts
      ↓
A types
      ↓
B sees it instantly
      ↓
B types simultaneously
      ↓
Both converge to same document
      ↓
Both see each other's cursors
      ↓
A clicks Run
      ↓
Code executes inside sandbox
      ↓
Output appears
      ↓
Both disconnect
      ↓
Reopen project
      ↓
Code remains persisted
```

That alone is a strong project.

---

# 71. Full Architecture

The final architecture should approximately be:

```text
                         ┌──────────────────────┐
                         │      Browser         │
                         │                      │
                         │ Next.js              │
                         │ Monaco               │
                         │ Yjs                  │
                         │ Zustand              │
                         └──────────┬───────────┘
                                    │
                       HTTPS / WebSocket
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
              ┌─────────────┐              ┌──────────────┐
              │ API Servers │              │ Collaboration│
              │             │              │   Servers    │
              │ Fastify     │              │ WebSocket    │
              └──────┬──────┘              └──────┬───────┘
                     │                             │
                     │                             │
             ┌───────┴────────┐               ┌────┴─────┐
             │                │               │          │
             ▼                ▼               ▼          ▼
       PostgreSQL           Redis          Pub/Sub    Presence
             │                │
             │                ▼
             │             BullMQ
             │                │
             │                ▼
             │             Workers
             │                │
             │                ▼
             │             Sandboxes
             │
             ▼
        Persistent Data
```

---

# 72. Technology Summary

| Layer         | Technology          |
| ------------- | ------------------- |
| Language      | TypeScript          |
| Frontend      | Next.js + React     |
| Editor        | Monaco              |
| Collaboration | Yjs                 |
| Transport     | WebSocket           |
| API           | Fastify             |
| Validation    | Zod                 |
| Database      | PostgreSQL          |
| ORM           | Drizzle             |
| Cache/PubSub  | Redis               |
| Queue         | BullMQ              |
| Execution     | Docker sandbox      |
| State         | Zustand             |
| Styling       | Tailwind            |
| Testing       | Vitest + Playwright |
| Load Testing  | k6                  |
| Logging       | Pino                |
| Observability | OpenTelemetry       |
| Containers    | Docker              |
| CI/CD         | GitHub Actions      |
| Monorepo      | pnpm + Turborepo    |

---

# 73. Suggested Project Name

A few names that fit the project:

```text
CodeSync
CollabCode
CodeMesh
PairForge
SyncIDE
LiveCode
CodeTogether
DevSync
```

I would choose something like:

**CodeMesh — Real-Time Collaborative Development Environment**

It sounds considerably more substantial than:

> “Online collaborative code editor.”

---

# 74. Final Resume Positioning

Once completed and actually benchmarked, the project can be described along these lines:

> **Altair — Real-Time Collaborative IDE**
>
> Built a TypeScript-based collaborative development environment supporting concurrent multi-user editing using CRDT-based synchronization, WebSockets, Monaco Editor, Redis Pub/Sub, and PostgreSQL; implemented horizontally scalable collaboration servers, persistent document snapshots, role-based project access, and isolated Docker-based code execution through a Redis-backed job queue.

The strongest interview topics from this project will be:

```text
CRDTs
WebSockets
Redis Pub/Sub
distributed state
connection lifecycle
reconnection
event propagation
horizontal scaling
sandbox security
job queues
PostgreSQL schema design
authentication
authorization
observability
load testing
```

That combination is what makes the project substantially stronger than a typical CRUD + Monaco application.

