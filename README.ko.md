---

# 📚 ss-react-boilerplate-ts 사용설명서

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

## 📑 목차

0. 🗂️ [프로젝트 구조(FSD 관점)](#프로젝트-구조fsd-관점)
1. 🚀 [프로젝트 개요](#프로젝트-개요)
2. 🛠️ [주요 기술 스택](#주요-기술-스택)
3. ⚡ [설치 및 실행](#설치-및-실행)
4. 🏗️ [상태관리 구조](#상태관리-구조)
5. 🎨 [테마 및 색상 설정](#테마-및-색상-설정)
6. 🏷️ [액션 명명 규칙](#액션-명명-규칙)
7. 🔄 [리듀서 사용법 (동기/비동기)](#리듀서-사용법-동기비동기)
8. 🧭 [동적 라우팅 구조](#동적-라우팅-구조)
9. 🧩 [SS Components & shadcn 라이브러리 이슈](#ss-components--shadcn-라이브러리-이슈)
10. 🧹 [코드 스타일(Prettier) 적용법](#코드-스타일prettier-적용법)
11. 📝 [기타 TODO 및 개선사항](#기타-todo-및-개선사항)

---

## 0. 프로젝트 구조(FSD 관점)

이 프로젝트는 **Feature-Sliced Design(FSD)** 패턴을 참고하여 폴더 구조를 설계하였습니다.  
각 폴더는 역할별로 분리되어 있으며, 유지보수성과 확장성을 높이기 위해 다음과 같이 구성되어 있습니다.

```
src/
  app/                # 앱의 엔트리포인트, 글로벌 설정, 스토어, 라우터 등
    api/              # API 클라이언트 및 글로벌 API 설정
    router/           # 라우터 및 라우터 관련 유틸, 타입
    store/            # 전역 상태관리(redux 등)
  assets/             # 폰트, 이미지, 로케일 등 정적 자원
  features/           # 도메인/비즈니스 단위의 feature(기능)별 폴더
    [feature]/        # 예: sample, user 등
      [Feature].tsx   # 해당 feature의 UI/로직
      [feature]Reducer.ts # 해당 feature의 리듀서
  pages/              # 라우트 단위의 페이지 컴포넌트(동적 라우팅 포함)
    [route]/          # 예: url, extra 등
      [Page].tsx      # 실제 라우트에 대응하는 페이지 컴포넌트
  shared/             # 여러 feature/page에서 공통으로 사용하는 컴포넌트, 유틸, 레이아웃 등
    components/       # 공통 UI 컴포넌트(버튼, 토스트, 테마 등)
    lib/              # 외부 라이브러리 래퍼, 공통 훅, 스타일 등
    utils/            # 공통 유틸 함수
    layouts/          # 공통 레이아웃 컴포넌트(헤더, 푸터 등)
  stories/            # 스토리북 등 문서/테스트용 컴포넌트
  styles/             # 전역 스타일, 변수, 리셋 등
  main.tsx            # 앱 진입점
  App.tsx             # 루트 컴포넌트
```

### 각 폴더의 역할 요약

- **app/**: 앱 전체에 영향을 주는 설정, 스토어, 라우터 등 글로벌 레이어
- **assets/**: 폰트, 이미지, 다국어 등 정적 리소스
- **features/**: 비즈니스 도메인별로 분리된 기능 단위(각 feature는 자체 UI, 상태, 비즈니스 로직을 가질 수 있음)
- **pages/**: 라우트 단위의 페이지 컴포넌트, 동적 라우팅 지원
- **shared/**: 여러 feature/page에서 재사용되는 공통 요소(컴포넌트, 유틸, 레이아웃 등)
- **stories/**: 스토리북, 문서화, 테스트용 컴포넌트
- **styles/**: 전역 스타일, CSS 변수, 리셋 등

---

## 1. 프로젝트 개요
- React + TypeScript 기반의 보일러플레이트 프로젝트입니다.
- 빠른 개발, 확장성, 유지보수를 고려한 구조로 설계되었습니다.

---

## 2. 주요 기술 스택
- **React 19**
- **TypeScript 5**
- **Redux Toolkit** (상태관리)
- **Redux**
- **Redux-Saga**
- **Typesafe-Actions**
- **React-Redux**
- **React-Router v7**
- **Vite 6** (번들러)
- **Storybook 8** (UI 문서화)
- **Cypress 14** (E2E 테스트)
- **Vitest 3** (단위 테스트)
- **Playwright** (브라우저 테스트)
- **TailwindCSS 4**
- **Prettier 3** & **prettier-plugin-tailwindcss**
- **shadcn/ui** (UI 컴포넌트)
- **i18next** (다국어 지원)
- **Framer Motion** (애니메이션)
- **Lucide-react** (아이콘)

---

## 3. 설치 및 실행

```bash
yarn install
yarn dev           # 개발 서버 실행
yarn build         # 프로덕션 빌드
yarn preview       # 빌드 미리보기
yarn lint          # ESLint 실행
```

### Storybook
```bash
yarn storybook         # 스토리북 실행
yarn build-storybook   # 스토리북 정적 사이트 빌드
```

### 테스트
```bash
yarn test        # 단위 테스트(Vitest)
yarn test:run    # 전체 테스트 CI 모드 실행
yarn cypress     # (설정 시) Cypress E2E 테스트 실행
```

---

## 4. 상태관리 구조

- **Redux Toolkit**을 사용하여 전역 상태를 관리합니다.
- store, hooks, utils는 `src/app/store/redux/`에 위치합니다.
- 각 feature별로 slice(reducer)를 생성하여 관리합니다.
- 비동기 처리는 createAsyncThunk 또는 redux-saga로 처리할 수 있습니다.

---

## 5. 테마 및 색상 설정

- **다크모드/라이트모드** 지원
- 테마 색상은 `src/shared/components/lib/shadcn/styles/shadcn.pcss` 및 `colorConstants.tsx`에서 관리
- 색상 커스터마이징은 [shadcn-ui-theme-generator](https://zippystarter.com/tools/shadcn-ui-theme-generator)에서 추출 후  
  `src/shared/components/lib/shadcn/styles/shadcn-variables.css`에 적용
- **TailwindCSS**로 유틸리티 스타일링 적용

---

## 6. 액션 명명 규칙

- **기본 규칙**
  - `get~~`, `edit~~`, `del~~`, `create~~` 등 동사+대상 형태
  - 상태 변화가 필요한 경우 `Status`를 뒤에 붙임
- **로컬 리듀서**
  - 액션명이 `Fail`, `Success`로 끝나면 안 됨 (자동 생성/인식 문제)
  - 개선 필요시 `todo` prefix 등 활용 권장

---

## 7. 리듀서 사용법 (동기/비동기)

### 동기 리듀서
- 일반적인 slice reducer로 관리

### 비동기 리듀서
- 비동기 액션은 `createAsyncThunk`로 생성하거나,
- 복잡한 사이드이펙트는 **redux-saga**로 처리할 수 있음
- extraReducers에서 pending/fulfilled/rejected 처리

---

## 8. 동적 라우팅 구조

- `src/pages/url/` 폴더 내에 `[param]` 형태로 동적 라우팅 구현
- 예시: `/url/[aid]/Sample.tsx` → `/url/123/Sample`
- **파일명 규칙**: feature와 구분을 위해 페이지 컴포넌트는 `Page` 접미사 사용 권장 (필수는 아님)

---

## 9. SS Components & shadcn 라이브러리 이슈

- shadcn 라이브러리 사용 시, 다운로드 후 `cn` 경로가 올바르게 적용되지 않는 이슈가 있음
- `components.json`에서 경로를 직접 수정 필요
- SS 컴포넌트와 shadcn 컴포넌트 혼용 가능

---

## 10. 코드 스타일(Prettier) 적용법

- 전체 코드 포맷팅:  
  ```bash
  yarn exec prettier . --write
  ```
- **자동 정렬 설정**  
  - WebStorm:  
    파일 | 설정 | 언어 및 프레임워크 | JavaScript | Prettier  
    jetbrains://WebStorm/settings?name=%EC%96%B8%EC%96%B4+%EB%B0%8F+%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC--JavaScript--Prettier  
    에서 자동 활성화 또는 저장 시 적용 활성화
- **TODO**: 커밋 시 자동 적용 (ex. husky 등 도입 필요)
- **TailwindCSS**는 prettier-plugin-tailwindcss로 자동 정렬

---

## 11. 기타 TODO 및 개선사항

- 추천 색상 적용 기능
- label to input 변경 기능
- JS 속도 개선
- 깃 커밋시 Prettier 자동 적용 (husky 등)
- 로컬 리듀서 액션명 개선 (todo prefix 등)

---

### 문의 및 기여
- 이 프로젝트에 대한 문의, 버그 제보, 기여는 언제든 환영합니다!

---

필요한 부분이 더 있거나, 각 항목별로 예시 코드/자세한 설명이 더 필요하면 말씀해 주세요! 































구버전  (정리 필요)
-------
TODO LIST

- 스토리북 설정 디테일 하게 보기 > 현재 있는 스토리 폴더 삭제후 컴포넌트 쪽으로 옴겨서 확인
- 스토리북 탬플릿 자동화 (plop 을통해 파일 생성
  가능) https://velog.io/@jh5717/.stories-%ED%8C%8C%EC%9D%BC-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0-plop
- 예시 컴포넌트 제작 (spin, 테이블, 동적 넓이 높이 추가 컴포넌트, 디바운스 처리된 인풋, 예시 래이아웃들)
- 모바일, pc , 테블릿 관련 설정 추가
- css 예외 처리 (몇몇 페이지만 새로 시작할 경우)
- 배포 처리 만들기 (도커를 통한 배포 자동화 스토리북으로도 하는 부분이 있으니 확인 필요)
- 쿠버내티스 배포까지? 는 백앤드 하고 디비 기본적인 설정 마치면 차후에
- readme 파일 스토리북 첫 페이지에 랜더링 하는 기능
- 리드미 추가 작성 (stack 로고로 변경, 목차 만들기 + 순서 정리, 설명 추가, 기술스택 용도별 분리, 라우팅 관련[라이브러리, 사용방법, 스토어 연동])
- rxjs 도입 고임
- 새로고침시 깜빡임 이슈 - 아주 가끔씩 발생함 원인 불명
- html 핼맷 도입 고민 < 19 는 그냥 써두 대지만 라우트별 다른 지원을 위해 도입


<img src="https://capsule-render.vercel.app/api?type=waving&height=250&color=gradient&text=ss-react-boilerplate-ts&desc=Super%20Sexy&fontAlignY=30&descAlignY=55" style="width: 100%;" />



## Stack (로고로 변경)
- 언어

- 프레임워크
- 빌드도구:   
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />

- 스타일링
- 라우팅
- 상태관리
- api통신
- 테스트
  vitest
- Code Quality & Linting
- CI/CD & Deployment
- Version Control & Collaboration
- Architecture & Folder Structure




<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=Redux&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Yarn4-2C8EBB?style=flat&logo=yarn&logoColor=white" />
</div>



----

# 설치 및 실행 How to Install

yarn


nvm 추천 > Linux https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating (wsl)
window > https://github.com/coreybutler/nvm-windows
yarn 프로젝트별 관리 추천 > https://yarnpkg.com/getting-started/install


개발자 모드
yarn dev
배포 테스트
yarn build
yarn preview

----

# 형상관리
{tag}: [{place}] 내용


```
feat: 기능 추가
modify: 버그 아닌 코드 수정
fix: 버그 수정
refactor: 코드 리팩토링
style: 코드 스타일(코드 컨벤션 추가) 수정
docs: 문서 작업
design: 프론트 CSS 수정
test: 테스트 코드 작성
chore: 프로젝트 설정 파일 수정
create: 프로젝트 생성
rename: 파일이나 폴더명을 수정하거나 옮기는 작업만 수행
remove: 파일을 삭제하는 작업만 수행
출처: https://ravenkim97.tistory.com/478 [Life Log:티스토리]


```
----


yarn4 + vite

cra 대비 테스트 결과
빌드속도 - 476 > 75 초


----

폴더 구조
FSD 의 장점과 프로젝트의 성향에 맞게 수정





----

# 상태 관리

ㅋㅌㅊㅋㅌㅊㅁㄴㅇㅁㅇㄴ

------

# 라우팅



### 간단한 동적 라우팅 기능
- 별도의 추가없이 src/pages/url/ 안에 경로에 맞게 파일 작성시 동적으로 url이 생성이 된다.
- [  ] 안에 임의의 명칭을 넣어서 동적 url 형성 가능
- feature랑 파일명 구분을 위해 Page를 뒤에 붙이는걸 권장 (Page 는 자동 제거됨)

### 졀도의 정적 라우팅 기능 (가장 메인은 여기에 해당[/])
- url 이외에 별도의 라우팅 처리는 src/app/router/router.tsx 안에 router 안에 추가하면 됩니다

### 예시
``` 
├── pages
│     ├── HomePage.jsx            ------>[/]                     
│     └── url                   
│         ├── [name]               
│         │     └── TestPage.jsx  ------>[/harry/Test]              
│         └── sample                   
│             ├── SamplePage.jsx  ------>[/sample/sample]                
│             └── [Id].jsx        ------>[/sample/123]          

```


### 이동 방법
```
 const navigate = useNavigate() 
```
를 선언해주고

```
            <button
                onClick={() => {
                    navigate('/')
                }}
            >홈으로
            </button>
```

다음과 같이 이동

맨 앞에 / 가 있으면 도메인 다음으로 들어가고
/가 없으면 현위치 기준으로 들어감

ex)
현재 url: localhost:8619/aaaa
navigate('/bbbb') >> localhost:8619/bbbb
navigate('/cccc') >> localhost:8619/aaaa/cccc


------

# 스타일
- tailwind 사용


## 폰트
기본 Pretendard

추가 혹은 변경
> src/assets/fonts 에 폰트 추가
> src/styles/typography.css 에 font-face 추가, layout 으로 테일윈드에 적용
> src/styles/base.pcss 에 기본적으로 사용할곳 지정


현재는 개발자 모드에서는 FOUT 현상이 있음
빌드시 preload 해주기에 문제 없음 > yarn preview 로 확인해 보기



----

# 테스트
단위 테스트
vitest

E2E 테스트 , 통합 테스트  
Cypress

----

| Script          | 설명                                                       | Description                                                     |
|-----------------|----------------------------------------------------------|-----------------------------------------------------------------|
| `yarn dev`      | 개발 서버를 시작합니다.                                            | Starts the development server.                                  |
| `yarn build`    | TypeScript 프로젝트를 빌드하고, 프로덕션 빌드를 생성합니다.                   | Builds the TypeScript project and generates a production build. |
| `yarn lint`     | ESLint를 사용하여 코드 린트 작업을 수행합니다.                            | Runs linting on the codebase using ESLint.                      |
| `yarn preview`  | 빌드된 프로젝트를 미리 보기 위해 로컬 서버를 실행합니다. (lighthouse 와 같은 성능 측정) | Runs a local server to preview the built project.               |
| `yarn test`     | 모든 테스트 파일을 대화식으로 실행합니다.                                  | Runs tests interactively for all test files.                    |
| `yarn test:run` | 터미널에서 모든 테스트를 자동으로 실행합니다.                                | Executes all tests automatically in the terminal.               |

# 추천 크롬 익스텐션

0. Reduc DevTools: state, action 관리해준다. DevTools 에서 확인 가능
  - [설치하기](https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ko)
  - https://github.com/reduxjs/redux-devtools

1. LocatorJS: 크롬에서 컴포넌트 alt + 마우스 좌클릭시 바로 에디터에서 해당 파일이 열림
  - [설치하기](https://chromewebstore.google.com/detail/locatorjs/npbfdllefekhdplbkdigpncggmojpefi)
  - https://www.locatorjs.com/
  - https://github.com/infi-pc/locatorjs

2. colorZilla: 크롬에서 스포이드로 색상 확인 및 복사
  - [설치하기](https://chromewebstore.google.com/detail/colorzilla/bhlhnicpbhignbdhedgjhgdocnmhomnp?hl=ko)
  - https://www.colorzilla.com/

3. Page Ruler: 크롬 화면에서 영역 지정하여 길이 px 확인 가능
  - [설치하기](https://chromewebstore.google.com/detail/page-ruler/jcbmcnpepaddcedmjdcmhbekjhbfnlff?hl=ko)

   








