-- =========================================================
-- 1) DATABASE
-- =========================================================
CREATE DATABASE IF NOT EXISTS tracklin_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tracklin_app;

-- =========================================================
-- 2) USERS TABLE (untuk register & login)
-- =========================================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50)  NOT NULL,
    email    VARCHAR(191) NOT NULL,
    -- NOTE: nilai di kolom "password" HARUS hash (bcrypt/argon2), 
    -- bukan password asli.
    password VARCHAR(255) NOT NULL,

    email_verified_at TIMESTAMP NULL,
    remember_token    VARCHAR(100) NULL,

    last_login_at TIMESTAMP NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- =========================================================
-- 3) TASKS TABLE (to-do & schedule per user)
-- =========================================================
CREATE TABLE tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    text VARCHAR(255) NOT NULL,     -- isi task (sesuai todolist.jsx/schedule.jsx)
    date DATE NULL,                 -- format 'YYYY-MM-DD'
    time CHAR(5) NULL,              -- format 'HH.MM' (misal '09.30')
    completed TINYINT(1) NOT NULL DEFAULT 0,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    KEY idx_tasks_user (user_id),
    KEY idx_tasks_date (date),
    KEY idx_tasks_completed (completed)
) ENGINE=InnoDB;

-- =========================================================
-- 4) PASSWORD RESETS (forgot password)
-- =========================================================
CREATE TABLE password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(191) NOT NULL,
    -- Simpan HASH dari token reset (misal sha256), 
    -- jangan simpan token asli yang dikirim ke email user.
    token_hash CHAR(64) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY idx_password_resets_email (email)
) ENGINE=InnoDB;

-- =========================================================
-- 5) (OPTIONAL) USER_SESSIONS (multi-device / session management)
-- =========================================================
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,
    -- hash dari session / refresh token
    session_token_hash CHAR(64) NOT NULL,

    ip_address  VARCHAR(45)  NULL,
    user_agent  VARCHAR(255) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_session_token_hash (session_token_hash)
) ENGINE=InnoDB;
