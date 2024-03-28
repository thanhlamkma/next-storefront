import { Checkbox, Form as AntForm } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "src/components";
import { GetAttributeFilterResponse } from "src/models/Product";
import WrapFilter from "./WrapFilter";

interface InitialForm {
  [propName: string]: boolean;
}

interface FilterCheckBoxProps {
  // data: Array<DataCheckBox>;
  // idAttr: string | number;
  data?: GetAttributeFilterResponse;
  filterName: string;
  unCheck?: boolean;
  onAttributeChange?: (value: CheckboxChangeEvent) => void;
}

const FilterCheckBox = ({
  data,
  filterName,
  unCheck,
  onAttributeChange,
}: FilterCheckBoxProps) => {
  const [form] = AntForm.useForm();
  const { t } = useTranslation();

  const [initialForm, setInitialForm] = useState<InitialForm | {}>({});
  // const [attributeData, setAttributeData] =
  //   useState<ProductAttributeValueResponse[]>();

  // useEffect(() => {
  //   const initialValues: InitialForm = {};
  //   data.forEach((item: DataCheckBox) => {
  //     initialValues[item.name] = item.checked;
  //   });
  //   setInitialForm(initialValues);
  // }, []);

  // const { run: attributeValueApi } = useJob((id) => {
  //   return ProductRepository.getAttributeValue(id).pipe(
  //     map(({ data }) => {
  //       console.log("test api", id);
  //       setAttributeData(data);
  //     }),
  //     catchError((err: any) => {
  //       console.log(err);
  //       return of(err);
  //     })
  //   );
  // });

  // useEffect(() => {
  //   attributeValueApi(idAttr);
  // }, []);

  useEffect(() => {
    if (unCheck) form.resetFields();
  }, [unCheck]);

  const onFinishFormSize = useCallback((values: any) => {
    form.resetFields();
  }, []);

  return (
    <div id="filter-checkbox">
      <WrapFilter name={filterName}>
        <Form
          form={form}
          enableReinitialize
          onFinish={onFinishFormSize}
          initialValues={initialForm}
        >
          {data?.attributeValues.map((item) => (
            <Form.Item
              key={`${item._id}-${item.name}`}
              valuePropName="checked"
              name={item.name}
            >
              <Checkbox
                onChange={onAttributeChange}
                value={item._id}
                style={{ textTransform: "capitalize" }}
                // checked={unCheck}
              >
                {t(item.name)}
              </Checkbox>
            </Form.Item>
          ))}
          {/* {data.map((item: DataCheckBox) => (
            <Form.Item
              key={`${item.name}-${item.lable}`}
              valuePropName="checked"
              name={item.name}
            >
              <Checkbox>{t(item.lable)}</Checkbox>
            </Form.Item>
          ))} */}
        </Form>
      </WrapFilter>
    </div>
  );
};

export default FilterCheckBox;
