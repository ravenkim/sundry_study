# Code Change Labeler

<aside>
💡 commit 이나 pull request 로 제출된 코드의 변화를 사람이 직접 표시할 수 있도록 하는 Toy Project 입니다.

- 이번 코딩 테스트에서는 아래 문서를 통해, 프로젝트의 목표, 유저스토리, 주요 도메인 개념, 이벤트를 이해한 후, 요구한 과제를 완료하는 것이 목표 입니다.
</aside>

## 1. 프로젝트 목표

---

- github 등에서 제출된 commit 이나 pull request 들을 보면 코드의 어떤 부분이 추가되고, 삭제되었는지를 비교해서 볼 수 있는 화면이 있습니다.
- 이는 `diff` 커맨드를 통해서 생성된 결과로, 언뜻보면 정확해 보이고, 간단한 알고리즘을 통한 결과로 생각되지만 그렇지만은 않습니다.
- git diff 를 통해서 생성된 코드의 change 는 생각보다 정확도가 떨어집니다.
  ![Untitled](%5B%E1%84%8F%E1%85%A9%E1%84%83%E1%85%B5%E1%86%BC%20%E1%84%90%E1%85%A6%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3%5D%20%E1%84%8F%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%8E%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8C%E1%85%B5%20%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%87%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A5%20f57842c14acf46c2a99d1dc33875fec7/Untitled.png)
  - 위 이미지에서 git diff 의 실수를 알아차리시겠나요?
  - git 은 before 와 after 의 10번 line 에 `mjs.` 이라는 단어가 추가되었고, 11 번 line 이 전체 삭제 되고, 다른 `.vscode` 라는 완전히 새로운 11번 line 이 추가되었다고 파악했지만,
  - 사실 before 의 11번 line `!/acorn/dist/acorn.mjs.d.ts` 이 after 의 10번 line 으로 변경없이 옮겨지고, before 의 10번이 전체 삭제되고된 것입니다.
- 거의 비슷해보이는데, 도대체 코드 체인지를 정확하게 파악하는 것은 왜 필요할까요? 코드 체인지를 정확하게 입력하는 것은 간단히는 협업을 위한 **코드 리뷰** 등에도 도움이 되겟지만
- 무엇보다도, 정확하게 코드 체인지를 탐색하는 알고리즘을 만들 수 있다면, 이를 통한 자동 코드 리뷰, 자동 커밋 메세지의 작성, 사전 오류 검증 등의 작업이 가능하게 됩니다.
- 이 Toy Project 는 정확하게 코드 체인지를 탐색하는 알고리즘을 만들기 위해 효율적으로 정답 데이터를 모으기 위한 Web 기반 휴먼 레이블러를 만드는 것이 목표 입니다.

## 2. 프로젝트 Repository 설명

---

[https://github.com/fika-dev/code-change-labeler](https://github.com/fika-dev/code-change-labeler)

- `frontend` 는 `react` 로 `backend` 는 `nest.js` 로 세팅되어 있습니다. `DB`는 `mongo DB` 로 세팅되어 있지만, 다른 DB 가 더 편하시다면 다른 DB 로 세팅하여 사용하셔도 무관합니다.
- frontend 는 [localhost](http://localhost) 의 `3030` port 로, backend 는 localhost 의 `3031` port 를 binding 하도록 세팅되어 있습니다.
- docker compose 를 통해 frontend, backend, DB 를 docker container 로 올리고 연동하도록 구성되어 있습니다.
  - project root directory 에서 `docker compose up` 커맨드를 통해 프로젝트를 실행하실 수 있습니다.
  - 만약 추가 설치된 package 가 있다면, `docker compose up --build` 와 같이 build option 을 포함하여 실행시켜주셔야 추가된 package 를 conatiner 에서 설치하고, 실행할 수 있습니다.
- package installer 로 yarn 을 사용한 프로젝트이지만, npm, pnpm 등 다른 package manager 를 사용하셔도 무관합니다.
- 현재 frontend 의 기능들이 구현되어 있고, 과제는 아래 설명되어있는 backend 의 기능들과 이에 matching 되는 frontend 의 일부 기능을 구현하는 것입니다.

![Untitled](%5B%E1%84%8F%E1%85%A9%E1%84%83%E1%85%B5%E1%86%BC%20%E1%84%90%E1%85%A6%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3%5D%20%E1%84%8F%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%8E%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8C%E1%85%B5%20%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%87%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A5%20f57842c14acf46c2a99d1dc33875fec7/Untitled%201.png)
