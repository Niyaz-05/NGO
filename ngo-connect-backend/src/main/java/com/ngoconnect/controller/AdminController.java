package com.ngoconnect.controller;

import com.ngoconnect.dto.AdminDashboardDTO;
import com.ngoconnect.entity.SystemAlert;
import com.ngoconnect.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Get admin dashboard data with overview, alerts, and pending verifications
     */
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboard() {
        try {
            System.out.println("Admin dashboard request received");
            AdminDashboardDTO dashboard = adminService.getAdminDashboard();
            System.out.println("Admin dashboard data fetched successfully");
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("Error fetching admin dashboard: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Approve NGO verification
     */
    @PostMapping("/ngo-verification/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveNGOVerification(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String reviewerNotes = (String) request.get("reviewerNotes");

            adminService.approveNGOVerification(id, adminId, reviewerNotes);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "NGO verification approved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error approving NGO verification: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to approve NGO verification: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Reject NGO verification
     */
    @PostMapping("/ngo-verification/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectNGOVerification(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String reviewerNotes = (String) request.get("reviewerNotes");

            adminService.rejectNGOVerification(id, adminId, reviewerNotes);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "NGO verification rejected successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error rejecting NGO verification: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to reject NGO verification: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Create a system alert
     */
    @PostMapping("/alerts")
    public ResponseEntity<SystemAlert> createAlert(@RequestBody Map<String, Object> request) {
        try {
            SystemAlert.AlertType alertType = SystemAlert.AlertType.valueOf((String) request.get("alertType"));
            SystemAlert.Priority priority = SystemAlert.Priority.valueOf((String) request.get("priority"));
            String title = (String) request.get("title");
            String message = (String) request.get("message");

            SystemAlert.EntityType entityType = null;
            Long entityId = null;

            if (request.containsKey("entityType") && request.get("entityType") != null) {
                entityType = SystemAlert.EntityType.valueOf((String) request.get("entityType"));
            }
            if (request.containsKey("entityId") && request.get("entityId") != null) {
                entityId = ((Number) request.get("entityId")).longValue();
            }

            SystemAlert alert = adminService.createAlert(alertType, priority, title, message, entityType, entityId);
            return ResponseEntity.ok(alert);
        } catch (Exception e) {
            System.err.println("Error creating alert: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Resolve an alert
     */
    @PostMapping("/alerts/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveAlert(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            adminService.resolveAlert(id, adminId);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Alert resolved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error resolving alert: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to resolve alert: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get all alerts with optional filtering
     */
    @GetMapping("/alerts")
    public ResponseEntity<List<SystemAlert>> getAllAlerts(
            @RequestParam(required = false) Boolean resolved,
            @RequestParam(required = false) SystemAlert.Priority priority,
            @RequestParam(required = false) SystemAlert.AlertType alertType) {
        try {
            List<SystemAlert> alerts = adminService.getAllAlerts(resolved, priority, alertType);
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            System.err.println("Error fetching alerts: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update platform statistics (manual trigger)
     */
    @PostMapping("/statistics/update")
    public ResponseEntity<Map<String, Object>> updatePlatformStatistics() {
        try {
            adminService.updatePlatformStatistics();
            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Platform statistics updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating platform statistics: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to update platform statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}