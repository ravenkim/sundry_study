// drawer title rendeer handler
import { FIELD_TYPE } from "Constants";

export const titleRender = (category) => {
  let title = "";
  switch (category) {
    case FIELD_TYPE.PATENT:
      title = "특허 목록";
      break;
    case FIELD_TYPE.THESIS_NDSL:
      title = "논문 목록";
      break;
    case FIELD_TYPE.SUBJECT_NTIS:
      title = "국가R&D 목록";
      break;
    case FIELD_TYPE.SUBJECT_KEIT:
      title = "KEIT R&D 목록";
      break;
    case FIELD_TYPE.MBR:
      title = "연구자 목록";
      break;

    default:
      title = "";
      break;
  }
  return title;
};

function makeChildrens(data) {
  const nodes = data.nodes,
    links = data.links;
  function childs(node) {
    if (!node.children && !node._children) {
      node.children = !node.children ? [] : null;
      node._children = !node._children ? [] : null;

      links.forEach((link) => {
        if (link.source === node.id) {
          nodes.forEach((n) => {
            if (link.target === n.id) {
              if (node.children) node.children.push(n);
              else if (node._children) node._children.push(n);
            }
          });
        }
      });

      if (node.children && node.children.length === 0) node.children = null;
      if (node._children && node._children.length === 0) node._children = null;
    }
  }
  nodes.forEach((node) => {
    childs(node);
  });
}

function makeParents(data) {
  const nodes = data.nodes,
    links = data.links;
  function parents(node) {
    if (!node.parent) {
      node.parent = null;
      links.forEach((link) => {
        if (link.target === node.id) {
          nodes.forEach((n) => {
            if (link.source === n.id) node.parent = n;
          });
        }
      });
    }
  }
  nodes.forEach((node) => {
    parents(node);
  });
}

function makeOptions(data) {
  const nodes = data.nodes;

  nodes.forEach((node) => {
    if (typeof node.depth === "string") {
      node._depth = node.depth;
      node.depth = parseInt(node.depth.substring(0, 1));
    }
    if (!node.tm) node.tm = "default value";
    node.clustering = false;
    node.isCluster = false;
  });
}

function makeClusterNode(data) {
  const nodes = data.nodes;
  const links = data.links;

  nodes.forEach((node) => {
    //클러스터 노드의 부모노드의 데이터를 가지고 클러스터 노드를 생성
    //자식 노드의 데이터를 가지고 클러스터 노드를 만드는 작업을 진행
    if (node.depth === 2) {
      //클러스터링 될 노드가 2개이상일때만 생성
      if (node.children && node.children.length < 2) return;
      if (node._children && node._children.length < 2) return;
      if (node._children && node._children.length < 2) return;

      const sliceArr = node.children || node._children;

      for (let i = 0; i < Math.ceil(sliceArr.length / 10); i++) {
        const currents = sliceArr.slice(i * 10, (i + 1) * 10);
        const clusterNode = {};
        //클러스터 노드 아이디 지정
        clusterNode.id = node.id + "_" + i;
        //클러스터 자식 없음
        clusterNode.children = undefined;
        clusterNode._children = undefined;
        //클러스터 노드인지 판별 2가지 type, isCluster 하나만 써도됨 => 지금 사용하고 있는 변수는 isCluster
        clusterNode.isCluster = true;
        clusterNode.type = "cluster";
        //클러스터 노드의 명칭
        clusterNode.name = "cluster";
        //클러스터링이 이루어지는 차원/뎁스
        clusterNode.depth = 3;
        //클러스터 노드의 사이즈 = 클러스터 내부에 포함되는 자식 노드의 수
        clusterNode.clustersize =
          currents && currents.length > 2
            ? currents.length > 6
              ? 7
              : currents.length
            : 3;
        //클러스터 노드의 부모노드
        clusterNode.parent = node;
        //클러스터링 on 기본 설정
        clusterNode.clustering = true;

        //클러스터 내부에 속할 자식 노드들 설정 및 자식 노드들에 대한 clusterid 설정
        if (node.children) {
          if (!node.children.find((n) => n.id === clusterNode.id))
            node.children.push(clusterNode);
          clusterNode.clusterchild = currents.filter(
            (n) => n.id !== clusterNode.id && n.type !== "cluster"
          );

          clusterNode.clusterchild.forEach((n) => {
            n.clusterid = clusterNode.id;
          });
        } else if (node._children) {
          if (!node._children.find((n) => n.id === clusterNode.id))
            node._children.push(clusterNode);
          clusterNode.clusterchild = currents.filter(
            (n) => n.id !== clusterNode.id && n.type !== "cluster"
          );
          clusterNode.clusterchild.forEach((n) => {
            n.clusterid = clusterNode.id;
          });
        }

        //클러스터 노드 등록 및 클러스터 노드 - 부모 노드 간의 링크 추가
        if (clusterNode.clusterchild.length > 0) {
          data.nodes.push(clusterNode);
          if (
            !data.links.find(
              (link) =>
                (link.target.id === clusterNode.id ||
                  link.target === clusterNode.id) &&
                (link.target.id === node.id || link.target === node.id)
            )
          )
            data.links.push({ source: node.id, target: clusterNode.id });
        }
      }
    }
  });
}

