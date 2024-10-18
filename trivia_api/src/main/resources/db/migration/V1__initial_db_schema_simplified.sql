DROP TABLE IF EXISTS game_questions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    registered_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_questions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    answer TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN,
    difficulty TEXT,
    score BIGINT,
    answered_at TIMESTAMP DEFAULT NOW()
);
