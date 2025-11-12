-- Sample Data Script for Admin Dashboard Testing
-- This script adds diverse data with various statuses for comprehensive testing

-- ==============================================
-- 1. ADD SAMPLE NGOs WITH DIFFERENT STATUSES
-- ==============================================

-- Add some PENDING NGOs (awaiting approval)
INSERT INTO ngos (organization_name, description, cause, location, website, phone, email, registration_number, founded_year, is_verified, status, created_at, updated_at)
VALUES 
('Hope Foundation', 'A foundation working for child education in rural areas', 'EDUCATION', 'Austin, TX, USA', 'https://hopefoundation.org', '+1-555-0101', 'contact@hopefoundation.org', 'REG-HOPE-001', 2020, false, 'PENDING', NOW(), NOW()),
('Green Earth Initiative', 'Environmental conservation and sustainability projects', 'ENVIRONMENT', 'Portland, OR, USA', 'https://greenearth.org', '+1-555-0102', 'info@greenearth.org', 'REG-GREEN-001', 2019, false, 'PENDING', NOW(), NOW()),
('Rural Health Network', 'Healthcare services for underserved rural communities', 'HEALTH', 'Omaha, NE, USA', 'https://ruralhealthnet.org', '+1-555-0103', 'admin@ruralhealthnet.org', 'REG-RURAL-001', 2021, false, 'PENDING', NOW(), NOW());

-- Add some SUSPENDED NGOs
INSERT INTO ngos (organization_name, description, cause, location, website, phone, email, registration_number, founded_year, is_verified, status, created_at, updated_at)
VALUES 
('Questionable Charity', 'Under investigation for fund misuse', 'GENERAL', 'Miami, FL, USA', 'https://questionablecharity.org', '+1-555-0201', 'contact@questionablecharity.org', 'REG-QUEST-001', 2018, true, 'SUSPENDED', NOW(), NOW()),
('Inactive Foundation', 'Suspended due to lack of activity reports', 'ANIMALS', 'Phoenix, AZ, USA', 'https://inactivefoundation.org', '+1-555-0202', 'info@inactivefoundation.org', 'REG-INACT-001', 2017, true, 'SUSPENDED', NOW(), NOW());

-- Add some REJECTED NGOs
INSERT INTO ngos (organization_name, description, cause, location, website, phone, email, registration_number, founded_year, is_verified, status, created_at, updated_at)
VALUES 
('Failed Venture', 'Application rejected due to incomplete documentation', 'POVERTY', 'Detroit, MI, USA', 'https://failedventure.org', '+1-555-0301', 'contact@failedventure.org', 'REG-FAIL-001', 2022, false, 'REJECTED', NOW(), NOW());

-- ==============================================
-- 2. ADD SAMPLE USERS WITH DIFFERENT STATUSES
-- ==============================================

-- Add some blocked users
INSERT INTO users (email, password, full_name, user_type, is_blocked, block_reason, email_verified, phone, address, total_donations, created_at, updated_at)
VALUES 
('blocked.donor@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Blocked Donor', 'DONOR', true, 'Suspicious donation patterns detected', true, '+1-555-1001', '111 Blocked St, Chicago, IL, USA', 0.00, NOW(), NOW()),
('spam.volunteer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Spam Volunteer', 'VOLUNTEER', true, 'Spam and inappropriate behavior', true, '+1-555-1002', '222 Spam Ave, Los Angeles, CA, USA', 0.00, NOW(), NOW()),
('inactive.ngo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Inactive NGO Manager', 'NGO', true, 'Account inactive for over 6 months', false, '+1-555-1003', '333 Inactive Rd, Seattle, WA, USA', 0.00, NOW(), NOW());

