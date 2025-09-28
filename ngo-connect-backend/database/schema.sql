-- NGO Connect Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS ngo_connect;
USE ngo_connect;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(500),
    user_type ENUM('DONOR', 'VOLUNTEER', 'NGO', 'ADMIN') NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT,
    blocked_by BIGINT NULL,
    blocked_at TIMESTAMP NULL,
    total_donations DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blocked_by) REFERENCES users(id) ON DELETE SET NULL
);

-- NGOs table
CREATE TABLE IF NOT EXISTS ngos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(200) NOT NULL,
    description TEXT,
    cause VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    website VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(200),
    registration_number VARCHAR(100),
    founded_year INT,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    image_url VARCHAR(500),
    urgency ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    is_verified BOOLEAN DEFAULT FALSE,
    status ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'REJECTED') DEFAULT 'PENDING',
    registration_documents TEXT, -- JSON array of document URLs
    suspension_reason TEXT,
    suspended_by BIGINT NULL,
    suspended_at TIMESTAMP NULL,
    verified_by BIGINT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (suspended_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    ngo_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    pledge_type ENUM('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'YEARLY') DEFAULT 'ONE_TIME',
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'UPI') NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    donor_message TEXT,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
);

-- Volunteer opportunities table
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    ngo_id BIGINT NOT NULL,
    cause VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    time_commitment VARCHAR(100) NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    volunteers_needed INT NOT NULL,
    volunteers_applied INT DEFAULT 0,
    urgency ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
);

-- Opportunity requirements table
CREATE TABLE IF NOT EXISTS opportunity_requirements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    opportunity_id BIGINT NOT NULL,
    requirement VARCHAR(500) NOT NULL,
    FOREIGN KEY (opportunity_id) REFERENCES volunteer_opportunities(id) ON DELETE CASCADE
);

-- Volunteer applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id BIGINT NOT NULL,
    opportunity_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    experience TEXT NOT NULL,
    motivation TEXT NOT NULL,
    availability VARCHAR(200) NOT NULL,
    emergency_contact VARCHAR(100) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    additional_info TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_date TIMESTAMP NULL,
    reviewer_notes TEXT,
    hours_completed INT DEFAULT 0,
    feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES volunteer_opportunities(id) ON DELETE CASCADE
);

