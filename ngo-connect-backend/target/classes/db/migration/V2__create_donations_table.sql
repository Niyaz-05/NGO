CREATE TABLE IF NOT EXISTS donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_id VARCHAR(100) NOT NULL,
    pledge_type VARCHAR(20) NOT NULL,
    message TEXT,
    user_id BIGINT NOT NULL,
    ngo_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    INDEX idx_donations_user_id (user_id),
    INDEX idx_donations_ngo_id (ngo_id),
    INDEX idx_donations_created_at (created_at)
);