-- Add some unverified email users
INSERT INTO users (email, password, full_name, user_type, is_blocked, email_verified, phone, address, total_donations, created_at, updated_at)
VALUES 
('unverified.donor@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Unverified Donor', 'DONOR', false, false, '+1-555-2001', '444 Pending St, Houston, TX, USA', 0.00, NOW(), NOW()),
('pending.volunteer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pending Volunteer', 'VOLUNTEER', false, false, '+1-555-2002', '555 Unverified Ave, Denver, CO, USA', 0.00, NOW(), NOW());

-- ==============================================
-- 3. ADD SAMPLE DONATIONS WITH VARIOUS SCENARIOS
-- ==============================================

-- Get some NGO and User IDs for foreign key references (adjust these IDs based on your existing data)
-- You may need to check your actual NGO and User IDs and modify accordingly

-- Donations to APPROVED NGOs (successful donations)
INSERT INTO donations (amount, donation_date, donor_id, ngo_id, donor_message, payment_method, transaction_id, status, pledge_type, created_at, updated_at)
VALUES 
(250.00, '2025-09-15 14:30:00', 1, 1, 'Keep up the great work!', 'CREDIT_CARD', 'TXN-SUCC-001', 'COMPLETED', 'ONE_TIME', NOW(), NOW()),
(500.00, '2025-09-20 10:15:00', 2, 1, 'Monthly donation for education', 'BANK_TRANSFER', 'TXN-SUCC-002', 'COMPLETED', 'MONTHLY', NOW(), NOW()),
(100.00, '2025-09-25 16:45:00', 3, 2, 'For environmental projects', 'PAYPAL', 'TXN-SUCC-003', 'COMPLETED', 'ONE_TIME', NOW(), NOW());

-- Failed/Pending donations
INSERT INTO donations (amount, donation_date, donor_id, ngo_id, donor_message, payment_method, transaction_id, status, pledge_type, created_at, updated_at)
VALUES 
(150.00, '2025-09-28 12:00:00', 1, 1, 'Payment processing...', 'CREDIT_CARD', 'TXN-PEND-001', 'PENDING', 'ONE_TIME', NOW(), NOW()),
(300.00, '2025-09-27 09:30:00', 2, 2, 'Transaction failed', 'BANK_TRANSFER', 'TXN-FAIL-001', 'FAILED', 'ONE_TIME', NOW(), NOW()),
(75.00, '2025-09-26 18:20:00', 3, 1, 'Payment cancelled by user', 'PAYPAL', 'TXN-CANCEL-001', 'CANCELLED', 'ONE_TIME', NOW(), NOW());

-- ==============================================
-- 4. ADD SAMPLE VOLUNTEER OPPORTUNITIES
-- ==============================================

-- Get NGO IDs for opportunities (adjust based on your data)
-- Active opportunities
INSERT INTO volunteer_opportunities (title, description, ngo_id, cause, location, time_commitment, work_type, start_date, end_date, volunteers_needed, volunteers_applied, urgency, is_active, status, created_at, updated_at)
VALUES 
('Teaching Assistant Program', 'Help teach underprivileged children basic reading and math skills', 1, 'EDUCATION', 'Austin, TX', '4 hours/week', 'EDUCATION', '2025-10-01', '2025-12-31', 10, 3, 'HIGH', true, 'ACTIVE', NOW(), NOW()),
('Environmental Cleanup Drive', 'Organize and participate in community cleanup events', 2, 'ENVIRONMENT', 'Portland, OR', '8 hours/month', 'FIELDWORK', '2025-10-15', '2025-11-15', 25, 12, 'MEDIUM', true, 'ACTIVE', NOW(), NOW()),
('Rural Health Outreach', 'Assist healthcare professionals in rural health camps', 3, 'HEALTH', 'Rural Nebraska', '2 days/month', 'HEALTHCARE', '2025-11-01', '2026-03-31', 15, 8, 'HIGH', true, 'ACTIVE', NOW(), NOW());

