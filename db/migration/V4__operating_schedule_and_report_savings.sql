-- Phase 1 확장: LEAF 요일별 운영시간 + 제보 절약량 스냅샷

CREATE TABLE location_operating_schedule_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    location_node_seq BIGINT NOT NULL,
    day_of_week TINYINT NOT NULL COMMENT '1=월 … 7=일 (java.time.DayOfWeek)',
    is_closed BIT(1) NOT NULL DEFAULT 0,
    power_on_time TIME DEFAULT NULL,
    power_off_time TIME DEFAULT NULL,
    PRIMARY KEY (seq),
    UNIQUE KEY UK_location_schedule_day (location_node_seq, day_of_week),
    KEY FK_location_schedule_node (location_node_seq),
    CONSTRAINT FK_location_schedule_node FOREIGN KEY (location_node_seq)
        REFERENCES location_node_db (seq) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

UPDATE report_db SET created_at = CURRENT_TIMESTAMP(6) WHERE created_at IS NULL;

ALTER TABLE report_db
    MODIFY COLUMN created_at DATETIME(6) NOT NULL,
    ADD COLUMN off_time_minutes INT DEFAULT NULL COMMENT '산출된 방치 시간(분)',
    ADD COLUMN estimated_kwh DECIMAL(10, 4) DEFAULT NULL COMMENT '예상 절약 kWh',
    ADD COLUMN estimated_savings_krw INT DEFAULT NULL COMMENT '예상 절약 금액(원)',
    ADD COLUMN estimated_point INT DEFAULT NULL COMMENT '예상 포인트 (승인 전 표시용)',
    ADD COLUMN point_awarded INT NOT NULL DEFAULT 0 COMMENT '확정 지급 포인트 (승인 시)';
