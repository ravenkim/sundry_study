-- year_month: MySQL 8.4 예약어 YEAR_MONTH — 식별자는 백틱 필수
CREATE TABLE electricity_tariff_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    `year_month` CHAR(7) NOT NULL COMMENT '적용 연월 YYYY-MM',
    contract_type_code VARCHAR(10) NOT NULL COMMENT '한전 계약종별 코드',
    contract_type_name VARCHAR(50) NOT NULL COMMENT '계약종별명 (예: 교육용)',
    unit_cost_krw DECIMAL(10, 2) NOT NULL COMMENT '평균판매단가 (원/kWh)',
    power_usage_kwh BIGINT DEFAULT NULL COMMENT '전력사용량 합계 (kWh)',
    bill_krw BIGINT DEFAULT NULL COMMENT '전기요금 합계 (원)',
    cust_count INT DEFAULT NULL COMMENT '고객호수',
    fetched_at DATETIME NOT NULL COMMENT 'API 수집 시각',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_electricity_tariff_month_contract (`year_month`, contract_type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
