package com.ngoconnect.dto;

import java.util.List;

public class VolunteerOpportunityDTO {

    private Long id;
    private String title;
    private String description;
    private String cause;
    private String location;
    private String timeCommitment;
    private String workType;
    private List<String> requirements;
    private String startDate;
    private String endDate;
    private Integer volunteersNeeded;
    private Integer volunteersApplied;
    private String urgency;
    private String image;
    private String ngo;
    private String ngoImage;

    public VolunteerOpportunityDTO() {
    }

    public VolunteerOpportunityDTO(Long id, String title, String description, String cause, String location,
            String timeCommitment, String workType, List<String> requirements,
            String startDate, String endDate, Integer volunteersNeeded, Integer volunteersApplied,
            String urgency, String image, String ngo, String ngoImage) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.cause = cause;
        this.location = location;
        this.timeCommitment = timeCommitment;
        this.workType = workType;
        this.requirements = requirements;
        this.startDate = startDate;
        this.endDate = endDate;
        this.volunteersNeeded = volunteersNeeded;
        this.volunteersApplied = volunteersApplied;
        this.urgency = urgency;
        this.image = image;
        this.ngo = ngo;
        this.ngoImage = ngoImage;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTimeCommitment() {
        return timeCommitment;
    }

    public void setTimeCommitment(String timeCommitment) {
        this.timeCommitment = timeCommitment;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getVolunteersNeeded() {
        return volunteersNeeded;
    }

    public void setVolunteersNeeded(Integer volunteersNeeded) {
        this.volunteersNeeded = volunteersNeeded;
    }

    public Integer getVolunteersApplied() {
        return volunteersApplied;
    }

    public void setVolunteersApplied(Integer volunteersApplied) {
        this.volunteersApplied = volunteersApplied;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getNgo() {
        return ngo;
    }

    public void setNgo(String ngo) {
        this.ngo = ngo;
    }

    public String getNgoImage() {
        return ngoImage;
    }

    public void setNgoImage(String ngoImage) {
        this.ngoImage = ngoImage;
    }
}
