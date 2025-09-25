package com.ngoconnect.controller;

import com.ngoconnect.dto.DonationDTO;
import com.ngoconnect.dto.NGODonationResponse;
import com.ngoconnect.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {
    private static final Logger logger = LoggerFactory.getLogger(DonationController.class);

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<DonationDTO> createDonation(@RequestBody DonationDTO donationDTO) {
        DonationDTO createdDonation = donationService.createDonation(donationDTO);
        return ResponseEntity.ok(createdDonation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DonationDTO>> getDonationsByUser(@PathVariable Long userId) {
        List<DonationDTO> donations = donationService.getDonationsByUserId(userId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationDTO> getDonationById(@PathVariable Long id) {
        DonationDTO donation = donationService.getDonationById(id);
        return ResponseEntity.ok(donation);
    }
    
    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<NGODonationResponse>> getDonationsByNgoId(@PathVariable Long ngoId) {
        System.out.println("Received request for donations with NGO ID: " + ngoId);
        try {
            List<NGODonationResponse> donations = donationService.getDonationsByNgoId(ngoId);
            System.out.println("Successfully retrieved " + donations.size() + " donations for NGO ID: " + ngoId);
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            System.err.println("Error fetching donations for NGO ID " + ngoId + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
