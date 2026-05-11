import React from "react";
import { Checkbox } from "antd";

const LimeLegend = ({ data, onChange, type, style }) => {
  return (
    <div className="toggle-box" style={style}>
      <ul className="btn-group">
        {data.map((d) => (
          <li className="toggle-btn" style={{color: d.color, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}} key={d.name}>
            <Checkbox
              checked={d.visible}
              onChange={() => onChange(d.name, data, type)}
              style={{marginRight: "10px"}}
            />
            <label>{d.name}</label>
          </li>
        ))}
      </ul>
    </div>
  )
};

export default LimeLegend;
