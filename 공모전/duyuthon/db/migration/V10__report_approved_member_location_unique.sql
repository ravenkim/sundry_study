-- APPROVED 제보만 member+location 중복 방지 (REJECTED 재시도 허용)

ALTER TABLE report_db
    ADD COLUMN approved_dup_key VARCHAR(100) GENERATED ALWAYS AS (
        CASE
            WHEN status = 'APPROVED'
                AND member_seq IS NOT NULL
                AND location_seq IS NOT NULL
            THEN CONCAT(member_seq, ':', location_seq)
            ELSE NULL
        END
    ) STORED;

CREATE UNIQUE INDEX UK_report_approved_member_location
    ON report_db (approved_dup_key);
