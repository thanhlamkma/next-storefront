import { Col, Input, InputNumber, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "src/components/Button";
import WrapFilter from "./WrapFilter";

interface FilterPriceProps {
  filterName: string;
  onApply: (price1: string, price2: string) => void;
  min?: string;
  max?: string;
}

interface CurrencyInputProps {
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
}

// const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const CurrencyInput = (props: CurrencyInputProps) => {
  const { value, onChange, placeHolder } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp: string = value;
    if (value) {
      if (value.charAt(value.length - 1) === "." || value === "-") {
        valueTemp = value.slice(0, -1);
      }
      onChange(valueTemp.replace(/0*(\d+)/, "$1"));
    }
  };

  // const title = value ? (
  //   <span className="numeric-input-title">
  //     {value !== "-" ? formatNumber(Number(value)) : "-"}
  //   </span>
  // ) : (
  //   "Input a number"
  // );

  return (
    // <Tooltip
    //   trigger={["focus"]}
    //   title={title}
    //   placement="left"
    //   overlayClassName="numeric-input"
    //   getPopupContainer={(triggerNode) => triggerNode}
    // >
    <Input
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeHolder}
      maxLength={25}
      type="number"
    />
    // </Tooltip>
  );
};

const FilterPrice = ({
  filterName,
  onApply,
  min: inputMin,
  max: inputMax,
}: FilterPriceProps) => {
  const { t } = useTranslation();
  const [min, setMin] = useState<number | undefined>(
    inputMin ? Number(inputMin) : undefined
  );
  const [max, setMax] = useState<number | undefined>(
    inputMax ? Number(inputMax) : undefined
  );

  const changeMin = useCallback(
    (value: number) => {
      setMin(value);
      if (typeof max !== "undefined" && value > max) {
        setMax(value + 1);
      }
    },
    [max]
  );

  const changeMax = useCallback(
    (value: number) => {
      setMax(value);
      if (typeof min !== "undefined" && value < min) {
        setMin(value - 1 > 0 ? value - 1 : 0);
      }
    },
    [min]
  );

  const handleApply = useCallback(() => {
    if (typeof min !== "undefined" && typeof max !== "undefined") {
      onApply(min.toString(), max.toString());
    }
  }, [min, max]);

  useEffect(() => {
    setMin(inputMin !== "" ? Number(inputMin) : 0);
    setMax(inputMax !== "" ? Number(inputMax) : 0);
  }, [inputMin, inputMax]);

  return (
    <div id="filter-price">
      <WrapFilter name={filterName}>
        {/* {dataPrice.map((price: Price) => (
          <div className="text-filter" key={`filter-price-${price.name}`}>
            {price.name}
          </div>
        ))} */}
        <div className="form-price mt-2">
          <Row gutter={12} className="mb-3">
            <Col span={12}>
              <InputNumber
                onChange={changeMin}
                value={min}
                max={Number.MAX_SAFE_INTEGER}
                min={0}
                placeholder="0"
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                onChange={changeMax}
                value={max}
                min={0}
                max={Number.MAX_SAFE_INTEGER}
                placeholder="0"
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
              />
            </Col>
          </Row>
          <Row>
            <Button className="btn-submit" type="primary" onClick={handleApply}>
              {t("products:apply")}
            </Button>
          </Row>
        </div>
      </WrapFilter>
    </div>
  );
};

export default FilterPrice;
