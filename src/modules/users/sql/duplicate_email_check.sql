SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE user_email = 'user@example.com'
) AS is_duplicate;