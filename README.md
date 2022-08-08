# Code Change Labeler

## 프로젝트 목표

- Git diff 를 통해서 생성된 change 는 정확하지 않다. 아래 이미지를 예로 들자면, before 의 10 번 line `!/acorn/dist/acorn.d.ts` 이 삭제되고, after 의 11 번 line `.vscode` 가 추가 된 것이 실제 변화이지만, git diff 알고리즘은 이를 정확하게 인지하지 못한다.
- Before 코드와 After 코드를 한 화면에 보여주고, 사람(Human) 으로부터 직접 UI 를 통해 사람이 생각하는 Before 에서 삭제된 부분과 After 에서 추가된 부분에 대한 Label 을 입력 받고 이를 DB 에 쌓고자 한다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6aaaeb6e-7718-4aec-be3e-9c02a8b1485f/Untitled.png)
