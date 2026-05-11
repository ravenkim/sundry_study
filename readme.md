# sundry_study

언어·주제별로 나눠 둔 학습·실험·토이 프로젝트를 모아 둔 저장소입니다. 각 하위 폴더는 독립적인 코드베이스일 수 있으며, 일부 프로젝트는 자체 `README`를 가집니다.

## 상위 구조

| 폴더 | 설명 |
|------|------|
| `firmware` | 펌웨어·하드웨어 관련 자료 (예: duckyPad, O.MG Cable) |
| `java` | Java / Spring 등 JVM 기반 예제·스터디 |
| `javascript-typescript` | Node, React, NestJS 등 JS/TS 프로젝트 |
| `kotlin` | Kotlin 예제 (예: `ss-auth` 인증 서버) |
| `misc-triage` | 기타 분류·정리용 |
| `python` | Python (크롤링, 도구 스크립트 등) |
| `security` | 보안·네트워크 실습 (예: ARP 관련) |
| `static-sites` | 정적 사이트·문서성 프로젝트 |
| `공모전` | 공모전/해커톤 산출물 |

## Git subtree로 프로젝트 추가

외부 저장소를 이 저장소의 하위 폴더로 한 번에 넣을 때는 **subtree add** 형식을 사용합니다.

```bash
git subtree add --prefix=<플젝명> <주소> <브랜치명>
```

| 인자 | 의미 |
|------|------|
| `--prefix=<플젝명>` | 이 repo 루트 기준으로 만들 경로. 위 **상위 구조**에 맞추는 것을 권장합니다. (예: `kotlin/ss-auth`, `javascript-typescript/ting_be`) |
| `<주소>` | 원격 저장소 URL (`https://...`, `git@...` 등) |
| `<브랜치명>` | 가져올 브랜치 (예: `main`, `master`) |

예시:

```bash
git subtree add --prefix=python/my-tool https://github.com/org/my-tool.git main
```

히스토리를 한 커밋으로 압축해 가져오려면 `--squash`를 붙입니다.

```bash
git subtree add --prefix=<플젝명> --squash <주소> <브랜치명>
```

이미 subtree로 넣은 원격을 최신으로 맞출 때:

```bash
git subtree pull --prefix=<플젝명> <주소> <브랜치명>
```

(`pull` 시에도 `--squash`를 썼다면 이후에도 동일하게 붙여 일관되게 두는 것이 좋습니다.)

## 사용 방법

1. 관심 있는 주제의 하위 폴더로 이동합니다.
2. 해당 디렉터리에 `README.md` 또는 `readme.md`가 있으면 그 안의 실행 방법·의존성을 따릅니다.
3. Gradle(`gradlew`), npm/yarn, pip 등은 **각 프로젝트 루트**에서 실행하는 것이 일반적입니다.

## 참고

- 루트에는 공통 빌드 스크립트가 없을 수 있습니다. 항목별로 환경을 맞춰 주세요.
- 서브모듈·외부 복제본이 포함될 수 있으니, 라이선스와 출처는 각 프로젝트 문서를 확인하세요.
