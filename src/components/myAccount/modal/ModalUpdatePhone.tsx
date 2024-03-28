import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiPhone } from "react-icons/fi";
import { Button, Form, Input } from "src/components";
import Modal from "src/components/Modal";

interface ModalUpdatePhoneProps {
  phone: string;
  onUpdate: (newPhone: string) => void;
  status: boolean;
  onCancel: () => void;
}

const ModalUpdatePhone = ({
  status,
  phone: defaultPhone,
  onCancel,
  onUpdate,
}: ModalUpdatePhoneProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  // const [isDisableForm, setIsDisableForm] = useState<boolean>(true);

  // const { run: runUpdatePhoneApi } = useJob((phone) => {
  //   return InfoUserRepository.updateProfileUser({
  //     phone,
  //     isUpdatePhone: true,
  //   }).pipe(
  //     map(({ data, status }: { data: UpdateResponse; status: any }) => {
  //       if (data) {
  //         toast.show("info", t("myAccount:updatePhoneSuccess"));
  //         onUpdate(phone);
  //         onCancel();
  //       }
  //       return data;
  //     }),
  //     catchError((err: any) => {
  //       toast.show("error", t("common:updateError"));
  //       onCancel();
  //       return of(err);
  //     })
  //   );
  // });
  useEffect(() => {
    form.setFieldsValue({
      phone: defaultPhone,
    });
  }, [onCancel]);

  const onSubmitForm = useCallback(() => {
    form.submit();
  }, [form]);

  const handleSubmitForm = useCallback((values: { phone: string }) => {
    values.phone && onUpdate(values.phone);
  }, []);

  return (
    <Modal
      visible={status}
      onCancel={onCancel}
      textConfirm={t("myAccount:update")}
      title={t("myAccount:updatePhone")}
      footer={
        <div className="modal-footer">
          <Button
            onClick={onSubmitForm}
            // disabled={isDisableForm}
            className="account__btn px-10 py-2 rounded-[3px] w-[100%] active"
          >
            {t("common:saveChange")}
          </Button>
        </div>
      }
    >
      <div id="update-phone">
        <div className="mx-auto border rounded-[3px] xs:w-full">
          <Form
            onFinish={handleSubmitForm}
            form={form}
            initialValues={{
              phone: defaultPhone,
            }}
            className="child-form-account p-5"
          >
            <label className="w-[25%] mr-5 font-semibold">
              {t("common:phoneNumber")}
            </label>
            <Form.Item
              name="phone"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const regexNumber = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                    // setIsDisableForm(true);
                    if (getFieldValue("phone") === "") {
                      return Promise.reject(
                        new Error(t("auth:phoneNumberRequired"))
                      );
                    } else if (!regexNumber.test(getFieldValue("phone"))) {
                      return Promise.reject(
                        new Error(t("auth:checkPhoneNumber"))
                      );
                    }
                    // setIsDisableForm(false);
                    return Promise.resolve();
                  },
                }),
                // {
                //   pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
                //   message: t("myAccount:invalidPhoneNumber"),
                // },
              ]}
            >
              <Input
                placeholder={t("myAccount:enterPhone")}
                className="rounded-[3px] mt-2"
                prefix={
                  <FiPhone
                    style={{
                      fontSize: "1.125rem",
                      color: "#6c757d",
                      marginRight: "5px",
                    }}
                  />
                }
              />
            </Form.Item>
            {/* <div className="child-form-account__description mb-3">
              {t("common:authNoticeOTP")}
            </div> */}
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdatePhone;
