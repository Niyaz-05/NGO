-- Add total_donations column to users table
ALTER TABLE users
ADD COLUMN total_donations DECIMAL(15, 2) NOT NULL DEFAULT 0.00;

-- Update existing users to set default value
UPDATE users SET total_donations = 0.00 WHERE total_donations IS NULL;
