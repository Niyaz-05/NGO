package com.ngoconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_utilization_reports")
@Data
public class FundUtilizationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_id", nullable = false)
    @JsonIgnore
    private NGO ngo;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "total_funds_received", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalFundsReceived;

    @Column(name = "total_funds_spent", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalFundsSpent;

    @Lob // Large Object - allows for longer text
    @Column(nullable = false, columnDefinition = "TEXT")
    private String breakdown; // e.g., "Education: $5000, Health Camps: $3000, Admin: $1000"

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
