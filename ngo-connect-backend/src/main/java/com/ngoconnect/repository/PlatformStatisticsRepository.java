package com.ngoconnect.repository;

import com.ngoconnect.entity.PlatformStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlatformStatisticsRepository extends JpaRepository<PlatformStatistics, Long> {

    Optional<PlatformStatistics> findByStatDate(LocalDate statDate);

    @Query("SELECT p FROM PlatformStatistics p WHERE p.statDate >= ?1 ORDER BY p.statDate DESC")
    List<PlatformStatistics> findByStatDateAfterOrderByStatDateDesc(LocalDate fromDate);

    @Query("SELECT p FROM PlatformStatistics p ORDER BY p.statDate DESC")
    List<PlatformStatistics> findAllOrderByStatDateDesc();

    @Query("SELECT p FROM PlatformStatistics p WHERE p.statDate = (SELECT MAX(ps.statDate) FROM PlatformStatistics ps)")
    Optional<PlatformStatistics> findLatestStatistics();

    @Query("SELECT p FROM PlatformStatistics p WHERE p.statDate BETWEEN ?1 AND ?2 ORDER BY p.statDate ASC")
    List<PlatformStatistics> findByStatDateBetweenOrderByStatDateAsc(LocalDate startDate, LocalDate endDate);
}