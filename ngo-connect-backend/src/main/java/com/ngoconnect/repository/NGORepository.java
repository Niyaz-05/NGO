package com.ngoconnect.repository;

import com.ngoconnect.entity.NGO;
import com.ngoconnect.entity.UrgencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NGORepository extends JpaRepository<NGO, Long> {

    List<NGO> findByCause(String cause);

    List<NGO> findByLocationContainingIgnoreCase(String location);

    List<NGO> findByUrgency(UrgencyLevel urgency);

    List<NGO> findByIsVerified(Boolean isVerified);

    @Query("SELECT n FROM NGO n WHERE n.cause = :cause AND n.location LIKE %:location%")
    List<NGO> findByCauseAndLocation(@Param("cause") String cause, @Param("location") String location);

    @Query("SELECT n FROM NGO n WHERE n.organizationName LIKE %:searchTerm% OR n.description LIKE %:searchTerm%")
    List<NGO> findBySearchTerm(@Param("searchTerm") String searchTerm);

    @Query("SELECT n FROM NGO n WHERE n.cause = :cause AND n.location LIKE %:location% AND n.urgency = :urgency")
    List<NGO> findByCauseAndLocationAndUrgency(@Param("cause") String cause, @Param("location") String location,
            @Param("urgency") UrgencyLevel urgency);

    List<NGO> findByCauseAndUrgency(String cause, UrgencyLevel urgency);

    List<NGO> findByLocationContainingIgnoreCaseAndUrgency(String location, UrgencyLevel urgency);

    // Find NGO by organization name
    Optional<NGO> findByOrganizationName(String organizationName);

    // Find NGO by email
    Optional<NGO> findByEmail(String email);

    // Count NGOs by verification status
    Long countByIsVerified(Boolean isVerified);
}
