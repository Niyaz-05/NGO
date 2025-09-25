package com.ngoconnect.service;

import com.ngoconnect.dto.DonationDTO;
import com.ngoconnect.dto.NGODonationResponse;
import com.ngoconnect.entity.*;
import com.ngoconnect.exception.ResourceNotFoundException;
import com.ngoconnect.repository.DonationRepository;
import com.ngoconnect.repository.NGORepository;
import com.ngoconnect.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NGORepository ngoRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private DonationService donationService;

    private User testUser;
    private NGO testNGO;
    private Donation testDonation;
    private DonationDTO testDonationDTO;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");

        // Setup test NGO
        testNGO = new NGO();
        testNGO.setId(1L);
        testNGO.setOrganizationName("Test NGO");

        // Setup test donation
        testDonation = new Donation();
        testDonation.setId(1L);
        testDonation.setDonor(testUser);
        testDonation.setNgo(testNGO);
        testDonation.setAmount(100.0);
        testDonation.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        testDonation.setPledgeType(Donation.PledgeType.ONE_TIME);
        testDonation.setStatus(DonationStatus.COMPLETED);
        testDonation.setDonationDate(LocalDateTime.now());
        testDonation.setCreatedAt(LocalDateTime.now());
        testDonation.setUpdatedAt(LocalDateTime.now());

        // Setup test DTO
        testDonationDTO = new DonationDTO();
        testDonationDTO.setId(1L);
        testDonationDTO.setUserId(1L);
        testDonationDTO.setNgoId(1L);
        testDonationDTO.setAmount(100.0);
        testDonationDTO.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        testDonationDTO.setPledgeType("ONE_TIME");
        testDonationDTO.setStatus(DonationStatus.COMPLETED);
    }

    @Test
    void createDonation_ValidData_ReturnsDonationDTO() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(ngoRepository.findById(1L)).thenReturn(Optional.of(testNGO));
        when(donationRepository.save(any(Donation.class))).thenReturn(testDonation);
        when(modelMapper.map(any(Donation.class), eq(DonationDTO.class))).thenReturn(testDonationDTO);

        // Act
        DonationDTO result = donationService.createDonation(testDonationDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testDonationDTO.getId(), result.getId());
        assertEquals(testDonationDTO.getAmount(), result.getAmount());
        assertEquals(testDonationDTO.getPaymentMethod(), result.getPaymentMethod());
        
        verify(userRepository, times(1)).findById(1L);
        verify(ngoRepository, times(1)).findById(1L);
        verify(donationRepository, times(1)).save(any(Donation.class));
    }

    @Test
    void createDonation_InvalidUserId_ThrowsException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        testDonationDTO.setUserId(999L);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            donationService.createDonation(testDonationDTO);
        });
    }

    @Test
    void createDonation_InvalidNGOId_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(ngoRepository.findById(999L)).thenReturn(Optional.empty());
        testDonationDTO.setNgoId(999L);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            donationService.createDonation(testDonationDTO);
        });
    }

    @Test
    void createDonation_InvalidPaymentMethod_ThrowsException() {
        // Arrange
        testDonationDTO.setPaymentMethod(null);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            donationService.createDonation(testDonationDTO);
        });
    }

    // Test public methods that internally use the private conversion methods
    @Test
    void getDonationById_ValidId_ReturnsDonationDTO() {
        // Arrange
        when(donationRepository.findById(1L)).thenReturn(Optional.of(testDonation));
        when(modelMapper.map(any(Donation.class), eq(DonationDTO.class))).thenReturn(testDonationDTO);

        // Act
        DonationDTO result = donationService.getDonationById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testDonationDTO.getId(), result.getId());
        assertEquals(testDonationDTO.getAmount(), result.getAmount());
    }

    @Test
    void getDonationsByNgoId_ValidId_ReturnsNGODonationResponses() {
        // Arrange
        when(donationRepository.findByNgoId(1L)).thenReturn(List.of(testDonation));
        when(ngoRepository.existsById(1L)).thenReturn(true);

        // Create a mock response
        NGODonationResponse mockResponse = new NGODonationResponse();
        mockResponse.setId(testDonation.getId());
        mockResponse.setAmount(testDonation.getAmount());
        mockResponse.setPaymentMethod(testDonation.getPaymentMethod().name());
        mockResponse.setStatus(testDonation.getStatus().name());
        mockResponse.setDonationDate(testDonation.getDonationDate());
        mockResponse.setCreatedAt(testDonation.getCreatedAt());
        
        NGODonationResponse.DonorInfo donorInfo = new NGODonationResponse.DonorInfo();
        donorInfo.setId(testUser.getId());
        donorInfo.setName(testUser.getFullName());
        donorInfo.setEmail(testUser.getEmail());
        mockResponse.setDonor(donorInfo);

        // Act
        List<NGODonationResponse> responses = donationService.getDonationsByNgoId(1L);

        // Assert
        assertNotNull(responses);
        assertFalse(responses.isEmpty());
        assertEquals(1, responses.size());
        assertEquals(testDonation.getId(), responses.get(0).getId());
        assertNotNull(responses.get(0).getDonor());
        assertEquals(testUser.getId(), responses.get(0).getDonor().getId());
        assertEquals(testUser.getFullName(), responses.get(0).getDonor().getName());
        assertEquals(testUser.getEmail(), responses.get(0).getDonor().getEmail());
    }
}
