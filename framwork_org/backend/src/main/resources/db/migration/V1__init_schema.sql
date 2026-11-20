-- =====================================================================
-- V1__init_schema.sql
-- Enterprise & Agency Starter Kit v2.0-FINAL (PostgreSQL 16 Standard)
-- =====================================================================

-- 1. 회원 (members)
CREATE TABLE members (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,               -- 외부 API 노출용 UUIDv7
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),                   -- 소셜 전용 가입 시 NULL 허용
    nickname VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, WITHDRAWN
    role VARCHAR(30) NOT NULL DEFAULT 'USER',     -- USER, VIP
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uq_members_email_active ON members(email) WHERE deleted_at IS NULL;

-- 2. 소셜 로그인 연동 계정 (member_oauth_accounts)
CREATE TABLE member_oauth_accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    provider VARCHAR(30) NOT NULL,                -- GOOGLE, KAKAO, NAVER
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider, provider_user_id)
);

-- 3. DB 기반 Refresh Token 순환 및 10초 Grace Window (refresh_tokens)
CREATE TABLE refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    family_id UUID NOT NULL,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    subject_type VARCHAR(20) NOT NULL,            -- MEMBER, ADMIN
    subject_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, USED, REVOKED
    replaced_by_token_hash VARCHAR(128),
    used_at TIMESTAMP WITH TIME ZONE,             -- USED 전환 후 10초 내 재요청 시 Grace 허용
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_refresh_tokens_family ON refresh_tokens(family_id);

-- 4. 관리자 계정 (admins)
CREATE TABLE admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, LOCKED
    totp_secret VARCHAR(255),                     -- Pro 옵션: Google OTP 시크릿 (기본 비활성)
    is_totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uq_admins_username_active ON admins(username) WHERE deleted_at IS NULL;

-- 5. 관리자 역할 및 권한 (roles, permissions, admin_roles, role_permissions)
CREATE TABLE roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_code VARCHAR(50) NOT NULL UNIQUE,        -- ROLE_SUPER_ADMIN, ROLE_MANAGER
    role_name VARCHAR(100) NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,     -- TRUE일 경우 관리자 화면에서 삭제 불가
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    permission_code VARCHAR(100) NOT NULL UNIQUE, -- inquiry:read, reservation:write, config:write
    permission_name VARCHAR(100) NOT NULL
);

