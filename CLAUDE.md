# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hackathon project ("duyuthon") in early setup phase. The repository is structured as a monorepo with separate frontend and backend directories.

## Repository Structure

```
be/       # Backend (planned: Spring Boot + MySQL)
fe/       # Frontend (planned: React + TailwindCSS)
docs/     # Documentation, planning materials, and presentation slides
```

## Planned Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Spring Boot, MySQL
- **AI/LLM**: Gemini API (Google Cloud)
- **Infra**: Google Cloud, Docker

> 아이디어 확정 전 (2026-05-16 기준). 내일 팀 회의 후 구체화 예정.

## Development Setup

Commands will be added here as the `be/` and `fe/` packages are initialized. Typical expected commands once scaffolded:

- `cd fe && npm run dev` — start frontend dev server
- `cd be && ./mvnw spring-boot:run` — start backend dev server
- `cd fe && npm run lint` — lint frontend
- `cd be && ./mvnw test` — run backend tests
