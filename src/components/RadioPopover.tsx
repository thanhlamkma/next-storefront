import { DownOutlined } from "@ant-design/icons";
import {
  Popover,
  PopoverProps,
  Radio,
  RadioChangeEvent,
  RadioGroupProps,
  Space,
} from "antd";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonProps } from "src/components/Button";
import { useDidUpdate } from "src/core/hooks";

type RadioPopoverProps = RadioGroupProps & {
  popoverProps?: PopoverProps;
  buttonProps?: ButtonProps;
  clearable?: boolean;
  onChange?: (event: any) => void;
};

const RadioPopover = ({
  popoverProps,
  buttonProps,
  children,
  clearable = true,
  ...props
}: RadioPopoverProps) => {
  const { t } = useTranslation("actions");
  const [value, setValue] = useState(props.value);

  useDidUpdate(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = useCallback(
    (event: RadioChangeEvent) => {
      setValue(event.target.value);
      props.onChange && props.onChange(event);
    },
    [props.onChange]
  );

  const clearValue = useCallback(() => {
    setValue(undefined);
    props.onChange && props.onChange(undefined);
  }, []);

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      {...popoverProps}
      content={
        <>
          <Radio.Group
            {...props}
            options={undefined}
            value={value}
            onChange={handleChange}
          >
            <Space direction="vertical">
              {props.options && props.options.length
                ? props.options.map((option, index) => (
                    <Radio {...option} key={index}>
                      {typeof option === "string" || typeof option === "number"
                        ? option
                        : option.label}
                    </Radio>
                  ))
                : popoverProps?.content}
            </Space>
            {clearable && <Radio value={undefined} className="d-none" />}
          </Radio.Group>
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

export default RadioPopover;
