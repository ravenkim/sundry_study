







끄는 방법 찾기
[locatorjs]: ok



쿠키가 필요한 요청 혹은 응답의 경우 
API 파일에 다음과 같이 추가 
```
export const [api이름] = (param) =>
    client.post('/[주소]', param, { withCredentials: true })
```


# Git 커밋 규칙 


 
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
svg: svg 파일 추가
```