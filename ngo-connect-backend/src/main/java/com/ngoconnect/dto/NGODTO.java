package com.ngoconnect.dto;

import com.ngoconnect.entity.NGO;
import com.ngoconnect.entity.UrgencyLevel;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NGODTO {
    private Long id;
    private String organizationName;
    private String description;
    private String cause;
    private List<String> causes;
    private String location;
    private String website;
    private String address;
    private String phone;
    private String email;
    private String registrationNumber;
    private String pointOfContactName;
    private String pointOfContactPhone;
    private String facebookUrl;
    private String instagramUrl;
    private String linkedinUrl;
    private Integer foundedYear;
    private Double totalDonations;
    private Double rating;
    private String imageUrl;
    private UrgencyLevel urgency;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NGODTO fromEntity(NGO ngo) {
        if (ngo == null) return null;
        
        NGODTO dto = new NGODTO();
        dto.setId(ngo.getId());
        dto.setOrganizationName(ngo.getOrganizationName());
        dto.setDescription(ngo.getDescription());
        dto.setCause(ngo.getCause());
        dto.setCauses(ngo.getCauses());
        dto.setLocation(ngo.getLocation());
        dto.setWebsite(ngo.getWebsite());
        dto.setAddress(ngo.getAddress());
        dto.setPhone(ngo.getPhone());
        dto.setEmail(ngo.getEmail());
        dto.setRegistrationNumber(ngo.getRegistrationNumber());
        dto.setPointOfContactName(ngo.getPointOfContactName());
        dto.setPointOfContactPhone(ngo.getPointOfContactPhone());
        dto.setFacebookUrl(ngo.getFacebookUrl());
        dto.setInstagramUrl(ngo.getInstagramUrl());
        dto.setLinkedinUrl(ngo.getLinkedinUrl());
        dto.setFoundedYear(ngo.getFoundedYear());
        dto.setTotalDonations(ngo.getTotalDonations());
        dto.setRating(ngo.getRating());
        dto.setImageUrl(ngo.getImageUrl());
        dto.setUrgency(ngo.getUrgency());
        dto.setIsVerified(ngo.getIsVerified());
        dto.setCreatedAt(ngo.getCreatedAt());
        dto.setUpdatedAt(ngo.getUpdatedAt());
        
        return dto;
    }
}
