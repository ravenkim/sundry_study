package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    /** LEAF(항목) 전용 — 에어컨 대수 */
    @Column(name = "ac_count", nullable = false)
    private int acCount = 0;

    /** LEAF(항목) 전용 — 형광등 개수 */
    @Column(name = "fluorescent_count", nullable = false)
    private int fluorescentCount = 0;

    /** LEAF(항목) 전용 — LED 조명 개수 */
    @Column(name = "led_count", nullable = false)
    private int ledCount = 0;

    @OneToMany(mappedBy = "locationNode", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LocationOperatingSchedule> operatingSchedules = new ArrayList<>();

    @Builder
    public LocationNode(
            LocationNode parent,
            Affiliation affiliation,
            String name,
            NodeKind nodeKind,
            int depth,
            int sortOrder,
            String locationType,
            int acCount,
            int fluorescentCount,
            int ledCount
    ) {
        this.parent = parent;
        this.affiliation = affiliation;
        this.name = name;
        this.nodeKind = nodeKind;
        this.depth = depth;
        this.sortOrder = sortOrder;
        this.locationType = locationType;
        this.acCount = acCount;
        this.fluorescentCount = fluorescentCount;
        this.ledCount = ledCount;
        this.operatingSchedules = new ArrayList<>();
    }
}
