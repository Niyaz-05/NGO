package com.ngoconnect.service;

import com.ngoconnect.dto.AdminDashboardDTO;
import com.ngoconnect.entity.*;
import com.ngoconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private NGOVerificationRequestRepository verificationRequestRepository;

    @Autowired
    private SystemAlertRepository systemAlertRepository;

    @Autowired
    private PlatformStatisticsRepository platformStatisticsRepository;

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private VolunteerOpportunityRepository volunteerOpportunityRepository;

    /**
     * Get comprehensive admin dashboard data
     */
    @Transactional(readOnly = true)
    public AdminDashboardDTO getAdminDashboard() {
        try {
            // Get or create today's statistics
            AdminDashboardDTO.DashboardOverview overview = getCurrentStatistics();

            // Get recent high-priority alerts
            List<AdminDashboardDTO.AlertDTO> alerts = getHighPriorityAlerts();

            // Get pending verifications
            List<AdminDashboardDTO.PendingVerificationDTO> pendingVerifications = getPendingVerifications();

            return new AdminDashboardDTO(overview, alerts, pendingVerifications);
        } catch (Exception e) {
            System.err.println("Error fetching admin dashboard: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private AdminDashboardDTO.DashboardOverview getCurrentStatistics() {
        // Try to get today's cached statistics
        Optional<PlatformStatistics> todayStats = platformStatisticsRepository.findByStatDate(LocalDate.now());

        AdminDashboardDTO.DashboardOverview overview = new AdminDashboardDTO.DashboardOverview();

        if (todayStats.isPresent()) {
            PlatformStatistics stats = todayStats.get();
            overview.setTotalNgosRegistered(stats.getTotalNgosRegistered());
            overview.setTotalNgosVerified(stats.getTotalNgosVerified());
            overview.setTotalNgosPending(stats.getTotalNgosPending());
            overview.setTotalUsersRegistered(stats.getTotalUsersRegistered());
            overview.setTotalDonationsAmount(stats.getTotalDonationsAmount());
            overview.setTotalDonationsCount(stats.getTotalDonationsCount());
            overview.setActiveVolunteerOpportunities(stats.getActiveVolunteerOpportunities());
            overview.setPendingVerifications(stats.getPendingVerifications());
            overview.setMissingFundReports(stats.getMissingFundReports());
            overview.setSuspiciousActivities(stats.getSuspiciousActivities());
        } else {
            // Calculate real-time statistics if no cached data
            overview = calculateRealTimeStatistics();
        }

        return overview;
    }

    private AdminDashboardDTO.DashboardOverview calculateRealTimeStatistics() {
        AdminDashboardDTO.DashboardOverview overview = new AdminDashboardDTO.DashboardOverview();

        // NGO statistics
        Long totalNgos = ngoRepository.count();
        Long verifiedNgos = ngoRepository.countByIsVerified(true);
        Long pendingNgos = verificationRequestRepository
                .countByStatus(NGOVerificationRequest.VerificationStatus.PENDING);

        overview.setTotalNgosRegistered(totalNgos.intValue());
        overview.setTotalNgosVerified(verifiedNgos.intValue());
        overview.setTotalNgosPending(pendingNgos.intValue());

        // User statistics
        Long totalUsers = userRepository.count();
        overview.setTotalUsersRegistered(totalUsers.intValue());

        // Donation statistics
        Long totalDonationCount = donationRepository.count();
        Double totalDonationAmount = donationRepository.getTotalDonationAmount();
        overview.setTotalDonationsCount(totalDonationCount.intValue());
        overview.setTotalDonationsAmount(totalDonationAmount != null ? totalDonationAmount : 0.0);

        // Volunteer opportunities
        Long activeOpportunities = volunteerOpportunityRepository.countByIsActive(true);
        overview.setActiveVolunteerOpportunities(activeOpportunities.intValue());

        // Alert statistics
        Long unresolvedAlerts = systemAlertRepository.countUnresolvedAlerts();
        overview.setPendingVerifications(pendingNgos.intValue());
        overview.setMissingFundReports(0); // TODO: Calculate from fund reports
        overview.setSuspiciousActivities(
                systemAlertRepository.countUnresolvedAlertsByPriority(SystemAlert.Priority.HIGH).intValue());

        return overview;
    }

    private List<AdminDashboardDTO.AlertDTO> getHighPriorityAlerts() {
        List<SystemAlert> alerts = systemAlertRepository.findHighPriorityUnresolvedAlerts();
        return alerts.stream()
                .limit(10) // Show only top 10 alerts
                .map(alert -> new AdminDashboardDTO.AlertDTO(
                        alert.getId(),
                        alert.getAlertType().name(),
                        alert.getPriority().name(),
                        alert.getTitle(),
                        alert.getMessage(),
                        alert.getRelatedEntityType() != null ? alert.getRelatedEntityType().name() : null,
                        alert.getRelatedEntityId(),
                        alert.getCreatedAt()))
                .collect(Collectors.toList());
    }

    private List<AdminDashboardDTO.PendingVerificationDTO> getPendingVerifications() {
        List<NGOVerificationRequest> pendingRequests = verificationRequestRepository
                .findPendingVerificationsOrderByDate();
        return pendingRequests.stream()
                .limit(5) // Show only top 5 pending verifications
                .map(request -> new AdminDashboardDTO.PendingVerificationDTO(
                        request.getId(),
                        request.getNgo().getId(),
                        request.getNgo().getOrganizationName(),
                        request.getNgo().getCause(),
                        request.getNgo().getLocation(),
                        request.getSubmittedDate(),
                        request.getDocumentsProvided(),
                        request.getVerificationScore()))
                .collect(Collectors.toList());
    }

    /**
     * Approve NGO verification
     */
    @Transactional
    public void approveNGOVerification(Long verificationRequestId, Long adminId, String reviewerNotes) {
        NGOVerificationRequest request = verificationRequestRepository.findById(verificationRequestId)
                .orElseThrow(() -> new RuntimeException("Verification request not found"));

        request.setStatus(NGOVerificationRequest.VerificationStatus.APPROVED);
        request.setReviewedDate(LocalDateTime.now());
        request.setReviewerNotes(reviewerNotes);

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        request.setReviewedBy(admin);

        // Update NGO verification status
        NGO ngo = request.getNgo();
        ngo.setIsVerified(true);
        ngoRepository.save(ngo);

        verificationRequestRepository.save(request);

        // Resolve related alert if exists
        resolveAlertByEntity(SystemAlert.AlertType.NGO_PENDING_APPROVAL, request.getNgo().getId());
    }

    /**
     * Reject NGO verification
     */
    @Transactional
    public void rejectNGOVerification(Long verificationRequestId, Long adminId, String reviewerNotes) {
        NGOVerificationRequest request = verificationRequestRepository.findById(verificationRequestId)
                .orElseThrow(() -> new RuntimeException("Verification request not found"));

        request.setStatus(NGOVerificationRequest.VerificationStatus.REJECTED);
        request.setReviewedDate(LocalDateTime.now());
        request.setReviewerNotes(reviewerNotes);

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        request.setReviewedBy(admin);

        verificationRequestRepository.save(request);

        // Resolve related alert
        resolveAlertByEntity(SystemAlert.AlertType.NGO_PENDING_APPROVAL, request.getNgo().getId());
    }

    /**
     * Create a system alert
     */
    @Transactional
    public SystemAlert createAlert(SystemAlert.AlertType alertType, SystemAlert.Priority priority,
            String title, String message, SystemAlert.EntityType entityType, Long entityId) {
        SystemAlert alert = new SystemAlert(alertType, priority, title, message);
        alert.setRelatedEntityType(entityType);
        alert.setRelatedEntityId(entityId);

        return systemAlertRepository.save(alert);
    }

    /**
     * Resolve an alert
     */
    @Transactional
    public void resolveAlert(Long alertId, Long adminId) {
        SystemAlert alert = systemAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setIsResolved(true);
        alert.setResolvedAt(LocalDateTime.now());

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        alert.setResolvedBy(admin);

        systemAlertRepository.save(alert);
    }

    private void resolveAlertByEntity(SystemAlert.AlertType alertType, Long entityId) {
        List<SystemAlert> alerts = systemAlertRepository.findUnresolvedByAlertTypeOrderByCreatedAtDesc(alertType);
        alerts.stream()
                .filter(alert -> entityId.equals(alert.getRelatedEntityId()))
                .forEach(alert -> {
                    alert.setIsResolved(true);
                    alert.setResolvedAt(LocalDateTime.now());
                    systemAlertRepository.save(alert);
                });
    }

    /**
     * Get all alerts with filtering
     */
    @Transactional(readOnly = true)
    public List<SystemAlert> getAllAlerts(Boolean resolved, SystemAlert.Priority priority,
            SystemAlert.AlertType alertType) {
        if (alertType != null && resolved != null) {
            return systemAlertRepository.findByAlertTypeAndIsResolved(alertType, resolved);
        } else if (priority != null && resolved != null) {
            return systemAlertRepository.findByPriorityAndIsResolvedOrderByCreatedAtDesc(priority, resolved);
        } else if (resolved != null) {
            return systemAlertRepository.findByIsResolvedOrderByCreatedAtDesc(resolved);
        } else {
            return systemAlertRepository.findAll();
        }
    }

    /**
     * Update platform statistics (should be run daily)
     */
    @Transactional
    public void updatePlatformStatistics() {
        LocalDate today = LocalDate.now();

        PlatformStatistics stats = platformStatisticsRepository.findByStatDate(today)
                .orElse(new PlatformStatistics(today));

        AdminDashboardDTO.DashboardOverview overview = calculateRealTimeStatistics();

        stats.setTotalNgosRegistered(overview.getTotalNgosRegistered());
        stats.setTotalNgosVerified(overview.getTotalNgosVerified());
        stats.setTotalNgosPending(overview.getTotalNgosPending());
        stats.setTotalUsersRegistered(overview.getTotalUsersRegistered());
        stats.setTotalDonationsAmount(overview.getTotalDonationsAmount());
        stats.setTotalDonationsCount(overview.getTotalDonationsCount());
        stats.setActiveVolunteerOpportunities(overview.getActiveVolunteerOpportunities());
        stats.setPendingVerifications(overview.getPendingVerifications());
        stats.setMissingFundReports(overview.getMissingFundReports());
        stats.setSuspiciousActivities(overview.getSuspiciousActivities());

        platformStatisticsRepository.save(stats);
    }

    // NGO Management Methods

    /**
     * Get all NGOs for admin management with filtering
     */
    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getAllNGOsForManagement(String status, int page, int size) {
        System.out.println(
                "getAllNGOsForManagement called with status: " + status + ", page: " + page + ", size: " + size);

        List<NGO> ngos;

        Sort sortByCreatedDesc = Sort.by(Sort.Direction.DESC, "createdAt");
        if (status != null && !status.isEmpty()) {
            // Filter by status if provided
            ngos = ngoRepository.findAll(sortByCreatedDesc).stream()
                    .filter(ngo -> {
                        String ngoStatus = getNGOStatus(ngo);
                        System.out.println("NGO " + ngo.getId() + " (" + ngo.getOrganizationName() + ") has status: "
                                + ngoStatus + " (DB status: " + ngo.getStatus() + ", isVerified: " + ngo.getIsVerified()
                                + ")");
                        return status.equalsIgnoreCase(ngoStatus);
                    })
                    .skip(page * size)
                    .limit(size)
                    .collect(Collectors.toList());
        } else {
            ngos = ngoRepository.findAll(sortByCreatedDesc).stream()
                    .peek(ngo -> {
                        String ngoStatus = getNGOStatus(ngo);
                        System.out.println("NGO " + ngo.getId() + " (" + ngo.getOrganizationName() + ") has status: "
                                + ngoStatus + " (DB status: " + ngo.getStatus() + ", isVerified: " + ngo.getIsVerified()
                                + ")");
                    })
                    .skip(page * size)
                    .limit(size)
                    .collect(Collectors.toList());
        }

        System.out.println("Returning " + ngos.size() + " NGOs for status filter: " + status);
        return ngos.stream().map(this::mapNGOForManagement).collect(Collectors.toList());
    }

    /**
     * Migrate existing NGOs to have proper status values
     * This method should be called once to fix NGOs that were created before the
     * status field was added
     */
    @Transactional
    public void migrateNGOStatuses() {
        List<NGO> allNgos = ngoRepository.findAll();

        for (NGO ngo : allNgos) {
            if (ngo.getStatus() == null) {
                // Set status based on isVerified field
                if (ngo.getIsVerified()) {
                    ngo.setStatus(NGO.NGOStatus.ACTIVE);
                } else {
                    ngo.setStatus(NGO.NGOStatus.PENDING);
                }
                ngoRepository.save(ngo);
                System.out.println("Migrated NGO " + ngo.getId() + " (" + ngo.getOrganizationName() + ") to status: "
                        + ngo.getStatus());
            }
        }
    }

    /**
     * Get detailed NGO information for admin review
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getNGODetailsForReview(Long ngoId) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        java.util.Map<String, Object> details = new java.util.HashMap<>();

        // Basic NGO info
        details.put("id", ngo.getId());
        details.put("organizationName", ngo.getOrganizationName());
        details.put("description", ngo.getDescription());
        details.put("cause", ngo.getCause());
        details.put("location", ngo.getLocation());
        details.put("website", ngo.getWebsite());
        details.put("phone", ngo.getPhone());
        details.put("email", ngo.getEmail());
        details.put("registrationNumber", ngo.getRegistrationNumber());
        details.put("foundedYear", ngo.getFoundedYear());
        details.put("totalDonations", ngo.getTotalDonations());
        details.put("rating", ngo.getRating());
        details.put("isVerified", ngo.getIsVerified());
        details.put("status", getNGOStatus(ngo));
        details.put("createdAt", ngo.getCreatedAt());
        details.put("updatedAt", ngo.getUpdatedAt());

        // Registration documents
        details.put("registrationDocuments", parseDocuments(getRegistrationDocuments(ngo)));

        // Suspension info if applicable
        details.put("suspensionReason", getSuspensionReason(ngo));
        details.put("suspendedBy", getSuspendedBy(ngo));
        details.put("suspendedAt", getSuspendedAt(ngo));

        // Verification info
        details.put("verifiedBy", getVerifiedBy(ngo));
        details.put("verifiedAt", getVerifiedAt(ngo));

        return details;
    }

    /**
     * Approve NGO application
     */
    @Transactional
    public java.util.Map<String, Object> approveNGO(Long ngoId, Long adminId, String notes) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        String previousStatus = getNGOStatus(ngo);

        ngo.setIsVerified(true);
        setNGOStatus(ngo, "ACTIVE");
        setVerifiedBy(ngo, adminId);
        setVerifiedAt(ngo, LocalDateTime.now());

        ngoRepository.save(ngo);

        // Log the action
        logNGOManagementAction(ngoId, adminId, "APPROVE", notes, previousStatus, "ACTIVE");

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "NGO approved successfully");
        response.put("ngoId", ngoId);
        response.put("status", "ACTIVE");

        return response;
    }

    /**
     * Reject NGO application
     */
    @Transactional
    public java.util.Map<String, Object> rejectNGO(Long ngoId, Long adminId, String reason) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        String previousStatus = getNGOStatus(ngo);

        ngo.setIsVerified(false);
        setNGOStatus(ngo, "REJECTED");

        ngoRepository.save(ngo);

        // Log the action
        logNGOManagementAction(ngoId, adminId, "REJECT", reason, previousStatus, "REJECTED");

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "NGO rejected");
        response.put("ngoId", ngoId);
        response.put("status", "REJECTED");

        return response;
    }

    /**
     * Suspend NGO
     */
    @Transactional
    public java.util.Map<String, Object> suspendNGO(Long ngoId, Long adminId, String reason) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        String previousStatus = getNGOStatus(ngo);

        setNGOStatus(ngo, "SUSPENDED");
        setSuspensionReason(ngo, reason);
        setSuspendedBy(ngo, adminId);
        setSuspendedAt(ngo, LocalDateTime.now());

        ngoRepository.save(ngo);

        // Log the action
        logNGOManagementAction(ngoId, adminId, "SUSPEND", reason, previousStatus, "SUSPENDED");

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "NGO suspended successfully");
        response.put("ngoId", ngoId);
        response.put("status", "SUSPENDED");

        return response;
    }

    /**
     * Deactivate NGO
     */
    @Transactional
    public java.util.Map<String, Object> deactivateNGO(Long ngoId, Long adminId, String reason) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        String previousStatus = getNGOStatus(ngo);

        setNGOStatus(ngo, "DEACTIVATED");

        ngoRepository.save(ngo);

        // Log the action
        logNGOManagementAction(ngoId, adminId, "DEACTIVATE", reason, previousStatus, "DEACTIVATED");

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "NGO deactivated successfully");
        response.put("ngoId", ngoId);
        response.put("status", "DEACTIVATED");

        return response;
    }

    /**
     * Reactivate NGO
     */
    @Transactional
    public java.util.Map<String, Object> reactivateNGO(Long ngoId, Long adminId, String notes) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        String previousStatus = getNGOStatus(ngo);

        setNGOStatus(ngo, "ACTIVE");
        ngo.setIsVerified(true);

        // Clear suspension info
        setSuspensionReason(ngo, null);
        setSuspendedBy(ngo, null);
        setSuspendedAt(ngo, null);

        ngoRepository.save(ngo);

        // Log the action
        logNGOManagementAction(ngoId, adminId, "REACTIVATE", notes, previousStatus, "ACTIVE");

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "NGO reactivated successfully");
        response.put("ngoId", ngoId);
        response.put("status", "ACTIVE");

        return response;
    }

    /**
     * Update NGO profile (admin managed)
     */
    @Transactional
    public java.util.Map<String, Object> updateNGOProfile(Long ngoId, Long adminId,
            java.util.Map<String, Object> profileData, String notes) {
        Optional<NGO> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found with ID: " + ngoId);
        }

        NGO ngo = ngoOpt.get();
        String previousStatus = getNGOStatus(ngo);

        // Update allowed fields
        if (profileData.containsKey("organizationName")) {
            ngo.setOrganizationName((String) profileData.get("organizationName"));
        }
        if (profileData.containsKey("description")) {
            ngo.setDescription((String) profileData.get("description"));
        }
        if (profileData.containsKey("website")) {
            ngo.setWebsite((String) profileData.get("website"));
        }
        if (profileData.containsKey("phone")) {
            ngo.setPhone((String) profileData.get("phone"));
        }
        if (profileData.containsKey("location")) {
            ngo.setLocation((String) profileData.get("location"));
        }

        ngoRepository.save(ngo);

        // Log the action
        logNGOManagementAction(ngoId, adminId, "PROFILE_UPDATE", notes, previousStatus, getNGOStatus(ngo));

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "NGO profile updated successfully");
        response.put("ngoId", ngoId);

        return response;
    }

    /**
     * Get NGO action history
     */
    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getNGOActionHistory(Long ngoId) {
        // This would require creating a repository method for NGOManagementActions
        // For now, return empty list - implement when NGOManagementActionRepository is
        // created
        return new java.util.ArrayList<>();
    }

    // Helper methods for NGO management

    private java.util.Map<String, Object> mapNGOForManagement(NGO ngo) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", ngo.getId());
        map.put("organizationName", ngo.getOrganizationName());
        map.put("cause", ngo.getCause());
        map.put("location", ngo.getLocation());
        map.put("email", ngo.getEmail());
        map.put("totalDonations", ngo.getTotalDonations());
        map.put("rating", ngo.getRating());
        map.put("isVerified", ngo.getIsVerified());
        map.put("status", getNGOStatus(ngo));
        map.put("createdAt", ngo.getCreatedAt());
        map.put("registrationNumber", ngo.getRegistrationNumber());
        return map;
    }

    private void logNGOManagementAction(Long ngoId, Long adminId, String actionType,
            String notes, String previousStatus, String newStatus) {
        // This would save to NGOManagementActions table
        // Implementation depends on creating the entity and repository
        System.out.println("NGO Management Action: " + actionType + " for NGO " + ngoId +
                " by admin " + adminId + " - " + notes);
    }

    // Helper methods to handle NGO status and related fields
    // These methods abstract away the database field access

    private String getNGOStatus(NGO ngo) {
        // Use the actual status field from database
        if (ngo.getStatus() != null) {
            return ngo.getStatus().name();
        }
        // Fallback to legacy logic for backward compatibility
        if (ngo.getIsVerified()) {
            return "ACTIVE";
        } else {
            return "PENDING";
        }
    }

    private void setNGOStatus(NGO ngo, String status) {
        // Set the new status field
        try {
            ngo.setStatus(NGO.NGOStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            // If status is not valid, default to PENDING
            ngo.setStatus(NGO.NGOStatus.PENDING);
        }

        // Also set appropriate legacy fields for backward compatibility
        switch (status) {
            case "ACTIVE":
                ngo.setIsVerified(true);
                break;
            case "PENDING":
            case "REJECTED":
            case "SUSPENDED":
            case "DEACTIVATED":
                ngo.setIsVerified(false);
                break;
        }
    }

    private String getRegistrationDocuments(NGO ngo) {
        // Return registration documents JSON or empty array
        return "[]"; // Placeholder
    }

    private List<String> parseDocuments(String documentsJson) {
        // Parse JSON string to list of document names/URLs
        return new java.util.ArrayList<>(); // Placeholder
    }

    private String getSuspensionReason(NGO ngo) {
        return null;
    } // Placeholder

    private Long getSuspendedBy(NGO ngo) {
        return null;
    } // Placeholder

    private LocalDateTime getSuspendedAt(NGO ngo) {
        return null;
    } // Placeholder

    private Long getVerifiedBy(NGO ngo) {
        return null;
    } // Placeholder

    private LocalDateTime getVerifiedAt(NGO ngo) {
        return null;
    } // Placeholder

    private void setSuspensionReason(NGO ngo, String reason) {
    } // Placeholder

    private void setSuspendedBy(NGO ngo, Long adminId) {
    } // Placeholder

    private void setSuspendedAt(NGO ngo, LocalDateTime dateTime) {
    } // Placeholder

    private void setVerifiedBy(NGO ngo, Long adminId) {
    } // Placeholder

    private void setVerifiedAt(NGO ngo, LocalDateTime dateTime) {
    } // Placeholder
}