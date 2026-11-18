# 엔터프라이즈 & 외주 에이전시 통합 홈페이지 스타터 킷 (v2.0-FINAL)

> **100% 라이선스 클린(Apache 2.0 / MIT / BSD / OFL)** · **2GB RAM 단일 서버 올인원 구동** · **단일 모듈 패키지 격리(Modular Monolith)**

---

## 1. 빠른 실행 가이드 (Docker Compose 올인원)

```bash
# 1. 환경변수 파일 복사 및 도메인·시크릿 키 설정
cp .env.example .env

# 2. 전체 스택 빌드 및 기동 (Caddy + Next.js 15 + Spring Boot 3.4 + PostgreSQL 16)
docker compose up -d --build
```

* **접속 주소**:
  * 대고객 홈페이지: `https://<DOMAIN_NAME>` (로컬: `http://localhost`)
  * 관리자 콘솔: `https://<DOMAIN_NAME>/admin`
* **초기 슈퍼 관리자 계정** (`AdminBootstrapConfig` 자동 시드):
  * 아이디: `admin`
  * 비밀번호: `Admin1234!` *(운영 배포 직후 반드시 변경 권장)*

---

## 2. Standard vs Pro 기능 스위치 (`.env` / `application.yml`)

| 기능 | 설정 키 | 기본값 | 설명 |
| :--- | :--- | :---: | :--- |
| 예약 채널 모드 | `FEATURE_RESERVATION_MODE` | `BOTH` | `OFF` \| `NAVER` \| `INTERNAL` \| `BOTH` |
| 예약 정원 모드 | `FEATURE_RESERVATION_CAPACITY` | `SINGLE` | `SINGLE`(1:1 단독) \| `MULTI`(시간대별 N명 정원제) |
| 주문·결제(Pro) | `FEATURE_PAYMENT` | `false` | `idempotency_key` 기반 중복 결제 방어 상태 머신 |
| 감사 로그(Pro) | `FEATURE_AUDIT_LOG` | `false` | `@AuditLog` AOP 변경 전/후 JSONB 기록 |
| 엑셀 다운로드 | `FEATURE_EXCEL_EXPORT` | `true` | Apache POI `SXSSFWorkbook` 스트리밍 `.xlsx` |
| 관리자 2FA(Pro) | `FEATURE_ADMIN_TOTP` | `false` | Google OTP (RFC 6238 TOTP) 2단계 인증 |

---

## 3. 로컬 검증 명령어

```bash
# 백엔드 전체 컴파일 및 ArchUnit / 도메인 단위 테스트
cd backend
./gradlew clean test

# 프론트엔드 TypeScript 타입 체크 및 프로덕션 빌드
cd ../frontend
npx tsc --noEmit
npm run build
```
