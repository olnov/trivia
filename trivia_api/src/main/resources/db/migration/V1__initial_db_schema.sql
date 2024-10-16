DROP TABLE IF EXISTS game_questions;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    registered_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    started_at TIMESTAMP DEFAULT NOW(),
    is_completed BOOLEAN
);

CREATE TABLE game_questions (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    trivia_id BIGINT,
    answer TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN,
    difficulty TEXT,
    score BIGINT,
    answered_at TIMESTAMP DEFAULT NOW()
);
