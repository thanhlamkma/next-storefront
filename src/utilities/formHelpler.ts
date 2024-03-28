import { FormInstance } from "antd";

export const getDisableButtonSubmit = (form: FormInstance) => {
  return (
    !form.isFieldsTouched() ||
    form.getFieldsError().filter(({ errors }) => errors.length).length > 0
  );
};
