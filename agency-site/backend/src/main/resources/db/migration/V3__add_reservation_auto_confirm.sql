INSERT INTO site_configs (config_key, config_value, value_type, group_name, description, is_public, is_system)
VALUES (
    'reservation_auto_confirm',
    'false',
    'BOOLEAN',
    'RESERVATION',
    '예약 접수 시 관리자 승인 없이 즉시 예약 확정(CONFIRMED) 처리 여부',
    TRUE,
    TRUE
)
ON CONFLICT (config_key) DO NOTHING;
