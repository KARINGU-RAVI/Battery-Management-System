-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS battery_data;

-- Create a table to store battery data points
CREATE TABLE battery_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    battery_id VARCHAR(50) NOT NULL,
    current DOUBLE NOT NULL,
    voltage DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL,
    `time` TIMESTAMP NOT NULL
);

-- Create a composite index for efficient lookups by battery and time
CREATE INDEX idx_battery_id_time ON battery_data (battery_id, `time` DESC);

-- (Bonus) Create a table for users for JWT authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a sample user for testing (password: "strongpassword")
INSERT INTO users (username, password_hash) VALUES ('testuser', '$2b$10$9s6zXkP5b/0f7e.y5z.9pOj.u7G/0iA7K6q3t.Y5s.g5F8p.E3q.e');