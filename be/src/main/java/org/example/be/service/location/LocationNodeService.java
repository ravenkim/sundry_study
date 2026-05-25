package org.example.be.service.location;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.LocationNodeRequest;
import org.example.be.api.response.BuildingResponse;
import org.example.be.api.response.LocationNodeResponse;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.LocationOperatingSchedule;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.LocationNodeRepository;
import org.example.be.domain.repository.LocationOperatingScheduleRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.savings.SavingsCalculationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationNodeService {

    private static final int MAX_DEPTH = 3;

    private final LocationNodeRepository locationNodeRepository;
    private final LocationOperatingScheduleRepository operatingScheduleRepository;
    private final AffiliationRepository affiliationRepository;
    private final ReportRepository reportRepository;
    private final SavingsCalculationService savingsCalculationService;

    public List<LocationNodeResponse.TreeNode> getAdminTree(Long affiliationId) {
        List<LocationNode> nodes = locationNodeRepository
                .findByAffiliation_SeqOrderByDepthAscSortOrderAscSeqAsc(affiliationId);
        return buildTree(nodes);
    }

    public List<BuildingResponse.Item> listPublicTrees(Long affiliationId) {
        return listPublicTrees(affiliationId, null);
    }

    public List<BuildingResponse.Item> listPublicTrees(Long affiliationId, Long memberSeq) {
        List<LocationNode> roots = locationNodeRepository
                .findByAffiliation_SeqAndParentIsNullOrderBySortOrderAscSeqAsc(affiliationId);
        return roots.stream()
                .map(root -> toPublicItem(root, memberSeq))
                .toList();
    }

    public List<BuildingResponse.Item> listPublicTreesForScope(LocationNode scopeNode) {
        return listPublicTreesForScope(scopeNode, null);
    }

    public List<BuildingResponse.Item> listPublicTreesForScope(LocationNode scopeNode, Long memberSeq) {
        return List.of(toPublicItem(scopeNode, memberSeq));
    }

    public List<BuildingResponse.Item> listAllPublicTrees() {
        return listAllPublicTrees(null);
    }

    public List<BuildingResponse.Item> listAllPublicTrees(Long memberSeq) {
        return locationNodeRepository.findAll().stream()
                .filter(node -> node.getParent() == null)
                .sorted(Comparator.comparingInt(LocationNode::getSortOrder)
                        .thenComparing(LocationNode::getSeq))
                .map(root -> toPublicItem(root, memberSeq))
                .toList();
    }

    @Transactional
    public LocationNodeResponse.TreeNode create(LocationNodeRequest.Create request) {
        Affiliation affiliation = affiliationRepository.findById(request.getAffiliationId())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 소속입니다."));

        int depth;
        int sortOrder;
        LocationNode parent = null;

        if (request.getParentId() == null) {
            depth = 1;
            sortOrder = nextSortOrder(null, affiliation.getSeq());
        } else {
            parent = locationNodeRepository.findById(request.getParentId())
                    .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "상위 장소를 찾을 수 없습니다."));

            if (parent.getNodeKind() != NodeKind.GROUP) {
                throw new BusinessLogicException(ErrorCode.INVALID, "그룹 노드에만 하위 장소를 추가할 수 있습니다.");
            }
            if (parent.getDepth() >= MAX_DEPTH) {
                throw new BusinessLogicException(ErrorCode.INVALID, "최대 3뎁스까지만 등록할 수 있습니다.");
            }
            if (!parent.getAffiliation().getSeq().equals(affiliation.getSeq())) {
                throw new BusinessLogicException(ErrorCode.INVALID, "상위 장소와 소속이 일치하지 않습니다.");
            }

            depth = parent.getDepth() + 1;
            sortOrder = nextSortOrder(parent.getSeq(), affiliation.getSeq());
        }

        if (request.getNodeKind() == NodeKind.GROUP && depth >= MAX_DEPTH) {
            throw new BusinessLogicException(ErrorCode.INVALID, "3뎁스에는 장소(LEAF)만 등록할 수 있습니다.");
        }

        int acCount = 0;
        int fluorescentCount = 0;
        int ledCount = 0;
        if (request.getNodeKind() == NodeKind.LEAF) {
            acCount = normalizeResourceCount(request.getAcCount(), "에어컨 대수");
            fluorescentCount = normalizeResourceCount(request.getFluorescentCount(), "형광등 개수");
            ledCount = normalizeResourceCount(request.getLedCount(), "LED 조명 개수");
        }

        LocationNode saved = locationNodeRepository.save(
                LocationNode.builder()
                        .parent(parent)
                        .affiliation(affiliation)
                        .name(request.getName().trim())
                        .nodeKind(request.getNodeKind())
                        .depth(depth)
                        .sortOrder(sortOrder)
                        .acCount(acCount)
                        .fluorescentCount(fluorescentCount)
                        .ledCount(ledCount)
                        .build()
        );

        if (request.getNodeKind() == NodeKind.LEAF) {
            applyOperatingSchedules(saved, request.getOperatingSchedules());
            saved = locationNodeRepository.save(saved);
        }

        return toAdminTreeNode(saved, List.of());
    }

    @Transactional
    public LocationNodeResponse.TreeNode update(Long nodeId, LocationNodeRequest.Update request) {
        LocationNode node = findNode(nodeId);
        node.setName(request.getName().trim());
        if (request.getSortOrder() != null) {
            node.setSortOrder(request.getSortOrder());
        }
        if (node.getNodeKind() == NodeKind.LEAF) {
            if (request.getAcCount() != null) {
                node.setAcCount(normalizeResourceCount(request.getAcCount(), "에어컨 대수"));
            }
            if (request.getFluorescentCount() != null) {
                node.setFluorescentCount(normalizeResourceCount(request.getFluorescentCount(), "형광등 개수"));
            }
            if (request.getLedCount() != null) {
                node.setLedCount(normalizeResourceCount(request.getLedCount(), "LED 조명 개수"));
            }
            if (request.getOperatingSchedules() != null) {
                applyOperatingSchedules(node, request.getOperatingSchedules());
            }
        }
        return toAdminTreeNode(node, loadChildren(node.getSeq()));
    }

    public List<LocationOperatingSchedule> getOperatingSchedules(Long locationNodeSeq) {
        return operatingScheduleRepository.findByLocationNode_SeqOrderByDayOfWeekAsc(locationNodeSeq);
    }

    @Transactional
    public void delete(Long nodeId) {
        LocationNode node = findNode(nodeId);

        if (locationNodeRepository.countByParent_Seq(nodeId) > 0) {
            throw new BusinessLogicException(ErrorCode.INVALID, "하위 장소가 있어 삭제할 수 없습니다.");
        }

        if (reportRepository.existsByLocationNode_Seq(nodeId)) {
            throw new BusinessLogicException(ErrorCode.INVALID, "제보가 연결된 장소는 삭제할 수 없습니다.");
        }

        locationNodeRepository.delete(node);
    }

    public LocationNode findNode(Long nodeId) {
        return locationNodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "장소를 찾을 수 없습니다."));
    }

    public LocationNode findLeafNode(Long nodeId) {
        LocationNode node = findNode(nodeId);
        if (node.getNodeKind() != NodeKind.LEAF) {
            throw new BusinessLogicException(ErrorCode.INVALID, "선택 가능한 장소(LEAF)만 지정할 수 있습니다.");
        }
        return node;
    }

    public void validateMemberScope(LocationNode memberScope, LocationNode target) {
        if (memberScope == null) {
            return;
        }
        if (memberScope.getNodeKind() != NodeKind.GROUP) {
            throw new BusinessLogicException(ErrorCode.INVALID, "회원 소속 장소 설정이 올바르지 않습니다.");
        }
        if (!isSameOrDescendant(target, memberScope)) {
            throw new BusinessLogicException(ErrorCode.INVALID, "소속 장소 범위에서만 제보할 수 있습니다.");
        }
    }

    public void validateMemberAffiliation(Affiliation affiliation, LocationNode target) {
        if (affiliation == null) {
            return;
        }
        if (!target.getAffiliation().getSeq().equals(affiliation.getSeq())) {
            throw new BusinessLogicException(ErrorCode.INVALID, "소속 캠퍼스 내 장소만 제보할 수 있습니다.");
        }
    }

    public boolean isSameOrDescendant(LocationNode node, LocationNode ancestor) {
        LocationNode current = node;
        while (current != null) {
            if (current.getSeq().equals(ancestor.getSeq())) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }

    public String buildPath(LocationNode node) {
        List<String> names = new ArrayList<>();
        LocationNode current = node;
        while (current != null) {
            names.add(0, current.getName());
            current = current.getParent();
        }
        return String.join(" > ", names);
    }

    public List<LocationNode> findRootsForAffiliation(Long affiliationId, NodeKind nodeKind) {
        return locationNodeRepository.findRootsByAffiliationAndKind(affiliationId, nodeKind);
    }

    private int nextSortOrder(Long parentId, Long affiliationId) {
        if (parentId == null) {
            List<LocationNode> roots = locationNodeRepository
                    .findByAffiliation_SeqAndParentIsNullOrderBySortOrderAscSeqAsc(affiliationId);
            return roots.isEmpty() ? 0 : roots.get(roots.size() - 1).getSortOrder() + 1;
        }
        List<LocationNode> siblings = locationNodeRepository.findByParent_SeqOrderBySortOrderAscSeqAsc(parentId);
        return siblings.isEmpty() ? 0 : siblings.get(siblings.size() - 1).getSortOrder() + 1;
    }

    private BuildingResponse.Item toPublicItem(LocationNode root, Long memberSeq) {
        return BuildingResponse.Item.builder()
                .buildingId(root.getSeq())
                .name(root.getName())
                .nodeKind(root.getNodeKind())
                .affiliationId(root.getAffiliation().getSeq())
                .affiliationName(root.getAffiliation().getName())
                .children(buildPublicChildren(root.getSeq(), memberSeq))
                .build();
    }

    private List<BuildingResponse.TreeNode> buildPublicChildren(Long parentId, Long memberSeq) {
        LocalDateTime now = LocalDateTime.now();
        return locationNodeRepository.findByParent_SeqOrderBySortOrderAscSeqAsc(parentId).stream()
                .map(child -> {
                    BuildingResponse.TreeNode.TreeNodeBuilder builder = BuildingResponse.TreeNode.builder()
                            .locationId(child.getSeq())
                            .name(child.getName())
                            .nodeKind(child.getNodeKind());

                    if (child.getNodeKind() == NodeKind.LEAF) {
                        var schedules = getOperatingSchedules(child.getSeq());
                        builder.reportable(savingsCalculationService.isReportableAt(now, schedules));
                        if (memberSeq != null) {
                            builder.alreadyReported(
                                    reportRepository.existsByMember_SeqAndLocationNode_Seq(
                                            memberSeq, child.getSeq()));
                        }
                    }

                    return builder
                            .children(child.getNodeKind() == NodeKind.GROUP
                                    ? buildPublicChildren(child.getSeq(), memberSeq)
                                    : List.of())
                            .build();
                })
                .toList();
    }

    private List<LocationNodeResponse.TreeNode> buildTree(List<LocationNode> nodes) {
        Map<Long, List<LocationNode>> childrenByParent = nodes.stream()
                .filter(node -> node.getParent() != null)
                .collect(Collectors.groupingBy(node -> node.getParent().getSeq()));

        return nodes.stream()
                .filter(node -> node.getParent() == null)
                .sorted(Comparator.comparingInt(LocationNode::getSortOrder)
                        .thenComparing(LocationNode::getSeq))
                .map(root -> toAdminTreeNode(root, loadChildrenFromMap(root.getSeq(), childrenByParent)))
                .toList();
    }

    private List<LocationNodeResponse.TreeNode> loadChildrenFromMap(
            Long parentId,
            Map<Long, List<LocationNode>> childrenByParent
    ) {
        List<LocationNode> children = childrenByParent.getOrDefault(parentId, List.of());
        return children.stream()
                .sorted(Comparator.comparingInt(LocationNode::getSortOrder)
                        .thenComparing(LocationNode::getSeq))
                .map(child -> toAdminTreeNode(child, loadChildrenFromMap(child.getSeq(), childrenByParent)))
                .toList();
    }

    private List<LocationNodeResponse.TreeNode> loadChildren(Long parentId) {
        return locationNodeRepository.findByParent_SeqOrderBySortOrderAscSeqAsc(parentId).stream()
                .map(child -> toAdminTreeNode(child, loadChildren(child.getSeq())))
                .toList();
    }

    private LocationNodeResponse.TreeNode toAdminTreeNode(
            LocationNode node,
            List<LocationNodeResponse.TreeNode> children
    ) {
        return LocationNodeResponse.TreeNode.builder()
                .id(node.getSeq())
                .name(node.getName())
                .nodeKind(node.getNodeKind())
                .depth(node.getDepth())
                .sortOrder(node.getSortOrder())
                .locationType(node.getLocationType())
                .acCount(node.getAcCount())
                .fluorescentCount(node.getFluorescentCount())
                .ledCount(node.getLedCount())
                .operatingSchedules(node.getNodeKind() == NodeKind.LEAF
                        ? toScheduleResponses(getOperatingSchedules(node.getSeq()))
                        : null)
                .children(children)
                .build();
    }

    private List<LocationNodeResponse.OperatingScheduleItem> toScheduleResponses(
            List<LocationOperatingSchedule> schedules
    ) {
        return schedules.stream()
                .map(schedule -> LocationNodeResponse.OperatingScheduleItem.builder()
                        .dayOfWeek(schedule.getDayOfWeek())
                        .closed(schedule.isClosed())
                        .powerOnTime(schedule.getPowerOnTime())
                        .powerOffTime(schedule.getPowerOffTime())
                        .build())
                .toList();
    }

    private void applyOperatingSchedules(
            LocationNode node,
            List<LocationNodeRequest.OperatingScheduleItem> items
    ) {
        List<LocationNodeRequest.OperatingScheduleItem> resolved = items;
        if (resolved == null || resolved.isEmpty()) {
            resolved = OperatingScheduleDefaults.defaultScheduleItems();
        }
        validateOperatingSchedules(resolved);
        node.getOperatingSchedules().clear();
        node.getOperatingSchedules().addAll(OperatingScheduleDefaults.toEntities(node, resolved));
    }

    private void validateOperatingSchedules(List<LocationNodeRequest.OperatingScheduleItem> items) {
        if (items.size() != 7) {
            throw new BusinessLogicException(ErrorCode.INVALID, "요일별 운영시간은 7일 모두 입력해야 합니다.");
        }
        Set<Integer> days = new HashSet<>();
        for (LocationNodeRequest.OperatingScheduleItem item : items) {
            if (item.getDayOfWeek() == null || item.getDayOfWeek() < 1 || item.getDayOfWeek() > 7) {
                throw new BusinessLogicException(ErrorCode.INVALID, "요일(dayOfWeek)은 1(월)~7(일)이어야 합니다.");
            }
            if (!days.add(item.getDayOfWeek())) {
                throw new BusinessLogicException(ErrorCode.INVALID, "중복된 요일이 있습니다.");
            }
            boolean closed = Boolean.TRUE.equals(item.getClosed());
            if (!closed) {
                if (item.getPowerOnTime() == null || item.getPowerOffTime() == null) {
                    throw new BusinessLogicException(ErrorCode.INVALID, "운영일에는 켜는/끄는 시간을 입력해 주세요.");
                }
                if (!item.getPowerOnTime().isBefore(item.getPowerOffTime())) {
                    throw new BusinessLogicException(ErrorCode.INVALID, "끄는 시간은 켜는 시간보다 늦어야 합니다.");
                }
            }
        }
    }

    private int normalizeResourceCount(Integer value, String label) {
        if (value == null) {
            return 0;
        }
        if (value < 0) {
            throw new BusinessLogicException(ErrorCode.INVALID, label + "는 0 이상이어야 합니다.");
        }
        return value;
    }
}
