# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hackathon project ("duyuthon") in early setup phase. The repository is structured as a monorepo with separate frontend and backend directories.

## Repository Structure

```
be/       # Backend (planned: NestJS + PostgreSQL)
fe/       # Frontend (planned: Next.js + TailwindCSS)
docs/     # Documentation, planning materials, and presentation slides
```

## Planned Tech Stack

- **Frontend**: Next.js, TailwindCSS
- **Backend**: NestJS, PostgreSQL
- **Infra**: AWS, Docker

## Development Setup

Commands will be added here as the `be/` and `fe/` packages are initialized. Typical expected commands once scaffolded:

- `cd fe && npm run dev` — start frontend dev server
- `cd be && npm run start:dev` — start backend in watch mode
- `cd fe && npm run lint` — lint frontend
- `cd be && npm run lint` — lint backend
- `cd fe && npm run test` — run frontend tests
- `cd be && npm run test` — run backend tests
- `cd be && npm run test:e2e` — run backend e2e tests
