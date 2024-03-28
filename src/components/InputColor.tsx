import { useCallback, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { AttributeValueResponse } from "src/models/Product";

export interface InputColorProps {
  attrId: number;
  attrActive?: number[];
  value: number;
  colorData: AttributeValueResponse[];
  onChange?: (value: any) => void;
}

interface ColorItemProps {
  active: boolean;
  value?: number;
  htmlColor?: string;
  isChosen?: boolean;
  onClick?: (value: any) => void;
}

const ColorItem = (props: ColorItemProps) => {
  const handleClick = useCallback(() => {
    props.onClick && props.onClick(props.value);
  }, [props.value, props.onClick]);

  return (
    <div
      // {...props}
      className={
        props.active
          ? "w-[26px] h-[26px] flex items-center justify-center cursor-pointer mr-2 rounded-full"
          : "not-allowed w-[26px] h-[26px] flex items-center justify-center  mr-2 rounded-full opacity-50 cursor-not-allowed"
      }
      style={{ background: props.htmlColor }}
      onClick={handleClick}
    >
      <FaCheck
        className={props.isChosen && props.active ? "text-white" : "hidden"}
      />
    </div>
  );
};

const InputColor = (props: InputColorProps) => {
  const [value, setValue] = useState<number>(props.value);

  const renderActive = (attrValueId: number) => {
    var flag: boolean = false;
    props.attrActive?.map((item) => {
      if (item === attrValueId) {
        flag = true;
      }
    });
    return flag;
  };

  const handleChange = useCallback(
    (data: number) => {
      setValue(data);
      props.onChange && props.onChange(data);
    },
    [props.onChange]
  );

  return (
    <div className="flex" style={{ width: "calc(100% - 100px)" }}>
      {props.colorData.length > 0 ? (
        <div className="flex items-center">
          {props.colorData.map((item: any) => (
            <ColorItem
              active={renderActive(item.id)}
              value={item.id}
              htmlColor={item.htmlColor}
              isChosen={item.id === value}
              onClick={handleChange}
            />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default InputColor;
