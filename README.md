1. cmd /c "mysql -u root -p < database/sql/init_tracklin.sql"
2. klik enter
3. php artisan config:clear
4. php artisan cache:clear
5. php artisan migrate
