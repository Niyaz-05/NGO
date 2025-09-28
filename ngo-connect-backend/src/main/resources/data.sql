-- Sample data for NGO Connect
-- This will be executed after schema creation

-- Insert sample users
INSERT IGNORE INTO users (full_name, email, password, phone, address, user_type, email_verified) VALUES
('John Doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890', '123 Main St, New York, NY', 'DONOR', TRUE),
('Jane Smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567891', '456 Oak Ave, California, CA', 'VOLUNTEER', TRUE),
('Admin User', 'admin@ngoconnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567892', '789 Admin Blvd, Texas, TX', 'ADMIN', TRUE),
('Deepak Soni', 'deepaksoni23022004@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567893', '123 Test Address', 'VOLUNTEER', TRUE),
('Test Admin', 'testadmin@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567894', '456 Test Address', 'ADMIN', TRUE),
('Test User', 'test@gmail.com', '$2a$12$LQqUy8qZmE0J0Y2PJkFgweS9s1HI8SjKo5ZE8o6MjNcYWJKPCZxKy', '+1234567895', '789 Test Street', 'ADMIN', TRUE);

-- Insert sample NGOs
INSERT IGNORE INTO ngos (organization_name, description, cause, location, website, phone, email, total_donations, rating, urgency, is_verified, status) VALUES
('Green Earth Foundation', 'Fighting climate change through reforestation projects and environmental education', 'Environment', 'New York', 'https://greenearth.org', '+1234567890', 'info@greenearth.org', 125000.00, 4.8, 'HIGH', TRUE, 'ACTIVE'),
('Education for All', 'Providing quality education to underprivileged children in rural areas', 'Education', 'California', 'https://educationforall.org', '+1234567891', 'contact@educationforall.org', 89000.00, 4.6, 'MEDIUM', TRUE, 'ACTIVE'),
('Health First', 'Medical assistance and healthcare services for rural communities', 'Healthcare', 'Texas', 'https://healthfirst.org', '+1234567892', 'info@healthfirst.org', 200000.00, 4.9, 'HIGH', TRUE, 'ACTIVE'),
('Women Empowerment Hub', 'Supporting women entrepreneurs and leaders through training and mentorship', 'Women Empowerment', 'Florida', 'https://womenempowerment.org', '+1234567893', 'hello@womenempowerment.org', 75000.00, 4.7, 'MEDIUM', TRUE, 'ACTIVE');

-- Insert volunteer opportunities
INSERT IGNORE INTO volunteer_opportunities (title, description, ngo_id, cause, location, time_commitment, work_type, start_date, end_date, volunteers_needed, volunteers_applied, urgency, is_active) VALUES
('Environmental Cleanup Drive', 'Join us for a community cleanup drive to make our parks cleaner and greener', 1, 'Environment', 'Central Park, New York', '4 hours', 'Physical Work', '2025-02-15 09:00:00', '2025-02-15 13:00:00', 20, 15, 'MEDIUM', TRUE),
('Teaching Assistant', 'Help children with their homework and provide educational support', 2, 'Education', 'Community Center, California', '2 hours/week', 'Teaching', '2025-01-01 10:00:00', '2025-06-30 16:00:00', 10, 7, 'HIGH', TRUE),
('Medical Camp Support', 'Assist medical professionals during a free health camp for rural communities', 3, 'Healthcare', 'Rural Clinic, Texas', '8 hours', 'Support Work', '2025-03-20 08:00:00', '2025-03-20 16:00:00', 15, 12, 'HIGH', TRUE),
('Women\'s Workshop Facilitator', 'Facilitate workshops on women\'s rights and empowerment', 4, 'Women Empowerment', 'Community Hall, Florida', '3 hours/week', 'Facilitation', '2025-01-10 14:00:00', '2025-05-10 17:00:00', 5, 3, 'MEDIUM', TRUE);

-- Insert opportunity requirements
INSERT IGNORE INTO opportunity_requirements (opportunity_id, requirement) VALUES
(1, 'Physical fitness'),
(1, 'Comfortable with outdoor work'),
(2, 'Teaching experience preferred'),
(2, 'Patience with children'),
(3, 'Basic first aid knowledge'),
(3, 'Comfortable with patients'),
(4, 'Leadership skills'),
(4, 'Experience with women\'s issues');