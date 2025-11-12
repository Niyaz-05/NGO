-- Check if volunteer_opportunities table has status field
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ngo_connect' 
  AND TABLE_NAME = 'volunteer_opportunities';