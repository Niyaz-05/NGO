package com.ngoconnect.controller;

import com.ngoconnect.dto.NGODTO;
import com.ngoconnect.entity.NGO;
import com.ngoconnect.entity.UrgencyLevel;
import com.ngoconnect.repository.NGORepository;
import com.ngoconnect.repository.DonationRepository;
import com.ngoconnect.repository.FundReportRepository;
import com.ngoconnect.entity.FundReport;
import com.ngoconnect.repository.VolunteerOpportunityRepository;
import com.ngoconnect.entity.VolunteerOpportunity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "*")
public class NGOController {
    
    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private FundReportRepository fundReportRepository;

    @Autowired
    private VolunteerOpportunityRepository volunteerOpportunityRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllNGOs(
            @RequestParam(required = false) String fields) {
        List<NGO> ngos = ngoRepository.findAll();
        
        // If no specific fields requested, return full objects
        if (fields == null || fields.trim().isEmpty()) {
            return ResponseEntity.ok(ngos.stream()
                .map(ngo -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", ngo.getId());
                    map.put("organization_name", ngo.getOrganizationName());
                    map.put("email", ngo.getEmail());
                    map.put("description", ngo.getDescription());
                    map.put("location", ngo.getLocation());
                    map.put("point_of_contact_phone", ngo.getPointOfContactPhone());
                    map.put("website", ngo.getWebsite());
                    map.put("causes", ngo.getCauses() != null && !ngo.getCauses().isEmpty() ? ngo.getCauses() : List.of(ngo.getCause()));
                    return map;
                })
                .toList());
        }
        
        // Parse requested fields
        String[] fieldArray = fields.split(",");
        
        // Map to store field names and their getter methods
        Map<String, java.util.function.Function<NGO, Object>> fieldGetters = new HashMap<>();
        fieldGetters.put("id", NGO::getId);
        fieldGetters.put("organization_name", NGO::getOrganizationName);
        fieldGetters.put("email", NGO::getEmail);
        fieldGetters.put("description", NGO::getDescription);
        fieldGetters.put("location", NGO::getLocation);
        fieldGetters.put("point_of_contact_phone", NGO::getPointOfContactPhone);
        fieldGetters.put("website", NGO::getWebsite);
        fieldGetters.put("causes", ngo -> ngo.getCauses() != null && !ngo.getCauses().isEmpty() ? 
            ngo.getCauses() : List.of(ngo.getCause()));
        
