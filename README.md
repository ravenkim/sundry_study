# 테이텀 개발자 채용 과제

## 복잡한 컴포넌트 설계 및 구현

---

테이블 내 복잡한 인푹을 가진 다이얼로그 컴포넌트 설계
조건

- 타입스크립트 - 완료
- react/next - 완료
- shadcn, tailwind - 완료

---

세부 요구사항

# 홈 페이지 (클라우드 리스트)

- 타입을 참고해서 더미 데이터 만들기 - 완료
- 클라우드 목록을 화면에 표시 - 완료
- 테이블은 식별이 가능한 정도로만 간략하게 구현 - 완료
- 각 Row에는 클라우드 수정 버튼 생성 - 완료
- 테이블 상단에 클라우드 생성 버튼을 배치 - 완료

# 상세 페이지

- 클라우드 생성, 수정 다이얼로그, 동일한 컴포넌트로 - 완료
- 기본값 모두 비어있음 - 완료
- 수정 다이얼로그는 서버에서 받은 데이터를 기반으로 인풋이 초기화 - 완료
- 수정데이터. 0 500ms Sleep후 응답하는 비동기 함수를 - 완료
- 취소버튼 클릭 시 다이 얼로그를 닫고, - 완료
- 확인 클릭 시 서버에 전송할 페이로드를 콘솔에 출력 후 다이얼로그를 닫기 - 완료

# 세부 요구사항

ux디테일 - 완료

확장성있는컴포넌트작성 - 완료

API 관리방안제시 - 완료

i18n 적용 전략 - 완료

---
# API 관리방안제시
## 1. API 문서 확인 — 시작은 명세에서

실무에서 API를 사용할 때 첫 번째 단계는 **문서 확인**입니다.
보통은 Swagger, Postman, Notion 등 다양한 도구로 API 명세 확인.

확인할 핵심 포인트는 다음과 같습니다:

- **Base URL**: 환경(dev/stage/prod)에 따라 달라질 수 있음
- **엔드포인트 그룹화**: `/auth`, `/products`, `/orders` 같이 도메인 단위로 묶어보기
- **요청/응답 스키마**: 어떤 필드가 필수인지, 어떤 값이 올 수 있는지
- **에러 포맷**: 에러 처리 로직을 전역화할 수 있는지

> 문서 확인 단계에서 “이 API가 내 기능(feature)에서 어떤 역할을 하는지”를 먼저 맵핑해두면 이후 작업이 훨씬 수월해집니다.

## 2. API 타입 작성 — 타입 안정성이 유지보수성을 만든다

API 문서에서 확인한 내용을 코드로 옮길 때,
가장 먼저 할 일은 **타입(TypeScript 인터페이스/타입)** 작성입니다.

예를 들어 로그인 API의 요청과 응답 타입은 이렇게 작성할 수 있습니다:

```ts
// src/features/auth/model/types.ts
export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    token: string
    user: {
        id: number
        name: string
        email: string
    }
}
```

- API 응답 구조가 바뀌면 타입이 먼저 깨지면서 코드 변경 포인트를 알려줌
- IDE 자동완성 지원 → 개발 속도 상승
- 실수(타입 오타, 누락 필드 등)를 컴파일 단계에서 잡아줌

실무에서는 **Swagger → openapi-typescript** 같은 도구를 활용해 타입을 자동 생성하고,
그 위에 프로젝트 특화 타입만 얹는 방식을 많이 씁니다.

## 3. API 호출 훅 구성 — React Query와 결합하기

타입을 만들었다면 이제 실제 API를 호출하는 훅을 작성합니다.
실무에서는 `axios`와 `React Query` 조합을 가장 많이 사용합니다.

### 공통 클라이언트 설정

```ts
// src/shared/api/base.ts
import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error(err.response?.data || err.message)
        return Promise.reject(err)
    },
)
```

### 로그인 API 훅

