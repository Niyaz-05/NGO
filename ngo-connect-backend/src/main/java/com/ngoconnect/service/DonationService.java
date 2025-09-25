package com.ngoconnect.service;

import com.ngoconnect.dto.DonationDTO;
import com.ngoconnect.dto.NGODTO;
import com.ngoconnect.entity.Donation;
import com.ngoconnect.entity.NGO;
import com.ngoconnect.entity.User;
import com.ngoconnect.exception.ResourceNotFoundException;
import com.ngoconnect.repository.DonationRepository;
import com.ngoconnect.repository.NGORepository;
import com.ngoconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.ngoconnect.entity.DonationStatus;
import com.ngoconnect.entity.PaymentMethod;
import com.ngoconnect.dto.NGODonationResponse;
import org.hibernate.proxy.HibernateProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class DonationService {
    private static final Logger logger = LoggerFactory.getLogger(DonationService.class);

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final NGORepository ngoRepository;
    private final ModelMapper modelMapper;
    @Value("${app.donation.default-status:COMPLETED}")
    private String defaultDonationStatus;

    @Transactional
    public DonationDTO createDonation(DonationDTO donationDTO) {
        try {
            logger.info("Creating donation: {}", donationDTO);
            
            // Validate required fields
            if (donationDTO.getUserId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }
            if (donationDTO.getNgoId() == null) {
                throw new IllegalArgumentException("NGO ID is required");
            }
            if (donationDTO.getAmount() == null || donationDTO.getAmount() <= 0) {
                throw new IllegalArgumentException("Valid amount is required");
            }
            if (donationDTO.getPaymentMethod() == null) {
                throw new IllegalArgumentException("Payment method is required");
            }

            // Fetch related entities
            User donor = userRepository.findById(donationDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + donationDTO.getUserId()));
            
            NGO ngo = ngoRepository.findById(donationDTO.getNgoId())
                    .orElseThrow(() -> new ResourceNotFoundException("NGO not found with id: " + donationDTO.getNgoId()));

            // Create and populate donation entity
            Donation donation = new Donation();
            donation.setDonor(donor);
            donation.setNgo(ngo);
            donation.setAmount(donationDTO.getAmount());
            
            // Set payment method safely
            try {
                donation.setPaymentMethod(donationDTO.getPaymentMethod());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid payment method: " + donationDTO.getPaymentMethod());
            }
            
            // Set other fields
            donation.setDonorMessage(donationDTO.getDonorMessage());
            donation.setDonationDate(LocalDateTime.now());
            
            // Set pledge type if available
            if (donationDTO.getPledgeType() != null) {
                try {
                    donation.setPledgeType(Donation.PledgeType.valueOf(donationDTO.getPledgeType().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    donation.setPledgeType(Donation.PledgeType.ONE_TIME);
                }
            }
            
            // Set status
            try {
                donation.setStatus(donationDTO.getStatus() != null ? 
                        donationDTO.getStatus() : 
                        (defaultDonationStatus != null ? DonationStatus.valueOf(defaultDonationStatus) : DonationStatus.PENDING));
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid donation status in configuration: {}", defaultDonationStatus);
                donation.setStatus(DonationStatus.PENDING);
            }
            
            // Save the donation
            Donation savedDonation = donationRepository.save(donation);
            logger.info("Donation created successfully with ID: {}", savedDonation.getId());
            
            // Update user's total donations if the donation is completed
            if (savedDonation.getStatus() == DonationStatus.COMPLETED) {
                updateUserDonationTotal(savedDonation);
            }
            
            return convertToDTO(savedDonation);
            
        } catch (Exception e) {
            logger.error("Error creating donation: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    private void updateUserDonationTotal(Donation donation) {
        if (donation.getDonor() != null) {
            User donor = donation.getDonor();
            donor.addToTotalDonations(donation.getAmount());
            userRepository.save(donor);
            logger.info("Updated total donations for user ID: {}", donor.getId());
        }
    }

    public List<DonationDTO> getDonationsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByDonorIdOrderByCreatedAtDesc(userId);
        return donations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<NGODonationResponse> getDonationsByNgoId(Long ngoId) {
        System.out.println("Fetching donations for NGO ID: " + ngoId);
        try {
            // First check if NGO exists
            if (!ngoRepository.existsById(ngoId)) {
                throw new ResourceNotFoundException("NGO not found with id: " + ngoId);
            }
            
            List<Donation> donations = donationRepository.findByNgoId(ngoId);
            System.out.println("Found " + donations.size() + " donations in database for NGO ID: " + ngoId);
            
            List<NGODonationResponse> response = donations.stream()
                    .map(this::convertToNGODonationResponse)
                    .collect(Collectors.toList());
            
            System.out.println("Successfully converted " + response.size() + " donations to response DTOs");
            return response;
        } catch (Exception e) {
            System.err.println("Error in getDonationsByNgoId for NGO ID " + ngoId + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public DonationDTO getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        return convertToDTO(donation);
    }

    private NGODonationResponse convertToNGODonationResponse(Donation donation) {
        if (donation == null) {
            return null;
        }
        
        try {
            NGODonationResponse response = new NGODonationResponse();
            response.setId(donation.getId());
            response.setAmount(donation.getAmount());
            
            // Handle enums safely
            if (donation.getPaymentMethod() != null) {
                response.setPaymentMethod(donation.getPaymentMethod().name());
            }
            if (donation.getStatus() != null) {
                response.setStatus(donation.getStatus().name());
            }
            
            response.setTransactionId(donation.getTransactionId());
            response.setDonationDate(donation.getDonationDate());
            response.setCreatedAt(donation.getCreatedAt());
            
            // Handle donor information
            if (donation.getDonor() != null) {
                User donor = donation.getDonor();
                // Initialize Hibernate proxy if needed
                if (donor instanceof HibernateProxy) {
                    donor = userRepository.findById(donor.getId())
                        .orElse(null);
                }
                
                if (donor != null) {
                    NGODonationResponse.DonorInfo donorInfo = new NGODonationResponse.DonorInfo();
                    donorInfo.setId(donor.getId());
                    donorInfo.setName(donor.getFullName());
                    donorInfo.setEmail(donor.getEmail());
                    response.setDonor(donorInfo);
                }
            }
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error converting Donation to NGODonationResponse: {}", e.getMessage(), e);
            throw new RuntimeException("Error converting donation to NGO donation response", e);
        }
    }

    private DonationDTO convertToDTO(Donation donation) {
        if (donation == null) {
            return null;
        }
        
        try {
            // Use ModelMapper for basic mapping
            DonationDTO dto = modelMapper.map(donation, DonationDTO.class);
            
            // Manually set fields that need special handling
            if (donation.getDonor() != null) {
                dto.setUserId(donation.getDonor().getId());
                
                // Set donor name - prefer organization name if available, otherwise full name
                String donorName = (donation.getDonor().getOrganizationName() != null && 
                                  !donation.getDonor().getOrganizationName().isEmpty()) ?
                        donation.getDonor().getOrganizationName() :
                        donation.getDonor().getFullName();
                dto.setDonorName(donorName);
                
                dto.setDonorEmail(donation.getDonor().getEmail());
            }
            
            if (donation.getNgo() != null) {
                dto.setNgoId(donation.getNgo().getId());
                
                // Only include basic NGO info in the DTO
                NGODTO ngoDTO = new NGODTO();
                ngoDTO.setId(donation.getNgo().getId());
                ngoDTO.setOrganizationName(donation.getNgo().getOrganizationName());
                dto.setNgo(ngoDTO);
            }
            
            // Ensure enum values are properly set
            if (donation.getPledgeType() != null) {
                dto.setPledgeType(donation.getPledgeType().name());
            }
            
            return dto;
            
        } catch (Exception e) {
            logger.error("Error converting Donation to DTO: {}", e.getMessage(), e);
            throw new RuntimeException("Error converting donation to DTO", e);
        }
    }
}
