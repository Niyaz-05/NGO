package com.ngoconnect.repository;

import com.ngoconnect.entity.Donation;
import com.ngoconnect.entity.DonationStatus;
import com.ngoconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    
    List<Donation> findByDonor(User donor);
    
    List<Donation> findByDonorAndStatus(User donor, DonationStatus status);
    
    List<Donation> findByNgoIdOrderByDonationDateDesc(Long ngoId);
    
    @Query("SELECT d FROM Donation d WHERE d.donor.id = :userId ORDER BY d.createdAt DESC")
    List<Donation> findByDonorIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT d FROM Donation d WHERE d.donor.id = :donorId ORDER BY d.donationDate DESC")
    List<Donation> findByDonorIdOrderByDonationDateDesc(@Param("donorId") Long donorId);
    
    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.donor.id = :donorId AND d.status = 'COMPLETED'")
    Double getTotalDonatedByDonor(@Param("donorId") Long donorId);
    
    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donor.id = :donorId AND d.status = 'COMPLETED'")
    Long getCountOfDonationsByDonor(@Param("donorId") Long donorId);
    
    @Query("SELECT d FROM Donation d WHERE d.donor.id = :donorId AND d.donationDate BETWEEN :startDate AND :endDate ORDER BY d.donationDate DESC")
    List<Donation> findByDonorIdAndDateRange(@Param("donorId") Long donorId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    List<Donation> findByStatus(DonationStatus status);
    
    @Query("SELECT d FROM Donation d WHERE d.ngo.id = :ngoId ORDER BY d.donationDate DESC")
    List<Donation> findByNgoId(@Param("ngoId") Long ngoId);
    
    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.ngo.id = :ngoId AND d.status = 'COMPLETED'")
    Double getTotalDonationsByNgo(@Param("ngoId") Long ngoId);
}
