package org.example.be.domain.repository;

import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.NodeKind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationNodeRepository extends JpaRepository<LocationNode, Long> {

    List<LocationNode> findByAffiliation_SeqAndParentIsNullOrderBySortOrderAscSeqAsc(Long affiliationSeq);

    List<LocationNode> findByParent_SeqOrderBySortOrderAscSeqAsc(Long parentSeq);

    long countByParent_Seq(Long parentSeq);

    List<LocationNode> findByAffiliation_SeqOrderByDepthAscSortOrderAscSeqAsc(Long affiliationSeq);

    @Query("""
            SELECT n FROM LocationNode n
            WHERE n.affiliation.seq = :affiliationId
              AND n.parent IS NULL
              AND n.nodeKind = :nodeKind
            ORDER BY n.sortOrder ASC, n.seq ASC
            """)
    List<LocationNode> findRootsByAffiliationAndKind(
            @Param("affiliationId") Long affiliationId,
            @Param("nodeKind") NodeKind nodeKind
    );

    boolean existsBySeqAndNodeKind(Long seq, NodeKind nodeKind);
}
