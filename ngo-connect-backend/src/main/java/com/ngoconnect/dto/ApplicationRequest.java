package com.ngoconnect.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ApplicationRequest {

    @NotNull
    private Long opportunityId;

    @NotNull
    private Long volunteerId;

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    private String experience;

    @NotBlank
    private String motivation;

    @NotBlank
    private String availability;

    @NotBlank
    private String emergencyContact;

    @NotBlank
    private String emergencyPhone;

    private List<String> skills;

    private String additionalInfo;
}