import { ChangeEvent, useCallback, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { GoPlusSmall } from "react-icons/go";
import Button from "src/components/Button";

export interface InputNumberProps {
  value: number;
  onChange: (data: number) => void;
}

const InputProductNumber = (props: InputNumberProps) => {
  const [value, setValue] = useState<number>(() => {
    props.onChange(1);
    return 1;
  });

  const incrementNumberCart = useCallback(() => {
    setValue((old) => {
      props.onChange(old + 1);
      return old + 1;
    });
  }, []);

  const decrementNumberCart = useCallback(() => {
    setValue((old) => {
      if (old > 1) {
        props.onChange(old - 1);
        return old - 1;
      }
      props.onChange(old);
      return old;
    });
  }, []);

  const handleChange = useCallback(
    (data: number) => {
      setValue(data);
      props.onChange(data);
    },
    [props.onChange]
  );

  return (
    <div className="wrap-input-number-cart">
      <input
        className="input-number-cart"
        type="number"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(parseInt(e.target.value))
        }
        min={1}
        max={1000}
        maxLength={4}
      />
      <Button className="btn-handler right-10" onClick={decrementNumberCart}>
        <BiMinus />
      </Button>
      <Button className="btn-handler right-2" onClick={incrementNumberCart}>
        <GoPlusSmall />
      </Button>
    </div>
  );
};

export default InputProductNumber;
