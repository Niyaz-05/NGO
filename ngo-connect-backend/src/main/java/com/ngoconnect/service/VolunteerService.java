package com.ngoconnect.service;

import com.ngoconnect.entity.VolunteerOpportunity;
import com.ngoconnect.entity.UrgencyLevel;
import com.ngoconnect.entity.OpportunityStatus;
import com.ngoconnect.repository.VolunteerOpportunityRepository;
import com.ngoconnect.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerOpportunityRepository volunteerOpportunityRepository;

    /**
     * Get all active volunteer opportunities
     */
    @Transactional(readOnly = true)
    public List<VolunteerOpportunity> getAllActiveOpportunities() {
        try {
            List<VolunteerOpportunity> opportunities = volunteerOpportunityRepository
                    .findByStatus(OpportunityStatus.ACTIVE);
            System.out.println("Found " + opportunities.size() + " active opportunities");

            // Force load requirements collection
            opportunities.forEach(opp -> {
                if (opp.getRequirements() != null)
                    opp.getRequirements().size();
            });

            return opportunities;
        } catch (Exception e) {
            System.err.println("Error fetching opportunities: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    /**
     * Get volunteer opportunity by ID
     */
    @Transactional(readOnly = true)
    public VolunteerOpportunity getOpportunityById(Long id) {
        VolunteerOpportunity opportunity = volunteerOpportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer opportunity not found with id: " + id));

        // Force load lazy requirements collection
        if (opportunity.getRequirements() != null) {
            opportunity.getRequirements().size(); // This triggers lazy loading
        }

        return opportunity;
    }

    /**
     * Get available opportunities (not fully booked)
     */
    public List<VolunteerOpportunity> getAvailableOpportunities() {
        return volunteerOpportunityRepository.findAvailableOpportunities();
    }

    /**
     * Search opportunities with multiple filters
     */
    public List<VolunteerOpportunity> searchOpportunities(String cause, String location,
            String workType, String timeCommitment, String urgency, String searchTerm) {

        List<VolunteerOpportunity> opportunities = getAllActiveOpportunities();

        // Apply filters
        if (cause != null && !cause.trim().isEmpty()) {
            opportunities = opportunities.stream()
                    .filter(opp -> opp.getCause().equalsIgnoreCase(cause))
                    .collect(Collectors.toList());
        }

        if (location != null && !location.trim().isEmpty()) {
            opportunities = opportunities.stream()
                    .filter(opp -> opp.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (workType != null && !workType.trim().isEmpty()) {
            opportunities = opportunities.stream()
                    .filter(opp -> opp.getWorkType().equalsIgnoreCase(workType))
                    .collect(Collectors.toList());
        }

        if (timeCommitment != null && !timeCommitment.trim().isEmpty()) {
            opportunities = opportunities.stream()
                    .filter(opp -> opp.getTimeCommitment().equalsIgnoreCase(timeCommitment))
                    .collect(Collectors.toList());
        }

        if (urgency != null && !urgency.trim().isEmpty()) {
            try {
                UrgencyLevel urgencyLevel = UrgencyLevel.valueOf(urgency.toUpperCase());
                opportunities = opportunities.stream()
                        .filter(opp -> opp.getUrgency() == urgencyLevel)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid urgency level, ignore filter
            }
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String searchLower = searchTerm.toLowerCase();
            opportunities = opportunities.stream()
                    .filter(opp -> opp.getTitle().toLowerCase().contains(searchLower) ||
                            opp.getDescription().toLowerCase().contains(searchLower) ||
                            (opp.getNgo() != null
                                    && opp.getNgo().getOrganizationName().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }

        return opportunities;
    }

    /**
     * Get filter options for dropdowns
     */
    public Map<String, List<String>> getFilterOptions() {
        List<VolunteerOpportunity> allOpportunities = getAllActiveOpportunities();

        Map<String, List<String>> filterOptions = new HashMap<>();

        // Get unique causes
        Set<String> causes = allOpportunities.stream()
                .map(VolunteerOpportunity::getCause)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        filterOptions.put("causes", new ArrayList<>(causes));

        // Get unique work types
        Set<String> workTypes = allOpportunities.stream()
                .map(VolunteerOpportunity::getWorkType)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        filterOptions.put("workTypes", new ArrayList<>(workTypes));

        // Get unique time commitments
        Set<String> timeCommitments = allOpportunities.stream()
                .map(VolunteerOpportunity::getTimeCommitment)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        filterOptions.put("timeCommitments", new ArrayList<>(timeCommitments));

        // Get unique locations
        Set<String> locations = allOpportunities.stream()
                .map(VolunteerOpportunity::getLocation)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        filterOptions.put("locations", new ArrayList<>(locations));

        // Urgency levels
        List<String> urgencyLevels = Arrays.stream(UrgencyLevel.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        filterOptions.put("urgencyLevels", urgencyLevels);

        return filterOptions;
    }
}