export default function () {
  function treeSocio(datas) {
    // make a children
    const links = Object.assign([], datas.links);
    const nodes = Object.assign([], datas.nodes);
    const outerlinks = Object.assign([], datas.outerlinks);
    const data = { nodes: nodes, links: links, outerlinks: outerlinks };
    makeChildrens(data);

    // make a Options
    makeOptions(data);

    // make a Cluster Node
    makeClusterNode(data);

    // make a parents
    makeParents(data);

    return data;
  }

  return treeSocio;
}

export const visableDatas = function (
  datas,
  fn_node_filter,
  fn_cluster_filter
) {
  let v_nodes = [],
    v_links = [],
    v_olinks = [];
  const links = datas.links;
  const nodes = datas.nodes;
  const outerLinks = datas.outerlinks ? datas.outerlinks : datas.outer_links;

  function flatten(root) {
    const nodes = [];
    function recurse(node) {
      if (node.children) node.children.forEach(recurse);
      nodes.push(node);
    }
    recurse(root);
    return nodes;
  }

  if (!nodes || nodes.length <= 0)
    return { nodes: [], links: [], outerlinks: [] };

  v_nodes.push(...flatten(nodes.find((n) => n.depth === 0)));
  if (typeof fn_node_filter === "function") {
    v_nodes = [...fn_node_filter(v_nodes)];
  }
  //클러스터 필터
  if (typeof fn_cluster_filter === "function") {
    v_nodes = [...fn_cluster_filter(v_nodes)];
  }
  let v_ids = Array.from(v_nodes, (d) => d.id);
  let tmp = null;
  links.forEach((l) => {
    if (typeof l.source !== "object")
      tmp = v_nodes.find((n) => n.id === l.source);
    if (
      (v_ids.includes(l.target) || v_ids.includes(l.target.id)) &&
      ((v_ids.includes(l.source) && tmp && tmp.children) ||
        (v_ids.includes(l.source.id) && l.source.children))
    ) {
      v_links.push(l);
    }
  });
  if (typeof fn_node_filter === "function") {
    const nrm_nodes = new Set();

    v_links.forEach((l) => {
      const tn = v_nodes.find(
        (vn) => vn.id === l.target.id || vn.id === l.target
      );
      const sn = v_nodes.find(
        (vn) => vn.id === l.source.id || vn.id === l.source
      );
      if (tn) nrm_nodes.add(tn);
      if (sn) nrm_nodes.add(sn);
    });
    if (nrm_nodes.size !== 0) v_nodes = [...Array.from(nrm_nodes)];
  }
  //그룹핑할 노드 생성 필요

  outerLinks.forEach((l) => {
    if (
      (v_ids.includes(l.target) || v_ids.includes(l.target.id)) &&
      (v_ids.includes(l.source) || v_ids.includes(l.source.id))
    ) {
      v_olinks.push(l);
    }
  });
  return { nodes: v_nodes, links: v_links, outerlinks: v_olinks };
};
/**
 *
 * @param node 시작위치 노드
 * @param datas 탐색할 범위 데이터 nodes, links
 * @returns {[]} 시착위치부터 도착위치까지의 링크
 */
export const findAncestorsLinks = function (node, datas) {
  const find_link = [];
  const links = datas.links;
  const nodes = datas.nodes;
  function linkRoof(node) {
    links.forEach((link) => {
      if (link.target.id === node.id || link.target === node.id) {
        find_link.push(link);
        linkRoof(
          nodes.find((n) => n.id === link.source.id || n.id === link.source)
        );
      }
    });
  }
  linkRoof(node);
  return find_link;
};

/**
 *
 * @param node 시작위치 노드
 * @param datas 탐색할 범위 데이터 nodes, links
 * @returns {[]} 시착위치부터 도착위치까지의 노드 하위->상위
 */
export const findAncestorsNodes = function (node, datas) {
  const find_node = new Set();
  const links = datas.links;
  const nodes = datas.nodes;
  function linkRoof(node) {
    find_node.add(node);
    links.forEach((link) => {
      if (link.target.id === node.id || link.target === node.id) {
        if (link.source.depth === 0) find_node.add(link.source);
        else
          linkRoof(
            nodes.find((n) => n.id === link.source.id || n.id === link.source)
          );
      }
    });
  }
  linkRoof(node);
  return Array.from(find_node);
};

/**
 *
 * @param node 시작위치 노드
 * @param datas 탐색할 범위 데이터 nodes, links
 * @returns {[]} 시착위치부터 도착위치까지의 노드 상위->하위
 */
export const findDescendantsNodes = function (node, datas) {
  const find_node = new Set();
  const links = datas.links;
  const nodes = datas.nodes;
  function linkRoof(node) {
    links.forEach((link) => {
      if (link.source.id === node.id || link.source === node.id) {
        find_node.add(node);
        linkRoof(
          nodes.find((n) => n.id === link.target.id || n.id === link.target)
        );
      }
    });
  }
  linkRoof(node);
  return Array.from(find_node);
};