-- Volunteer skills table
CREATE TABLE IF NOT EXISTS volunteer_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    FOREIGN KEY (application_id) REFERENCES volunteer_applications(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_ngos_cause ON ngos(cause);
CREATE INDEX idx_ngos_location ON ngos(location);
CREATE INDEX idx_ngos_urgency ON ngos(urgency);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_ngo_id ON donations(ngo_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_volunteer_opportunities_cause ON volunteer_opportunities(cause);
CREATE INDEX idx_volunteer_opportunities_location ON volunteer_opportunities(location);
CREATE INDEX idx_volunteer_opportunities_urgency ON volunteer_opportunities(urgency);
CREATE INDEX idx_volunteer_applications_volunteer_id ON volunteer_applications(volunteer_id);
CREATE INDEX idx_volunteer_applications_opportunity_id ON volunteer_applications(opportunity_id);
CREATE INDEX idx_volunteer_applications_status ON volunteer_applications(status);

-- Insert sample data
INSERT INTO users (full_name, email, password, phone, address, user_type, email_verified) VALUES
('John Doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890', '123 Main St, New York, NY', 'DONOR', TRUE),
('Jane Smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567891', '456 Oak Ave, California, CA', 'VOLUNTEER', TRUE),
('Admin User', 'admin@ngoconnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567892', '789 Admin Blvd, Texas, TX', 'ADMIN', TRUE);

INSERT INTO ngos (organization_name, description, cause, location, website, phone, email, total_donations, rating, urgency, is_verified, status, registration_documents) VALUES
('Green Earth Foundation', 'Fighting climate change through reforestation projects and environmental education', 'Environment', 'New York', 'https://greenearth.org', '+1234567890', 'info@greenearth.org', 125000.00, 4.8, 'HIGH', TRUE, 'ACTIVE', '["registration_cert.pdf", "tax_exemption.pdf", "board_resolution.pdf"]'),
('Education for All', 'Providing quality education to underprivileged children in rural areas', 'Education', 'California', 'https://educationforall.org', '+1234567891', 'contact@educationforall.org', 89000.00, 4.6, 'MEDIUM', TRUE, 'ACTIVE', '["registration_cert.pdf", "annual_report.pdf"]'),
('Health First', 'Medical assistance and healthcare services for rural communities', 'Healthcare', 'Texas', 'https://healthfirst.org', '+1234567892', 'info@healthfirst.org', 200000.00, 4.9, 'HIGH', TRUE, 'ACTIVE', '["registration_cert.pdf", "medical_license.pdf", "audit_report.pdf"]'),
('Women Empowerment Hub', 'Supporting women entrepreneurs and leaders through training and mentorship', 'Women Empowerment', 'Florida', 'https://womenempowerment.org', '+1234567893', 'hello@womenempowerment.org', 75000.00, 4.7, 'MEDIUM', TRUE, 'ACTIVE', '["registration_cert.pdf", "program_details.pdf"]'),
('Pending NGO Application', 'New NGO application waiting for admin review', 'Healthcare', 'Arizona', 'https://newhealth.org', '+1234567894', 'info@newhealth.org', 0.00, 0.0, 'LOW', FALSE, 'PENDING', '["registration_cert.pdf", "founder_id.pdf"]');

INSERT INTO volunteer_opportunities (title, description, ngo_id, cause, location, time_commitment, work_type, start_date, end_date, volunteers_needed, volunteers_applied, urgency) VALUES
('Environmental Cleanup Drive', 'Join us for a community cleanup drive to make our parks cleaner and greener', 1, 'Environment', 'Central Park, New York', '4 hours', 'Physical Work', '2024-02-15 09:00:00', '2024-02-15 13:00:00', 20, 15, 'MEDIUM'),
('Teaching Assistant', 'Help children with their homework and provide educational support', 2, 'Education', 'Community Center, California', '2 hours/week', 'Teaching', '2024-02-01 10:00:00', '2024-06-30 16:00:00', 10, 7, 'HIGH'),
('Medical Camp Support', 'Assist medical professionals during a free health camp for rural communities', 3, 'Healthcare', 'Rural Clinic, Texas', '8 hours', 'Support Work', '2024-02-20 08:00:00', '2024-02-20 16:00:00', 15, 12, 'HIGH'),
('Women\'s Workshop Facilitator', 'Facilitate workshops on women\'s rights and empowerment', 4, 'Women Empowerment', 'Community Hall, Florida', '3 hours/week', 'Facilitation', '2024-02-10 14:00:00', '2024-05-10 17:00:00', 5, 3, 'MEDIUM');

INSERT INTO opportunity_requirements (opportunity_id, requirement) VALUES
(1, 'Physical fitness'),
(1, 'Comfortable with outdoor work'),
(2, 'Teaching experience preferred'),
(2, 'Patience with children'),
(3, 'Basic first aid knowledge'),
(3, 'Comfortable with patients'),
(4, 'Leadership skills'),
(4, 'Experience with women\'s issues');

-- Admin tables for the Admin Module

-- NGO verification requests table
CREATE TABLE IF NOT EXISTS ngo_verification_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ngo_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW') DEFAULT 'PENDING',
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_date TIMESTAMP NULL,
    reviewed_by BIGINT NULL, -- admin user id
    reviewer_notes TEXT,
    documents_provided TEXT, -- JSON or comma-separated list
    verification_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    activity_type ENUM('NGO_VERIFICATION', 'USER_MANAGEMENT', 'DONATION_REVIEW', 'REPORT_REVIEW', 'SYSTEM_CONFIG') NOT NULL,
    target_id BIGINT, -- ID of the affected entity (NGO, user, donation, etc.)
    action VARCHAR(100) NOT NULL, -- 'APPROVE', 'REJECT', 'SUSPEND', 'DELETE', etc.
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System alerts table for admin notifications
CREATE TABLE IF NOT EXISTS system_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_type ENUM('NGO_PENDING_APPROVAL', 'MISSING_FUND_REPORT', 'SUSPICIOUS_ACTIVITY', 'HIGH_DONATION_VOLUME', 'SYSTEM_ERROR') NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type ENUM('NGO', 'USER', 'DONATION', 'APPLICATION') NULL,
    related_entity_id BIGINT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by BIGINT NULL, -- admin user id
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Fund utilization reports table
CREATE TABLE IF NOT EXISTS fund_utilization_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ngo_id BIGINT NOT NULL,
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    total_funds_received DECIMAL(15,2) NOT NULL,
    total_funds_utilized DECIMAL(15,2) NOT NULL,
    utilization_breakdown TEXT, -- JSON format
    impact_description TEXT,
    supporting_documents TEXT, -- file paths or URLs
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION') DEFAULT 'PENDING',
    reviewed_by BIGINT NULL, -- admin user id
    reviewed_date TIMESTAMP NULL,
    reviewer_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- NGO management actions table
CREATE TABLE IF NOT EXISTS ngo_management_actions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ngo_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL,
    action_type ENUM('APPROVE', 'REJECT', 'SUSPEND', 'DEACTIVATE', 'REACTIVATE', 'PROFILE_UPDATE', 'DOCUMENT_REVIEW') NOT NULL,
    reason TEXT,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    additional_notes TEXT,
    documents_reviewed TEXT, -- JSON array of document info
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Platform statistics table for caching dashboard data
CREATE TABLE IF NOT EXISTS platform_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_ngos_registered INT DEFAULT 0,
    total_ngos_verified INT DEFAULT 0,
    total_ngos_pending INT DEFAULT 0,
    total_users_registered INT DEFAULT 0,
    total_donations_amount DECIMAL(15,2) DEFAULT 0.00,
    total_donations_count INT DEFAULT 0,
    active_volunteer_opportunities INT DEFAULT 0,
    pending_verifications INT DEFAULT 0,
    missing_fund_reports INT DEFAULT 0,
    suspicious_activities INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_stat_date (stat_date)
);

-- Add indexes for admin tables
CREATE INDEX idx_ngo_verification_status ON ngo_verification_requests(status);
CREATE INDEX idx_ngo_verification_submitted ON ngo_verification_requests(submitted_date);
CREATE INDEX idx_admin_activity_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_type ON admin_activity_logs(activity_type);
CREATE INDEX idx_system_alerts_type ON system_alerts(alert_type);
CREATE INDEX idx_system_alerts_priority ON system_alerts(priority);
CREATE INDEX idx_system_alerts_resolved ON system_alerts(is_resolved);
CREATE INDEX idx_fund_reports_ngo_id ON fund_utilization_reports(ngo_id);
CREATE INDEX idx_fund_reports_status ON fund_utilization_reports(status);
CREATE INDEX idx_platform_stats_date ON platform_statistics(stat_date);

-- Insert sample verification requests and alerts
INSERT INTO ngo_verification_requests (ngo_id, status, submitted_date) VALUES
(1, 'APPROVED', '2024-01-15 10:00:00'),
(2, 'APPROVED', '2024-01-16 11:00:00'),
(3, 'APPROVED', '2024-01-17 12:00:00'),
(4, 'PENDING', '2024-02-01 14:00:00');

INSERT INTO system_alerts (alert_type, priority, title, message, related_entity_type, related_entity_id) VALUES
('NGO_PENDING_APPROVAL', 'MEDIUM', 'New NGO Awaiting Verification', 'Women Empowerment Hub has submitted documents for verification', 'NGO', 4),
('MISSING_FUND_REPORT', 'HIGH', 'Fund Utilization Report Overdue', 'Green Earth Foundation has not submitted their quarterly fund report', 'NGO', 1),
('SUSPICIOUS_ACTIVITY', 'HIGH', 'Unusual Donation Pattern Detected', 'Multiple large donations from the same source detected', 'DONATION', NULL);

INSERT INTO platform_statistics (stat_date, total_ngos_registered, total_ngos_verified, total_ngos_pending, total_users_registered, total_donations_amount, total_donations_count, active_volunteer_opportunities) VALUES
(CURDATE(), 4, 3, 1, 3, 489000.00, 15, 4);