-- Inactive/Full opportunities  
INSERT INTO volunteer_opportunities (title, description, ngo_id, cause, location, time_commitment, work_type, start_date, end_date, volunteers_needed, volunteers_applied, urgency, is_active, status, created_at, updated_at)
VALUES 
('Completed Food Drive', 'Food collection and distribution - COMPLETED', 4, 'POVERTY', 'Miami, FL', '6 hours/day', 'LOGISTICS', '2025-08-01', '2025-08-31', 20, 25, 'MEDIUM', false, 'COMPLETED', NOW(), NOW()),
('Full Capacity Program', 'Mentorship program - positions filled', 5, 'EDUCATION', 'Phoenix, AZ', '3 hours/week', 'MENTORSHIP', '2025-09-15', '2025-12-15', 8, 8, 'LOW', false, 'FULL', NOW(), NOW());

-- ==============================================
-- 5. ADD SYSTEM ALERTS FOR ADMIN DASHBOARD
-- ==============================================

INSERT INTO system_alerts (alert_type, priority, title, message, related_entity_type, related_entity_id, is_resolved, created_at, updated_at)
VALUES 
('NGO_PENDING_APPROVAL', 'HIGH', 'NGO Verification Pending', 'Hope Foundation requires verification review', 'NGO', 1, false, NOW(), NOW()),
('SUSPICIOUS_ACTIVITY', 'CRITICAL', 'Unusual Donation Pattern', 'Multiple large donations from same IP address detected', 'DONATION', 1, false, NOW(), NOW()),
('SYSTEM_ERROR', 'MEDIUM', 'User Account Blocked', 'User account blocked due to spam activity', 'USER', 4, false, NOW(), NOW()),
('MISSING_FUND_REPORT', 'HIGH', 'Missing Fund Utilization Report', 'Questionable Charity has not submitted required fund report', 'NGO', 4, false, NOW(), NOW()),
('HIGH_DONATION_VOLUME', 'LOW', 'NGO Inactive Warning', 'Inactive Foundation shows no activity for 90+ days', 'NGO', 5, false, NOW(), NOW());

-- ==============================================
-- 6. ADD NGO VERIFICATION REQUESTS
-- ==============================================

INSERT INTO ngo_verification_requests (ngo_id, status, submitted_date, documents_provided, verification_score, created_at, updated_at)
VALUES 
(1, 'PENDING', '2025-09-20 10:00:00', 'Registration certificate, Tax exemption, Financial statements', 0, NOW(), NOW()),
(2, 'UNDER_REVIEW', '2025-09-18 14:30:00', 'Registration certificate, Environmental certification', 65, NOW(), NOW()),
(3, 'PENDING', '2025-09-25 16:15:00', 'Medical license, Registration certificate', 0, NOW(), NOW()),
(7, 'REJECTED', '2025-09-10 11:20:00', 'Incomplete documentation', 25, NOW(), NOW());

-- ==============================================
-- 7. VERIFY DATA INSERTION
-- ==============================================

-- Check the data
SELECT 'NGO Status Distribution' as Info;
SELECT status, COUNT(*) as count FROM ngos GROUP BY status;

SELECT 'User Status Distribution' as Info;
SELECT 
    CASE 
        WHEN is_blocked = 1 THEN 'BLOCKED'
        WHEN email_verified = 0 THEN 'UNVERIFIED'
        ELSE 'ACTIVE'
    END as status,
    user_type,
    COUNT(*) as count
FROM users 
GROUP BY status, user_type;

SELECT 'Donation Status Distribution' as Info;
SELECT status, COUNT(*) as count FROM donations GROUP BY status;

SELECT 'Volunteer Opportunities Status' as Info;
SELECT 
    CASE 
        WHEN is_active = 1 THEN 'ACTIVE'
        ELSE 'INACTIVE'
    END as status,
    COUNT(*) as count
FROM volunteer_opportunities 
GROUP BY status;

SELECT 'System Alerts by Priority' as Info;
SELECT priority, COUNT(*) as count FROM system_alerts WHERE is_resolved = false GROUP BY priority;