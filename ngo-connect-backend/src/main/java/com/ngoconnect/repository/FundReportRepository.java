package com.ngoconnect.repository;

import com.ngoconnect.entity.FundReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundReportRepository extends JpaRepository<FundReport, Long> {
    List<FundReport> findByNgoIdOrderByReportedAtDesc(Long ngoId);
}
