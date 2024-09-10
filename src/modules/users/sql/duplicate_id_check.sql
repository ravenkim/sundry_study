SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE user_login_id = ?
) AS is_duplicate;