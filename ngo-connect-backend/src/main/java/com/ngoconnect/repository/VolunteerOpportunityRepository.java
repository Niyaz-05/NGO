package com.ngoconnect.repository;

import com.ngoconnect.entity.VolunteerOpportunity;
import com.ngoconnect.entity.UrgencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VolunteerOpportunityRepository extends JpaRepository<VolunteerOpportunity, Long> {

        List<VolunteerOpportunity> findByCause(String cause);

        List<VolunteerOpportunity> findByLocationContainingIgnoreCase(String location);

        List<VolunteerOpportunity> findByUrgency(UrgencyLevel urgency);

        List<VolunteerOpportunity> findByWorkType(String workType);

        List<VolunteerOpportunity> findByIsActive(Boolean isActive);

        @Query("SELECT v FROM VolunteerOpportunity v WHERE v.cause = :cause AND v.location LIKE %:location%")
        List<VolunteerOpportunity> findByCauseAndLocation(@Param("cause") String cause,
                        @Param("location") String location);

        @Query("SELECT v FROM VolunteerOpportunity v WHERE v.title LIKE %:searchTerm% OR v.description LIKE %:searchTerm%")
        List<VolunteerOpportunity> findBySearchTerm(@Param("searchTerm") String searchTerm);

        @Query("SELECT v FROM VolunteerOpportunity v WHERE v.cause = :cause AND v.location LIKE %:location% AND v.urgency = :urgency")
        List<VolunteerOpportunity> findByCauseAndLocationAndUrgency(@Param("cause") String cause,
                        @Param("location") String location, @Param("urgency") UrgencyLevel urgency);

        @Query("SELECT v FROM VolunteerOpportunity v WHERE v.cause = :cause AND v.workType = :workType")
        List<VolunteerOpportunity> findByCauseAndWorkType(@Param("cause") String cause,
                        @Param("workType") String workType);

        @Query("SELECT v FROM VolunteerOpportunity v WHERE v.startDate >= :startDate AND v.endDate <= :endDate")
        List<VolunteerOpportunity> findByDateRange(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT v FROM VolunteerOpportunity v WHERE v.volunteersApplied < v.volunteersNeeded AND v.isActive = true")
        List<VolunteerOpportunity> findAvailableOpportunities();

        List<VolunteerOpportunity> findByCauseAndUrgency(String cause, UrgencyLevel urgency);

        List<VolunteerOpportunity> findByLocationContainingIgnoreCaseAndUrgency(String location, UrgencyLevel urgency);

        Long countByIsActive(Boolean isActive);

        List<VolunteerOpportunity> findByStatus(com.ngoconnect.entity.OpportunityStatus status);
}
