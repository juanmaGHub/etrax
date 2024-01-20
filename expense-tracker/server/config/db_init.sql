--------------------------------------------------------------------------------
-- Create tables and relationships
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP 
);
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP
);
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    userId BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    categoryId BIGINT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    INDEX u_idx (userId),
    INDEX c_idx (categoryId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
--------------------------------------------------------------------------------
-- Create admin user
--------------------------------------------------------------------------------
INSERT INTO users (username,
                     email,
                     password)
VALUES ('admin','admin@gmail.com','4dm1n');
--------------------------------------------------------------------------------
-- Create default categories
--------------------------------------------------------------------------------
INSERT INTO categories (name)
VALUES ('Food'),
       ('Transportation'),
       ('Entertainment'),
       ('Clothes'),
       ('Other');
``` 