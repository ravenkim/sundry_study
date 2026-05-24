-- Hibernate validate: Java int → INTEGER (V4는 TINYINT로 생성됨)
ALTER TABLE location_operating_schedule_db
    MODIFY COLUMN day_of_week INT NOT NULL COMMENT '1=월 … 7=일 (java.time.DayOfWeek)';
