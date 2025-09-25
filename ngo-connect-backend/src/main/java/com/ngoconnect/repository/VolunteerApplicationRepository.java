package com.ngoconnect.repository;

import com.ngoconnect.entity.ApplicationStatus;
import com.ngoconnect.entity.VolunteerApplication;
import com.ngoconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VolunteerApplicationRepository extends JpaRepository<VolunteerApplication, Long> {
    
    List<VolunteerApplication> findByVolunteer(User volunteer);
    
    List<VolunteerApplication> findByVolunteerAndStatus(User volunteer, ApplicationStatus status);
    
    @Query("SELECT va FROM VolunteerApplication va WHERE va.volunteer.id = :volunteerId ORDER BY va.appliedDate DESC")
    List<VolunteerApplication> findByVolunteerIdOrderByAppliedDateDesc(@Param("volunteerId") Long volunteerId);
    
    @Query("SELECT va FROM VolunteerApplication va WHERE va.opportunity.id = :opportunityId ORDER BY va.appliedDate DESC")
    List<VolunteerApplication> findByOpportunityIdOrderByAppliedDateDesc(@Param("opportunityId") Long opportunityId);
    
    @Query("SELECT COUNT(va) FROM VolunteerApplication va WHERE va.volunteer.id = :volunteerId AND va.status = 'COMPLETED'")
    Long getTotalCompletedApplicationsByVolunteer(@Param("volunteerId") Long volunteerId);
    
    @Query("SELECT SUM(va.hoursCompleted) FROM VolunteerApplication va WHERE va.volunteer.id = :volunteerId AND va.status = 'COMPLETED'")
    Integer getTotalHoursByVolunteer(@Param("volunteerId") Long volunteerId);
    
    @Query("SELECT va FROM VolunteerApplication va WHERE va.volunteer.id = :volunteerId AND va.appliedDate BETWEEN :startDate AND :endDate ORDER BY va.appliedDate DESC")
    List<VolunteerApplication> findByVolunteerIdAndDateRange(@Param("volunteerId") Long volunteerId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    List<VolunteerApplication> findByStatus(ApplicationStatus status);
    
    @Query("SELECT va FROM VolunteerApplication va WHERE va.opportunity.id = :opportunityId AND va.status = :status")
    List<VolunteerApplication> findByOpportunityIdAndStatus(@Param("opportunityId") Long opportunityId, @Param("status") ApplicationStatus status);
    
    @Query("SELECT COUNT(va) FROM VolunteerApplication va WHERE va.opportunity.id = :opportunityId AND va.status = 'APPROVED'")
    Long getApprovedApplicationsCountByOpportunity(@Param("opportunityId") Long opportunityId);
    
    @Query("SELECT va FROM VolunteerApplication va WHERE va.volunteer.id = :volunteerId AND va.opportunity.id = :opportunityId")
    VolunteerApplication findByVolunteerIdAndOpportunityId(@Param("volunteerId") Long volunteerId, @Param("opportunityId") Long opportunityId);
}
