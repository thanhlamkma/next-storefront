import { Col, Row } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface FilterProps {
  children: any;
  onClearFilter: () => void;
}

const Filter = ({ children, onClearFilter }: FilterProps) => {
  const { t } = useTranslation();
  const clearFilter = useCallback(() => {
    onClearFilter();
  }, []);
  return (
    <div id="filter" className="w-full">
      <Row className="pb-4" justify="space-between">
        <Col className="text-base font-bold text-black-33">
          {t("filters:filter")} :
        </Col>
        <Col
          className="text-sm text-black-33 cursor-pointer"
          onClick={clearFilter}
        >
          {t("filters:cleanAll")}
        </Col>
      </Row>
      {children}
    </div>
  );
};

export default Filter;
