-- Check if sample data exists in the database
SELECT 'Total Users:' as Info, COUNT(*) as count FROM users;
SELECT 'Total NGOs:' as Info, COUNT(*) as count FROM ngos;
SELECT 'Total Donations:' as Info, COUNT(*) as count FROM donations;
SELECT 'Total Volunteer Opportunities:' as Info, COUNT(*) as count FROM volunteer_opportunities;

-- Check donation statuses
SELECT 'Donation Status Distribution:' as Info;
SELECT status, COUNT(*) as count FROM donations GROUP BY status;

-- Check NGO statuses
SELECT 'NGO Status Distribution:' as Info;
SELECT status, COUNT(*) as count FROM ngos GROUP BY status;

-- Check volunteer opportunities
SELECT 'Volunteer Opportunities:' as Info;
SELECT id, title, status, is_active FROM volunteer_opportunities LIMIT 10;