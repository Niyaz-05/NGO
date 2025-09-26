package com.ngoconnect.service;

import com.ngoconnect.dto.AdminDashboardDTO;
import com.ngoconnect.entity.*;
import com.ngoconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
}