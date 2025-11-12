package com.ngoconnect.service;

import com.ngoconnect.dto.AdminDashboardDTO;
import com.ngoconnect.dto.DonationDTO;
import com.ngoconnect.entity.*;
import com.ngoconnect.entity.Donation;
import com.ngoconnect.repository.*;
import com.ngoconnect.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.data.domain.Sort;
import java.util.*;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

@Service
public class AdminService {

    @PostConstruct
    public void init() {
        System.out.println("=== AdminService initialized successfully ===");
    }

    // Getter for testing
    public VolunteerOpportunityRepository getVolunteerOpportunityRepository() {
        return volunteerOpportunityRepository;
    }

    // Simple test method to check database connectivity
    public String testVolunteerOpportunityAccess() {
        try {
            System.out.println("=== Testing volunteer opportunity database access ===");
            long count = volunteerOpportunityRepository.count();
            System.out.println("Database count query returned: " + count);
            return "Database accessible. Found " + count + " volunteer opportunities.";
        } catch (Exception e) {
            System.err.println("Database access error: " + e.getMessage());
            e.printStackTrace();
            return "Database error: " + e.getMessage();
        }
    }

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
    private DonationService donationService;

    @Autowired
    private VolunteerOpportunityRepository volunteerOpportunityRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

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

        // Initialize variables with defaults
        Long totalNgos = 0L;
        Long verifiedNgos = 0L;
        Long pendingNgos = 0L;

        try {
            // NGO statistics using native SQL to avoid enum mapping issues
            totalNgos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ngos", Long.class);
            verifiedNgos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ngos WHERE is_verified = true",
                    Long.class);
            pendingNgos = verificationRequestRepository
                    .countByStatus(NGOVerificationRequest.VerificationStatus.PENDING);

