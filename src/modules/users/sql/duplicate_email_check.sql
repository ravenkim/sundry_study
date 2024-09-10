SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE user_email = ?
) AS is_duplicate;

