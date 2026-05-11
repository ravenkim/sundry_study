import React from "react";
import { NavLink } from "react-router-dom";

const AdminTypeButton = () => {
  return (
      <section className="section1">
        <h2 className="hidden">검색 메뉴</h2>
        <ul className="manage-button">
          <li>
            <NavLink
              to={`/admin/term`}
              activeClassName={"active"}
            >
            <strong>용어관리</strong>
            </NavLink>
          </li>

          <li>
            <NavLink
              to={`/admin/member`}
              activeClassName={"active"}
            >
              <strong>회원관리</strong>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/code`}
              activeClassName={"active"}
            >
              <strong>코드관리</strong>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/menu`}
              activeClassName={"active"}
            >
              <strong>메뉴관리</strong>
            </NavLink>
          </li>
        </ul>
      </section>
  );
};

export default AdminTypeButton;
