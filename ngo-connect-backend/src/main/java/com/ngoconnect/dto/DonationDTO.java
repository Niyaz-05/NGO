package com.ngoconnect.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ngoconnect.entity.DonationStatus;
import com.ngoconnect.entity.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DonationDTO {
    private Long id;
    private Double amount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private PaymentMethod paymentMethod;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private String pledgeType; // ONE_TIME, MONTHLY, QUARTERLY, YEARLY
    private DonationStatus status;
    private String transactionId;
    private String donorMessage;
    private LocalDateTime donationDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Foreign keys
    private Long userId;
    private Long ngoId;
    
    // Nested DTOs
    private NGODTO ngo;
    
    // Additional fields for display
    private String donorName;
    private String donorEmail;
}
