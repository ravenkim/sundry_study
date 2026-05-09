# Project Gemini Instructions

This file provides foundational guidance for Gemini CLI when working in this repository. These mandates take precedence over general defaults.

## Repository Overview

This is a monorepo for the GDG Daejeon project.

- `fe/` — Frontend application (React 19, Vite, TypeScript, Tailwind CSS 4)
- `be/` — Backend application (Early initialization)
- `doc/` — Project documentation and design specs

## Development Commands

### Frontend (`fe/`)
- **Dev Server:** `yarn dev` (from `fe/`)
- **Build:** `yarn build`
- **Lint:** `yarn lint`
- **Format:** `yarn format`
- **Test (Unit):** `yarn test`
- **Storybook:** `yarn storybook`

## Coding Standards & Behavioral Guidelines

### 1. Think Before Coding
- **Explicit Assumptions:** State assumptions before implementing. If uncertain, ask for clarification.
- **Surface Tradeoffs:** Present multiple interpretations or simpler approaches instead of picking silently.
- **Clear Communication:** If a task is ambiguous, stop and name the confusion.

### 2. Simplicity First
- **Minimal Implementation:** Write the minimum code required to solve the problem. Avoid speculative features or abstractions.
- **No Over-Engineering:** Avoid "flexibility" or "configurability" that wasn't requested.
- **Senior Engineering Bar:** If a solution feels overcomplicated, simplify it.

### 3. Surgical Changes
- **Targeted Edits:** Touch only what is necessary. Don't refactor or "improve" adjacent code unless requested.
- **Match Local Style:** Rigorously adhere to existing naming conventions, formatting, and architectural patterns.
- **Cleanup:** Remove imports, variables, or functions that YOUR changes made unused. Do not remove pre-existing dead code unless asked.

### 4. Goal-Driven Execution
- **Verifiable Success:** Transform tasks into verifiable goals (e.g., "Add validation" → "Write tests for invalid inputs, then make them pass").
- **Plan-Act-Validate:** For multi-step tasks, provide a brief plan and verify each step.
- **Testing Mandate:** For bug fixes, reproduce the failure with a test case before applying the fix.

## Tech Stack (Frontend)
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + Shadcn UI (Radix UI)
- **State:** Redux Toolkit + Redux Saga
- **Routing:** React Router 7
- **I18n:** i18next
- **Testing:** Vitest, Storybook, Playwright, Cypress
- **Package Manager:** Yarn 4 (Plug'n'Play or node-modules as configured)
