

# todo list 
주석에는 유저스토리 [1] 의 1번 이면 1-1 로 표시 

## fe 프로젝트 세팅
- webstorm 지원 기능 추가 - 완료 
- 패키지 메니저 설정 - 완료 
- 프리티어 추가,  테일윈드 순서 플러그인 추가 - 완료 


## 유저스토리 [1] github 의 open source repository 에서 pull request 들의 git diff 결과를 가져온다. - 완료 
1. UrlForm component 안에 onchange, onSubmit, value 구현 - 완료 
2. 임시데이터 삭제및 빈값일때 확인 - 완료
3. state 에 diff 추가해서 데이터 fetch - 완료
4. 비동기 데이터 로딩 처리 (spinner 추가) - 완료
5. 기존 props 로 받던 하드 코딩된 데이터 변경 및 기존 임시 데이터 삭제 - 완료
6. diff data 가 state 가 아니라서 랜더링 안되는 문제 해결 - 완료 

## 유저스토리 [7] Label 에 임시로 fixed 로 입력하고 있던 데이터를, 제대로 입력할 수 있도록 수정 - 완료 
1. fileName 수정 - 완료 
2. changeType 수정 - 완료


## be 프로젝트 세팅 
- 패키지 매니저 설정, 의존성 관리 - 완료
- 스웨거 설정 - 완료

## 시스템 설정  - 완료  
- 도커로 디비만 먼저 올리기 - 완료

## 유저스토리 [9] Server 에서는 제출된 데이터를 받아 추후 알고리즘 학습에 사용될 수 있도록 데이터 베이스에 저장 - 완료
- label 모듈 제작 - 완료
- 모듈 등록 - 완료
- 컨트롤러 제작 - 완료
- 서비스 제작 - 완료
- dto 제작 - 완료
  - labels: 라벨 정보 - 완료
  - pullRequestUrl: url 정보 - 완료
  - diffFetchedAt: url 에서 들고온 시간 - 완료
  - submissionAt: label 을 제출한 시간  (timestamp 로찍어줌) - 완료
- 스키마 제작 - 완료 



## 유저스토리 [8] Submit 시에 State 서버에 제출 - 완료
- labels 외에 필요한 diffFetchedAt, pullRequestUrl 추가해서 데이터 요청 기능 제작 - 완료
- 요청 완료 팝업 or toast 추가- 완료

## 배포 테스트  - 완료
- 프, 백, 디비 패포된 상태로 정상 작동하는지 확인 - 완료

## 깃허브 주소 공유 - 완료


## 디버깅 - 완료
- 스크롤 추가 필요 - 완료

---

# 평가 기준 

- User story 를 기반으로 한 코드 설계 능력을 갖추었는지.
    - User story 를 기반으로 적절한 test code 를 생성할 수 있는지.
    - User story 를 구현할 Class 와 Method 를 적절하게 설계할 수 있는지.
      - user story를 기반으로 todolist 를 작성하고 코드를 구현했습니다. 
- Frontend
    - hook 을 이용하여, component cycle 을 조절할 수 있는지.
      - 기존 생명주기가 이상하여 새로 데이터를 불러와도 랜더링 안되던 문제를 해결했습니다.
- Backend
    - Nest.js 프레임웍을 이용해, endpoint 를 구현할 수 있는지.
    - Controller, Service, Module 을 적절하게 나누어서 개발하는지.
      - endpoint 를 구현하고, Controller, Service, Module, dto, schema 를 나누어 구현했습니다.
- Typescript 사용 능력
    - 적절한 Type 의 선언과 활용
      - any 없이 적절하게 type 을 사용했습니다.
- Git 사용 능력
    - 적절한 Commit 단위를 만들어 이해가능하고, 유용한 Git history 를 만드는지.
    - 적절한 Commit Message 를 사용하는지.
      - commit 을 진행하였습니다. (readme 에 커밋 규칙은 따로 없어서 임의로 작성하였습니다.)
- third-party library 사용능력 (사용한다면)
    - 특정 library 를 가져와 사용할때, library 의존성을 하나의 모듈로만 국한시킬 수 있는지.
      - yarn berry 를 사용하여 library 의존성을 해결했습니다.
- Docker 이해도
    - docker compose 를 project 개발에 사용할 수 있는지.
      - docker compose 를 통해 로컬에서 잘 돌아가는지 테스트를 마쳤습니다.
- 기타
    - prettierrc 파일을 project 에 적용하여 format 을 통일할 수 있는지.
        - prettierrc 파일을 성공적으로 적용하였습니다.
        - prettierrc 실행 명령어를 package.json 에 등록하였습니다. 
        - prettierrc 플러그인으로 테일윈드 순서 format을 통일하였습니.
        - 테일윈드 순서를 일괄적으로 통일하여 적용했습니다 


