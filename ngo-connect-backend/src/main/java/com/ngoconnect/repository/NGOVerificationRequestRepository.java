package com.ngoconnect.repository;

import com.ngoconnect.entity.NGOVerificationRequest;
import com.ngoconnect.entity.NGOVerificationRequest.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NGOVerificationRequestRepository extends JpaRepository<NGOVerificationRequest, Long> {

    List<NGOVerificationRequest> findByStatus(VerificationStatus status);

    Optional<NGOVerificationRequest> findByNgoId(Long ngoId);

    @Query("SELECT COUNT(v) FROM NGOVerificationRequest v WHERE v.status = ?1")
    Long countByStatus(VerificationStatus status);

    @Query("SELECT v FROM NGOVerificationRequest v WHERE v.status = 'PENDING' ORDER BY v.submittedDate ASC")
    List<NGOVerificationRequest> findPendingVerificationsOrderByDate();

    @Query("SELECT v FROM NGOVerificationRequest v WHERE v.reviewedBy.id = ?1 ORDER BY v.reviewedDate DESC")
    List<NGOVerificationRequest> findByReviewedByOrderByReviewedDateDesc(Long adminId);
}