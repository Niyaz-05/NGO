package com.ngoconnect.dto;

import java.time.LocalDateTime;

public class AdminDashboardDTO {

    private DashboardOverview overview;
    private java.util.List<AlertDTO> alerts;
    private java.util.List<PendingVerificationDTO> pendingVerifications;

    public AdminDashboardDTO() {
    }

    public AdminDashboardDTO(DashboardOverview overview, java.util.List<AlertDTO> alerts,
            java.util.List<PendingVerificationDTO> pendingVerifications) {
        this.overview = overview;
        this.alerts = alerts;
        this.pendingVerifications = pendingVerifications;
    }

    // Getters and Setters
    public DashboardOverview getOverview() {
        return overview;
    }

    public void setOverview(DashboardOverview overview) {
        this.overview = overview;
    }

    public java.util.List<AlertDTO> getAlerts() {
        return alerts;
    }

    public void setAlerts(java.util.List<AlertDTO> alerts) {
        this.alerts = alerts;
    }

    public java.util.List<PendingVerificationDTO> getPendingVerifications() {
        return pendingVerifications;
    }

    public void setPendingVerifications(java.util.List<PendingVerificationDTO> pendingVerifications) {
        this.pendingVerifications = pendingVerifications;
    }

    public static class DashboardOverview {
        private Integer totalNgosRegistered;
        private Integer totalNgosVerified;
        private Integer totalNgosPending;
        private Integer totalUsersRegistered;
        private Double totalDonationsAmount;
        private Integer totalDonationsCount;
        private Integer activeVolunteerOpportunities;
        private Integer pendingVerifications;
        private Integer missingFundReports;
        private Integer suspiciousActivities;

        public DashboardOverview() {
        }

        // Getters and Setters
        public Integer getTotalNgosRegistered() {
            return totalNgosRegistered;
        }

        public void setTotalNgosRegistered(Integer totalNgosRegistered) {
            this.totalNgosRegistered = totalNgosRegistered;
        }

        public Integer getTotalNgosVerified() {
            return totalNgosVerified;
        }

        public void setTotalNgosVerified(Integer totalNgosVerified) {
            this.totalNgosVerified = totalNgosVerified;
        }

        public Integer getTotalNgosPending() {
            return totalNgosPending;
        }

        public void setTotalNgosPending(Integer totalNgosPending) {
            this.totalNgosPending = totalNgosPending;
        }

        public Integer getTotalUsersRegistered() {
            return totalUsersRegistered;
        }

        public void setTotalUsersRegistered(Integer totalUsersRegistered) {
            this.totalUsersRegistered = totalUsersRegistered;
        }

        public Double getTotalDonationsAmount() {
            return totalDonationsAmount;
        }

        public void setTotalDonationsAmount(Double totalDonationsAmount) {
            this.totalDonationsAmount = totalDonationsAmount;
        }

        public Integer getTotalDonationsCount() {
            return totalDonationsCount;
        }

        public void setTotalDonationsCount(Integer totalDonationsCount) {
            this.totalDonationsCount = totalDonationsCount;
        }

        public Integer getActiveVolunteerOpportunities() {
            return activeVolunteerOpportunities;
        }

        public void setActiveVolunteerOpportunities(Integer activeVolunteerOpportunities) {
            this.activeVolunteerOpportunities = activeVolunteerOpportunities;
        }

        public Integer getPendingVerifications() {
            return pendingVerifications;
        }

        public void setPendingVerifications(Integer pendingVerifications) {
            this.pendingVerifications = pendingVerifications;
        }

        public Integer getMissingFundReports() {
            return missingFundReports;
        }

        public void setMissingFundReports(Integer missingFundReports) {
            this.missingFundReports = missingFundReports;
        }

        public Integer getSuspiciousActivities() {
            return suspiciousActivities;
        }

        public void setSuspiciousActivities(Integer suspiciousActivities) {
            this.suspiciousActivities = suspiciousActivities;
        }
    }

    public static class AlertDTO {
        private Long id;
        private String alertType;
        private String priority;
        private String title;
        private String message;
        private String relatedEntityType;
        private Long relatedEntityId;
        private LocalDateTime createdAt;

        public AlertDTO() {
        }

        public AlertDTO(Long id, String alertType, String priority, String title, String message,
                String relatedEntityType, Long relatedEntityId, LocalDateTime createdAt) {
            this.id = id;
            this.alertType = alertType;
            this.priority = priority;
            this.title = title;
            this.message = message;
            this.relatedEntityType = relatedEntityType;
            this.relatedEntityId = relatedEntityId;
            this.createdAt = createdAt;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getAlertType() {
            return alertType;
        }

        public void setAlertType(String alertType) {
            this.alertType = alertType;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getRelatedEntityType() {
            return relatedEntityType;
        }

        public void setRelatedEntityType(String relatedEntityType) {
            this.relatedEntityType = relatedEntityType;
        }

        public Long getRelatedEntityId() {
            return relatedEntityId;
        }

        public void setRelatedEntityId(Long relatedEntityId) {
            this.relatedEntityId = relatedEntityId;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class PendingVerificationDTO {
        private Long id;
        private Long ngoId;
        private String ngoName;
        private String cause;
        private String location;
        private LocalDateTime submittedDate;
        private String documentsProvided;
        private Integer verificationScore;

        public PendingVerificationDTO() {
        }

        public PendingVerificationDTO(Long id, Long ngoId, String ngoName, String cause,
                String location, LocalDateTime submittedDate,
                String documentsProvided, Integer verificationScore) {
            this.id = id;
            this.ngoId = ngoId;
            this.ngoName = ngoName;
            this.cause = cause;
            this.location = location;
            this.submittedDate = submittedDate;
            this.documentsProvided = documentsProvided;
            this.verificationScore = verificationScore;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getNgoId() {
            return ngoId;
        }

        public void setNgoId(Long ngoId) {
            this.ngoId = ngoId;
        }

        public String getNgoName() {
            return ngoName;
        }

        public void setNgoName(String ngoName) {
            this.ngoName = ngoName;
        }

        public String getCause() {
            return cause;
        }

        public void setCause(String cause) {
            this.cause = cause;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public LocalDateTime getSubmittedDate() {
            return submittedDate;
        }

        public void setSubmittedDate(LocalDateTime submittedDate) {
            this.submittedDate = submittedDate;
        }

        public String getDocumentsProvided() {
            return documentsProvided;
        }

        public void setDocumentsProvided(String documentsProvided) {
            this.documentsProvided = documentsProvided;
        }

        public Integer getVerificationScore() {
            return verificationScore;
        }

        public void setVerificationScore(Integer verificationScore) {
            this.verificationScore = verificationScore;
        }
    }
}