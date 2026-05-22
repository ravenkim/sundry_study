package org.example.be.domain.repository;

import org.example.be.domain.model.Affiliation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AffiliationRepository extends JpaRepository<Affiliation, Long> {
}