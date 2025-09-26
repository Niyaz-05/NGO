package com.ngoconnect.repository;

import com.ngoconnect.entity.SystemAlert;
import com.ngoconnect.entity.SystemAlert.AlertType;
import com.ngoconnect.entity.SystemAlert.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, Long> {

    List<SystemAlert> findByIsResolvedOrderByCreatedAtDesc(Boolean isResolved);

    List<SystemAlert> findByAlertTypeAndIsResolved(AlertType alertType, Boolean isResolved);

    List<SystemAlert> findByPriorityAndIsResolvedOrderByCreatedAtDesc(Priority priority, Boolean isResolved);

    @Query("SELECT COUNT(s) FROM SystemAlert s WHERE s.isResolved = false")
    Long countUnresolvedAlerts();

    @Query("SELECT COUNT(s) FROM SystemAlert s WHERE s.isResolved = false AND s.priority = ?1")
    Long countUnresolvedAlertsByPriority(Priority priority);

    @Query("SELECT s FROM SystemAlert s WHERE s.isResolved = false AND s.alertType = ?1 ORDER BY s.createdAt DESC")
    List<SystemAlert> findUnresolvedByAlertTypeOrderByCreatedAtDesc(AlertType alertType);

    @Query("SELECT s FROM SystemAlert s WHERE s.isResolved = false AND s.priority IN ('HIGH', 'CRITICAL') ORDER BY s.priority DESC, s.createdAt ASC")
    List<SystemAlert> findHighPriorityUnresolvedAlerts();
}