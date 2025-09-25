package com.ngoconnect.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ngos")
public class NGO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "organization_name")
    private String organizationName;
    
    @NotBlank
    @Size(max = 500)
    private String description;
    
    // Primary cause for backward compatibility
    @NotBlank
    @Size(max = 100)
    private String cause;

    // Multiple causes tagging
    @ElementCollection
    @CollectionTable(name = "ngo_causes", joinColumns = @JoinColumn(name = "ngo_id"))
    @Column(name = "cause")
    private List<String> causes = new ArrayList<>();
    
    @NotBlank
    @Size(max = 200)
    private String location;
    
    @Size(max = 100)
    private String website;

    @Size(max = 500)
    private String address;
    
    @Size(max = 20)
    private String phone;
    
    @Size(max = 200)
    private String email;
    
    @Column(name = "registration_number")
    private String registrationNumber;

    // Point of Contact
    @Size(max = 100)
    private String pointOfContactName;

    @Size(max = 20)
    private String pointOfContactPhone;

    // Optional social links
    @Size(max = 200)
    private String facebookUrl;

    @Size(max = 200)
    private String instagramUrl;

    @Size(max = 200)
    private String linkedinUrl;
    
    @Column(name = "founded_year")
    private Integer foundedYear;
    
    @Column(name = "total_donations")
    private Double totalDonations = 0.0;
    
    @Column(name = "rating")
    private Double rating = 0.0;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgency = UrgencyLevel.MEDIUM;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "ngo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Donation> donations;
    
    @OneToMany(mappedBy = "ngo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VolunteerOpportunity> volunteerOpportunities;
    
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
    public NGO() {}
    
    public NGO(String organizationName, String description, String cause, String location) {
        this.organizationName = organizationName;
        this.description = description;
        this.cause = cause;
        this.location = location;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOrganizationName() {
        return organizationName;
    }
    
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCause() {
        return cause;
    }
    
    public void setCause(String cause) {
        this.cause = cause;
    }

    public List<String> getCauses() {
        return causes;
    }

    public void setCauses(List<String> causes) {
        this.causes = causes;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getWebsite() {
        return website;
    }
    
    public void setWebsite(String website) {
        this.website = website;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getPointOfContactName() {
        return pointOfContactName;
    }

    public void setPointOfContactName(String pointOfContactName) {
        this.pointOfContactName = pointOfContactName;
    }

    public String getPointOfContactPhone() {
        return pointOfContactPhone;
    }

    public void setPointOfContactPhone(String pointOfContactPhone) {
        this.pointOfContactPhone = pointOfContactPhone;
    }

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }
    
    public Integer getFoundedYear() {
        return foundedYear;
    }
    
    public void setFoundedYear(Integer foundedYear) {
        this.foundedYear = foundedYear;
    }
    
    public Double getTotalDonations() {
        return totalDonations;
    }
    
    public void setTotalDonations(Double totalDonations) {
        this.totalDonations = totalDonations;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public UrgencyLevel getUrgency() {
        return urgency;
    }
    
    public void setUrgency(UrgencyLevel urgency) {
        this.urgency = urgency;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
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
    
    public List<Donation> getDonations() {
        return donations;
    }
    
    public void setDonations(List<Donation> donations) {
        this.donations = donations;
    }
    
    public List<VolunteerOpportunity> getVolunteerOpportunities() {
        return volunteerOpportunities;
    }
    
    public void setVolunteerOpportunities(List<VolunteerOpportunity> volunteerOpportunities) {
        this.volunteerOpportunities = volunteerOpportunities;
    }
}
