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

    /**
     * Migrate existing NGOs to have proper status values
     */
    @PostMapping("/migrate-ngo-statuses")
    public ResponseEntity<Map<String, Object>> migrateNGOStatuses() {
        try {
            adminService.migrateNGOStatuses();
            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "NGO statuses migrated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error migrating NGO statuses: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to migrate NGO statuses: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // NGO Management Endpoints

    /**
     * Get all NGOs for management (with status filtering)
     */
    @GetMapping("/ngos")
    public ResponseEntity<List<Map<String, Object>>> getAllNGOs(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            List<Map<String, Object>> ngos = adminService.getAllNGOsForManagement(status, page, size);
            return ResponseEntity.ok(ngos);
        } catch (Exception e) {
            System.err.println("Error fetching NGOs: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get specific NGO details for review
     */
    @GetMapping("/ngos/{ngoId}")
    public ResponseEntity<Map<String, Object>> getNGODetails(@PathVariable Long ngoId) {
        try {
            Map<String, Object> ngoDetails = adminService.getNGODetailsForReview(ngoId);
            return ResponseEntity.ok(ngoDetails);
        } catch (Exception e) {
            System.err.println("Error fetching NGO details: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Approve NGO application
     */
    @PostMapping("/ngos/{ngoId}/approve")
    public ResponseEntity<Map<String, Object>> approveNGO(
            @PathVariable Long ngoId,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String notes = (String) request.get("notes");

            Map<String, Object> result = adminService.approveNGO(ngoId, adminId, notes);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error approving NGO: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to approve NGO: " + e.getMessage()));
        }
    }

    /**
     * Reject NGO application
     */
    @PostMapping("/ngos/{ngoId}/reject")
    public ResponseEntity<Map<String, Object>> rejectNGO(
            @PathVariable Long ngoId,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String reason = (String) request.get("reason");

            Map<String, Object> result = adminService.rejectNGO(ngoId, adminId, reason);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error rejecting NGO: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to reject NGO: " + e.getMessage()));
        }
    }

    /**
     * Suspend NGO
     */
    @PostMapping("/ngos/{ngoId}/suspend")
    public ResponseEntity<Map<String, Object>> suspendNGO(
            @PathVariable Long ngoId,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String reason = (String) request.get("reason");

            Map<String, Object> result = adminService.suspendNGO(ngoId, adminId, reason);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error suspending NGO: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to suspend NGO: " + e.getMessage()));
        }
    }

    /**
     * Deactivate NGO
     */
    @PostMapping("/ngos/{ngoId}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateNGO(
            @PathVariable Long ngoId,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String reason = (String) request.get("reason");

            Map<String, Object> result = adminService.deactivateNGO(ngoId, adminId, reason);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error deactivating NGO: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to deactivate NGO: " + e.getMessage()));
        }
    }

    /**
     * Reactivate NGO
     */
    @PostMapping("/ngos/{ngoId}/reactivate")
    public ResponseEntity<Map<String, Object>> reactivateNGO(
            @PathVariable Long ngoId,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            String notes = (String) request.get("notes");

            Map<String, Object> result = adminService.reactivateNGO(ngoId, adminId, notes);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error reactivating NGO: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to reactivate NGO: " + e.getMessage()));
        }
    }

    /**
     * Update NGO profile (admin managed)
     */
    @PutMapping("/ngos/{ngoId}/profile")
    public ResponseEntity<Map<String, Object>> updateNGOProfile(
            @PathVariable Long ngoId,
            @RequestBody Map<String, Object> request) {
        try {
            Long adminId = ((Number) request.get("adminId")).longValue();
            Map<String, Object> profileData = (Map<String, Object>) request.get("profileData");
            String notes = (String) request.get("notes");

            Map<String, Object> result = adminService.updateNGOProfile(ngoId, adminId, profileData, notes);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error updating NGO profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to update NGO profile: " + e.getMessage()));
        }
    }

    /**
     * Get NGO management action history
     */
    @GetMapping("/ngos/{ngoId}/actions")
    public ResponseEntity<List<Map<String, Object>>> getNGOActionHistory(@PathVariable Long ngoId) {
        try {
            List<Map<String, Object>> actions = adminService.getNGOActionHistory(ngoId);
            return ResponseEntity.ok(actions);
        } catch (Exception e) {
            System.err.println("Error fetching NGO action history: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}