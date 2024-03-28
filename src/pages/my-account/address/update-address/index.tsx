import {
  Checkbox,
  Col,
  ColProps,
  FormItemProps,
  Radio,
  Row,
  RowProps,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, {
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Form from "src/components/Form";
import Input from "src/components/Input";
import Layout from "src/components/layout";
import LayoutAccount from "src/components/layout/LayoutAccount";
import Select, { SelectFetchFunc } from "src/components/Select";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { DetailStateResponse } from "src/models/Common";
import {
  CreateRequest as CreateRequestAddress,
  GetDetailAddressResponse as DetailAddress,
  UpdateRequest as UpdateRequestAddress,
} from "src/models/Partner";
import CommonRepository from "src/repositories/CommonRepository";
import PartnerRepository from "src/repositories/PartnerRepository";
import toast from "src/services/toast";

interface PropsServerSideData {
  detailAddess: DetailAddress | null;
  detailState: DetailStateResponse | null;
  hasError: boolean;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    const { id } = context.query;

    const addressId = id && !Array.isArray(id) ? parseInt(id) : null;

    let propsData: PropsServerSideData = {
      detailAddess: null,
      detailState: null,
      hasError: false,
    };

    if (addressId) {
      try {
        const { data: dataAddress } = await lastValueFrom(
          PartnerRepository.getDetailAddress(addressId)
        );
        let detailState: DetailStateResponse | null = null;
        if (dataAddress.stateId) {
          const { data: dataDetailState } = await lastValueFrom(
            CommonRepository.getDetailState(dataAddress.stateId)
          );
          detailState = dataDetailState;
        }

        propsData = {
          ...propsData,
          detailAddess: dataAddress,
          detailState: detailState,
        };
      } catch (error) {
        propsData = {
          ...propsData,
          hasError: false,
        };
      }
    }

    const session = await getSession(context);

    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "vi")),
        ...propsData,
      },
    };
  }
);

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
      style={{ marginBottom: 16 }}
      {...props}
    >
      {children}
    </Form.Item>
  );
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

interface Props extends PropsServerSideData {}

const AddressForm: PageComponent<Props> = ({
  detailAddess,
  detailState,
  hasError,
}) => {
  const { t } = useTranslation();
  const [infoAddress, setInfoAddress] = useState<DetailAddress | null>(
    detailAddess
  );
  const [form] = useForm();
  const router = useRouter();

  const { run: updateAddress } = useJob((address: UpdateRequestAddress) => {
    return PartnerRepository.update(
      infoAddress?.id || address.id,
      address
    ).pipe(
      map(({ data }) => {
        if (data.id) {
          toast.show("info", t("common:updateSuccess"));
          router.push({
            pathname: "/my-account/address",
          });
        }
      }),
      catchError((err: any) => {
        toast.show("error", t("common:updateError"));
        return of(err);
      })
    );
  });

  const { run: createAddress } = useJob((newAddress: CreateRequestAddress) => {
    return PartnerRepository.create(newAddress).pipe(
      map(({ data }) => {
        if (data.id) {
          toast.show("info", t("common:createSuccess"));
          router.replace({
            pathname: "/my-account/address",
          });
        }
      }),
      catchError((err: any) => {
        toast.show("error", t("common:createError"));
        return of(err);
      })
    );
  });

  const initialForm = useMemo(() => {
    if (!infoAddress) {
      return {};
    }
    return {
      ...infoAddress,
      addressType: infoAddress.isCompany ? "company" : "home",
      isDefault: infoAddress.isDefault,
    };
  }, [infoAddress]);

  const handleSubmitForm = useCallback(
    (values) => {
      const isCompany = values.addressType === "company" ? true : false;

      console.log("Updated Address: ", values);

      if (infoAddress?.id) {
        updateAddress({
          id: infoAddress.id,
          name: values.name,
          phone: values.phone,
          ...(values.stateId && { stateId: values.stateId }),
          ...(values.street2 && { street2: values.street2 }),
          ...(values.street && { street: values.street }),
          isCompany: values.addressType === "company" ? true : false,
          isDefault: values.isDefault ? true : false,
        });
      } else {
        createAddress({
          name: values.name,
          phone: values.phone,
          ...(values.stateId && { stateId: values.stateId }),
          ...(values.street2 && { street2: values.street2 }),
          ...(values.street && { street: values.street }),
          isCompany: isCompany,
          isDefault: values.isDefault ? true : false,
        });
      }
    },
    [infoAddress]
  );

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

  const handlePreventSpace: KeyboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    }, []);

  return (
    <Form
      form={form}
      initialValues={initialForm}
      onFinish={handleSubmitForm}
      className="address-form mb-4 ml-5 mt-2 xs:w-[90%] md:w-[75%]"
    >
      <FormItemFlex
        name="name"
        label={`${t("common:fullName")}:`}
        className="address-form__item"
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
        <Input placeholder={t("auth:enterFullName")} />
      </FormItemFlex>
      {/* <FormItemFlex
        name="company"
        label={`${t("accountAddress:company")}:`}
        className="address-form__item"
      >
        <Input placeholder={t("accountAddress:enterCompany")} />
      </FormItemFlex> */}
      <FormItemFlex
        name="phone"
        label={`${t("common:phoneNumber")}:`}
        className="address-form__item"
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
          placeholder={t("common:enterPhoneNumber")}
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
      {(infoAddress?.isDefault === false || infoAddress === null) && (
        <FormItemFlex valuePropName="checked" name="isDefault">
          <Checkbox className="mb-5">
            {t("accountAddress:setDefaultAddess")}
          </Checkbox>
        </FormItemFlex>
      )}
      <button className="submit-address-form-btn w-[100%] py-[10px]">
        {t("common:update")}
      </button>
    </Form>
  );
};

AddressForm.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default AddressForm;
