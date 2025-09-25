package com.ngoconnect.dto;

import com.ngoconnect.entity.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ApplicationResponse {

    private Long id;
    private Long opportunityId;
    private String opportunityTitle;
    private String ngoName;
    private String cause;
    private Long volunteerId;
    private String volunteerName;
    private String volunteerEmail;
    private String phone;
    private String address;
    private String experience;
    private String motivation;
    private String availability;
    private String emergencyContact;
    private String emergencyPhone;
    private List<String> skills;
    private String additionalInfo;
    private ApplicationStatus status;
    private LocalDateTime appliedDate;
    private LocalDateTime statusUpdatedDate;
    private String feedback;
    private Integer rating;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer hoursCompleted;
    private Integer totalHours;
}