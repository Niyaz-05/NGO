package com.ngoconnect.controller;

import com.ngoconnect.entity.VolunteerApplication;
import com.ngoconnect.entity.ApplicationStatus;
import com.ngoconnect.service.ApplicationService;
import com.ngoconnect.dto.ApplicationRequest;
import com.ngoconnect.dto.ApplicationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class VolunteerApplicationController {

    @Autowired
    private ApplicationService applicationService;

    /**
     * Apply for a volunteer opportunity
     */
    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyForOpportunity(@RequestBody ApplicationRequest request) {
        try {
            VolunteerApplication application = applicationService.submitApplication(request);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Application submitted successfully!",
                    "applicationId", application.getId(),
                    "status", application.getStatus().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to submit application: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get user's volunteer application history
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationResponse>> getUserApplications(@PathVariable Long userId) {
        List<ApplicationResponse> applications = applicationService.getUserApplicationHistory(userId);
        return ResponseEntity.ok(applications);
    }

    /**
     * Get applications for a specific opportunity (for NGO use)
     */
    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<List<ApplicationResponse>> getOpportunityApplications(@PathVariable Long opportunityId) {
        List<ApplicationResponse> applications = applicationService.getApplicationsForOpportunity(opportunityId);
        return ResponseEntity.ok(applications);
    }

    /**
     * Update application status (for NGO use)
     */
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Map<String, Object>> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> statusUpdate) {

        try {
            String status = statusUpdate.get("status");
            ApplicationStatus newStatus = ApplicationStatus.valueOf(status.toUpperCase());

            VolunteerApplication updatedApplication = applicationService.updateApplicationStatus(applicationId,
                    newStatus);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Application status updated successfully",
                    "applicationId", updatedApplication.getId(),
                    "newStatus", updatedApplication.getStatus().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to update status: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get application by ID
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long applicationId) {
        ApplicationResponse application = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(application);
    }

    /**
     * Cancel application (by volunteer)
     */
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Map<String, Object>> cancelApplication(@PathVariable Long applicationId) {
        try {
            applicationService.cancelApplication(applicationId);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Application cancelled successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to cancel application: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}