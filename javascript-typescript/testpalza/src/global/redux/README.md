# Redux 설정 가이드

이 프로젝트는 Next.js App Router와 함께 Redux Toolkit과 Redux Saga를 사용하도록 설정되어 있습니다.

## 파일 구조

```
src/core/store/
├── reduxStore.ts          # Redux store 설정
├── hooks.ts              # Redux hooks (useAppDispatch, useAppSelector, useAppStore)
├── reduxMaker.ts         # Redux maker 유틸리티 (고급 사용법)
├── StoreProvider.tsx     # Redux Provider 컴포넌트
└── sample/
    └── sampleReducer.ts  # 샘플 reducer
```

## 기본 사용법

### 1. Redux Store 설정

`src/core/store/reduxStore.ts`에서 모든 reducer를 등록합니다:

```typescript
import { sampleReducer } from './sample/sampleReducer'

const reducers = {
    sampleReducer,
    // 다른 reducer들...
}
```

### 2. Redux Hooks 사용

컴포넌트에서 Redux hooks를 사용합니다:

```typescript
import { useAppDispatch, useAppSelector } from '../global/redux/hooks'
import { sampleActions } from '../global/redux/sample/sampleReducer'

export default function MyComponent() {
  const dispatch = useAppDispatch()
  const { count, name, sampleData } = useAppSelector((state) => state.sampleReducer)

  const handleIncrement = () => {
    dispatch(sampleActions.increment())
  }

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={handleIncrement}>증가</button>
    </div>
  )
}
```

### 3. Reducer 생성

새로운 reducer를 생성할 때는 `createSlice`를 사용합니다:

```typescript
import { createSlice } from '@reduxjs/toolkit'

interface MyState {
    data: any
    loading: boolean
    error: string
}

const initialState: MyState = {
    data: null,
    loading: false,
    error: '',
}

export const mySlice = createSlice({
    name: 'my',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setData: (state, action) => {
            state.data = action.payload
            state.loading = false
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    },
})

export const myActions = mySlice.actions
export const myReducer = mySlice.reducer
```

## 고급 사용법 (Redux Maker)

`reduxMaker` 유틸리티를 사용하면 비동기 요청과 로컬 상태를 쉽게 관리할 수 있습니다.

### 1. Redux Maker 사용 예시

```typescript
import { reduxMaker, AsyncRequest } from '../reduxMaker'

interface UserData {
    id: number
    name: string
    email: string
}

interface UserState {
    currentUser: UserData | null
}

const asyncRequests: AsyncRequest<UserData, { id: number }>[] = [
    {
        action: 'fetchUser',
        state: 'userData',
        initialState: null,
        api: async (payload) => {
            const response = await fetch(`/api/users/${payload.id}`)
            return response
        },
    },
]

const localState: UserState = {
    currentUser: null,
}

const localReducers = {
    setCurrentUser: (state: UserState, action: { payload: UserData }) => {
        state.currentUser = action.payload
    },
}

export const {
    slice: userSlice,
    actions: userActions,
    saga: userSaga,
} = reduxMaker('user', asyncRequests, localState, localReducers)
```

### 2. Redux Maker의 장점

- **자동 상태 관리**: 로딩, 에러, 데이터 상태를 자동으로 관리
- **타입 안전성**: TypeScript와 완벽하게 호환
- **일관된 패턴**: 모든 reducer에서 동일한 패턴 사용
- **에러 처리**: HTTP 상태 코드에 따른 자동 에러 메시지 생성

## 주의사항

1. **'use client' 지시어**: Redux를 사용하는 컴포넌트에는 반드시 `'use client'`를 추가해야 합니다.
2. **Provider 설정**: `StoreProvider`가 `layout.tsx`에서 모든 컴포넌트를 감싸고 있어야 합니다.
3. **타입 안전성**: `useAppSelector`와 `useAppDispatch`를 사용하여 타입 안전성을 보장합니다.

## 개발 도구

Redux DevTools가 개발 환경에서 자동으로 활성화됩니다. 브라우저 확장 프로그램을 설치하여 상태 변화를 실시간으로 확인할 수 있습니다.
