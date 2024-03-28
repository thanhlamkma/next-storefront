import {
  Button,
  Col,
  ColProps,
  Form as AntForm,
  FormItemProps,
  Modal,
  ModalProps,
  Radio,
  Row,
  RowProps,
} from "antd";
import {
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { map } from "rxjs";
import Form from "src/components/Form";
import Input from "src/components/Input";
import Select, { SelectFetchFunc } from "src/components/Select";
import { DetailStateResponse } from "src/models/Common";
import {
  CreateRequest as CreateAddressRequest,
  GetDetailAddressResponse,
} from "src/models/Partner";
import CommonRepository from "src/repositories/CommonRepository";

const FormItemFlex = ({ children = <Input />, ...props }: FormItemProps) => {
  return (
    <Form.Item
      labelAlign="left"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

type AddressDetail = {
  city: string;
  detailsAddress: string;
  district: string;
  email: string;
  name: string;
  phoneNumber: string;
};

type RowFormItemType = {
  rowProps?: RowProps;
  colProps?: ColProps;
  childrens: [ReactNode, ReactNode];
};

const RowFormItem = ({ childrens, rowProps, colProps }: RowFormItemType) => {
  return (
    <Row {...rowProps}>
      <Col
        {...colProps}
        sm={{
          span: 11,
        }}
        xs={{
          span: 24,
          offset: 0,
        }}
      >
        {childrens[0]}
      </Col>
      <Col
        {...colProps}
        sm={{
          span: 11,
          offset: 2,
        }}
        xs={{
          span: 24,
          offset: 0,
        }}
      >
        {childrens[1]}
      </Col>
    </Row>
  );
};

interface Props extends ModalProps {
  onSubmitAddress: (data: CreateAddressRequest) => void;

  detailAddess?: GetDetailAddressResponse | null;
  detailState?: DetailStateResponse | null;
  onClose?: () => void;
}

const CustomerInfo = ({
  onSubmitAddress,
  detailAddess,
  detailState,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const [form] = AntForm.useForm();

  const fetchMoreCity: SelectFetchFunc = useCallback((searchText, page) => {
    return CommonRepository.getListState({
      PageIndex: page,
      PageSize: 10,
      NameFilter: searchText,
    }).pipe(
      map(({ data }) => {
        return {
          hasMore: data.total >= data.pageIndex * data.pageSize,
          options: data.data.map((state) => ({
            value: state.id,
            label: state.name,
          })),
        };
      })
    );
  }, []);

  useEffect(() => {
    if (detailAddess) {
      form.setFieldsValue({
        ...detailAddess,
        addressType: detailAddess.isCompany ? "company" : "home",
        isDefault: detailAddess.isDefault,
      });
    }
  }, [props.onCancel]);

  const initialForm = useMemo(() => {
    if (!detailAddess) {
      return {};
    }
    return {
      ...detailAddess,
      addressType: detailAddess.isCompany ? "company" : "home",
      isDefault: detailAddess.isDefault,
    };
  }, [detailAddess]);

  const handlePreventSpace: KeyboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    }, []);

  const handleSubmitForm = (values: any) => {
    const isCompany = values.addressType === "company" ? true : false;

    onSubmitAddress({
      name: values.name,
      phone: values.phone,
      ...(values.stateId && { stateId: values.stateId }),
      ...(values.street2 && { street2: values.street2 }),
      ...(values.street && { street: values.street }),
      isCompany: isCompany,
      isDefault: true,
    });

    form.resetFields();
  };

  // const handleClick = () => {

  // }

  return (
    // <form className="shipping-info-form border-b-[1px] border-b-solid border-b-border">
    //   <div className="shipping-input-group">
    //     <label htmlFor="">Name</label>
    //     <input disabled name="name" type="text" />
    //   </div>
    //   <div className="shipping-input-group">
    //     <label htmlFor="">Phone Number</label>
    //     <input disabled name="phoneNumber" type="text" />
    //   </div>
    //   <div className="shipping-input-group">
    //     <label htmlFor="">Country</label>
    //     <input disabled name="country" type="text" />
    //   </div>
    //   <div className="shipping-input-group">
    //     <label htmlFor="">Town / City</label>
    //     <input disabled name="city" type="text" />
    //   </div>
    //   <div className="shipping-input-group">
    //     <label htmlFor="">Details</label>
    //     <textarea rows={3} name="details" />
    //   </div>
    //   <div className="update-total-btn">Update Total</div>
    // </form>
    <Modal {...props}>
      <Form
        className="customer-address-form"
        form={form}
        onFinish={handleSubmitForm}
        initialValues={initialForm}
      >
        <FormItemFlex
          name="name"
          label={t("common:fullName")}
          className="customer-name"
          rules={[
            {
              required: true,
              pattern: /(.*)(\S)(.*)/,
              message: t("myAccount:fullNameRequired"),
            },
            {
              max: 50,
              message: t("myAccount:maxLengthFullName"),
            },
          ]}
        >
          <Input placeholder={t("common:yourFullName")} />
        </FormItemFlex>
        {/* <RowFormItem
          childrens={[
            <FormItemFlex
              name="email"
              label={t("common:email")}
              className="customer-email"
            >
              <Input placeholder={t("common:yourEmail")} type="email" />
            </FormItemFlex>,
          ]}
        /> */}
        <FormItemFlex
          name="phone"
          label={t("common:phoneNumber")}
          className="customer-phone-number"
          rules={[
            {
              required: true,
              message: t("myAccount:phoneNumberRequired"),
            },
            {
              pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
              message: t("myAccount:invalidPhoneNumber"),
            },
          ]}
        >
          <Input
            placeholder={t("common:yourPhoneNumber")}
            onKeyDown={handlePreventSpace}
          />
        </FormItemFlex>

        <RowFormItem
          childrens={[
            <FormItemFlex
              name="stateId"
              label={t("accountAddress:labelCity")}
              className="address-form__item"
              rules={[
                {
                  required: true,
                  message: t("myAccount:cityRequired"),
                },
              ]}
            >
              <Select.Ajax
                placeholder={t("accountAddress:pickCity")}
                fetchFunc={fetchMoreCity}
                extraOptions={
                  detailState
                    ? [{ label: detailState.name, value: detailState.id }]
                    : undefined
                }
              ></Select.Ajax>
            </FormItemFlex>,
            <FormItemFlex
              name="street2"
              label={t("accountAddress:labelDistrict")}
              className="address-form__item"
              rules={[
                {
                  pattern: /(.*)(\S)(.*)/,
                  required: true,
                  message: t("myAccount:districtRequired"),
                },
                {
                  max: 255,
                  message: t("myAccount:maxLengthDistrictRequired"),
                },
              ]}
            >
              <Input placeholder={t("accountAddress:pickDistrict")} />
            </FormItemFlex>,
          ]}
        />
        <FormItemFlex
          name="street"
          label={t("common:address")}
          className="address-form__item"
          rules={[
            {
              pattern: /(.*)(\S)(.*)/,
              required: true,
              message: t("myAccount:addressRequired"),
            },
            {
              max: 255,
              message: t("myAccount:maxLengthAddressRequired"),
            },
          ]}
        >
          <Input.TextArea
            cols={4}
            rows={5}
            placeholder={t("accountAddress:enterAddress")}
          />
        </FormItemFlex>
        <FormItemFlex
          name="addressType"
          label={`${t("accountAddress:addressType")}`}
          className="address-form__item"
        >
          <Radio.Group defaultValue="home" className="radio-type-common">
            <Radio value="home">{t("accountAddress:homeType")}</Radio>
            <Radio value="company">{t("accountAddress:companyType")}</Radio>
          </Radio.Group>
        </FormItemFlex>
        {/* <FormItemFlex valuePropName="checked" name="isDefault">
          <Checkbox className="mb-5">
            {t("accountAddress:setDefaultAddess")}
          </Checkbox>
        </FormItemFlex> */}
        <Button
          className="submit-customer-info-btn w-[100%] py-[6px] uppercase"
          htmlType="submit"
        >
          {t("common:done")}
        </Button>
      </Form>
    </Modal>
  );
};

export default CustomerInfo;
