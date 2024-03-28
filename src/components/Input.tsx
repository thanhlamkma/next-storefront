import { Input as AntInput, InputProps as AntInputProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDebounceFn } from "src/core/hooks";

interface InputProps extends AntInputProps {}

const Input = (props: InputProps) => {
  return <AntInput {...props} />;
};

export default Input;

Input.Password = AntInput.Password;
Input.Search = AntInput.Search;
Input.TextArea = AntInput.TextArea;
Input.Group = AntInput.Group;

// Debounce Input
interface DebounceInputProps extends InputProps {
  wait?: number;
}

Input.Debounce = ({ wait = 500, ...props }: DebounceInputProps) => {
  const [val, setVal] = useState(props.value);

  const { run: onChange } = useDebounceFn(
    useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(event);
      },
      [props.onChange]
    ),
    { wait }
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVal(event.target.value);
      onChange(event);
    },
    []
  );

  useEffect(() => {
    setVal(props.value);
  }, [props.value]);

  return <Input {...props} value={val} onChange={handleInputChange} />;
};
