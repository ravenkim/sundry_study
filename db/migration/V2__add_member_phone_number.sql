ALTER TABLE member_db
    ADD COLUMN phone_number VARCHAR(20) DEFAULT NULL;

ALTER TABLE member_db
    ADD UNIQUE KEY UK_member_phone (phone_number);
