package com.ngoconnect.controller;

import com.ngoconnect.entity.VolunteerOpportunity;
import com.ngoconnect.dto.VolunteerOpportunityDTO;
import com.ngoconnect.entity.VolunteerApplication;
import com.ngoconnect.service.VolunteerService;
import com.ngoconnect.service.ApplicationService;
import com.ngoconnect.dto.ApplicationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opportunities")
@CrossOrigin(origins = "*")
public class OpportunityController {

    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private ApplicationService applicationService;

    /**
     * Get all active volunteer opportunities
     */
    @GetMapping
    public ResponseEntity<List<VolunteerOpportunityDTO>> getAllOpportunities() {
        try {
            System.out.println("API call received for all opportunities");
            List<VolunteerOpportunity> opportunities = volunteerService.getAllActiveOpportunities();

            // Map to DTO to avoid lazy-loading/serialization issues
            List<VolunteerOpportunityDTO> dtoList = opportunities.stream().map(opp -> {
                String ngoName = opp.getNgo() != null ? opp.getNgo().getOrganizationName() : null;
                String ngoImg = opp.getNgo() != null ? opp.getNgo().getImageUrl() : null;

                VolunteerOpportunityDTO dto = new VolunteerOpportunityDTO(
                        opp.getId(),
                        opp.getTitle(),
                        opp.getDescription(),
                        opp.getCause(),
                        opp.getLocation(),
                        opp.getTimeCommitment(),
                        opp.getWorkType(),
                        opp.getRequirements(),
                        opp.getStartDate() != null ? opp.getStartDate().toString() : null,
                        opp.getEndDate() != null ? opp.getEndDate().toString() : null,
                        opp.getVolunteersNeeded(),
                        opp.getVolunteersApplied(),
                        opp.getUrgency() != null ? opp.getUrgency().name() : null,
                        opp.getImageUrl(),
                        ngoName,
                        ngoImg);
                return dto;
            }).collect(java.util.stream.Collectors.toList());

            System.out.println("Returning " + dtoList.size() + " opportunities (DTO)");
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            System.err.println("Error in getAllOpportunities: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get volunteer opportunity by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VolunteerOpportunity> getOpportunityById(@PathVariable Long id) {
        VolunteerOpportunity opportunity = volunteerService.getOpportunityById(id);
        return ResponseEntity.ok(opportunity);
    }

    /**
     * Search volunteer opportunities with filters
     */
    @GetMapping("/search")
    public ResponseEntity<List<VolunteerOpportunity>> searchOpportunities(
            @RequestParam(required = false) String cause,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workType,
            @RequestParam(required = false) String timeCommitment,
            @RequestParam(required = false) String urgency,
            @RequestParam(required = false) String searchTerm) {

        List<VolunteerOpportunity> opportunities = volunteerService.searchOpportunities(
                cause, location, workType, timeCommitment, urgency, searchTerm);
        return ResponseEntity.ok(opportunities);
    }

    /**
     * Get available opportunities (not fully booked)
     */
    @GetMapping("/available")
    public ResponseEntity<List<VolunteerOpportunity>> getAvailableOpportunities() {
        List<VolunteerOpportunity> opportunities = volunteerService.getAvailableOpportunities();
        return ResponseEntity.ok(opportunities);
    }

    /**
     * Apply for a volunteer opportunity
     */
    @PostMapping("/{opportunityId}/apply")
    public ResponseEntity<Map<String, Object>> applyForOpportunity(
            @PathVariable Long opportunityId,
            @RequestBody ApplicationRequest request) {

        try {
            // Set the opportunity ID from the path
            request.setOpportunityId(opportunityId);

            VolunteerApplication application = applicationService.submitApplication(request);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Application submitted successfully!",
                    "applicationId", application.getId(),
                    "status", application.getStatus().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to submit application: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get filter options for frontend dropdowns
     */
    @GetMapping("/filter-options")
    public ResponseEntity<Map<String, List<String>>> getFilterOptions() {
        Map<String, List<String>> filterOptions = volunteerService.getFilterOptions();
        return ResponseEntity.ok(filterOptions);
    }
}