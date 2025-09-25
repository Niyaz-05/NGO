package com.ngoconnect.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NGODonationResponse {
    private Long id;
    private Double amount;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private LocalDateTime donationDate;
    private LocalDateTime createdAt;
    private DonorInfo donor;

    @Data
    public static class DonorInfo {
        private Long id;
        private String name;
        private String email;
    }
}
