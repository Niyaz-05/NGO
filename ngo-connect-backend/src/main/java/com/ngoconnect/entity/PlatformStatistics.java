package com.ngoconnect.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "platform_statistics")
public class PlatformStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stat_date", nullable = false, unique = true)
    private java.time.LocalDate statDate;

    @Column(name = "total_ngos_registered")
    private Integer totalNgosRegistered = 0;

    @Column(name = "total_ngos_verified")
    private Integer totalNgosVerified = 0;

    @Column(name = "total_ngos_pending")
    private Integer totalNgosPending = 0;

    @Column(name = "total_users_registered")
    private Integer totalUsersRegistered = 0;

    @Column(name = "total_donations_amount", precision = 15, scale = 2)
    private Double totalDonationsAmount = 0.00;

    @Column(name = "total_donations_count")
    private Integer totalDonationsCount = 0;

    @Column(name = "active_volunteer_opportunities")
    private Integer activeVolunteerOpportunities = 0;

    @Column(name = "pending_verifications")
    private Integer pendingVerifications = 0;

    @Column(name = "missing_fund_reports")
    private Integer missingFundReports = 0;

    @Column(name = "suspicious_activities")
    private Integer suspiciousActivities = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public PlatformStatistics() {
    }

    public PlatformStatistics(java.time.LocalDate statDate) {
        this.statDate = statDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public java.time.LocalDate getStatDate() {
        return statDate;
    }

    public void setStatDate(java.time.LocalDate statDate) {
        this.statDate = statDate;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}