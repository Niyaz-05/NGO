package com.ngoconnect.repository;

import com.ngoconnect.entity.FundUtilizationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundUtilizationReportRepository extends JpaRepository<FundUtilizationReport, Long> {
    List<FundUtilizationReport> findByNgoIdOrderByReportDateDesc(Long ngoId);
}
