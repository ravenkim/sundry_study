-- Phase 1: LEAF(항목) 노드에 전기 자원 수량 (공모전 MVP)
-- 절약량 계산 시 ResourceType 기본 W × quantity 로 사용 (W는 코드/문서 상수)

ALTER TABLE location_node_db
    ADD COLUMN ac_count INT NOT NULL DEFAULT 0 COMMENT '에어컨 대수 (LEAF만 사용)',
    ADD COLUMN fluorescent_count INT NOT NULL DEFAULT 0 COMMENT '형광등 개수 (LEAF만 사용)',
    ADD COLUMN led_count INT NOT NULL DEFAULT 0 COMMENT 'LED 조명 개수 (LEAF만 사용)';
