ALTER TABLE member_db
    ADD COLUMN nickname VARCHAR(20) NULL;

UPDATE member_db
SET nickname = CONCAT('eco_', seq)
WHERE nickname IS NULL;

ALTER TABLE member_db
    MODIFY nickname VARCHAR(20) NOT NULL;

ALTER TABLE member_db
    ADD CONSTRAINT UK_member_nickname UNIQUE (nickname);
