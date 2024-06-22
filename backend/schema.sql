CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    child_first_name TEXT,
    child_last_name TEXT,
    child_dob DATE
);

CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username INTEGER NOT NULL,
    timestamp DATETIME NOT NULL,
    user_message TEXT NOT NULL,
    system_message TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users (id)
);
