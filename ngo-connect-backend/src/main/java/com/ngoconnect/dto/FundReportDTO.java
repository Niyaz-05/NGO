package com.ngoconnect.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FundReportDTO {
    private Long id;
    private Long ngoId;
    private LocalDate reportDate;
    private BigDecimal totalFundsReceived;
    private BigDecimal totalFundsSpent;
    private String breakdown;
    private LocalDateTime createdAt;
}
