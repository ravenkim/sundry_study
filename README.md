
# required
```
node.js : 20.10.0
```
```
yarn : 4.0.2
```
만족시 바로 install 로 넘어가세요!

---
#### 버전 확인 방법
node.js 
```
node -v
```
yarn
```
yarn -v
```
---

## Migration steps
1. 노드가 버전이 18 + 인지 확인
2. ```corepack enable```
3. 클론 받은 폴더로 이동
4. ```yarn set version stable```
5. ```yarn -v``` 버전 확인
6. ```yarn```


---
# install 
```
yarn
```
로컬 실행
```
yarn dev
```

---



# 배포
```
git pull
```
```
docker build --tag rms:0.1 . 
```
```
docker run -itd -p 8089:80 --name rms_front rms:0.1
```




## 코딩 규칙
* Page를 만들고 그안에 features 및 컴포넌트 작성
* Page 이름은 featuresPage로 통일
* localReducers 안에는 'Success', 'Failure' 로 끝나는 함수 만들지 말것
