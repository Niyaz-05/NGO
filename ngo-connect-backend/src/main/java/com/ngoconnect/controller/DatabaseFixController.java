package com.ngoconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseFixController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/fix-ngo-status")
    public ResponseEntity<Map<String, Object>> fixNgoStatus() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Check for problematic records
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM ngos WHERE status IS NULL OR status = '' OR status NOT IN ('PENDING', 'APPROVED', 'REJECTED')",
                    Integer.class);

            response.put("problematicRecords", count);

            if (count != null && count > 0) {
                // Update problematic records to APPROVED
                int updatedRows = jdbcTemplate.update(
                        "UPDATE ngos SET status = 'APPROVED' WHERE status IS NULL OR status = '' OR status NOT IN ('PENDING', 'APPROVED', 'REJECTED')");

                response.put("updatedRecords", updatedRows);
                response.put("message", "Successfully fixed " + updatedRows + " NGO records");
            } else {
                response.put("updatedRecords", 0);
                response.put("message", "No records needed fixing");
            }

            // Get current status distribution
            Map<String, Integer> distribution = new HashMap<>();
            jdbcTemplate.query(
                    "SELECT COALESCE(status, 'NULL') as status, COUNT(*) as count FROM ngos GROUP BY status",
                    (rs) -> {
                        distribution.put(rs.getString("status"), rs.getInt("count"));
                    });
            response.put("statusDistribution", distribution);
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}