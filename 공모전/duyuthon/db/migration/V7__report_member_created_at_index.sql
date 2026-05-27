-- 제보 이력 목록 조회(member_seq + created_at 정렬) 성능 개선

CREATE INDEX IDX_report_member_created_at
    ON report_db (member_seq, created_at DESC);

CREATE INDEX IDX_report_member_status_created_at
    ON report_db (member_seq, status, created_at DESC);
