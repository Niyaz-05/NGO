package com.ngoconnect.controller;

import com.ngoconnect.dto.FundReportDTO;
import com.ngoconnect.entity.FundUtilizationReport;
import com.ngoconnect.entity.NGO;
import com.ngoconnect.repository.FundUtilizationReportRepository;
import com.ngoconnect.repository.NGORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transparency/reports")
@CrossOrigin(origins = "*")
public class FundReportController {

    @Autowired
    private FundUtilizationReportRepository fundReportRepository;

    @Autowired
    private NGORepository ngoRepository;

    // Endpoint for NGOs to CREATE a new fund report
    @PostMapping("/ngo/{ngoId}")
    @PreAuthorize("hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<FundReportDTO> createFundReport(@PathVariable Long ngoId,
            @RequestBody FundReportDTO reportDTO) {
        NGO ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        FundUtilizationReport report = new FundUtilizationReport();
        report.setNgo(ngo);
        report.setReportDate(reportDTO.getReportDate());
        report.setTotalFundsReceived(reportDTO.getTotalFundsReceived());
        report.setTotalFundsSpent(reportDTO.getTotalFundsSpent());
        report.setBreakdown(reportDTO.getBreakdown());

        FundUtilizationReport savedReport = fundReportRepository.save(report);
        return ResponseEntity.ok(convertToDto(savedReport));
    }

    // Endpoint for the PUBLIC to VIEW all reports for a specific NGO
    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<FundReportDTO>> getReportsForNgo(@PathVariable Long ngoId) {
        List<FundUtilizationReport> reports = fundReportRepository.findByNgoIdOrderByReportDateDesc(ngoId);
        List<FundReportDTO> dtos = reports.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private FundReportDTO convertToDto(FundUtilizationReport report) {
        FundReportDTO dto = new FundReportDTO();
        dto.setId(report.getId());
        dto.setNgoId(report.getNgo().getId());
        dto.setReportDate(report.getReportDate());
        dto.setTotalFundsReceived(report.getTotalFundsReceived());
        dto.setTotalFundsSpent(report.getTotalFundsSpent());
        dto.setBreakdown(report.getBreakdown());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
