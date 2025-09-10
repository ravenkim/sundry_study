프로젝트 세팅 

> 테스트 코드 작성할것


# todo list 
주석에는 유저스토리 [1] 의 1번 이면 1-1 로 표시 

## 프로젝트 세팅
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

## 유저스토리 [7] - 완료 
1. fileName 수정 - 완료 
2. changeType 수정 - 완료



---
# 기능 요구사항
##  📝  **github 의 open source repository 에서 pull request 들의 git diff 결과를 가져온다.**
- 현재 fixed text 로 diff 결과를 사용하고 있으나, frontend 에서 input 을 통해 받아온 github url 로부터 diff 결과를 받아서 사용하도록 기능을 추가 해야함.
    - github 은 commit 과 pull request 의 주소 뒤에 `.diff` 를 추가하면, diff 결과의 raw text 을 받아올 수 있다.
    - e.g. https://patch-diff.githubusercontent.com/raw/fika-dev/fika-cli/pull/331.diff
    - UrlForm component 사용할것 

## 📝 Frontend 에서 Label 에 임시로 fixed 로 입력하고 있던 데이터를, 제대로 입력할 수 있도록 수정한다.**
- 현재 label 을 state 에 저장시, 아래와 같이 fileName 과 changeType 에 대한 처리가 제대로 이루어지지 않고 있다.

    ```tsx
    const label: Label = {
        id: labelId,
        selectedRange: labeledRange,
        fileName: '',
        changeType: 'Inserted',
      };
    ```

- 알맞은 fileName 과 changeType 을 넣을 수 있도록 수정한다.
##  📝 **Submit 시에 State 서버에 제출하도록 한다.**
- Submit 시에 서버에 State 에 저장된 Label 들을 제출하도록 구현한다.
##  📝 **Server 에서는 제출된 데이터를 받아 추후 알고리즘 학습에 사용될 수 있도록 데이터 베이스에 저장**
- 추후 분석에 필요한 정보
    - 어떤 pull request 로 부터 가져온 diff 정보인지
    - pull request 로부터 diff 정보를 가져온 일시
    - Human Label 의 제출 일시
    - 개별 Label 정보
        - 어떤 파일(file)
        - inserted, deleted 의 change type 중 어디에 해당하는지
        - label 의 selection 의 start point (e.g. line, column)
        - label 의 selection 의 end point (e.g. line, column)


---

# 평가 기준 

- User story 를 기반으로 한 코드 설계 능력을 갖추었는지.
    - User story 를 기반으로 적절한 test code 를 생성할 수 있는지.
    - User story 를 구현할 Class 와 Method 를 적절하게 설계할 수 있는지.
- Frontend
    - hook 을 이용하여, component cycle 을 조절할 수 있는지.
- Backend
    - Nest.js 프레임웍을 이용해, endpoint 를 구현할 수 있는지.
    - Controller, Service, Module 을 적절하게 나누어서 개발하는지.
- Typescript 사용 능력
    - 적절한 Type 의 선언과 활용
- Git 사용 능력
    - 적절한 Commit 단위를 만들어 이해가능하고, 유용한 Git history 를 만드는지.
    - 적절한 Commit Message 를 사용하는지.
- third-party library 사용능력 (사용한다면)
    - 특정 library 를 가져와 사용할때, library 의존성을 하나의 모듈로만 국한시킬 수 있는지.
- Docker 이해도
    - docker compose 를 project 개발에 사용할 수 있는지.
  
- 기타
    - prettierrc 파일을 project 에 적용하여 format 을 통일할 수 있는지.
        - prettierrc 파일을 성공적으로 적용하였다.
        - prettierrc 실행 명령어를 package.json 에 등록하였다. 
        - prettierrc 플러그인으로 테일윈드 순서 format을 통일하였다.


테일윈드 정렬 기능 추가 