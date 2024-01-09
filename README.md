
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

추가할것
+ corepack 없을시 설치 
+ nvm 을톨한 노드 버전 관리 
+ 배포 방법


docker build --tag rms:0.1 . 

docker run -itd -p 8089:80 --name rms_front rms:0.1

