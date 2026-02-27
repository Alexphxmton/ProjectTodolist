CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
    completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    notes TEXT,
    due_date DATE,
    priority INTEGER CHECK (priority IN (1,2,3)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_todos_order ON todos(order_index);
CREATE INDEX idx_todos_completed ON todos(completed);
