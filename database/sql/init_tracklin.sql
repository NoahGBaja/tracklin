-- ===============================
-- INIT DB UNTUK LARAVEL TRACKLIN
-- ===============================

-- 1) Buat database "tracklin" kalau belum ada
CREATE DATABASE IF NOT EXISTS tracklin
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2) Buat user "tracklin_user" dengan password "Shes_electric"
CREATE USER IF NOT EXISTS 'tracklin_user'@'localhost'
IDENTIFIED BY 'Shes_electric';

-- 3) Berikan semua hak ke DB "tracklin"
GRANT ALL PRIVILEGES ON tracklin.* TO 'tracklin_user'@'localhost';

-- 4) Refresh privilege
FLUSH PRIVILEGES;
