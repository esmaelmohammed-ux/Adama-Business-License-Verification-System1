CREATE DATABASE IF NOT EXISTS ketelelema_audit;
USE ketelelema_audit;
// comment
CREATE TABLE IF NOT EXISTS businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  license_number VARCHAR(50) NOT NULL UNIQUE,
  owner_name VARCHAR(150) NOT NULL,
  sub_city VARCHAR(100) NOT NULL,
  expiry_date DATE NOT NULL,
  payment_status ENUM('Paid', 'Expired') NOT NULL,
  balance_due DECIMAL(10, 2) NOT NULL DEFAULT 0,
  INDEX idx_license_number (license_number)
);
// comment
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role ENUM('inspector', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