            overview.setTotalNgosRegistered(totalNgos.intValue());
            overview.setTotalNgosVerified(verifiedNgos.intValue());
            overview.setTotalNgosPending(pendingNgos.intValue());
        } catch (Exception e) {
            System.err.println("Error calculating NGO statistics: " + e.getMessage());
            // Set default values if there's an error
            overview.setTotalNgosRegistered(0);
            overview.setTotalNgosVerified(0);
            overview.setTotalNgosPending(0);
        }

        // User statistics
        Long totalUsers = userRepository.count();
        Long activeUsers = userRepository.findAll().stream()
                .filter(user -> !Boolean.TRUE.equals(user.getIsBlocked())
                        && Boolean.TRUE.equals(user.getEmailVerified()))
                .count();
        Long blockedUsers = userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsBlocked()))
                .count();
        Long totalDonors = userRepository.findByUserType(UserType.DONOR).stream()
                .filter(user -> !Boolean.TRUE.equals(user.getIsBlocked()))
                .count();
        Long totalVolunteers = userRepository.findByUserType(UserType.VOLUNTEER).stream()
                .filter(user -> !Boolean.TRUE.equals(user.getIsBlocked()))
                .count();

        overview.setTotalUsersRegistered(totalUsers.intValue());
        overview.setTotalUsersActive(activeUsers.intValue());
        overview.setTotalUsersBlocked(blockedUsers.intValue());
        overview.setTotalDonors(totalDonors.intValue());
        overview.setTotalVolunteers(totalVolunteers.intValue());

        // Donation statistics
        Long totalDonationCount = donationRepository.count();
        Double totalDonationAmount = donationRepository.getTotalDonationAmount();
        overview.setTotalDonationsCount(totalDonationCount.intValue());
        overview.setTotalDonationsAmount(totalDonationAmount != null ? totalDonationAmount : 0.0);

        // Volunteer opportunities
        Long activeOpportunities = volunteerOpportunityRepository.countByIsActive(true);
        overview.setActiveVolunteerOpportunities(activeOpportunities.intValue());

        // Alert statistics
        overview.setPendingVerifications(pendingNgos.intValue());
        overview.setMissingFundReports(getMissingFundReportsCount()); // Calculate from fund reports
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
     * Admin: Get volunteer opportunities pending approval
     */
    @Transactional(readOnly = true)
    public List<VolunteerOpportunity> getPendingOpportunities() {
        return volunteerOpportunityRepository.findByStatus(OpportunityStatus.PENDING_APPROVAL);
    }

    /**
     * Admin: Get all volunteer opportunities
     */
    @Transactional(readOnly = true)
    public List<VolunteerOpportunity> getAllVolunteerOpportunities() {
        try {
            System.out.println("=== Starting getAllVolunteerOpportunities method ===");

            // First, test basic repository access
            long count = volunteerOpportunityRepository.count();
            System.out.println("Total volunteer opportunities count: " + count);

            if (count == 0) {
                System.out.println("No volunteer opportunities found in database");
                return new ArrayList<>();
            }

            // Try to get all opportunities
            List<VolunteerOpportunity> opportunities = volunteerOpportunityRepository.findAll();
            System.out.println(
                    "Successfully retrieved " + opportunities.size() + " volunteer opportunities from repository");

            // Process each opportunity individually to catch problematic ones
            List<VolunteerOpportunity> validOpportunities = new ArrayList<>();
            for (int i = 0; i < opportunities.size(); i++) {
                VolunteerOpportunity opp = opportunities.get(i);
                try {
                    System.out.println("Processing opportunity " + (i + 1) + "/" + opportunities.size());
                    System.out.println("  ID: " + opp.getId());
                    System.out.println("  Title: " + (opp.getTitle() != null ? opp.getTitle() : "NULL"));
                    System.out.println("  Status: " + (opp.getStatus() != null ? opp.getStatus() : "NULL"));

                    // Test NGO relationship carefully
                    if (opp.getNgo() != null) {
                        try {
                            String ngoName = opp.getNgo().getOrganizationName();
                            Long ngoId = opp.getNgo().getId();
                            System.out.println("  NGO: " + ngoName + " (ID: " + ngoId + ")");
                        } catch (Exception ngoError) {
                            System.err.println("  ERROR accessing NGO data: " + ngoError.getMessage());
                            // Continue processing but note the error
                        }
                    } else {
                        System.out.println("  NGO: null");
                    }

                    // Test other critical fields
                    System.out.println("  Location: " + (opp.getLocation() != null ? opp.getLocation() : "NULL"));
                    System.out.println("  Cause: " + (opp.getCause() != null ? opp.getCause() : "NULL"));
                    System.out.println("  Created: " + opp.getCreatedAt());

                    validOpportunities.add(opp);
                    System.out.println("  ✓ Opportunity processed successfully");

                } catch (Exception oppError) {
                    System.err.println("ERROR processing opportunity " + (i + 1) + " (ID: " +
                            (opp.getId() != null ? opp.getId() : "unknown") + "): " + oppError.getMessage());
                    oppError.printStackTrace();
                    // Skip this opportunity and continue with others
                }
            }

            System.out.println("=== Completed processing. Valid opportunities: " + validOpportunities.size() + "/"
                    + opportunities.size() + " ===");
            return validOpportunities;

        } catch (Exception e) {
            System.err.println("=== ERROR in getAllVolunteerOpportunities ===");
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Admin: Approve a pending volunteer opportunity
     */
    @Transactional
    public void approveOpportunity(Long opportunityId) {
        VolunteerOpportunity opportunity = volunteerOpportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        opportunity.setStatus(OpportunityStatus.ACTIVE);
        volunteerOpportunityRepository.save(opportunity);
    }

    /**
     * Admin: Reject a pending volunteer opportunity
     */
    @Transactional
    public void rejectOpportunity(Long opportunityId) {
        VolunteerOpportunity opportunity = volunteerOpportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        opportunity.setStatus(OpportunityStatus.REJECTED);
        volunteerOpportunityRepository.save(opportunity);
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
        // Note: PlatformStatistics entity may need to be updated with new user fields
        // if needed
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
                    ngo.setStatus(NGOStatus.APPROVED);
                } else {
                    ngo.setStatus(NGOStatus.PENDING);
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

    // User Management Methods

    /**
     * Get all users for admin management with filtering
     */
    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getAllUsersForManagement(String userType, String status, int page,
            int size) {
        System.out.println("getAllUsersForManagement called with userType: " + userType + ", status: " + status
                + ", page: " + page + ", size: " + size);

        Sort sortByCreatedDesc = Sort.by(Sort.Direction.DESC, "createdAt");
        List<User> users = userRepository.findAll(sortByCreatedDesc).stream()
                .filter(user -> {
                    // Filter by user type if provided
                    if (userType != null && !userType.isEmpty() && !userType.equalsIgnoreCase("ALL")) {
                        if (!userType.equalsIgnoreCase(user.getUserType().name())) {
                            return false;
                        }
                    }

                    // Filter by status if provided
                    if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL")) {
                        boolean isBlocked = Boolean.TRUE.equals(user.getIsBlocked());
                        boolean matchesStatus = false;

                        switch (status.toUpperCase()) {
                            case "ACTIVE":
                                matchesStatus = !isBlocked && Boolean.TRUE.equals(user.getEmailVerified());
                                break;
                            case "BLOCKED":
                                matchesStatus = isBlocked;
                                break;
                            case "UNVERIFIED":
                                matchesStatus = !isBlocked && !Boolean.TRUE.equals(user.getEmailVerified());
                                break;
                        }

                        if (!matchesStatus) {
                            return false;
                        }
                    }

                    return true;
                })
                .skip(page * size)
                .limit(size)
                .collect(Collectors.toList());

        return users.stream().map(this::mapUserForManagement).collect(Collectors.toList());
    }

    /**
     * Get detailed user information for admin review
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getUserDetailsForReview(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();
        java.util.Map<String, Object> details = new java.util.HashMap<>();

        // Basic user info
        details.put("id", user.getId());
        details.put("fullName", user.getFullName());
        details.put("email", user.getEmail());
        details.put("phone", user.getPhone());
        details.put("address", user.getAddress());
        details.put("userType", user.getUserType().name());
        details.put("emailVerified", user.getEmailVerified());
        details.put("isBlocked", user.getIsBlocked());
        details.put("blockReason", user.getBlockReason());
        details.put("blockedBy", user.getBlockedBy());
        details.put("blockedAt", user.getBlockedAt());
        details.put("totalDonations", user.getTotalDonations());
        details.put("createdAt", user.getCreatedAt());
        details.put("updatedAt", user.getUpdatedAt());

        // Activity statistics
        details.put("activityStats", getUserActivity(userId));

        return details;
    }

    /**
     * Get user activity statistics
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getUserActivity(Long userId) {
        java.util.Map<String, Object> activity = new java.util.HashMap<>();

        // Donation activity
        List<Donation> donations = donationRepository.findAll().stream()
                .filter(d -> d.getDonor() != null && d.getDonor().getId().equals(userId))
                .collect(Collectors.toList());

        activity.put("totalDonations", donations.size());
        activity.put("totalDonationAmount", donations.stream().mapToDouble(Donation::getAmount).sum());
        activity.put("recentDonations", donations.stream()
                .sorted((d1, d2) -> d2.getDonationDate().compareTo(d1.getDonationDate()))
                .limit(5)
                .map(this::mapDonationForActivity)
                .collect(Collectors.toList()));

        // Volunteer activity (if applicable) - simplified for now since we don't have
        // volunteer applications tracking
        // This would require a separate VolunteerApplication entity
        activity.put("totalVolunteerApplications", 0);
        activity.put("recentVolunteerApplications", new java.util.ArrayList<>());
        return activity;
    }

    /**
     * Reset user password
     */
    @Transactional
    public java.util.Map<String, Object> resetUserPassword(Long userId, Long adminId, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();

        // In a real application, you'd use password encoder
        user.setPassword(newPassword);
        userRepository.save(user);

        // Log the action
        logUserManagementAction(userId, adminId, "PASSWORD_RESET", "Password reset by admin");

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "Password reset successfully");
        response.put("userId", userId);

        return response;
    }

    /**
     * Block user account
     */
    @Transactional
    public java.util.Map<String, Object> blockUser(Long userId, Long adminId, String reason) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();
        user.setIsBlocked(true);
        user.setBlockReason(reason);
        user.setBlockedBy(adminId);
        user.setBlockedAt(LocalDateTime.now());

        userRepository.save(user);

        // Log the action
        logUserManagementAction(userId, adminId, "BLOCK", reason);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "User blocked successfully");
        response.put("userId", userId);

        return response;
    }

    /**
     * Unblock user account
     */
    @Transactional
    public java.util.Map<String, Object> unblockUser(Long userId, Long adminId, String notes) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();
        user.setIsBlocked(false);
        user.setBlockReason(null);
        user.setBlockedBy(null);
        user.setBlockedAt(null);

        userRepository.save(user);

        // Log the action
        logUserManagementAction(userId, adminId, "UNBLOCK", notes);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "User unblocked successfully");
        response.put("userId", userId);

        return response;
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
            ngo.setStatus(NGOStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            // If status is not valid, default to PENDING
            ngo.setStatus(NGOStatus.PENDING);
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

    // Helper methods for User management

    private java.util.Map<String, Object> mapUserForManagement(User user) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getFullName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("userType", user.getUserType().name());
        map.put("emailVerified", user.getEmailVerified());
        map.put("isBlocked", user.getIsBlocked());
        map.put("totalDonations", user.getTotalDonations());
        map.put("createdAt", user.getCreatedAt());
        map.put("status", getUserStatus(user));
        return map;
    }

    private String getUserStatus(User user) {
        if (Boolean.TRUE.equals(user.getIsBlocked())) {
            return "BLOCKED";
        } else if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return "ACTIVE";
        } else {
            return "UNVERIFIED";
        }
    }

    private java.util.Map<String, Object> mapDonationForActivity(Donation donation) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", donation.getId());
        map.put("amount", donation.getAmount());
        map.put("ngoName", donation.getNgo() != null ? donation.getNgo().getOrganizationName() : "Unknown");
        map.put("donatedAt", donation.getDonationDate());
        map.put("status", donation.getStatus().name());
        return map;
    }

    private java.util.Map<String, Object> mapVolunteerOpportunityForActivity(VolunteerOpportunity opportunity) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", opportunity.getId());
        map.put("title", opportunity.getTitle());
        map.put("ngoName", opportunity.getNgo() != null ? opportunity.getNgo().getOrganizationName() : "Unknown");
        map.put("location", opportunity.getLocation());
        map.put("createdAt", opportunity.getCreatedAt());
        return map;
    }

    /**
     * Fetch all donations and convert to safe DTO format for admin consumption
     */
    @Transactional(readOnly = true)
    public List<DonationDTO> getAllDonations() {
        try {
            List<Donation> donations = donationRepository.findAll();
            System.out.println("Found " + donations.size() + " donations");

            List<DonationDTO> result = new ArrayList<>();
            for (Donation donation : donations) {
                try {
                    // Manual conversion to avoid ModelMapper issues
                    DonationDTO dto = createDonationDTOManually(donation);
                    result.add(dto);
                } catch (Exception e) {
                    System.err.println("Error converting donation ID " + donation.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                    // Skip this donation but continue with others
                }
            }

            System.out.println("Successfully converted " + result.size() + " donations to DTOs");
            return result;
        } catch (Exception e) {
            System.err.println("Error in getAllDonations: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Manual DTO conversion to avoid ModelMapper issues
     */
    private DonationDTO createDonationDTOManually(Donation donation) {
        if (donation == null) {
            return null;
        }

        DonationDTO dto = new DonationDTO();

        // Basic fields
        dto.setId(donation.getId());
        dto.setAmount(donation.getAmount());
        dto.setDonationDate(donation.getDonationDate());
        dto.setDonorMessage(donation.getDonorMessage());
        dto.setTransactionId(donation.getTransactionId());
        dto.setCreatedAt(donation.getCreatedAt());
        dto.setUpdatedAt(donation.getUpdatedAt());

        // Handle enums safely - use the actual enum types
        dto.setPaymentMethod(donation.getPaymentMethod());
        dto.setStatus(donation.getStatus());

        // Handle pledge type as string
        if (donation.getPledgeType() != null) {
            dto.setPledgeType(donation.getPledgeType().name());
        }

        // Handle donor safely
        if (donation.getDonor() != null) {
            dto.setUserId(donation.getDonor().getId());
            dto.setDonorName(donation.getDonor().getFullName());
            dto.setDonorEmail(donation.getDonor().getEmail());
        }

        // Handle NGO safely
        if (donation.getNgo() != null) {
            dto.setNgoId(donation.getNgo().getId());

            // Create a simple NGO DTO
            com.ngoconnect.dto.NGODTO ngoDTO = new com.ngoconnect.dto.NGODTO();
            ngoDTO.setId(donation.getNgo().getId());
            ngoDTO.setOrganizationName(donation.getNgo().getOrganizationName());
            dto.setNgo(ngoDTO);
        }

        return dto;
    }

    /**
     * Generate donation report by NGO
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getDonationReportByNGO(Long ngoId, LocalDate startDate, LocalDate endDate) {
        List<Donation> donations = donationRepository.findAll().stream()
                .filter(d -> d.getNgo() != null && d.getNgo().getId().equals(ngoId))
                .filter(d -> d.getDonationDate().toLocalDate().isAfter(startDate.minusDays(1))
                        && d.getDonationDate().toLocalDate().isBefore(endDate.plusDays(1)))
                .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();
        report.put("ngoId", ngoId);
        report.put("ngoName", donations.isEmpty() ? "Unknown" : donations.get(0).getNgo().getOrganizationName());
        report.put("totalDonations", donations.size());
        report.put("totalAmount", donations.stream().mapToDouble(Donation::getAmount).sum());
        report.put("averageAmount",
                donations.isEmpty() ? 0 : donations.stream().mapToDouble(Donation::getAmount).average().orElse(0));
        report.put("donations", donations.stream().map(donationService::convertToDto).collect(Collectors.toList()));
        return report;
    }

    /**
     * Generate donation report by cause
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getDonationReportByCause(String cause, LocalDate startDate, LocalDate endDate) {
        List<Donation> donations = donationRepository.findAll().stream()
                .filter(d -> d.getNgo() != null && cause.equalsIgnoreCase(d.getNgo().getCause()))
                .filter(d -> d.getDonationDate().toLocalDate().isAfter(startDate.minusDays(1))
                        && d.getDonationDate().toLocalDate().isBefore(endDate.plusDays(1)))
                .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();
        report.put("cause", cause);
        report.put("totalDonations", donations.size());
        report.put("totalAmount", donations.stream().mapToDouble(Donation::getAmount).sum());
        report.put("uniqueNGOs", donations.stream().map(d -> d.getNgo().getId()).distinct().count());
        report.put("donations", donations.stream().map(donationService::convertToDto).collect(Collectors.toList()));
        return report;
    }

    /**
     * Flag unusual donation patterns
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> flagUnusualDonationPatterns() {
        List<Map<String, Object>> suspiciousPatterns = new ArrayList<>();

        // Find donors with unusually large donations
        List<Donation> allDonations = donationRepository.findAll();
        double avgDonationAmount = allDonations.stream().mapToDouble(Donation::getAmount).average().orElse(0);
        double threshold = avgDonationAmount * 10; // 10x average is suspicious

        Map<Long, List<Donation>> donorDonations = allDonations.stream()
                .filter(d -> d.getDonor() != null)
                .collect(Collectors.groupingBy(d -> d.getDonor().getId()));

        for (Map.Entry<Long, List<Donation>> entry : donorDonations.entrySet()) {
            List<Donation> donations = entry.getValue();
            double userTotal = donations.stream().mapToDouble(Donation::getAmount).sum();

            if (userTotal > threshold || donations.size() > 100) { // More than 100 donations is also suspicious
                Map<String, Object> pattern = new HashMap<>();
                pattern.put("donorId", entry.getKey());
                pattern.put("donorName", donations.get(0).getDonor().getFullName());
                pattern.put("totalAmount", userTotal);
                pattern.put("donationCount", donations.size());
                pattern.put("pattern", userTotal > threshold ? "LARGE_AMOUNT" : "HIGH_FREQUENCY");
                suspiciousPatterns.add(pattern);
            }
        }

        return suspiciousPatterns;
    }

    /**
     * Monitor volunteer participation across NGOs
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getVolunteerParticipationReport() {
        List<VolunteerOpportunity> activeOpportunities = volunteerOpportunityRepository.findByIsActive(true);

        Map<String, Object> report = new HashMap<>();
        report.put("totalActiveOpportunities", activeOpportunities.size());
        report.put("totalVolunteersNeeded",
                activeOpportunities.stream().mapToInt(VolunteerOpportunity::getVolunteersNeeded).sum());
        report.put("totalVolunteersApplied", activeOpportunities.stream()
                .mapToInt(vo -> vo.getVolunteersApplied() != null ? vo.getVolunteersApplied() : 0).sum());

        // Group by NGO
        Map<String, List<VolunteerOpportunity>> ngoOpportunities = activeOpportunities.stream()
                .filter(vo -> vo.getNgo() != null)
                .collect(Collectors.groupingBy(vo -> vo.getNgo().getOrganizationName()));

        List<Map<String, Object>> ngoStats = new ArrayList<>();
        for (Map.Entry<String, List<VolunteerOpportunity>> entry : ngoOpportunities.entrySet()) {
            Map<String, Object> ngoStat = new HashMap<>();
            ngoStat.put("ngoName", entry.getKey());
            ngoStat.put("opportunityCount", entry.getValue().size());
            ngoStat.put("volunteersNeeded",
                    entry.getValue().stream().mapToInt(VolunteerOpportunity::getVolunteersNeeded).sum());
            ngoStat.put("volunteersApplied", entry.getValue().stream()
                    .mapToInt(vo -> vo.getVolunteersApplied() != null ? vo.getVolunteersApplied() : 0).sum());
            ngoStats.add(ngoStat);
        }

        report.put("ngoStatistics", ngoStats);
        return report;
    }

    /**
     * Remove/flag fake volunteer opportunities
     */
    @Transactional
    public List<Map<String, Object>> detectSuspiciousVolunteerOpportunities() {
        List<VolunteerOpportunity> allOpportunities = volunteerOpportunityRepository.findAll();
        List<Map<String, Object>> suspicious = new ArrayList<>();

        for (VolunteerOpportunity opp : allOpportunities) {
            Map<String, Object> suspiciousData = new HashMap<>();
            boolean isSuspicious = false;
            List<String> reasons = new ArrayList<>();

            // Check for unrealistic volunteer requirements
            if (opp.getVolunteersNeeded() != null && opp.getVolunteersNeeded() > 1000) {
                reasons.add("UNREALISTIC_VOLUNTEER_COUNT");
                isSuspicious = true;
            }

            // Check for duplicate/similar titles from same NGO
            long similarTitles = allOpportunities.stream()
                    .filter(other -> other.getNgo() != null && opp.getNgo() != null)
                    .filter(other -> other.getNgo().getId().equals(opp.getNgo().getId()))
                    .filter(other -> other.getTitle().toLowerCase()
                            .contains(opp.getTitle().toLowerCase().substring(0, Math.min(10, opp.getTitle().length()))))
                    .count();

            if (similarTitles > 5) {
                reasons.add("DUPLICATE_OPPORTUNITIES");
                isSuspicious = true;
            }

            // Check for vague descriptions
            if (opp.getDescription() != null && opp.getDescription().length() < 50) {
                reasons.add("VAGUE_DESCRIPTION");
                isSuspicious = true;
            }

            if (isSuspicious) {
                suspiciousData.put("opportunityId", opp.getId());
                suspiciousData.put("title", opp.getTitle());
                suspiciousData.put("ngoName", opp.getNgo() != null ? opp.getNgo().getOrganizationName() : "Unknown");
                suspiciousData.put("reasons", reasons);
                suspicious.add(suspiciousData);
            }
        }

        return suspicious;
    }

    /**
     * Calculate missing fund reports count
     */
    private int getMissingFundReportsCount() {
        // Simple logic: NGOs that have received donations but haven't submitted reports
        // recently
        List<NGO> verifiedNGOs = ngoRepository.findByIsVerified(true);
        int missingReports = 0;

        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);

        for (NGO ngo : verifiedNGOs) {
            // Check if NGO has received donations
            boolean hasRecentDonations = donationRepository.findAll().stream()
                    .anyMatch(d -> d.getNgo() != null && d.getNgo().getId().equals(ngo.getId())
                            && d.getDonationDate().isAfter(threeMonthsAgo));

            if (hasRecentDonations) {
                // For now, we'll count all NGOs with recent donations as missing reports
                // In a real system, you'd check against a FundUtilizationReport table
                missingReports++;
            }
        }

        return Math.max(0, missingReports);
    }

    private void logUserManagementAction(Long userId, Long adminId, String actionType, String notes) {
        // This would save to UserManagementActions table
        // Implementation depends on creating the entity and repository
        System.out.println("User Management Action: " + actionType + " for User " + userId +
                " by admin " + adminId + " - " + notes);
    }
}