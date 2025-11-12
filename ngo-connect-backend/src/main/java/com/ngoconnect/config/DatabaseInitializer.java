package com.ngoconnect.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try {
            System.out.println("Checking and fixing NGO status values...");

            // First check if there are any problematic records
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM ngos WHERE status IS NULL OR status = '' OR status NOT IN ('PENDING', 'APPROVED', 'REJECTED')",
                    Integer.class);

            if (count != null && count > 0) {
                System.out.println("Found " + count + " NGO records with invalid status values. Fixing...");

                // Update problematic records to APPROVED
                int updatedRows = jdbcTemplate.update(
                        "UPDATE ngos SET status = 'APPROVED' WHERE status IS NULL OR status = '' OR status NOT IN ('PENDING', 'APPROVED', 'REJECTED')");

                System.out.println("Successfully updated " + updatedRows + " NGO records with valid status values.");
            } else {
                System.out.println("All NGO status values are valid. No fixes needed.");
            }

            // Show current status distribution for verification
            System.out.println("Current NGO status distribution:");
            jdbcTemplate.query(
                    "SELECT COALESCE(status, 'NULL') as status, COUNT(*) as count FROM ngos GROUP BY status",
                    (rs) -> {
                        System.out.println("  " + rs.getString("status") + ": " + rs.getInt("count") + " records");
                    });

        } catch (Exception e) {
            System.err.println("Error during database initialization: " + e.getMessage());
            // Don't fail the application startup, just log the error
            e.printStackTrace();
        }
    }
}