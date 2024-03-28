import {
  InputNumber as AntInputNumber,
  InputNumberProps as AntInputNumberProps,
} from "antd";

export interface InputNumberProps extends AntInputNumberProps {}

const InputNumber = (props: InputNumberProps) => {
  return <AntInputNumber {...props} />;
};

export default InputNumber;

// Currency input
InputNumber.Currency = (props: InputNumberProps) => {
  return (
    <InputNumber
      {...props}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      parser={(value) =>
        value ? parseInt(value.replace(/\$\s?|(\.*)/g, "")) : NaN
      }
    />
  );
};