CREATE TABLE admin_roles (
    admin_id BIGINT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (admin_id, role_id)
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 6. 동적 메뉴 (menus)
CREATE TABLE menus (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id BIGINT REFERENCES menus(id) ON DELETE CASCADE,
    menu_type VARCHAR(20) NOT NULL DEFAULT 'PUBLIC', -- PUBLIC(홈페이지 헤더), ADMIN(관리자 사이드바)
    menu_name VARCHAR(100) NOT NULL,
    route_path VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,        -- 사장님 실수 삭제 방지 잠금 플래그
    required_permission VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_menus_type_parent_sort ON menus(menu_type, parent_id, sort_order);

-- 7. 무코드 SEO, 브랜딩, 예약 스위치 설정 (site_configs)
CREATE TABLE site_configs (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT NOT NULL,
    value_type VARCHAR(20) NOT NULL DEFAULT 'STRING', -- STRING, NUMBER, BOOLEAN, JSON, COLOR, IMAGE
    group_name VARCHAR(50) NOT NULL,                  -- SEO, BRANDING, RESERVATION, NOTIFICATION, COMPANY
    description VARCHAR(255) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,          -- TRUE일 경우 홈페이지 렌더링 시 공개 조회 허용
    is_system BOOLEAN NOT NULL DEFAULT TRUE,          -- TRUE일 경우 키 삭제 절대 불가 (값만 수정 가능)
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. 동적 상담 문의 (inquiries)
CREATE TABLE inquiries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- GENERAL, ESTIMATE, PARTNERSHIP
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb, -- 업종별 추가 입력 항목 (예산, 희망지역 등)
    attachment_media_id BIGINT,                       -- /uploads/private 에 저장된 비공개 첨부파일 ID
    privacy_agreed BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',    -- PENDING(접수대기), IN_PROGRESS(상담중), COMPLETED(완료), SPAM
    admin_memo TEXT,
    client_ip VARCHAR(45) NOT NULL,
    answered_by VARCHAR(100),
    answered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_inquiries_status_created ON inquiries(status, created_at DESC) WHERE deleted_at IS NULL;

-- 9. 하이브리드 예약 슬롯 (reservation_slots)
CREATE TABLE reservation_slots (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    service_name VARCHAR(100) NOT NULL DEFAULT 'DEFAULT',
    max_capacity INT NOT NULL DEFAULT 1,              -- SINGLE 모드: 1 고정 / MULTI 모드: N명 설정 가능
    reserved_count INT NOT NULL DEFAULT 0,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (slot_date, slot_time, service_name),
    CONSTRAINT chk_slot_capacity CHECK (reserved_count >= 0 AND reserved_count <= max_capacity)
);

-- 10. 자체 예약 접수 내역 (reservations)
CREATE TABLE reservations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    slot_id BIGINT NOT NULL REFERENCES reservation_slots(id),
    member_id BIGINT REFERENCES members(id),          -- 비회원 예약도 허용 (NULL 가능)
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    visitor_count INT NOT NULL DEFAULT 1,             -- SINGLE 모드: 1 고정 / MULTI 모드: 예약 인원수
    custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb, -- 업종별 예약 추가 질문 (증상, 요청사항 등)
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',  -- REQUESTED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
    order_id BIGINT,                                  -- Pro 결제 연동 시 예약금 주문 ID
    admin_memo TEXT,
    client_ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reservations_slot ON reservations(slot_id, status);
CREATE INDEX idx_reservations_phone ON reservations(customer_phone, created_at DESC);

-- 11. 미디어 파이프라인 공개/비공개 통합 메타데이터 (media_files)
CREATE TABLE media_files (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC', -- PUBLIC(/uploads/public), PRIVATE(/uploads/private)
    original_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL UNIQUE,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INT,
    height INT,
    blur_hash VARCHAR(100),
    variants_json JSONB DEFAULT '{}'::jsonb,          -- THUMBNAIL(360), MEDIUM(768), LARGE(1920) WebP 경로 통합 저장
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',    -- PENDING, PROCESSING, READY, REJECTED, FAILED
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 12. CMS 통합 콘텐츠 (cms_contents)
CREATE TABLE cms_contents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,                    -- NOTICE, FAQ, PORTFOLIO, BANNER, POPUP, TERMS
    title VARCHAR(300) NOT NULL,
    summary VARCHAR(500),
    content_html TEXT,
    thumbnail_url VARCHAR(500),
    extra_json JSONB DEFAULT '{}'::jsonb,             -- 팝업 노출 좌표/기간, 포트폴리오 고객사명 등
    view_count BIGINT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,         -- 이용약관·개인정보처리방침 등 필수 문서 삭제 방지
    author_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uq_cms_slug_active ON cms_contents(slug, category) WHERE deleted_at IS NULL;

-- 13. Transactional Outbox 이벤트 큐 (outbox_events)
CREATE TABLE outbox_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aggregate_type VARCHAR(50) NOT NULL,              -- INQUIRY, RESERVATION, MEMBER, ORDER
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,                  -- SEND_ALIMTALK, SEND_EMAIL, SEND_SLACK
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',    -- PENDING, PUBLISHED, FAILED
    retry_count INT NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_outbox_pending ON outbox_events(status, next_retry_at) WHERE status = 'PENDING';

-- 14. [Pro 확장 옵션] 주문·결제 상태 머신 (orders)
CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    member_id BIGINT REFERENCES members(id),
    order_name VARCHAR(255) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',    -- PENDING, PAID, CANCELLED, REFUNDED
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    pg_provider VARCHAR(50),                          -- MOCK, TOSS, PORTONE
    pg_transaction_id VARCHAR(255),
    raw_webhook_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. [Pro 확장 옵션] 데이터 변경 감사 로그 (audit_logs)
CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,                 -- CREATE, UPDATE, DELETE, EXPORT, LOGIN_FAIL
    domain_type VARCHAR(50) NOT NULL,                 -- CONFIG, INQUIRY, RESERVATION, MEMBER, ADMIN
    target_id VARCHAR(100),
    actor_id VARCHAR(100) NOT NULL,
    client_ip VARCHAR(45) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
