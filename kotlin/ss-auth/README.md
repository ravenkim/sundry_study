# SS Authentication Service

SSO 및 일반 로그인을 지원하는 인증 서비스 API 서버입니다.

## 프로젝트 구조

```
src/main/kotlin/com/ss/auth/
├── auth/                           # 인증 관련 기능
│   ├── traditional/               # 일반 로그인
│   │   ├── TraditionalAuthController.kt
│   │   └── TraditionalAuthService.kt
│   └── sso/                      # SSO 로그인
│       ├── SsoAuthController.kt
│       ├── naver/                # 네이버 OAuth
│       │   └── NaverOAuthService.kt
│       ├── kakao/                # 카카오 OAuth
│       │   └── KakaoOAuthService.kt
│       └── google/               # 구글 OAuth
│           └── GoogleOAuthService.kt
├── config/                        # 설정 파일들
│   ├── ConfigManager.kt          # 모든 설정 관리
│   ├── oauth/                    # OAuth 설정
│   ├── security/                 # 보안 설정
│   ├── swagger/                  # Swagger 설정
│   └── db/                       # 데이터베이스 설정
├── controller/                    # 메인 컨트롤러
│   └── AuthController.kt         # 서비스 정보 및 상태
├── jwt/                          # JWT 관련
├── model/                        # 데이터 모델
└── AuthApplication.kt            # 메인 애플리케이션
```

## 주요 기능

### 1. 일반 로그인 (Traditional Authentication)
- 사용자명/비밀번호 기반 로그인
- JWT 토큰 발급
- 엔드포인트: `/api/auth/traditional/login`

### 2. SSO 로그인 (Social Authentication)
- **네이버**: `/api/auth/sso/naver`
- **카카오**: `/api/auth/sso/kakao`
- **구글**: `/api/auth/sso/google`

### 3. API 서버
- 웹 화면 없음, API 엔드포인트만 제공
- Swagger UI를 통한 API 테스트
- 헬스 체크: `/api/health`
- 서비스 정보: `/api/info`

## 실행 방법

### 1. 환경 설정
```bash
# application.properties에서 OAuth 클라이언트 정보 설정
spring.security.oauth2.client.registration.naver.client-id=<your-naver-client-id>
spring.security.oauth2.client.registration.naver.client-secret=<your-naver-client-secret>
```

### 2. 애플리케이션 실행
```bash
./gradlew bootRun
```

### 3. 시작 메시지 확인
애플리케이션이 시작되면 콘솔에 다음과 같은 정보가 출력됩니다:

```
============================================================
🎉 SS Authentication Service is Ready!
============================================================
📖 Swagger UI: http://localhost:8080/api/swagger-ui.html
📚 API Docs: http://localhost:8080/api/api-docs
🔗 Health Check: http://localhost:8080/api/api/health
ℹ️  Service Info: http://localhost:8080/api/api/info
🔐 Traditional Login: http://localhost:8080/api/api/auth/traditional/login
🌐 SSO Status: http://localhost:8080/api/api/auth/sso/status
============================================================
💡 Use Swagger UI to test all APIs!
============================================================
```

### 4. Swagger UI 접속
위의 콘솔 메시지에서 제공되는 Swagger UI 주소로 접속하여 API를 테스트할 수 있습니다.

## API 엔드포인트

### 인증 관련
- `POST /api/auth/traditional/login` - 일반 로그인
- `GET /api/auth/sso/me` - SSO 사용자 정보
- `GET /api/auth/sso/status` - SSO 서비스 상태

### 서비스 정보
- `GET /api/health` - 서비스 상태 확인
- `GET /api/info` - 서비스 정보

## 개발 가이드

### 새로운 SSO 제공자 추가
1. `auth/sso/` 폴더에 새 폴더 생성 (예: `facebook/`)
2. `XxxOAuthService.kt` 클래스 생성
3. `application.properties`에 OAuth 설정 추가
4. `ConfigManager.kt`에 새 설정 클래스 추가

### 보안 설정
- JWT 시크릿 키 변경 필수
- OAuth 클라이언트 정보 보안 유지
- 프로덕션 환경에서는 HTTPS 사용

## 기술 스택

- **언어**: Kotlin
- **프레임워크**: Spring Boot 3.5.5
- **보안**: Spring Security, OAuth2, JWT
- **문서화**: Swagger/OpenAPI 3
- **빌드 도구**: Gradle

## 라이센스

이 프로젝트는 내부 사용을 위한 것입니다.
