[한국어 설명서는 여기에서 볼 수 있습니다.](./README.ko.md)

---

# 📚 ss-react-boilerplate-ts User Guide

## 🛠️ Stack

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=Redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux Toolkit-EF4444?style=flat&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux Saga-999999?style=flat&logo=redux-saga&logoColor=white" />
  <img src="https://img.shields.io/badge/React Router-CA4245?style=flat&logo=react-router&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white" />
</div>
<div align="center">
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Storybook-FF4785?style=flat&logo=storybook&logoColor=white" />
  <img src="https://img.shields.io/badge/Cypress-17202C?style=flat&logo=cypress&logoColor=white" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" />
</div>
<div align="center">
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/i18next-26A69A?style=flat&logo=i18next&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer Motion-EF008C?style=flat&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide React-000000?style=flat&logo=lucide&logoColor=white" />
  <img src="https://img.shields.io/badge/Yarn4-2C8EBB?style=flat&logo=yarn&logoColor=white" />
</div>

---

## 📑 Table of Contents

0. 🗂️ [Project Structure (FSD Perspective)](#project-structure-fsd-perspective)
1. 🚀 [Project Overview](#project-overview)
2. 🛠️ [Tech Stack](#tech-stack)
3. ⚡ [Installation & Run](#installation--run)
4. 🏗️ [State Management Structure](#state-management-structure)
5. 🎨 [Theme & Color Settings](#theme--color-settings)
6. 🏷️ [Action Naming Convention](#action-naming-convention)
7. 🔄 [Reducer Usage (Sync/Async)](#reducer-usage-syncasync)
8. 🧭 [Dynamic Routing Structure](#dynamic-routing-structure)
9. 🧩 [SS Components & shadcn Library Issues](#ss-components--shadcn-library-issues)
10. 🧹 [Code Style (Prettier) Usage](#code-style-prettier-usage)
11. 📝 [Other TODOs & Improvements](#other-todos--improvements)

---

## 0. Project Structure (FSD Perspective)

This project is structured based on the **Feature-Sliced Design (FSD)** pattern.  
Each folder is separated by responsibility, aiming for maintainability and scalability as follows:

```
src/
  app/                # App entry point, global settings, store, router, etc.
    api/              # API client and global API settings
    router/           # Router and related utils, types
    store/            # Global state management (redux, etc.)
  assets/             # Static assets like fonts, images, locales
  features/           # Business domain/feature-specific folders
    [feature]/        # e.g., sample, user, etc.
      [Feature].tsx   # UI/logic for the feature
      [feature]Reducer.ts # Reducer for the feature
  pages/              # Route-level page components (including dynamic routing)
    [route]/          # e.g., url, extra, etc.
      [Page].tsx      # Page component for the route
  shared/             # Components, utils, layouts shared across features/pages
    components/       # Common UI components (button, toast, theme, etc.)
    lib/              # External library wrappers, common hooks, styles, etc.
    utils/            # Common utility functions
    layouts/          # Common layout components (header, footer, etc.)
  stories/            # Storybook, documentation, test components
  styles/             # Global styles, variables, reset, etc.
  main.tsx            # App entry point
  App.tsx             # Root component
```

### Folder Role Summary

- **app/**: Global layer for settings, store, router, etc.
- **assets/**: Static resources like fonts, images, locales
- **features/**: Business domain-specific features (each feature can have its own UI, state, business logic)
- **pages/**: Route-level page components, supports dynamic routing
- **shared/**: Common elements reused across features/pages (components, utils, layouts, etc.)
- **stories/**: Storybook, documentation, test components
- **styles/**: Global styles, CSS variables, reset, etc.

---

## 1. Project Overview

- A boilerplate project based on React + TypeScript.
- Designed for fast development, scalability, and maintainability.

---

## 2. Tech Stack

- **React 19**
- **TypeScript 5**
- **Redux Toolkit** (state management)
- **Redux**
- **Redux-Saga**
- **Typesafe-Actions**
- **React-Redux**
- **React-Router v7**
- **Vite 6** (bundler)
- **Storybook 8** (UI documentation)
- **Cypress 14** (E2E testing)
- **Vitest 3** (unit testing)
- **Playwright** (browser testing)
- **TailwindCSS 4**
- **Prettier 3** & **prettier-plugin-tailwindcss**
- **shadcn/ui** (UI components)
- **i18next** (internationalization)
- **Framer Motion** (animation)
- **Lucide-react** (icons)

---

## 3. Installation & Run

```bash
yarn install
yarn dev           # Start development server
yarn build         # Build for production
yarn preview       # Preview production build
yarn lint          # Run ESLint
```

### Storybook

```bash
yarn storybook         # Start Storybook
yarn build-storybook   # Build Storybook static site
```

### Testing

```bash
yarn test        # Run unit tests (Vitest)
yarn test:run    # Run all tests in CI mode
yarn cypress     # (if configured) Run Cypress E2E tests
```

---

## 4. State Management Structure

- Uses **Redux Toolkit** for global state management.
- Store, hooks, and utils are located in `src/app/store/redux/`.
- Each feature has its own slice (reducer).
- Async operations are handled with createAsyncThunk or redux-saga (if needed).

### Example

```ts
// src/globals/store/redux/reduxStore.tsx
import { configureStore } from '@reduxjs/toolkit'
import sampleReducer from 'src/features/sample/sampleReducer'

export const store = configureStore({
    reducer: {
        sample: sampleReducer,
        // ...other reducers
    },
})
```

---

## 5. Theme & Color Settings

- Supports **dark mode/light mode**
- Theme colors are managed in `src/shared/components/lib/shadcn/styles/shadcn.pcss` and `colorConstants.tsx`
- For color customization, use [shadcn-ui-theme-generator](https://zippystarter.com/tools/shadcn-ui-theme-generator) and apply to  
  `src/shared/components/lib/shadcn/styles/shadcn-variables.css`
- **TailwindCSS** is used for utility-first styling.

---

## 6. Action Naming Convention

- **Basic Rule**
    - Use verb+target format: `get~~`, `edit~~`, `del~~`, `create~~`, etc.
    - If state change is needed, append `Status` at the end
- **Local Reducer**
    - Action names should NOT end with `Fail` or `Success` (due to auto-generation/recognition issues)
    - If needed, use a `todo` prefix or similar for improvement

---

## 7. Reducer Usage (Sync/Async)

### Synchronous Reducer

- Managed as a regular slice reducer
- Example:
    ```ts
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload
        }
    }
    ```

### Asynchronous Reducer

- Use `createAsyncThunk` for async actions
- Or use **redux-saga** for more complex side effects
- Handle pending/fulfilled/rejected in extraReducers
- Example:
    ```ts
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.data = action.payload
            })
            .addCase(fetchData.rejected, (state) => {
                state.error = true
            })
    }
    ```

---

## 8. Dynamic Routing Structure

- Dynamic routing is implemented in the `src/pages/url/` folder using `[param]` syntax
- Example: `/url/[aid]/Sample.tsx` → `/url/123/Sample`
- **File Naming Rule**: To distinguish from features, it is recommended (not required) to use the `Page` suffix for page components

---

## 9. SS Components & shadcn Library Issues

- When using the shadcn library, there may be issues with the `cn` path after download
- You may need to manually fix the path in `components.json`
- SS components and shadcn components can be used together

---

## 10. Code Style (Prettier) Usage

- Format all code:
    ```bash
    yarn format
    ```
- **Auto-formatting settings**
    - WebStorm:
      File | Settings | Languages & Frameworks | JavaScript | Prettier  
      jetbrains://WebStorm/settings?name=Languages+%26+Frameworks--JavaScript--Prettier  
      Enable auto-format or format on save
- **TODO**: Apply Prettier automatically on commit (e.g., with husky)
- **TailwindCSS** is auto-sorted with prettier-plugin-tailwindcss

---

## 11. Other TODOs & Improvements

- Add recommended color application feature
- Change label to input feature
- JS performance improvements
- Apply Prettier automatically on git commit (e.g., husky)
- Improve local reducer action naming (e.g., todo prefix)

---

### Contact & Contribution

- Feel free to ask questions, report bugs, or contribute to this project!

---

If you need more detailed examples or explanations for any section, please let me know!
