import { Collapse } from "antd";
import classnames from "classnames";
import React from "react";

interface WrapFilterProps {
  name: string;
  children: any;
}

const WrapFilter = ({ name, children }: WrapFilterProps) => {
  return (
    <div id="wrap-filter">
      <Collapse
        bordered={false}
        defaultActiveKey={[name]}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <div>
            <div
              className={classnames([
                "toggle-btn",
                { "active-toggle": isActive },
              ])}
            />
          </div>
        )}
      >
        <Collapse.Panel
          header={<div className="header-filter text-base"> {name}</div>}
          key={name}
        >
          <div className="">{children}</div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default WrapFilter;
