# Agent Guide: next-generation-scrum-poker

## Project Overview

A **Scrum Poker** web application for distributed team estimation during agile ceremonies. Real-time collaboration via WebSockets, serverless backend, Preact frontend.

## Design Goals

1. **Implement Only What's Needed**
   - No over-engineering, over-abstraction, or speculative features
   - Keep the codebase lean and focused on essential functionality
   - Prefer simple, direct solutions over complex patterns

2. **Test New Features**
   - Add unit tests alongside new components/functions
   - Add E2E tests for significant user flows
   - Follow existing testing patterns in the codebase

## Architecture

```
Frontend (Preact + Vite) ←→ WebSocket API Gateway ←→ Lambda Functions ←→ DynamoDB
```

### Key Directories

| Directory                  | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `frontend/src/Components/` | UI components organized by feature                           |
| `backend/`                 | Lambda functions: `onconnect`, `ondisconnect`, `sendmessage` |
| `backend/shared/database/` | DynamoDB operations                                          |
| `shared/`                  | Code shared between frontend and backend                     |
| `e2e/`                     | Playwright E2E tests with Page Object Model                  |

### Data Model

- **Connection**: Links WebSocket connection to user and session
- **Group**: Session containing scale, votes, visibility, and connected users

## Communication Protocol

### Client → Server

| Type           | Purpose                                    |
| -------------- | ------------------------------------------ |
| `login`        | Join session with user name and session ID |
| `set-vote`     | Submit vote                                |
| `set-scale`    | Change voting scale                        |
| `reveal-votes` | Show all votes                             |
| `reset-votes`  | Clear votes for new round                  |
| `remove-user`  | Remove user from session                   |

### Server → Client

| Type            | Purpose                    |
| --------------- | -------------------------- |
| `state`         | Full state update          |
| `not-logged-in` | Disconnection notification |

## Development Commands

```bash
npm start              # Local dev (backend + frontend)
npm test               # Unit tests (Vitest)
npm run e2e            # E2E tests (Playwright)
npm run e2e:ui         # E2E tests in UI mode
npm run build          # Production build
npm run lint           # ESLint
npm run format         # Prettier
```

## Technology Stack

- **Frontend**: Preact, TypeScript, Vite, CSS Modules, Chartist
- **Backend**: AWS Lambda, DynamoDB, WebSocket API Gateway
- **Testing**: Vitest, Playwright, Testing Library

## Key Patterns

- **WebSocket Context**: [`WebSocket.tsx`](frontend/src/Components/WebSocket/WebSocket.tsx) provides connection state and actions via context
- **Shared Types**: [`shared/`](shared/) ensures type consistency between frontend and backend
- **Page Objects**: E2E tests use Page Object Model in [`e2e/pages/`](e2e/pages/)
- **Component Tests**: Unit tests colocated with components as `.test.tsx` files

## Intentional Design Decisions

- **No Authentication**: Tool is free and open for all users
- **No Session Persistence**: Sessions are temporary and privacy-friendly
- **No Moderator Role**: Any participant can reveal/reset - transparent collaboration
- **No Export Feature**: Keep codebase focused on essential functionality
