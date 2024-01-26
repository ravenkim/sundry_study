
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
ssh 원격 접속후 
추후 자동 배포 도입 예정
```
sh cleanup.sh
```





## 코딩 규칙
* Page를 만들고 그안에 features 및 컴포넌트 작성
* Page 이름은 featuresPage로 통일
* 
* 커밋할 경우 앞에 [수정] or [추가] 를 기입
* localReducers 안에는 'Success', 'Failure' 로 끝나는 함수 만들지 말것
