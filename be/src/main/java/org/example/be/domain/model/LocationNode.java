package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "location_node_db")
@Getter
@Setter
@NoArgsConstructor
public class LocationNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_seq")
    private LocationNode parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliation_seq", nullable = false)
    private Affiliation affiliation;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "node_kind", nullable = false)
    private NodeKind nodeKind;

    @Column(nullable = false)
    private int depth;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "location_type")
    private String locationType;

    @Builder
    public LocationNode(
            LocationNode parent,
            Affiliation affiliation,
            String name,
            NodeKind nodeKind,
            int depth,
            int sortOrder,
            String locationType
    ) {
        this.parent = parent;
        this.affiliation = affiliation;
        this.name = name;
        this.nodeKind = nodeKind;
        this.depth = depth;
        this.sortOrder = sortOrder;
        this.locationType = locationType;
    }
}
