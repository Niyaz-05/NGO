package com.ngoconnect.service;

import com.ngoconnect.entity.VolunteerApplication;
import com.ngoconnect.entity.VolunteerOpportunity;
import com.ngoconnect.entity.User;
import com.ngoconnect.entity.ApplicationStatus;
import com.ngoconnect.repository.VolunteerApplicationRepository;
import com.ngoconnect.repository.VolunteerOpportunityRepository;
import com.ngoconnect.repository.UserRepository;
import com.ngoconnect.dto.ApplicationRequest;
import com.ngoconnect.dto.ApplicationResponse;
import com.ngoconnect.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private VolunteerApplicationRepository applicationRepository;

    @Autowired
    private VolunteerOpportunityRepository opportunityRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Submit a new volunteer application
     */
    @Transactional
    public VolunteerApplication submitApplication(ApplicationRequest request) {
        // Validate opportunity exists and is active
        VolunteerOpportunity opportunity = opportunityRepository.findById(request.getOpportunityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Opportunity not found with id: " + request.getOpportunityId()));

        if (!opportunity.getIsActive()) {
            throw new IllegalStateException("This opportunity is no longer active");
        }

        // Check if opportunity is full
        if (opportunity.getVolunteersApplied() >= opportunity.getVolunteersNeeded()) {
            throw new IllegalStateException("This opportunity is fully booked");
        }

        // Validate volunteer exists
        User volunteer = userRepository.findById(request.getVolunteerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Volunteer not found with id: " + request.getVolunteerId()));

        // Check if volunteer already applied for this opportunity
        VolunteerApplication existingApplication = applicationRepository.findByVolunteerIdAndOpportunityId(
                request.getVolunteerId(), request.getOpportunityId());
        if (existingApplication != null) {
            throw new IllegalStateException("You have already applied for this opportunity");
        }

        // Create new application
        VolunteerApplication application = new VolunteerApplication();
        application.setVolunteer(volunteer);
        application.setOpportunity(opportunity);
        application.setFullName(request.getFullName());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setAddress(request.getAddress());
        application.setExperience(request.getExperience());
        application.setMotivation(request.getMotivation());
        application.setAvailability(request.getAvailability());
        application.setEmergencyContact(request.getEmergencyContact());
        application.setEmergencyPhone(request.getEmergencyPhone());
        application.setSkills(request.getSkills());
        application.setAdditionalInfo(request.getAdditionalInfo());
        application.setStatus(ApplicationStatus.PENDING);
        application.setAppliedDate(LocalDateTime.now());

        VolunteerApplication savedApplication = applicationRepository.save(application);

        // Update opportunity volunteers applied count
        opportunity.setVolunteersApplied(opportunity.getVolunteersApplied() + 1);
        opportunityRepository.save(opportunity);

        return savedApplication;
    }

    /**
     * Get application history for a volunteer
     */
    public List<ApplicationResponse> getUserApplicationHistory(Long userId) {
        List<VolunteerApplication> applications = applicationRepository.findByVolunteerIdOrderByAppliedDateDesc(userId);
        return applications.stream()
                .map(this::convertToApplicationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get applications for a specific opportunity
     */
    public List<ApplicationResponse> getApplicationsForOpportunity(Long opportunityId) {
        List<VolunteerApplication> applications = applicationRepository
                .findByOpportunityIdOrderByAppliedDateDesc(opportunityId);
        return applications.stream()
                .map(this::convertToApplicationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update application status
     */
    @Transactional
    public VolunteerApplication updateApplicationStatus(Long applicationId, ApplicationStatus newStatus) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(newStatus);
        application.setStatusUpdatedDate(LocalDateTime.now());

        VolunteerApplication updatedApplication = applicationRepository.save(application);

        // If status changed from PENDING to REJECTED, decrease volunteers applied count
        if (oldStatus == ApplicationStatus.PENDING && newStatus == ApplicationStatus.REJECTED) {
            VolunteerOpportunity opportunity = application.getOpportunity();
            opportunity.setVolunteersApplied(Math.max(0, opportunity.getVolunteersApplied() - 1));
            opportunityRepository.save(opportunity);
        }

        return updatedApplication;
    }

    /**
     * Get application by ID
     */
    public ApplicationResponse getApplicationById(Long applicationId) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        return convertToApplicationResponse(application);
    }

    /**
     * Cancel application
     */
    @Transactional
    public void cancelApplication(Long applicationId) {
        VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (application.getStatus() == ApplicationStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed application");
        }

        // Update opportunity volunteers applied count if application was pending
        if (application.getStatus() == ApplicationStatus.PENDING) {
            VolunteerOpportunity opportunity = application.getOpportunity();
            opportunity.setVolunteersApplied(Math.max(0, opportunity.getVolunteersApplied() - 1));
            opportunityRepository.save(opportunity);
        }

        application.setStatus(ApplicationStatus.CANCELLED);
        application.setStatusUpdatedDate(LocalDateTime.now());
        applicationRepository.save(application);
    }

    /**
     * Convert VolunteerApplication entity to ApplicationResponse DTO
     */
    private ApplicationResponse convertToApplicationResponse(VolunteerApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setOpportunityId(application.getOpportunity().getId());
        response.setOpportunityTitle(application.getOpportunity().getTitle());
        response.setNgoName(application.getOpportunity().getNgo().getOrganizationName());
        response.setCause(application.getOpportunity().getCause());
        response.setVolunteerId(application.getVolunteer().getId());
        response.setVolunteerName(application.getFullName());
        response.setVolunteerEmail(application.getEmail());
        response.setPhone(application.getPhone());
        response.setAddress(application.getAddress());
        response.setExperience(application.getExperience());
        response.setMotivation(application.getMotivation());
        response.setAvailability(application.getAvailability());
        response.setEmergencyContact(application.getEmergencyContact());
        response.setEmergencyPhone(application.getEmergencyPhone());
        response.setSkills(application.getSkills());
        response.setAdditionalInfo(application.getAdditionalInfo());
        response.setStatus(application.getStatus());
        response.setAppliedDate(application.getAppliedDate());
        response.setStatusUpdatedDate(application.getStatusUpdatedDate());
        response.setFeedback(application.getFeedback());
        response.setRating(application.getRating());
        response.setStartDate(application.getOpportunity().getStartDate());
        response.setEndDate(application.getOpportunity().getEndDate());
        response.setHoursCompleted(application.getHoursCompleted());
        response.setTotalHours(application.getTotalHours());

        return response;
    }
}