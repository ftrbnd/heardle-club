# Heardle Club

Run the dev script to get started:

```sh
turbo dev tunnel:{OS} worker:dev
```

## Architecture

### apps/web

- Next.js app that handles frontend logic with simple backend requests handled by API routes and server actions

### apps/server (Elysia)

- Backend server powered by Elysia
- Handles auth, and sends requests to the BullMQ queue system

### apps/server (BullMQ)

- Runs requested jobs that download audio files
- Runs the daily heardle reset function that resets statistics and uploads a new song

### packages/database

- Provides a common API to the client and server to make db requests
