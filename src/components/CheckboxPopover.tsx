import { DownOutlined } from "@ant-design/icons";
import { Popover, PopoverProps, Space } from "antd";
import Checkbox, { CheckboxGroupProps } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonProps } from "src/components/Button";
import { useDidUpdate } from "src/core/hooks";

type CheckboxPopoverProps = CheckboxGroupProps & {
  popoverProps?: PopoverProps;
  buttonProps?: ButtonProps;
  clearable?: boolean;
};

const CheckboxPopover = ({
  popoverProps,
  buttonProps,
  children,
  clearable = true,
  ...props
}: CheckboxPopoverProps) => {
  const { t } = useTranslation("actions");
  const [value, setValue] = useState(props.value);

  useDidUpdate(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = useCallback(
    (newValue: CheckboxValueType[]) => {
      setValue(newValue);
      props.onChange && props.onChange(newValue);
    },
    [props.onChange]
  );

  const clearValue = useCallback(() => {
    setValue(undefined);
  }, []);

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      {...popoverProps}
      content={
        <>
          <Checkbox.Group
            {...props}
            options={undefined}
            value={value}
            onChange={handleChange}
          >
            <Space direction="vertical">
              {props.options && props.options.length
                ? props.options.map((option: any, index) => (
                    <Checkbox {...option} key={index}>
                      {typeof option === "string" || typeof option === "number"
                        ? option
                        : option.label}
                    </Checkbox>
                  ))
                : popoverProps?.content}
            </Space>
          </Checkbox.Group>
          {clearable && (
            <div className="d-inline-block w-100 pt-2">
              <Button size="small" type="text" onClick={clearValue} danger>
                {t("clear")}
              </Button>
            </div>
          )}
        </>
      }
    >
      <Button
        icon={<DownOutlined style={{ fontSize: "12px", height: "12px" }} />}
        iconRight
        {...buttonProps}
      >
        {children}
      </Button>
    </Popover>
  );
};

export default CheckboxPopover;
