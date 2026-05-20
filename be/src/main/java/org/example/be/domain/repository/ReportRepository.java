package org.example.be.domain.repository;

import org.example.be.domain.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

}