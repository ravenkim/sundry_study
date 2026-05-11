# TIPA FRONTEND

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

1. nodejs 설지 (LTS 버전으로 설치)

2. yarn 설치
```javascript
// global option으로 yarn 패키지메니저 설치   
npm install -g yarn
```
3. package.json에 명시되어있는 라이브러리 설치
```javascript
yarn
```

4. 서버 실행

*로컬
```javascript
yarn start
```
*개발서버
```javascript
yarn start:dev
```

*운영서버
```javascript
yarn start:prod
```
## Coding Convention


1. Package
    - 소문자
    
      
2. Reducer, API
    - Lower CamelCase <br/> ex) searchReducer, userReducer


3. Component
    - Upper CamelCase <br/> ex) SearchPage, MainPage


4. Function
    - Lower CamelCase
      <br/><br/>  
    - 컴포넌트 내의 함수는 함수명 뒤에 Handler를 붙인다.<br/>
      ex) buttonClickHandler, valueChangeHandler
      <br/><br/>
    - Reducer 내의 비동기 통신 함수는 뒤에 Async를 붙인다.<br/>
      ex) getMemeberListAync, getMemberAsync
      

5. Variable
    - Lower CamelCase<br/>
      ex) memberInfo, searchData


6. State
   - Lower CamelCase<br/>
     ex) memberInfo, searchData
     <br/><br/>
   - useState로 상태 생성시 setter는 앞에 set을 붙인다.<br/>
     ex) const [ memberInfo, setMemberInfo ] = useState();




## 프론트 실행 에러시 참고사항

1. Cannot find module 'less'
   - 정상적으로 모듈이 존재할때 해당 디렉토리를 인식하지 못할때 발생
   - craco-less 버전을 낮추어서 해결(임시) <br/>
     1.8->1.7 / 내부 less 4.x.x -> 3.x.x



## 배포용 설정
0. docker-compose.yml, dockerfile 파일 사용
```
docker-compose -d --build
```
1. 배포용 스크립트 설정
``` shell
deploy.sh # yarn build 를 통한 배포

deploy_image.sh #기존에 배포된 이미지 파일을 바탕으로 nginx 설정만 수정하여 배포할 수 있는 버전  
```

## 개발용 설정
0. docker-compose-dev.yml, dockerfile-dev 파일 사용
```
docker-compose -f docker-compose-dev.yml up -d --build
```
1. Gitlab CI/CD 검토중
2. 개발용 스크립트 설정
```shell
dev.sh #로컬 개발 테스트용 dockerfile 설정. yarn start 를 통한 실행.
```
