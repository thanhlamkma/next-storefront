import { useForm } from "antd/lib/form/Form";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineMail } from "react-icons/hi";
import { Button, Form, Input } from "src/components";
import Modal from "src/components/Modal";

interface ModalUpdateEmailProps {
  status: boolean;
  email: string;
  onUpdate: (newEmail: string) => void;
  onCancel: () => void;
}

const ModalUpdateEmail = ({
  status,
  email: defaultEmail,
  onUpdate,
  onCancel,
}: ModalUpdateEmailProps) => {
  // const [isDisableForm, setIsDisableForm] = useState<boolean>(true);
  const { t } = useTranslation();
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      email: defaultEmail,
    });
  }, [onCancel]);

  const onSubmitForm = useCallback(() => {
    form.submit();
  }, [form]);

  const handleSubmitForm = useCallback((values: { email: string }) => {
    values.email && onUpdate(values.email);
  }, []);

  // const handleFormValuesChange = useCallback(
  //   (values) => {
  //     setIsDisableForm(getDisableButtonSubmit(form));
  //   },
  //   [form]
  // );

  return (
    <Modal
      visible={status}
      onCancel={onCancel}
      textConfirm={t("myAccount:update")}
      title={t("myAccount:updateEmail")}
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
      <div id="update-email">
        <div className="mx-auto border rounded-[3px] xs:w-full">
          <Form
            // onValuesChange={handleFormValuesChange}
            onFinish={handleSubmitForm}
            form={form}
            initialValues={{
              email: defaultEmail,
            }}
            className="child-form-account p-5"
          >
            <label className="w-[25%] mr-5 font-semibold">
              {t("common:emailAddress")}
            </label>
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: t("auth:userNameTypeEmail") },
                { required: true, message: t("auth:emailRequired") },
              ]}
            >
              <Input
                placeholder={t("myAccount:enterEmail")}
                className="rounded-[3px] mt-2"
                prefix={
                  <HiOutlineMail
                    style={{
                      fontSize: "1.125rem",
                      color: "#6c757d",
                      marginRight: "5px",
                    }}
                  />
                }
              />
            </Form.Item>
            {/* <div className="child-form-account__description my-3">
              {t("common:authNoticeOTP")}
            </div> */}
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateEmail;