```ts
// src/features/auth/api/useLogin.ts
import { useMutation } from '@tanstack/react-query'
import { api } from 'src/shared/api/base'
import { LoginRequest, LoginResponse } from '../model/types'

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload)
    return data
}

export const useLogin = () => {
    return useMutation({ mutationFn: login })
}
```

- **조회성 API(`GET`)** → `useQuery`
- **변경성 API(`POST/PUT/DELETE`)** → `useMutation`

이렇게 명확하게 역할을 나누면 코드 가독성이 좋아집니다.

## 4. 컴포넌트에서 사용하는 방법

이제 훅을 컴포넌트에서 불러와 사용합니다.

```tsx
// src/features/auth/ui/LoginForm.tsx
import { useLogin } from '../api/useLogin'

export const LoginForm = () => {
    const { mutate: login, isPending } = useLogin()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        login({ email: 'test@test.com', password: '1234' })
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" disabled={isPending}>
                로그인
            </button>
        </form>
    )
}
```

이렇게 하면 `LoginForm`은 오직 **UI와 이벤트 처리**에만 집중할 수 있고,
실제 API 호출 로직은 `features/auth/api/useLogin`에 캡슐화됩니다.

## 5. 다수의 API를 효율적으로 관리하기 위한 원칙

실무에서 API가 많아질수록 중요한 건 **일관성**입니다.

- **문서 먼저 확인** → 어떤 기능에서 어떤 API를 쓰는지 명확히
- **타입 먼저 작성** → 변경에 강한 코드 구조 확보
- **훅 단위 관리** → 기능별(`features`)로 API 모듈화
- **React Query 캐싱** → 불필요한 네트워크 호출 최소화
- **공통 클라이언트 관리** → `shared/api`에서 에러, 토큰, 인터셉터 일괄 처리

# FSD 를 활용하기

특정 기능에서 사용하는 API는 해당 feature 안에서 관리하는 것이 자연스럽습니다.

```
src/
├── shared/            # 공통 유틸, axios 클라이언트
│   └── api/
├── features/          # 기능 단위
│   ├── auth/
│   │   ├── api/       # 로그인/회원가입 API 훅
│   │   ├── model/     # 타입, 상태
│   │   └── ui/        # 화면 컴포넌트
│   ├── product/
│   │   ├── api/       # 상품 조회/등록 API 훅
│   │   ├── model/
│   │   └── ui/
└── pages/
```

## API 문서 확인 — FSD 관점에서

API 문서(Swagger, Postman 등)를 확인하는 단계에서는 단순히 엔드포인트를 보는 걸 넘어,
“이 API가 어느 feature에 속하는지”를 같이 생각해야 합니다.

예를 들어:

/auth/login, /auth/register → features/auth

/products, /products/:id → features/product

/orders → features/order

즉, 문서 확인 단계에서 feature 단위로 API를 그룹화해두면,
나중에 코드 위치를 정할 때 헷갈리지 않습니다.

- API 문서 확인: 엔드포인트를 확인하면서 feature 단위로 그룹화
- API 타입 작성: features/<도메인>/model에 정의
- API 호출 훅 구성: features/<도메인>/api에 React Query 훅 작성

---

# i18n적용방안제시


## 1. i18n 관리 위치 정하기

FSD에서는 **공통적인 기술 스택이나 유틸리티**는 `shared` 혹은 `processes` 레벨에 둡니다.
따라서 i18n 역시 `shared/lib/i18n`에 배치하는 것이 일반적입니다.

```
src/
 ├─ app/
 ├─ processes/
 ├─ pages/
 ├─ features/
 ├─ entities/
 └─ shared/
     ├─ api/
     ├─ config/
     ├─ lib/
     │   └─ i18n/
     └─ ui/
```

* `shared/lib/i18n/config.ts` : i18next 초기화 및 리소스 로딩
* `shared/lib/i18n/locales/` : 다국어 JSON 저장소
* `shared/lib/i18n/types.ts` : 키 자동완성을 위한 타입 정의