        // Filter and return only requested fields
        List<Map<String, Object>> result = ngos.stream()
            .map(ngo -> {
                Map<String, Object> map = new HashMap<>();
                for (String field : fieldArray) {
                    field = field.trim();
                    if (fieldGetters.containsKey(field)) {
                        map.put(field, fieldGetters.get(field).apply(ngo));
                    }
                }
                return map;
            })
            .toList();
            
        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-organization")
    public ResponseEntity<?> getNGOByOrganizationName(@RequestParam String organizationName) {
        return ngoRepository.findByOrganizationName(organizationName)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "NGO not found with organization name: " + organizationName)));
    }
    
    @GetMapping("/by-email")
    public ResponseEntity<?> getNGOByEmail(@RequestParam String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email parameter is required"));
            }
            
            email = email.trim();
            System.out.println("Looking up NGO with email: " + email);
            
            Optional<NGO> ngoOpt = ngoRepository.findByEmail(email);
            
            if (ngoOpt.isPresent()) {
                NGO ngo = ngoOpt.get();
                System.out.println("Found NGO: " + ngo.getOrganizationName() + " (ID: " + ngo.getId() + ")");
                return ResponseEntity.ok(NGODTO.fromEntity(ngo));
            } else {
                System.out.println("No NGO found with email: " + email);
                return ResponseEntity.status(404).body(Map.of(
                    "error", "NGO not found",
                    "message", "No NGO found with email: " + email
                ));
            }
        } catch (Exception e) {
            System.err.println("Error in getNGOByEmail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error processing request",
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/debug/emails")
    public ResponseEntity<?> debugEmails() {
        try {
            List<NGO> ngos = ngoRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("total_ngos", ngos.size());
            response.put("emails", ngos.stream()
                .map(ngo -> Map.of(
                    "id", ngo.getId(),
                    "organizationName", ngo.getOrganizationName(),
                    "email", ngo.getEmail()
                ))
                .collect(Collectors.toList()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error fetching emails",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping
    public ResponseEntity<?> createNGO(@RequestBody NGO ngo) {
        // Relax validation for auto-create from dashboard: only name minimally required
        if (ngo.getOrganizationName() == null || ngo.getOrganizationName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "NGO Name is required"));
        }

        // Defaults to avoid validation issues in entity constraints (@NotBlank)
        if (ngo.getDescription() == null || ngo.getDescription().isBlank()) {
            ngo.setDescription("N/A");
        }
        if (ngo.getLocation() == null || ngo.getLocation().isBlank()) {
            ngo.setLocation("Unknown");
        }
        // Backward compatibility: ensure primary cause is set if multiple causes provided
        if ((ngo.getCause() == null || ngo.getCause().isBlank())) {
            if (ngo.getCauses() != null && !ngo.getCauses().isEmpty()) {
                ngo.setCause(ngo.getCauses().get(0));
            } else {
                ngo.setCause("General");
            }
        }
        // registrationNumber optional; no validation required

        NGO saved = ngoRepository.save(ngo);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNGO(@PathVariable Long id, @RequestBody NGO update) {
        return ngoRepository.findById(id)
                .map(existing -> {
                    // Update fields
                    existing.setOrganizationName(update.getOrganizationName());
                    existing.setRegistrationNumber(update.getRegistrationNumber());
                    existing.setDescription(update.getDescription());
                    existing.setLocation(update.getLocation());
                    existing.setAddress(update.getAddress());
                    existing.setEmail(update.getEmail());
                    existing.setPhone(update.getPhone());
                    existing.setWebsite(update.getWebsite());
                    existing.setPointOfContactName(update.getPointOfContactName());
                    existing.setPointOfContactPhone(update.getPointOfContactPhone());
                    existing.setFacebookUrl(update.getFacebookUrl());
                    existing.setInstagramUrl(update.getInstagramUrl());
                    existing.setLinkedinUrl(update.getLinkedinUrl());
                    existing.setCauses(update.getCauses());

                    // Field defaulting/validation (same as createNGO)
                    if (existing.getOrganizationName() == null || existing.getOrganizationName().isBlank()) {
                        return ResponseEntity.badRequest().body(Map.of("error", "NGO Name is required"));
                    }
                    if (existing.getDescription() == null || existing.getDescription().isBlank()) {
                        existing.setDescription("N/A");
                    }
                    if (existing.getLocation() == null || existing.getLocation().isBlank()) {
                        existing.setLocation("Unknown");
                    }
                    // Backward compatibility: ensure primary cause is set if multiple causes provided
                    if ((update.getCause() == null || update.getCause().isBlank())) {
                        if (update.getCauses() != null && !update.getCauses().isEmpty()) {
                            existing.setCause(update.getCauses().get(0));
                        } else {
                            existing.setCause("General");
                        }
                    } else {
                        existing.setCause(update.getCause());
                    }
                    // registrationNumber optional; no validation required

                    NGO saved = ngoRepository.save(existing);
                    return ResponseEntity.ok(NGODTO.fromEntity(saved));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/donations")
    public ResponseEntity<?> getDonationsForNgo(@PathVariable Long id) {
        if (!ngoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(donationRepository.findByNgoIdOrderByDonationDateDesc(id));
    }

    @GetMapping("/{id}/fund-reports")
    public ResponseEntity<?> getFundReports(@PathVariable Long id) {
        if (!ngoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fundReportRepository.findByNgoIdOrderByReportedAtDesc(id));
    }

    @PostMapping("/{id}/fund-reports")
    public ResponseEntity<?> createFundReport(@PathVariable Long id, @RequestBody FundReport report) {
        return ngoRepository.findById(id)
                .map(ngo -> {
                    report.setNgo(ngo);
                    FundReport saved = fundReportRepository.save(report);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/opportunities")
    public ResponseEntity<?> getNgoOpportunities(@PathVariable Long id) {
        if (!ngoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(volunteerOpportunityRepository.findAll().stream().filter(v -> v.getNgo().getId().equals(id)).toList());
    }

    @PostMapping("/{id}/opportunities")
    public ResponseEntity<?> createNgoOpportunity(@PathVariable Long id, @RequestBody VolunteerOpportunity opp) {
        return ngoRepository.findById(id)
                .map(ngo -> {
                    opp.setNgo(ngo);
                    VolunteerOpportunity saved = volunteerOpportunityRepository.save(opp);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{ngoId}/opportunities/{oppId}")
    public ResponseEntity<?> updateNgoOpportunity(@PathVariable Long ngoId, @PathVariable Long oppId, @RequestBody VolunteerOpportunity update) {
        return volunteerOpportunityRepository.findById(oppId)
                .map(existing -> {
                    if (!existing.getNgo().getId().equals(ngoId)) {
                        return ResponseEntity.status(403).body(Map.of("error", "Not your opportunity"));
                    }
                    existing.setTitle(update.getTitle());
                    existing.setDescription(update.getDescription());
                    existing.setCause(update.getCause());
                    existing.setLocation(update.getLocation());
                    existing.setTimeCommitment(update.getTimeCommitment());
                    existing.setWorkType(update.getWorkType());
                    existing.setStartDate(update.getStartDate());
                    existing.setEndDate(update.getEndDate());
                    existing.setVolunteersNeeded(update.getVolunteersNeeded());
                    existing.setUrgency(update.getUrgency());
                    existing.setImageUrl(update.getImageUrl());
                    existing.setIsActive(update.getIsActive());
                    VolunteerOpportunity saved = volunteerOpportunityRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{ngoId}/opportunities/{oppId}")
    public ResponseEntity<?> deleteNgoOpportunity(@PathVariable Long ngoId, @PathVariable Long oppId) {
        return volunteerOpportunityRepository.findById(oppId)
                .map(existing -> {
                    if (!existing.getNgo().getId().equals(ngoId)) {
                        return ResponseEntity.status(403).body(Map.of("error", "Not your opportunity"));
                    }
                    volunteerOpportunityRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getNGOById(@PathVariable Long id) {
        Optional<NGO> ngo = ngoRepository.findById(id);
        if (ngo.isPresent()) {
            return ResponseEntity.ok(ngo.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "NGO not found");
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<NGO>> searchNGOs(
            @RequestParam(required = false) String cause,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String urgency,
            @RequestParam(required = false) String searchTerm) {
        
        List<NGO> ngos;
        
        if (searchTerm != null && !searchTerm.isEmpty()) {
            ngos = ngoRepository.findBySearchTerm(searchTerm);
        } else if (cause != null && location != null && urgency != null) {
            UrgencyLevel urgencyLevel = UrgencyLevel.valueOf(urgency.toUpperCase());
            ngos = ngoRepository.findByCauseAndLocationAndUrgency(cause, location, urgencyLevel);
        } else if (cause != null && location != null) {
            ngos = ngoRepository.findByCauseAndLocation(cause, location);
        } else if (cause != null && urgency != null) {
            UrgencyLevel urgencyLevel = UrgencyLevel.valueOf(urgency.toUpperCase());
            ngos = ngoRepository.findByCauseAndUrgency(cause, urgencyLevel);
        } else if (location != null && urgency != null) {
            UrgencyLevel urgencyLevel = UrgencyLevel.valueOf(urgency.toUpperCase());
            ngos = ngoRepository.findByLocationContainingIgnoreCaseAndUrgency(location, urgencyLevel);
        } else if (cause != null) {
            ngos = ngoRepository.findByCause(cause);
        } else if (location != null) {
            ngos = ngoRepository.findByLocationContainingIgnoreCase(location);
        } else if (urgency != null) {
            UrgencyLevel urgencyLevel = UrgencyLevel.valueOf(urgency.toUpperCase());
            ngos = ngoRepository.findByUrgency(urgencyLevel);
        } else {
            ngos = ngoRepository.findAll();
        }
        
        return ResponseEntity.ok(ngos);
    }
    
    @GetMapping("/causes")
    public ResponseEntity<List<String>> getCauses() {
        List<String> causes = List.of(
            "Environment", "Education", "Healthcare", "Women Empowerment", 
            "Disaster Relief", "Children", "Elderly", "Animals", "Arts & Culture"
        );
        return ResponseEntity.ok(causes);
    }
    
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getLocations() {
        List<String> locations = List.of(
            "New York", "California", "Texas", "Florida", "Illinois", 
            "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"
        );
        return ResponseEntity.ok(locations);
    }
}
