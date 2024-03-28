import { Form as AntForm, FormProps as AntFormProps } from "antd";
import { isEqual } from "lodash";
import MountOnBrowser from "src/core/components/MountOnBrowser";
import { useDidUpdate, usePrevious } from "src/core/hooks";

interface FormProps extends AntFormProps {
  enableReinitialize?: boolean;
}

const Form = ({ enableReinitialize, ...props }: FormProps) => {
  const [form] = AntForm.useForm(props.form);
  const prevInitialValues = usePrevious(props.initialValues);

  useDidUpdate(() => {
    if (
      enableReinitialize &&
      !isEqual(props.initialValues, prevInitialValues)
    ) {
      setTimeout(() => {
        form.resetFields();
      }, 200);
    }
  }, [props.initialValues]);

  return (
    <MountOnBrowser>
      <AntForm {...props} form={form} />
    </MountOnBrowser>
  );
};

Form.Item = AntForm.Item;
Form.List = AntForm.List;
Form.Provider = AntForm.Provider;
Form.ErrorList = AntForm.ErrorList;

export default Form;