## 2. JSON 구조 설계

JSON 파일은 언어별로 나누되, **FSD 레벨을 반영한 네임스페이스**를 도입하면 관리가 쉬워집니다.

예시: `locales/ko/product.json`

```json
{
  "card": {
    "title": "상품명",
    "price": "가격: {{value}}원"
  },
  "detail": {
    "description": "상품 설명",
    "stock": "재고: {{count}}개"
  }
}
```

예시: `locales/en/product.json`

```json
{
  "card": {
    "title": "Product Name",
    "price": "Price: ${{value}}"
  },
  "detail": {
    "description": "Description",
    "stock": "Stock: {{count}}"
  }
}
```

👉 이렇게 하면 `features/product`에서만 쓰이는 번역 키를 **product 네임스페이스**로 묶어 관리할 수 있습니다.



## 3. 번역 프로세스 효율화

번역 파일이 많아지면 **동기화와 검증**이 핵심 과제가 됩니다.
다음과 같은 접근을 추천합니다:

1. **i18next-scanner** 같은 도구로 `t('...')` 키를 자동 추출
2. 추출된 키를 기준으로 JSON 업데이트 (CI/CD 파이프라인에 통합 가능)
3. 번역가는 JSON만 수정 (개발자는 키 관리에 집중)
4. ESLint + 커스텀 룰로 존재하지 않는 키 사용 시 에러 감지

이렇게 하면 누락이나 불일치 문제를 최소화할 수 있습니다.



## 4. 코드에서 i18n 활용하기

FSD 관점에서는 i18n 훅(`useTranslation`)을 **features나 pages 레벨에서 호출**하는 것이 권장됩니다.
즉, **shared/ui 컴포넌트**에서는 번역 키를 직접 쓰지 않고, 상위 레벨에서 텍스트를 내려주는 식입니다.

### ❌ 나쁜 예시 (shared/ui Button 내부에서 번역 호출)

```tsx
export const Button = () => {
  const { t } = useTranslation('common')
  return <button>{t('submit')}</button>
}
```

### ✅ 좋은 예시 (features 레벨에서 번역 후 전달)

```tsx
import { Button } from 'shared/ui/button'
import { useTranslation } from 'react-i18next'

export const SubmitButton = () => {
  const { t } = useTranslation('form')
  return <Button>{t('submit')}</Button>
}
```

👉 이렇게 하면 **shared/ui** 레벨은 완전히 비즈니스 로직과 언어 종속성에서 자유로워집니다.



## 5. 타입 세이프티 적용

TypeScript 환경이라면 `i18next-typescript` 같은 플러그인을 붙여서
`t('product.card.title')` 입력 시 자동완성을 받는 게 좋습니다.

예시:

```ts
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      product: typeof import('./locales/en/product.json')
      common: typeof import('./locales/en/common.json')
    }
  }
}
```

👉 이렇게 하면 잘못된 키 입력 시 **컴파일 타임 에러**로 막을 수 있습니다.



## 6. 마무리

FSD 관점에서의 i18n 적용 핵심은 다음과 같습니다:

1. **공통 라이브러리 관리**: `shared/lib/i18n`에 배치
2. **네임스페이스 분리**: features 단위별 JSON 관리
3. **자동화된 번역 프로세스**: 키 추출 + ESLint 검증 + CI/CD 통합
4. **UI 분리 원칙 준수**: `shared/ui`는 번역 호출 금지
5. **타입 세이프티 적용**: JSON 기반 자동완성 도입

이 구조를 따르면 **프로젝트가 커져도 유지보수가 쉬운 i18n 시스템**을 만들 수 있습니다.



## 7. 기타 방안 제시 
https://github.com/generaltranslation/gt
와 같은 ai 를 활용한 일괄 번역 제공 프로젝트도 있습니.


---

